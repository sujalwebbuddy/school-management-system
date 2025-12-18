const User = require("../models/userModel");
const classroom = require("../models/classModel");
const Subject = require("../models/subjectModel");
const Attendance = require("../models/attendanceModel");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const config = require("../config/envConfig");

// nodemailer config
let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
});

// @desc create a new admin account
exports.addNewAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const existUser = await User.findOne({ email });
    if (existUser) return res.status(404).json({ msg: "Email already exists" });
    const salt = bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(password, salt);
    await User.create({
      firstName,
      lastName,
      email,
      password: hash,
      role: "admin",
      isApproved: true,
    });
    res.status(200).json({ msg: "new admin has been created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong");
  }
};

// @desc add new user
// @params POST /api/v1/users/addUser
// @access PRIVATE
exports.addNewUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
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
    
    let classInObjectId = null;
    if (classIn) {
      if (mongoose.Types.ObjectId.isValid(classIn)) {
        classInObjectId = classIn;
      } else {
        const foundClass = await classroom.findOne({ className: classIn });
        if (!foundClass) {
          return res.status(404).json({ msg: `Class "${classIn}" not found` });
        }
        classInObjectId = foundClass._id;
      }
    }
    
    let subjectObjectId = null;
    if (subject) {
      if (mongoose.Types.ObjectId.isValid(subject)) {
        subjectObjectId = subject;
      } else {
        const foundSubject = await Subject.findOne({ name: subject });
        if (!foundSubject) {
          return res.status(404).json({ msg: `Subject "${subject}" not found` });
        }
        subjectObjectId = foundSubject._id;
      }
    }
    
    const existUser = await User.findOne({ email });
    if (existUser) {
      if (existUser.isApproved) {
        return res.status(404).json({ msg: "Email already exists and is approved" });
      }
      const salt = bcrypt.genSaltSync(10);
      const hash = await bcrypt.hashSync(password, salt);
      const updatedUser = await User.findOneAndUpdate(
        { email },
        {
          firstName,
          lastName,
          password: hash,
          phoneNumber,
          role,
          gender,
          classIn: classInObjectId,
          subject: subjectObjectId,
          isApproved: true,
        },
        { new: true }
      );
      

      const mailDetails = {
        from: "meleksebri25@gmail.com",
        to: email,
        subject: "Your school account information",
        text: `email : ${email}\npassword : ${password}`,
      };

      mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log("Email sent successfully");
        }
      });

      return res.json({ msg: "user now approved", user: updatedUser });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(password, salt);

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
      isApproved: true,
    });


    const mailDetails = {
      from: "meleksebri25@gmail.com",
      to: email,
      subject: "Your school account information",
      text: `email : ${email}\npassword : ${password}`,
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent successfully");
      }
    });

    res.json({ msg: "user now approved", user: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong");
  }
};

// @desc get pended users
// @params GET /api/v1/users/pendedusers
// @access PRIVATE
exports.getPendedUsers = async (req, res) => {
  try {
    const pendedUsers = await User.find({ isApproved: false });
    if (!pendedUsers) return res.json("no pended user");
    res.status(200).json(pendedUsers);
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong");
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
    const students = await User.find({
      isApproved: true,
      role: "student",
    }).populate("classIn");
    res.status(200).json({ msg: "list of the students", students });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong");
  }
};

// @desc get all teachers
// @params GET /api/v1/teachers
// @access PRIVATE
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find({
      isApproved: true,
      role: "teacher",
    }).populate("subject");
    res.status(200).json({ msg: "list of the teachers", teachers });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong");
  }
};


// @desc get one user
// @params GET /api/v1/user/:userId
// @access PRIVATE
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("classIn")
      .populate("subject");
    res.status(200).json({ msg: "user found", user });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong");
  }
};

// @desc delete one user
// @params DELETE /api/v1/user/delete/:userId
// @access PRIVATE
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }
    res.status(200).json({ msg: "user deleted successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong");
  }
};

// @desc update one user
// @params UPDATE /api/v1/user/update/:userId
// @access PRIVATE
exports.updateUser = async (req, res) => {
  try {
    let updateData = { ...req.body };
    
    if (updateData.classIn) {
      if (mongoose.Types.ObjectId.isValid(updateData.classIn)) {
        updateData.classIn = updateData.classIn;
      } else {
        const foundClass = await classroom.findOne({ className: updateData.classIn });
        if (!foundClass) {
          return res.status(404).json({ msg: `Class "${updateData.classIn}" not found` });
        }
        updateData.classIn = foundClass._id;
      }
    }
    
    if (updateData.subject) {
      if (mongoose.Types.ObjectId.isValid(updateData.subject)) {
        updateData.subject = updateData.subject;
      } else {
        const foundSubject = await Subject.findOne({ name: updateData.subject });
        if (!foundSubject) {
          return res.status(404).json({ msg: `Subject "${updateData.subject}" not found` });
        }
        updateData.subject = foundSubject._id;
      }
    }
    
    if (req?.file?.s3Url) {
      updateData.profileImage = req.file.s3Url;
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      updateData,
      {
        new: true,
      }
    ).populate("classIn");
    res.status(200).json({ msg: "user updated", user });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong");
  }
};

// @desc get number of users
// @params GET /api/v1/admin/number
// @access PRIVATE
exports.getNumberUsers = async (req, res) => {
  try {
    const numberTeachers = await User.find({
      isApproved: true,
      role: "teacher",
    })
      .select("-password")
      .populate("subject");

    const numberStudents = await User.find({
      isApproved: true,
      role: "student",
    })
      .select("-password")
      .populate("classIn");

    const numberAdmins = await User.find({
      role: "admin",
      isApproved: true,
    }).select("-password");
    res.status(200).json({
      student: numberStudents,
      admin: numberAdmins,
      teacher: numberTeachers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong");
  }
};

// !! class and subject related api
exports.addNewClass = async (req, res) => {
  try {
    const { className } = req.body;
    const existClass = await classroom.findOne({ className });
    if (existClass)
      return res.status(404).json({ msg: "Class already exists" });
    await classroom.create({ className });
    res.status(200).json({ msg: "Class added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong");
  }
};

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await classroom.find().populate("subjects");
    res.status(200).json({ msg: "list of classes", classes });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong");
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const classSelected = await classroom.findById(req.params.userId);
    if (classSelected) {
      await User.updateMany(
        { classIn: classSelected._id },
        { $unset: { classIn: "" } }
      );
    }
    const classr = await classroom.findByIdAndDelete(req.params.userId);
    res.status(200).json({ msg: "class deleted successfully", classr });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong");
  }
};

exports.updateClass = async (req, res) => {
  try {
    let updateData = { ...req.body };
    
    if (updateData.className && updateData.className !== req.body.className) {
      const existClass = await classroom.findOne({ className: updateData.className });
      if (existClass && existClass._id.toString() !== req.params.userId) {
        return res.status(400).json({ msg: "Class name already exists" });
      }
    }
    
    if (updateData.subjects && Array.isArray(updateData.subjects)) {
      const subjectIds = [];
      for (const subject of updateData.subjects) {
        if (mongoose.Types.ObjectId.isValid(subject)) {
          subjectIds.push(subject);
        } else {
          let foundSubject = await Subject.findOne({ name: subject });
          if (!foundSubject) {
            foundSubject = await Subject.create({ name: subject });
          }
          subjectIds.push(foundSubject._id);
        }
      }
      updateData.subjects = subjectIds;
    }
    
    const classr = await classroom.findByIdAndUpdate(
      req.params.userId,
      updateData,
      { new: true }
    ).populate("subjects");
    res.status(200).json({ msg: "class updated", classr });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong");
  }
};

exports.assignNewSubject = async (req, res) => {
  try {
    const { classname, className, subjectName, subjectId } = req.body;
    
    let classObjectId = null;
    if (className || classname) {
      const classToFind = className || classname;
      if (mongoose.Types.ObjectId.isValid(classToFind)) {
        classObjectId = classToFind;
      } else {
        const foundClass = await classroom.findOne({ className: classToFind });
        if (!foundClass) {
          return res.status(404).json({ msg: `Class "${classToFind}" not found` });
        }
        classObjectId = foundClass._id;
      }
    } else {
      return res.status(400).json({ msg: "className or classname is required" });
    }
    
    let subjectObjectId = null;
    if (subjectId || subjectName) {
      const subjectToFind = subjectId || subjectName;
      if (mongoose.Types.ObjectId.isValid(subjectToFind)) {
        subjectObjectId = subjectToFind;
      } else {
        let foundSubject = await Subject.findOne({ name: subjectToFind });
        if (!foundSubject) {
          foundSubject = await Subject.create({ name: subjectToFind });
        }
        subjectObjectId = foundSubject._id;
      }
    } else {
      return res.status(400).json({ msg: "subjectId or subjectName is required" });
    }
    
    const claz = await classroom.findByIdAndUpdate(
      classObjectId,
      { $addToSet: { subjects: subjectObjectId } },
      { new: true }
    ).populate("subjects");
    res.status(200).json({ msg: "Subject added", claz });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong");
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findOne({ email: req?.query?.email })
      .populate("classIn")
      .populate("subject");
    if (!user) return res.status(404).json({ msg: "user not found" });
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong");
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const { date, classId, userId, role } = req.query;

    if (!date) {
      return res.status(400).json({ msg: 'Date is required' });
    }

    const attendanceDate = new Date(date);
    if (isNaN(attendanceDate.getTime())) {
      return res.status(400).json({ msg: 'Invalid date format' });
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
    };

    if (classId && mongoose.Types.ObjectId.isValid(classId)) {
      query.classId = classId;
    }

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      query.studentId = userId;
    }

    const attendanceRecords = await Attendance.find(query)
      .populate('studentId', 'firstName lastName email role')
      .populate('classId', 'className')
      .populate('markedBy', 'firstName lastName')
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
      msg: 'Attendance fetched successfully',
      date: date,
      attendance: attendanceMap,
      count: attendanceRecords.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Something went wrong', error: error.message });
  }
};

exports.submitAttendance = async (req, res) => {
  try {
    const { date, attendance, role } = req.body;
    const adminId = req.userId || req.headers.userid;

    if (!date) {
      return res.status(400).json({ msg: 'Date is required' });
    }

    if (!attendance || !Array.isArray(attendance) || attendance.length === 0) {
      return res.status(400).json({ msg: 'Attendance data is required' });
    }

    const attendanceDate = new Date(date);
    if (isNaN(attendanceDate.getTime())) {
      return res.status(400).json({ msg: 'Invalid date format' });
    }

    const expectedRole = role || 'student';
    if (!['student', 'teacher'].includes(expectedRole)) {
      return res.status(400).json({ msg: 'Role must be student or teacher' });
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

      const user = await User.findById(userIdToUse);
      if (!user) {
        errors.push({ userId: userIdToUse, error: 'User not found' });
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
          },
          {
            date: attendanceDate,
            studentId: userIdToUse,
            classId: classId || null,
            status,
            markedBy: adminId || null,
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
        msg: 'Failed to submit attendance',
        errors,
      });
    }

    res.status(200).json({
      msg: 'Attendance submitted successfully',
      success: results.length,
      failed: errors.length,
      results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Something went wrong', error: error.message });
  }
};
