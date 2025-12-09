const User = require("../models/userModel");
const Classroom = require("../models/classModel");
const Exam = require("../models/examModel");
const Homework = require("../models/homeworkModel");
const mongoose = require("mongoose");

exports.studentClass = async (req, res) => {
  try {
    let classr = null;
    if (mongoose.Types.ObjectId.isValid(req?.query?.classn)) {
      classr = await Classroom.findById(req.query.classn).populate("subjects");
    } else {
      classr = await Classroom.findOne({
        className: req?.query?.classn,
      }).populate("subjects");
    }
    if (!classr) return res.status(404).json({ msg: "Classroom not found" });
    res.status(200).json({ classr });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong");
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
