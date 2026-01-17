const User = require("../models/userModel");
const classroom = require("../models/classModel");
const Subject = require("../models/subjectModel");
const Attendance = require("../models/attendanceModel");
const Organization = require("../models/organizationModel");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const config = require("../config/envConfig");
const {
  ANALYTICS_CONSTANTS,
  validateDaysParameter,
  createDateRange,
  fillMissingDates,
  calculateOrganizationMetrics,
  getUserCounts,
  handleAnalyticsError
} = require("../utils/analyticsUtils");

class AdminControllerError extends Error {
  constructor(message, code = "ADMIN_ERROR", statusCode = 400) {
    super(message);
    this.name = "AdminControllerError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

// nodemailer config
let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
});

// @desc create a new admin account for an organization
exports.addNewAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, organizationId } = req.body;

    if (!firstName || !lastName || !email || !password || !organizationId) {
      throw new AdminControllerError("All fields including organization ID are required", "MISSING_FIELDS", 400);
    }

    const organization = await Organization.findById(organizationId);
    if (!organization) {
      throw new AdminControllerError("Organization not found", "ORG_NOT_FOUND", 404);
    }

    if (!organization.isActive()) {
      throw new AdminControllerError("Organization subscription is inactive", "ORG_INACTIVE", 403);
    }

    // Check user limit for the organization
    const currentUserCount = await User.countDocuments({
      organizationId: organization._id,
      isApproved: true
    });

    if (currentUserCount >= organization.maxUsers) {
      throw new AdminControllerError(
        `User limit reached. Your ${organization.subscriptionTier.replace('_', ' ')} plan allows maximum ${organization.maxUsers} users. Please upgrade your plan to add more users.`,
        "USER_LIMIT_EXCEEDED",
        403
      );
    }

    const existingUser = await User.findOne({
      email,
      organizationId: organization._id
    });

    if (existingUser) {
      throw new AdminControllerError("Email already exists in this organization", "EMAIL_EXISTS", 409);
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = await bcrypt.hash(password, salt);

    await User.create({
      firstName,
      lastName,
      email,
      password: hash,
      role: "admin",
      organizationId: organization._id,
      isApproved: true,
    });

    res.status(200).json({
      msg: "New admin has been created successfully",
      organization: organization.name
    });
  } catch (error) {
    if (error instanceof AdminControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code,
      });
    }

    const wrappedError = new AdminControllerError("Failed to create admin", "CREATE_ADMIN_ERROR", 500);
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code,
    });
  }
};

// @desc add new user within organization
// @params POST /api/v1/admin/addUser
// @access PRIVATE - Organization Admin Only
exports.addNewUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.organization) {
      throw new AdminControllerError("Organization context required", "NO_ORG_CONTEXT", 403);
    }

    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      role,
      gender,
      classIn,
      subject,
    } = req.body;

    if (!["teacher", "student"].includes(role)) {
      throw new AdminControllerError("Invalid role specified", "INVALID_ROLE", 400);
    }

    // Check user limit for the organization
    const currentUserCount = await User.countDocuments({
      organizationId: req.organization._id,
      isApproved: true
    });

    if (currentUserCount >= req.organization.maxUsers) {
      throw new AdminControllerError(
        `User limit reached. Your ${req.organization.subscriptionTier.replace('_', ' ')} plan allows maximum ${req.organization.maxUsers} users. Please upgrade your plan to add more users.`,
        "USER_LIMIT_EXCEEDED",
        403
      );
    }

    let classInObjectId = null;
    if (classIn) {
      if (mongoose.Types.ObjectId.isValid(classIn)) {
        classInObjectId = classIn;
        const foundClass = await classroom.findOne({
          _id: classIn,
          organizationId: req.organization._id
        });
        if (!foundClass) {
          throw new AdminControllerError("Class not found in your organization", "CLASS_NOT_FOUND", 404);
        }
      } else {
        const foundClass = await classroom.findOne({
          className: classIn,
          organizationId: req.organization._id
        });
        if (!foundClass) {
          throw new AdminControllerError(`Class "${classIn}" not found in your organization`, "CLASS_NOT_FOUND", 404);
        }
        classInObjectId = foundClass._id;
      }
    }

    let subjectObjectId = null;
    if (subject) {
      if (mongoose.Types.ObjectId.isValid(subject)) {
        subjectObjectId = subject;
        const foundSubject = await Subject.findOne({
          _id: subject,
          organizationId: req.organization._id
        });
        if (!foundSubject) {
          throw new AdminControllerError("Subject not found in your organization", "SUBJECT_NOT_FOUND", 404);
        }
      } else {
        const foundSubject = await Subject.findOne({
          name: subject,
          organizationId: req.organization._id
        });
        if (!foundSubject) {
          throw new AdminControllerError(`Subject "${subject}" not found in your organization`, "SUBJECT_NOT_FOUND", 404);
        }
        subjectObjectId = foundSubject._id;
      }
    }

    const existingUser = await User.findOne({ email, organizationId: req.organization._id });
    if (existingUser) {
      if (existingUser.isApproved) {
        throw new AdminControllerError("Email already exists and is approved", "EMAIL_EXISTS", 409);
      }

      const salt = bcrypt.genSaltSync(10);
      const hash = await bcrypt.hash(password, salt);

      const updatedUser = await User.findOneAndUpdate(
        {
          email,
          organizationId: req.organization._id
        },
        {
          firstName,
          lastName,
          password: hash,
          phoneNumber,
          role,
          gender,
          classIn: classInObjectId,
          subject: subjectObjectId,
          organizationId: req.organization._id,
          isApproved: true,
        },
        { new: true }
      );

      const mailDetails = {
        from: config.EMAIL_USER,
        to: email,
        subject: `Your ${req.organization.name} account information`,
        text: `Welcome to ${req.organization.name}!\n\nemail: ${email}\npassword: ${password}`,
      };

      mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
          console.error("Email sending failed:", err);
        } else {
          console.log("Email sent successfully");
        }
      });

      return res.json({
        msg: "User account approved and updated",
        user: {
          id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          role: updatedUser.role,
          organization: req.organization.name
        }
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hash,
      phoneNumber,
      role,
      gender,
      classIn: classInObjectId,
      subject: subjectObjectId,
      organizationId: req.organization._id,
      isApproved: true,
    });

    const mailDetails = {
      from: config.EMAIL_USER,
      to: email,
      subject: `Your ${req.organization.name} account information`,
      text: `Welcome to ${req.organization.name}!\n\nemail: ${email}\npassword: ${password}`,
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
      if (err) {
        console.error("Email sending failed:", err);
      } else {
        console.log("Email sent successfully");
      }
    });

    res.json({
      msg: "New user created successfully",
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        organization: req.organization.name
      }
    });
  } catch (error) {
    console.log(error);
    if (error instanceof AdminControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code,
      });
    }

    const wrappedError = new AdminControllerError("Failed to create user", "CREATE_USER_ERROR", 500);
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code,
    });
  }
};

// @desc get pending users in organization
// @params GET /api/v1/admin/pendingUsers
// @access PRIVATE - Organization Admin Only
exports.getPendedUsers = async (req, res) => {
  try {
    if (!req.organization) {
      throw new AdminControllerError("Organization context required", "NO_ORG_CONTEXT", 403);
    }

    const pendingUsers = await User.find({
      isApproved: false,
      organizationId: req.organization._id
    })
    .select("-password")
    .populate("classIn", "className")
    .populate("subject", "name")
    .sort({ createdAt: -1 });

    res.json(pendingUsers);
  } catch (error) {
    if (error instanceof AdminControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code,
      });
    }

    const wrappedError = new AdminControllerError("Failed to retrieve pending users", "GET_PENDING_USERS_ERROR", 500);
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code,
    });
  }
};

// @desc delete pended users
// @params DELETE /api/v1/users/deletependedusers
// @access PRIVATE
exports.deletePendedUsers = async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ _id: req.params.userId, isApproved: false });
    res.status(200).json({ msg: "user request deleted", deletedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong");
  }
};

// !! user related api

// @desc get all students
// @params GET /api/v1/students
// @access PRIVATE
exports.getAllStudents = async (req, res) => {
  try {
    if (!req.organization) {
      throw new AdminControllerError("Organization context required", "NO_ORG_CONTEXT", 403);
    }

    const students = await User.find({
      role: "student",
      isApproved: true,
      organizationId: req.organization._id
    })
    .select("-password")
    .populate("classIn", "className")
    .sort({ firstName: 1, lastName: 1 });

    res.json({
      success: true,
      students,
      count: students.length,
      organization: req.organization.name
    });
  } catch (error) {
    if (error instanceof AdminControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code,
      });
    }

    const wrappedError = new AdminControllerError("Failed to retrieve students", "GET_STUDENTS_ERROR", 500);
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code,
    });
  }
};

// @desc get all teachers
// @params GET /api/v1/teachers
// @access PRIVATE
exports.getAllTeachers = async (req, res) => {
  try {
    if (!req.organization) {
      throw new AdminControllerError("Organization context required", "NO_ORG_CONTEXT", 403);
    }

    const teachers = await User.find({
      role: "teacher",
      isApproved: true,
      organizationId: req.organization._id
    })
    .select("-password")
    .populate("subject", "name")
    .sort({ firstName: 1, lastName: 1 });

    res.json({
      success: true,
      teachers,
      count: teachers.length,
      organization: req.organization.name
    });
  } catch (error) {
    if (error instanceof AdminControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code,
      });
    }

    const wrappedError = new AdminControllerError("Failed to retrieve teachers", "GET_TEACHERS_ERROR", 500);
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code,
    });
  }
};


// @desc get one user
// @params GET /api/v1/user/:userId
// @access PRIVATE
exports.getUser = async (req, res) => {
  try {
    if (!req.organization) {
      throw new AdminControllerError("Organization context required", "NO_ORG_CONTEXT", 403);
    }

    const user = await User.findOne({
      _id: req.params.userId,
      organizationId: req.organization._id
    })
      .populate(["classIn", "subject"]);

    if (!user) {
      throw new AdminControllerError("User not found in your organization", "USER_NOT_FOUND", 404);
    }

    res.status(200).json({
      success: true,
      msg: "user found",
      user,
      organization: req.organization.name
    });
  } catch (error) {
    console.log(error);
    if (error instanceof AdminControllerError) {
      res.status(error.statusCode).json({ msg: error.message });
    } else {
      res.status(500).json({ msg: "Something went wrong", error: error.message });
    }
  }
};

// @desc delete one user
// @params DELETE /api/v1/user/delete/:userId
// @access PRIVATE
exports.deleteUser = async (req, res) => {
  try {
    if (!req.organization) {
      throw new AdminControllerError("Organization context required", "NO_ORG_CONTEXT", 403);
    }

    const user = await User.findOneAndDelete({
      _id: req.params.userId,
      organizationId: req.organization._id
    });

    if (!user) {
      throw new AdminControllerError("User not found in your organization", "USER_NOT_FOUND", 404);
    }

    res.status(200).json({
      success: true,
      msg: "user deleted successfully",
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      organization: req.organization.name
    });
  } catch (error) {
    console.log(error);
    if (error instanceof AdminControllerError) {
      res.status(error.statusCode).json({ msg: error.message });
    } else {
      res.status(500).json({ msg: "Something went wrong", error: error.message });
    }
  }
};

// @desc update one user
// @params UPDATE /api/v1/user/update/:userId
// @access PRIVATE
exports.updateUser = async (req, res) => {
  try {
    if (!req.organization) {
      throw new AdminControllerError("Organization context required", "NO_ORG_CONTEXT", 403);
    }

    let updateData = { ...req.body };

    if (updateData.classIn) {
      if (mongoose.Types.ObjectId.isValid(updateData.classIn)) {
        const foundClass = await classroom.findOne({
          _id: updateData.classIn,
          organizationId: req.organization._id
        });
        if (!foundClass) {
          throw new AdminControllerError("Class not found in your organization", "CLASS_NOT_FOUND", 404);
        }
        updateData.classIn = foundClass._id;
      } else {
        const foundClass = await classroom.findOne({
          className: updateData.classIn,
          organizationId: req.organization._id
        });
        if (!foundClass) {
          throw new AdminControllerError(`Class "${updateData.classIn}" not found in your organization`, "CLASS_NOT_FOUND", 404);
        }
        updateData.classIn = foundClass._id;
      }
    }

    if (updateData.subject) {
      if (mongoose.Types.ObjectId.isValid(updateData.subject)) {
        const foundSubject = await Subject.findOne({
          _id: updateData.subject,
          organizationId: req.organization._id
        });
        if (!foundSubject) {
          throw new AdminControllerError("Subject not found in your organization", "SUBJECT_NOT_FOUND", 404);
        }
        updateData.subject = foundSubject._id;
      } else {
        const foundSubject = await Subject.findOne({
          name: updateData.subject,
          organizationId: req.organization._id
        });
        if (!foundSubject) {
          throw new AdminControllerError(`Subject "${updateData.subject}" not found in your organization`, "SUBJECT_NOT_FOUND", 404);
        }
        updateData.subject = foundSubject._id;
      }
    }

    if (req?.file?.s3Url) {
      updateData.profileImage = req.file.s3Url;
    }

    const user = await User.findOneAndUpdate(
      {
        _id: req.params.userId,
        organizationId: req.organization._id
      },
      updateData,
      {
        new: true,
      }
    ).populate(["classIn", "subject"]);

    if (!user) {
      throw new AdminControllerError("User not found in your organization", "USER_NOT_FOUND", 404);
    }

    res.status(200).json({
      success: true,
      msg: "user updated successfully",
      user,
      organization: req.organization.name
    });
  } catch (error) {
    console.log(error);
    if (error instanceof AdminControllerError) {
      res.status(error.statusCode).json({ msg: error.message });
    } else {
      res.status(500).json({ msg: "Something went wrong", error: error.message });
    }
  }
};

// @desc get number of users
// @params GET /api/v1/admin/number
// @access PRIVATE
exports.getNumberUsers = async (req, res) => {
  try {
    const organizationId = req.organization._id;

    const [numberTeachers, numberStudents, numberAdmins] = await Promise.all([
      User.find({
        organizationId,
        isApproved: true,
        role: "teacher",
      })
        .select("-password")
        .populate("subject"),

      User.find({
        organizationId,
        isApproved: true,
        role: "student",
      })
        .select("-password")
        .populate("classIn"),

      User.find({
        organizationId,
        role: "admin",
        isApproved: true,
      }).select("-password")
    ]);

    res.status(200).json({
      student: numberStudents,
      admin: numberAdmins,
      teacher: numberTeachers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong", error: error.message });
  }
};

// !! class and subject related api
exports.addNewClass = async (req, res) => {
  try {
    if (!req.organization) {
      throw new AdminControllerError("Organization context required", "NO_ORG_CONTEXT", 403);
    }

    const { className } = req.body;

    if (!className || !className.trim()) {
      throw new AdminControllerError("Class name is required", "MISSING_CLASS_NAME", 400);
    }

    const existingClass = await classroom.findOne({
      className: className.trim(),
      organizationId: req.organization._id
    });

    if (existingClass) {
      throw new AdminControllerError("Class already exists in your organization", "CLASS_EXISTS", 409);
    }

    const newClass = await classroom.create({
      className: className.trim(),
      organizationId: req.organization._id
    });

    res.json({
      msg: "Class added successfully",
      class: {
        id: newClass._id,
        className: newClass.className,
        organization: req.organization.name
      }
    });
  } catch (error) {
    if (error instanceof AdminControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code,
      });
    }

    const wrappedError = new AdminControllerError("Failed to create class", "CREATE_CLASS_ERROR", 500);
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code,
    });
  }
};

exports.getAllClasses = async (req, res) => {
  try {
    if (!req.organization) {
      throw new AdminControllerError("Organization context required", "NO_ORG_CONTEXT", 403);
    }

    const classes = await classroom.find({
      organizationId: req.organization._id
    })
    .populate("subjects", "name code")
    .sort({ className: 1 });

    res.json({
      success: true,
      classes,
      count: classes.length,
      organization: req.organization.name
    });
  } catch (error) {
    if (error instanceof AdminControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code,
      });
    }

    const wrappedError = new AdminControllerError("Failed to retrieve classes", "GET_CLASSES_ERROR", 500);
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code,
    });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    if (!req.organization) {
      throw new AdminControllerError("Organization context required", "NO_ORG_CONTEXT", 403);
    }

    const classSelected = await classroom.findOne({
      _id: req.params.userId,
      organizationId: req.organization._id
    });

    if (classSelected) {
      await User.updateMany(
        {
          classIn: classSelected._id,
          organizationId: req.organization._id
        },
        { $unset: { classIn: "" } }
      );
    }

    const deletedClass = await classroom.findOneAndDelete({
      _id: req.params.userId,
      organizationId: req.organization._id
    });

    if (!deletedClass) {
      throw new AdminControllerError("Class not found in your organization", "CLASS_NOT_FOUND", 404);
    }

    res.status(200).json({
      success: true,
      msg: "class deleted successfully",
      class: {
        id: deletedClass._id,
        className: deletedClass.className
      },
      organization: req.organization.name
    });
  } catch (error) {
    console.log(error);
    if (error instanceof AdminControllerError) {
      res.status(error.statusCode).json({ msg: error.message });
    } else {
      res.status(500).json({ msg: "Something went wrong", error: error.message });
    }
  }
};

exports.updateClass = async (req, res) => {
  try {
    if (!req.organization) {
      throw new AdminControllerError("Organization context required", "NO_ORG_CONTEXT", 403);
    }

    let updateData = { ...req.body };

    if (updateData.className && updateData.className !== req.body.className) {
      const existClass = await classroom.findOne({
        className: updateData.className,
        organizationId: req.organization._id
      });
      if (existClass && existClass._id.toString() !== req.params.userId) {
        throw new AdminControllerError("Class name already exists in your organization", "CLASS_EXISTS", 400);
      }
    }

    if (updateData.subjects && Array.isArray(updateData.subjects)) {
      const subjectIds = [];
      for (const subject of updateData.subjects) {
        if (mongoose.Types.ObjectId.isValid(subject)) {
          const foundSubject = await Subject.findOne({
            _id: subject,
            organizationId: req.organization._id
          });
          if (!foundSubject) {
            throw new AdminControllerError(`Subject not found in your organization`, "SUBJECT_NOT_FOUND", 404);
          }
          subjectIds.push(subject);
        } else {
          let foundSubject = await Subject.findOne({
            name: subject,
            organizationId: req.organization._id
          });
          if (!foundSubject) {
            foundSubject = await Subject.create({
              name: subject,
              organizationId: req.organization._id
            });
          }
          subjectIds.push(foundSubject._id);
        }
      }
      updateData.subjects = subjectIds;
    }

    const updatedClass = await classroom.findOneAndUpdate(
      {
        _id: req.params.userId,
        organizationId: req.organization._id
      },
      updateData,
      { new: true }
    ).populate("subjects");

    if (!updatedClass) {
      throw new AdminControllerError("Class not found in your organization", "CLASS_NOT_FOUND", 404);
    }

    res.status(200).json({
      success: true,
      msg: "class updated successfully",
      class: updatedClass,
      organization: req.organization.name
    });
  } catch (error) {
    console.log(error);
    if (error instanceof AdminControllerError) {
      res.status(error.statusCode).json({ msg: error.message });
    } else {
      res.status(500).json({ msg: "Something went wrong", error: error.message });
    }
  }
};

// Helper function to generate unique subject codes
const generateUniqueSubjectCode = async (subjectName, organizationId) => {
  const baseCode = subjectName.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 6) || 'SUBJ';
  let uniqueCode = baseCode;
  let counter = 1;

  while (await Subject.findOne({ code: uniqueCode, organizationId })) {
    uniqueCode = `${baseCode}${counter}`;
    counter++;
  }

  return uniqueCode;
};

exports.assignNewSubject = async (req, res) => {
  try {
    // Validate organization context (should be guaranteed by middleware, but defensive check)
    if (!req.organization) {
      throw new AdminControllerError("Organization context required", "NO_ORG_CONTEXT", 403);
    }

    const { classname, className, subjectName, subjectId } = req.body;
    const organizationId = req.organization._id;

    // Validate required fields
    if (!classname && !className) {
      throw new AdminControllerError("className or classname is required", "MISSING_CLASS", 400);
    }

    if (!subjectId && !subjectName) {
      throw new AdminControllerError("subjectId or subjectName is required", "MISSING_SUBJECT", 400);
    }

    // Find and validate class
    const classToFind = className || classname;
    let classObjectId;

    if (mongoose.Types.ObjectId.isValid(classToFind)) {
      // If it's an ObjectId, verify it belongs to the organization
      const foundClass = await classroom.findOne({
        _id: classToFind,
        organizationId
      });
      if (!foundClass) {
        throw new AdminControllerError("Class not found in your organization", "CLASS_NOT_FOUND", 404);
      }
      classObjectId = foundClass._id;
    } else {
      // If it's a class name, find it within the organization
      const foundClass = await classroom.findOne({
        className: classToFind,
        organizationId
      });
      if (!foundClass) {
        throw new AdminControllerError(`Class "${classToFind}" not found in your organization`, "CLASS_NOT_FOUND", 404);
      }
      classObjectId = foundClass._id;
    }

    // Find or create subject
    const subjectToFind = subjectId || subjectName;
    let subjectObjectId;

    if (mongoose.Types.ObjectId.isValid(subjectToFind)) {
      // If it's an ObjectId, verify it belongs to the organization
      const foundSubject = await Subject.findOne({
        _id: subjectToFind,
        organizationId
      });
      if (!foundSubject) {
        throw new AdminControllerError("Subject not found in your organization", "SUBJECT_NOT_FOUND", 404);
      }
      subjectObjectId = foundSubject._id;
    } else {
      // If it's a subject name, find or create it within the organization
      let foundSubject = await Subject.findOne({
        name: subjectToFind,
        organizationId
      });

      if (!foundSubject) {
        // Generate unique code and create new subject
        const uniqueCode = await generateUniqueSubjectCode(subjectToFind, organizationId);

        foundSubject = await Subject.create({
          name: subjectToFind,
          code: uniqueCode,
          organizationId
        });
      }

      subjectObjectId = foundSubject._id;
    }

    // Check if subject is already assigned to this class
    const existingClass = await classroom.findOne({
      _id: classObjectId,
      subjects: subjectObjectId
    });

    if (existingClass) {
      throw new AdminControllerError("Subject is already assigned to this class", "SUBJECT_ALREADY_ASSIGNED", 409);
    }

    // Assign subject to class
    const updatedClass = await classroom.findByIdAndUpdate(
      classObjectId,
      { $addToSet: { subjects: subjectObjectId } },
      { new: true }
    ).populate("subjects", "name code");

    res.status(200).json({
      success: true,
      msg: "Subject assigned to class successfully",
      data: {
        class: {
          id: updatedClass._id,
          className: updatedClass.className,
          subjects: updatedClass.subjects
        },
        organization: req.organization.name
      }
    });

  } catch (error) {
    if (error instanceof AdminControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code,
      });
    }

    console.error("Error assigning subject to class:", error);
    const wrappedError = new AdminControllerError("Failed to assign subject to class", "ASSIGN_SUBJECT_ERROR", 500);
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code,
    });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    if (!req.organization) {
      throw new AdminControllerError("Organization context required", "NO_ORG_CONTEXT", 403);
    }

    const user = await User.findOne({
      email: req?.query?.email,
      organizationId: req.organization._id
    })
      .populate(["classIn", "subject"]);

    if (!user) {
      throw new AdminControllerError("User not found in your organization", "USER_NOT_FOUND", 404);
    }

    res.status(200).json({ user });
  } catch (error) {
    if (error instanceof AdminControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code,
      });
    }

    console.log(error);
    const wrappedError = new AdminControllerError("Failed to retrieve user info", "GET_USER_INFO_ERROR", 500);
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code,
    });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    if (!req.organization) {
      throw new AdminControllerError("Organization context required", "NO_ORG_CONTEXT", 403);
    }

    const { date, classId, userId, role } = req.query;

    if (!date) {
      throw new AdminControllerError("Date is required", "MISSING_DATE", 400);
    }

    const attendanceDate = new Date(date);
    if (isNaN(attendanceDate.getTime())) {
      throw new AdminControllerError("Invalid date format", "INVALID_DATE", 400);
    }

    const startOfDay = new Date(attendanceDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(attendanceDate);
    endOfDay.setHours(23, 59, 59, 999);

    const query = {
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      organizationId: req.organization._id,
    };

    if (classId && mongoose.Types.ObjectId.isValid(classId)) {
      const foundClass = await classroom.findOne({
        _id: classId,
        organizationId: req.organization._id
      });
      if (!foundClass) {
        throw new AdminControllerError("Class not found in your organization", "CLASS_NOT_FOUND", 404);
      }
      query.classId = classId;
    }

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      const foundUser = await User.findOne({
        _id: userId,
        organizationId: req.organization._id
      });
      if (!foundUser) {
        throw new AdminControllerError("User not found in your organization", "USER_NOT_FOUND", 404);
      }
      query.studentId = userId;
    }

    const attendanceRecords = await Attendance.find(query)
      .populate([
        { path: 'studentId', select: 'firstName lastName email role' },
        { path: 'classId', select: 'className' },
        { path: 'markedBy', select: 'firstName lastName' }
      ])
      .sort({ createdAt: -1 });

    const attendanceMap = {};
    attendanceRecords.forEach((record) => {
      if (record.studentId && record.studentId._id) {
        const userRole = record.studentId.role;
        if (role && userRole !== role) {
          return;
        }
        const userIdStr = record.studentId._id.toString();
        attendanceMap[userIdStr] = {
          userId: record.studentId._id,
          status: record.status,
          markedBy: record.markedBy,
          markedAt: record.createdAt,
        };
      }
    });

    res.status(200).json({
      success: true,
      msg: 'Attendance fetched successfully',
      date: date,
      attendance: attendanceMap,
      count: attendanceRecords.length,
      organization: req.organization.name
    });
  } catch (error) {
    console.log(error);
    if (error instanceof AdminControllerError) {
      res.status(error.statusCode).json({ msg: error.message });
    } else {
      res.status(500).json({ msg: "Something went wrong", error: error.message });
    }
  }
};

exports.submitAttendance = async (req, res) => {
  try {
    if (!req.organization) {
      throw new AdminControllerError("Organization context required", "NO_ORG_CONTEXT", 403);
    }

    const { date, attendance, role } = req.body;
    const adminId = req.userId || req.headers.userid;

    if (!date) {
      throw new AdminControllerError("Date is required", "MISSING_DATE", 400);
    }

    if (!attendance || !Array.isArray(attendance) || attendance.length === 0) {
      throw new AdminControllerError("Attendance data is required", "MISSING_ATTENDANCE", 400);
    }

    const attendanceDate = new Date(date);
    if (isNaN(attendanceDate.getTime())) {
      throw new AdminControllerError("Invalid date format", "INVALID_DATE", 400);
    }

    const expectedRole = role || 'student';
    if (!['student', 'teacher'].includes(expectedRole)) {
      throw new AdminControllerError("Role must be student or teacher", "INVALID_ROLE", 400);
    }

    const results = [];
    const errors = [];

    for (const item of attendance) {
      const { userId, status } = item;
      const userIdToUse = userId || item.studentId;

      if (!userIdToUse) {
        errors.push({ userId: userIdToUse, error: 'User ID is required' });
        continue;
      }

      if (!['present', 'absent'].includes(status)) {
        errors.push({ userId: userIdToUse, error: 'Status must be present or absent' });
        continue;
      }

      if (!mongoose.Types.ObjectId.isValid(userIdToUse)) {
        errors.push({ userId: userIdToUse, error: 'Invalid user ID format' });
        continue;
      }

      const user = await User.findOne({
        _id: userIdToUse,
        organizationId: req.organization._id
      });
      if (!user) {
        errors.push({ userId: userIdToUse, error: 'User not found in your organization' });
        continue;
      }

      if (user.role !== expectedRole) {
        errors.push({ userId: userIdToUse, error: `User is not a ${expectedRole}` });
        continue;
      }

      const classId = expectedRole === 'student' ? (user.classIn || null) : null;

      try {
        const attendanceRecord = await Attendance.findOneAndUpdate(
          {
            date: attendanceDate,
            studentId: userIdToUse,
            organizationId: req.organization._id,
          },
          {
            date: attendanceDate,
            studentId: userIdToUse,
            classId: classId || null,
            status,
            markedBy: adminId || null,
            organizationId: req.organization._id,
          },
          {
            upsert: true,
            new: true,
          }
        );
        results.push({ userId: userIdToUse, status: 'success', attendanceId: attendanceRecord._id });
      } catch (error) {
        errors.push({ userId: userIdToUse, error: error.message });
      }
    }

    if (errors.length > 0 && results.length === 0) {
      return res.status(400).json({
        success: false,
        msg: 'Failed to submit attendance',
        errors,
      });
    }

    res.status(200).json({
      success: true,
      msg: 'Attendance submitted successfully',
      success: results.length,
      failed: errors.length,
      results,
      errors: errors.length > 0 ? errors : undefined,
      organization: req.organization.name
    });
  } catch (error) {
    console.log(error);
    if (error instanceof AdminControllerError) {
      res.status(error.statusCode).json({ msg: error.message });
    } else {
      res.status(500).json({ msg: "Something went wrong", error: error.message });
    }
  }
};

exports.getUserRegistrationTrends = async (req, res) => {
  try {
    const days = validateDaysParameter(req.query.days);
    const { startDate, endDate } = createDateRange(days);

    const registrationData = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          organizationId: req.organization._id,
          isApproved: true
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const trends = fillMissingDates(registrationData, startDate, endDate);

    res.status(200).json({
      success: true,
      data: trends,
      metadata: {
        period: `${days} days`,
        totalRegistrations: trends.reduce((sum, day) => sum + day.registrations, 0),
        averageDaily: (trends.reduce((sum, day) => sum + day.registrations, 0) / days).toFixed(1)
      }
    });
  } catch (error) {
    handleAnalyticsError(error, 'getUserRegistrationTrends', res);
  }
};

exports.getSubscriptionAnalytics = async (req, res) => {
  try {
    const [organizations, totalActiveUsers] = await Promise.all([
      Organization.find({}).select('subscriptionTier maxUsers subscriptionStatus createdAt'),
      User.countDocuments({ isApproved: true })
    ]);

    const metrics = calculateOrganizationMetrics(organizations, config.SUBSCRIPTION_PRICES);

    const recentOrganizations = organizations
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, ANALYTICS_CONSTANTS.RECENT_ORGANIZATIONS_LIMIT)
      .map(org => ({
        tier: org.subscriptionTier,
        createdAt: org.createdAt,
        status: org.subscriptionStatus
      }));

    res.status(200).json({
      success: true,
      data: {
        ...metrics,
        totalActiveUsers,
        utilizationRate: metrics.totalUserCapacity > 0
          ? ((totalActiveUsers / metrics.totalUserCapacity) * 100).toFixed(1)
          : 0,
        recentOrganizations
      }
    });
  } catch (error) {
    handleAnalyticsError(error, 'getSubscriptionAnalytics', res);
  }
};

exports.getEducationalAnalytics = async (req, res) => {
  try {
    const { startDate } = createDateRange(ANALYTICS_CONSTANTS.ATTENDANCE_DAYS);

    const [classes, subjects, attendanceStats] = await Promise.all([
      classroom.find({ organizationId: req.organization._id }).select('className'),
      Subject.find({ organizationId: req.organization._id }).select('subjectName'),
      Attendance.aggregate([
        {
          $match: {
            date: { $gte: startDate },
            organizationId: req.organization._id
          }
        },
        {
          $group: {
            _id: { $toLower: '$status' },
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    const subjectDistribution = {};
    subjects.forEach(subject => {
      const subjectName = subject.subjectName;
      subjectDistribution[subjectName] = (subjectDistribution[subjectName] || 0) + 1;
    });

    const attendanceSummary = {
      present: 0,
      absent: 0,
      late: 0,
      total: 0
    };

    attendanceStats.forEach(stat => {
      const status = stat._id;
      const count = stat.count;
      if (attendanceSummary.hasOwnProperty(status)) {
        attendanceSummary[status] = count;
        attendanceSummary.total += count;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalClasses: classes.length,
        totalSubjects: subjects.length,
        subjectDistribution,
        attendanceSummary,
        attendanceRate: attendanceSummary.total > 0
          ? ((attendanceSummary.present / attendanceSummary.total) * 100).toFixed(1)
          : '0.0'
      }
    });
  } catch (error) {
    handleAnalyticsError(error, 'getEducationalAnalytics', res);
  }
};

exports.getDashboardAnalytics = async (req, res) => {
  try {
    const { startDate: registrationStartDate } = createDateRange(ANALYTICS_CONSTANTS.DEFAULT_DAYS);
    const { startDate: activityStartDate } = createDateRange(ANALYTICS_CONSTANTS.RECENT_ACTIVITY_DAYS);

    const [
      userTrends,
      subscription,
      [classCount, subjectCount],
      pendingUsers,
      recentActivity,
      userCounts
    ] = await Promise.all([
      User.aggregate([
        {
          $match: {
            createdAt: { $gte: registrationStartDate },
            organizationId: req.organization._id,
            isApproved: true
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { "_id": 1 } }
      ]),

      Organization.findById(req.organization._id).select('subscriptionTier maxUsers subscriptionStatus'),

      Promise.all([
        classroom.countDocuments({ organizationId: req.organization._id }),
        Subject.countDocuments({ organizationId: req.organization._id })
      ]),

      User.countDocuments({
        organizationId: req.organization._id,
        isApproved: false
      }),

      User.find({
        organizationId: req.organization._id,
        lastLogin: { $gte: activityStartDate }
      })
      .select('firstName lastName role lastLogin')
      .sort({ lastLogin: -1 })
      .limit(ANALYTICS_CONSTANTS.RECENT_ACTIVITY_LIMIT),

      getUserCounts(req.organization._id)
    ]);

    const utilizationRate = subscription?.maxUsers > 0
      ? ((userCounts.totalUsers / subscription.maxUsers) * 100).toFixed(1)
      : '0.0';

    res.status(200).json({
      success: true,
      data: {
        userTrends,
        subscription,
        classCount,
        subjectCount,
        pendingUsers,
        recentActivity: recentActivity.map(user => ({
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
          lastLogin: user.lastLogin
        })),
        quickStats: {
          ...userCounts,
          pendingApprovals: pendingUsers,
          utilizationRate
        }
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        period: {
          registration: `${ANALYTICS_CONSTANTS.DEFAULT_DAYS} days`,
          activity: `${ANALYTICS_CONSTANTS.RECENT_ACTIVITY_DAYS} days`
        }
      }
    });
  } catch (error) {
    handleAnalyticsError(error, 'getDashboardAnalytics', res);
  }
};
