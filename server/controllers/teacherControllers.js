const User = require("../models/userModel");
const Classroom = require("../models/classModel");
const Subject = require("../models/subjectModel");
const Exam = require("../models/examModel");
const Homework = require("../models/homeworkModel");
const mongoose = require("mongoose");
const config = require("../config/envConfig");

exports.getTeacherClass = async (req, res) => {
  try {
    let subjectId = null;
    if (req.query.subject) {
      if (mongoose.Types.ObjectId.isValid(req.query.subject)) {
        subjectId = req.query.subject;
      } else {
        const foundSubject = await Subject.findOne({ name: req.query.subject });
        if (!foundSubject) {
          return res.status(404).json({ msg: "Subject not found" });
        }
        subjectId = foundSubject._id;
      }
    }
    const classro = await Classroom.findOne({ subjects: subjectId }).populate("subjects");
    if (!classro) return res.status(404).json({ msg: "classroom not found" });
    res.status(200).json({ classro });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong");
  }
};

exports.newExam = async (req, res) => {
  try {
    const { name, dateOf, totalMark, subject, subjectId, classname, className, classId } = req.body;
    
    const dateOfDate = dateOf ? new Date(dateOf) : new Date();
    if (isNaN(dateOfDate.getTime())) {
      return res.status(400).json({ msg: "Invalid date format" });
    }
    
    if (totalMark <= 0) {
      return res.status(400).json({ msg: "Total mark must be greater than 0" });
    }
    
    let classIdObjectId = null;
    if (classId && mongoose.Types.ObjectId.isValid(classId)) {
      classIdObjectId = classId;
    } else if (classname || className) {
      const classToFind = classname || className;
      const foundClass = await Classroom.findOne({ className: classToFind });
      if (!foundClass) {
        return res.status(404).json({ msg: `Class "${classToFind}" not found` });
      }
      classIdObjectId = foundClass._id;
    } else {
      return res.status(400).json({ msg: "classId, classname, or className is required" });
    }
    
    let subjectIdObjectId = null;
    if (subjectId && mongoose.Types.ObjectId.isValid(subjectId)) {
      subjectIdObjectId = subjectId;
    } else if (subject) {
      const foundSubject = await Subject.findOne({ name: subject });
      if (!foundSubject) {
        return res.status(404).json({ msg: `Subject "${subject}" not found` });
      }
      subjectIdObjectId = foundSubject._id;
    } else {
      return res.status(400).json({ msg: "subjectId or subject is required" });
    }
    
    await Exam.create({
      name,
      dateOf: dateOfDate,
      totalMark,
      subjectId: subjectIdObjectId,
      classId: classIdObjectId,
    });
    res.status(200).json({ msg: "Exam added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong", error: error.message });
  }
};

exports.deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.examId);
    res.status(200).json({ msg: "exam deteted successfully", exam });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong");
  }
};

exports.getExams = async (req, res) => {
  try {
    let subjectIdObjectId = null;
    if (req.query.subjectId || req.query.subject) {
      const subjectToFind = req.query.subjectId || req.query.subject;
      if (mongoose.Types.ObjectId.isValid(subjectToFind)) {
        subjectIdObjectId = subjectToFind;
      } else {
        const foundSubject = await Subject.findOne({ name: subjectToFind });
        if (!foundSubject) {
          return res.status(404).json({ msg: "Subject not found" });
        }
        subjectIdObjectId = foundSubject._id;
      }
    }
    
    const query = subjectIdObjectId ? { subjectId: subjectIdObjectId } : {};
    const exams = await Exam.find(query).populate("classId").populate("subjectId");
    res.status(200).json({ msg: "list of exams", exams });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong");
  }
};

exports.updateExam = async (req, res) => {
  try {
    let updateData = { ...req.body };
    
    if (updateData.subjectId || updateData.subject) {
      const subjectToFind = updateData.subjectId || updateData.subject;
      if (mongoose.Types.ObjectId.isValid(subjectToFind)) {
        updateData.subjectId = subjectToFind;
      } else {
        const foundSubject = await Subject.findOne({ name: subjectToFind });
        if (!foundSubject) {
          return res.status(404).json({ msg: `Subject "${subjectToFind}" not found` });
        }
        updateData.subjectId = foundSubject._id;
      }
      delete updateData.subject;
    }
    
    if (updateData.classId || updateData.classname || updateData.className) {
      const classToFind = updateData.classId || updateData.classname || updateData.className;
      if (mongoose.Types.ObjectId.isValid(classToFind)) {
        updateData.classId = classToFind;
      } else {
        const foundClass = await Classroom.findOne({ className: classToFind });
        if (!foundClass) {
          return res.status(404).json({ msg: `Class "${classToFind}" not found` });
        }
        updateData.classId = foundClass._id;
      }
      delete updateData.classname;
      delete updateData.className;
    }
    
    if (updateData.dateOf) {
      updateData.dateOf = new Date(updateData.dateOf);
      if (isNaN(updateData.dateOf.getTime())) {
        return res.status(400).json({ msg: "Invalid date format" });
      }
    }
    
    const exam = await Exam.findByIdAndUpdate(req.params.examId, updateData, {
      new: true,
    }).populate("classId").populate("subjectId");
    res.status(200).json({ msg: "Exam updated", exam });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong", error: error.message });
  }
};

exports.submitMark = async (req, res) => {
  try {
    const { examname, examId, exammarks } = req.body;
    const teacherId = req.userId || req.headers.userid;
    
    let exam = null;
    if (examId && mongoose.Types.ObjectId.isValid(examId)) {
      exam = await Exam.findById(examId);
    } else if (examname) {
      exam = await Exam.findOne({ name: examname });
    } else {
      return res.status(400).json({ msg: "examId or examname is required" });
    }
    
    if (!exam) {
      return res.status(404).json({ msg: "Exam not found" });
    }
    
    const marksMap = new Map(exam.marks || new Map());
    if (exammarks && typeof exammarks === "object") {
      for (const [studentId, markValue] of Object.entries(exammarks)) {
        const mark = parseInt(typeof markValue === "object" ? markValue.mark : markValue);
        if (typeof mark === "number" && mark >= 0 && mark <= exam.totalMark) {
          marksMap.set(studentId.toString(), {
            mark: mark,
            submittedAt: new Date(),
            submittedBy: teacherId ? mongoose.Types.ObjectId(teacherId) : null,
          });
        } else {
          return res.status(400).json({ 
            msg: `Invalid mark ${mark} for student ${studentId}. Must be between 0 and ${exam.totalMark}` 
          });
        }
      }
    }
    
    exam.marks = marksMap;
    await exam.save();
    
    res.status(200).json({ msg: "Marks updated", exam });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong", error: error.message });
  }
};

exports.newHomework = async (req, res) => {
  try {
    const {
      name,
      dateOf,
      description,
      subject,
      subjectId,
      classname,
      className,
      classId,
      optionA,
      optionB,
      optionC,
      optionD,
      correct,
    } = req.body;
    
    const dateOfDate = dateOf ? new Date(dateOf) : new Date();
    if (isNaN(dateOfDate.getTime())) {
      return res.status(400).json({ msg: "Invalid date format" });
    }
    
    let classIdObjectId = null;
    if (classId && mongoose.Types.ObjectId.isValid(classId)) {
      classIdObjectId = classId;
    } else if (classname || className) {
      const classToFind = classname || className;
      const foundClass = await Classroom.findOne({ className: classToFind });
      if (!foundClass) {
        return res.status(404).json({ msg: `Class "${classToFind}" not found` });
      }
      classIdObjectId = foundClass._id;
    } else {
      return res.status(400).json({ msg: "classId, classname, or className is required" });
    }
    
    let subjectIdObjectId = null;
    if (subjectId && mongoose.Types.ObjectId.isValid(subjectId)) {
      subjectIdObjectId = subjectId;
    } else if (subject) {
      const foundSubject = await Subject.findOne({ name: subject });
      if (!foundSubject) {
        return res.status(404).json({ msg: `Subject "${subject}" not found` });
      }
      subjectIdObjectId = foundSubject._id;
    } else {
      return res.status(400).json({ msg: "subjectId or subject is required" });
    }
    
    await Homework.create({
      name,
      dateOf: dateOfDate,
      description,
      subjectId: subjectIdObjectId,
      classId: classIdObjectId,
      optionA,
      optionB,
      optionC,
      optionD,
      correct,
    });
    res.status(200).json({ msg: "Homework added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong", error: error.message });
  }
};

exports.getHomeworks = async (req, res) => {
  try {
    let subjectIdObjectId = null;
    if (req.query.subjectId || req.query.subject) {
      const subjectToFind = req.query.subjectId || req.query.subject;
      if (mongoose.Types.ObjectId.isValid(subjectToFind)) {
        subjectIdObjectId = subjectToFind;
      } else {
        const foundSubject = await Subject.findOne({ name: subjectToFind });
        if (!foundSubject) {
          return res.status(404).json({ msg: "Subject not found" });
        }
        subjectIdObjectId = foundSubject._id;
      }
    }
    
    const query = subjectIdObjectId ? { subjectId: subjectIdObjectId } : {};
    const homeworks = await Homework.find(query).populate("classId").populate("subjectId");
    res.status(200).json({ homeworks });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong");
  }
};

exports.deleteHomework = async (req, res) => {
  try {
    const homework = await Homework.findByIdAndDelete(req.params.homeId);
    res.status(200).json({ msg: "homework deteted successfully", homework });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong");
  }
};

exports.updateProfile = async (req, res) => {
  try {
    let updateData = { ...req.body };
    
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
    
    if (req?.file?.filename) {
      const imagePath = `${config.SERVER_BASE_URL}/uploads/${req.file.filename}`;
      updateData.profileImage = imagePath;
    }
    
    const user = await User.findByIdAndUpdate(req.params.userId, updateData, {
      new: true,
    }).populate("subject");
    res.status(200).json({ msg: "Profile updated successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong");
  }
};
