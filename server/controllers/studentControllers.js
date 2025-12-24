const User = require("../models/userModel");
const Classroom = require("../models/classModel");
const Exam = require("../models/examModel");
const Homework = require("../models/homeworkModel");
const Organization = require("../models/organizationModel");
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
    const teacherlist = await User.find({ role: "teacher", isApproved: true })
      .populate("subject");

    res.status(200).json({ teacherlist });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong");
  }
};

exports.getHomeworks = async (req, res) => {
  try {
    let classIdObjectId = null;
    if (req?.query?.myclas) {
      if (mongoose.Types.ObjectId.isValid(req.query.myclas)) {
        classIdObjectId = req.query.myclas;
      } else {
        const foundClass = await Classroom.findOne({ className: req.query.myclas });
        if (foundClass) {
          classIdObjectId = foundClass._id;
        }
      }
    }
    
    const query = classIdObjectId ? { classId: classIdObjectId } : {};
    const homeworkList = await Homework.find(query).populate("classId").populate("subjectId");
    res.status(200).json({ homeworkList });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong");
  }
};

exports.getExams = async (req, res) => {
  try {
    let classIdObjectId = null;
    if (req?.query?.myclasss) {
      if (mongoose.Types.ObjectId.isValid(req.query.myclasss)) {
        classIdObjectId = req.query.myclasss;
      } else {
        const foundClass = await Classroom.findOne({ className: req.query.myclasss });
        if (foundClass) {
          classIdObjectId = foundClass._id;
        }
      }
    }
    
    const query = classIdObjectId ? { classId: classIdObjectId } : {};
    const examlist = await Exam.find(query).populate("classId").populate("subjectId");
    res.status(200).json({ examlist });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong");
  }
};
