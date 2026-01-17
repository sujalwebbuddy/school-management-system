const User = require("../models/userModel");
const Classroom = require("../models/classModel");
const Exam = require("../models/examModel");
const Homework = require("../models/homeworkModel");
const mongoose = require("mongoose");

class StudentControllerError extends Error {
  constructor(message, code = "STUDENT_ERROR", statusCode = 400) {
    super(message);
    this.name = "StudentControllerError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

exports.studentClass = async (req, res) => {
  try {
    if (!req.organization) {
      throw new StudentControllerError("Organization context required", "NO_ORG_CONTEXT", 403);
    }

    let classroom = null;
    if (mongoose.Types.ObjectId.isValid(req?.query?.classn)) {
      classroom = await Classroom.findOne({
        _id: req.query.classn,
        organizationId: req.organization._id
      }).populate("subjects", "name code");
    } else {
      classroom = await Classroom.findOne({
        className: req?.query?.classn,
        organizationId: req.organization._id
      }).populate("subjects", "name code");
    }

    if (!classroom) {
      throw new StudentControllerError("Classroom not found in your organization", "CLASSROOM_NOT_FOUND", 404);
    }

    res.json({
      success: true,
      classroom,
      organization: req.organization.name
    });
  } catch (error) {
    if (error instanceof StudentControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code,
      });
    }

    const wrappedError = new StudentControllerError("Failed to retrieve student class", "GET_STUDENT_CLASS_ERROR", 500);
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code,
    });
  }
};

exports.getTeachers = async (req, res) => {
  try {
    if (!req.organization) {
      throw new StudentControllerError("Organization context required", "NO_ORG_CONTEXT", 403);
    }

    const teacherlist = await User.find({
      role: "teacher",
      isApproved: true,
      organizationId: req.organization._id
    })
      .populate("subject");

    res.status(200).json({
      teacherlist,
      organization: req.organization.name
    });
  } catch (error) {
    if (error instanceof StudentControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code,
      });
    }

    console.log(error);
    const wrappedError = new StudentControllerError("Failed to retrieve teachers", "GET_TEACHERS_ERROR", 500);
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code,
    });
  }
};

exports.getHomeworks = async (req, res) => {
  try {
    if (!req.organization) {
      throw new StudentControllerError("Organization context required", "NO_ORG_CONTEXT", 403);
    }

    let classIdObjectId = null;
    if (req?.query?.myclas) {
      if (mongoose.Types.ObjectId.isValid(req.query.myclas)) {
        classIdObjectId = req.query.myclas;
        // Verify the class belongs to the organization
        const foundClass = await Classroom.findOne({
          _id: classIdObjectId,
          organizationId: req.organization._id
        });
        if (!foundClass) {
          throw new StudentControllerError("Class not found in your organization", "CLASS_NOT_FOUND", 404);
        }
      } else {
        const foundClass = await Classroom.findOne({
          className: req.query.myclas,
          organizationId: req.organization._id
        });
        if (foundClass) {
          classIdObjectId = foundClass._id;
        }
      }
    }

    const query = {
      ...(classIdObjectId && { classId: classIdObjectId }),
      organizationId: req.organization._id
    };

    const homeworkList = await Homework.find(query)
      .populate(["classId", "subjectId"]);

    res.status(200).json({
      homeworkList,
      organization: req.organization.name
    });
  } catch (error) {
    if (error instanceof StudentControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code,
      });
    }

    console.log(error);
    const wrappedError = new StudentControllerError("Failed to retrieve homeworks", "GET_HOMEWORKS_ERROR", 500);
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code,
    });
  }
};

exports.getExams = async (req, res) => {
  try {
    if (!req.organization) {
      throw new StudentControllerError("Organization context required", "NO_ORG_CONTEXT", 403);
    }

    let classIdObjectId = null;
    if (req?.query?.myclasss) {
      if (mongoose.Types.ObjectId.isValid(req.query.myclasss)) {
        classIdObjectId = req.query.myclasss;
        // Verify the class belongs to the organization
        const foundClass = await Classroom.findOne({
          _id: classIdObjectId,
          organizationId: req.organization._id
        });
        if (!foundClass) {
          throw new StudentControllerError("Class not found in your organization", "CLASS_NOT_FOUND", 404);
        }
      } else {
        const foundClass = await Classroom.findOne({
          className: req.query.myclasss,
          organizationId: req.organization._id
        });
        if (foundClass) {
          classIdObjectId = foundClass._id;
        }
      }
    }

    const query = {
      ...(classIdObjectId && { classId: classIdObjectId }),
      organizationId: req.organization._id
    };

    const examlist = await Exam.find(query)
      .populate(["classId", "subjectId"]);

    res.status(200).json({
      examlist,
      organization: req.organization.name
    });
  } catch (error) {
    if (error instanceof StudentControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code,
      });
    }

    console.log(error);
    const wrappedError = new StudentControllerError("Failed to retrieve exams", "GET_EXAMS_ERROR", 500);
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code,
    });
  }
};
