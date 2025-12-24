const User = require("../models/userModel");
const Classroom = require("../models/classModel");
const Subject = require("../models/subjectModel");
const Exam = require("../models/examModel");
const Homework = require("../models/homeworkModel");
const Organization = require("../models/organizationModel");
const mongoose = require("mongoose");
const config = require("../config/envConfig");

class TeacherControllerError extends Error {
  constructor(message, code = "TEACHER_ERROR", statusCode = 400) {
    super(message);
    this.name = "TeacherControllerError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

exports.getTeacherClass = async (req, res) => {
  try {
    if (!req.organization) {
      throw new TeacherControllerError("Organization context required", "NO_ORG_CONTEXT", 403);
    }

    let subjectId = null;
    if (req.query.subject) {
      if (mongoose.Types.ObjectId.isValid(req.query.subject)) {
        subjectId = req.query.subject;
        const subject = await Subject.findOne({
          _id: subjectId,
          organizationId: req.organization._id
        });
        if (!subject) {
          throw new TeacherControllerError("Subject not found in your organization", "SUBJECT_NOT_FOUND", 404);
        }
      } else {
        const foundSubject = await Subject.findOne({
          name: req.query.subject,
          organizationId: req.organization._id
        });
        if (!foundSubject) {
          throw new TeacherControllerError("Subject not found in your organization", "SUBJECT_NOT_FOUND", 404);
        }
        subjectId = foundSubject._id;
      }
    }

    const classroom = await Classroom.findOne({
      subjects: subjectId,
      organizationId: req.organization._id
    }).populate("subjects", "name code");

    if (!classroom) {
      throw new TeacherControllerError("Classroom not found", "CLASSROOM_NOT_FOUND", 404);
    }

    res.json({
      success: true,
      classroom,
      organization: req.organization.name
    });
  } catch (error) {
    if (error instanceof TeacherControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code,
      });
    }

    const wrappedError = new TeacherControllerError("Failed to retrieve teacher class", "GET_TEACHER_CLASS_ERROR", 500);
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code,
    });
  }
};

exports.newExam = async (req, res) => {
  try {
    if (!req.organization) {
      throw new TeacherControllerError("Organization context required", "NO_ORG_CONTEXT", 403);
    }

    const { name, dateOf, totalMark, subject, subjectId, classname, className, classId } = req.body;

    if (!name || !name.trim()) {
      throw new TeacherControllerError("Exam name is required", "MISSING_EXAM_NAME", 400);
    }

    if (!totalMark || totalMark <= 0) {
      throw new TeacherControllerError("Total mark must be greater than 0", "INVALID_TOTAL_MARK", 400);
    }

    const dateOfDate = dateOf ? new Date(dateOf) : new Date();
    if (isNaN(dateOfDate.getTime())) {
      throw new TeacherControllerError("Invalid date format", "INVALID_DATE", 400);
    }

    let classIdObjectId = null;
    if (classId && mongoose.Types.ObjectId.isValid(classId)) {
      classIdObjectId = classId;
      const foundClass = await Classroom.findOne({
        _id: classId,
        organizationId: req.organization._id
      });
      if (!foundClass) {
        throw new TeacherControllerError("Class not found in your organization", "CLASS_NOT_FOUND", 404);
      }
    } else if (classname || className) {
      const classToFind = classname || className;
      const foundClass = await Classroom.findOne({
        className: classToFind,
        organizationId: req.organization._id
      });
      if (!foundClass) {
        throw new TeacherControllerError(`Class "${classToFind}" not found in your organization`, "CLASS_NOT_FOUND", 404);
      }
      classIdObjectId = foundClass._id;
    } else {
      throw new TeacherControllerError("classId, classname, or className is required", "MISSING_CLASS", 400);
    }

    let subjectIdObjectId = null;
    if (subjectId && mongoose.Types.ObjectId.isValid(subjectId)) {
      subjectIdObjectId = subjectId;
      const foundSubject = await Subject.findOne({
        _id: subjectId,
        organizationId: req.organization._id
      });
      if (!foundSubject) {
        throw new TeacherControllerError("Subject not found in your organization", "SUBJECT_NOT_FOUND", 404);
      }
    } else if (subject) {
      const foundSubject = await Subject.findOne({
        name: subject,
        organizationId: req.organization._id
      });
      if (!foundSubject) {
        throw new TeacherControllerError(`Subject "${subject}" not found in your organization`, "SUBJECT_NOT_FOUND", 404);
      }
      subjectIdObjectId = foundSubject._id;
    } else {
      throw new TeacherControllerError("subjectId or subject is required", "MISSING_SUBJECT", 400);
    }

    const exam = await Exam.create({
      name: name.trim(),
      dateOf: dateOfDate,
      totalMark,
      subjectId: subjectIdObjectId,
      classId: classIdObjectId,
      organizationId: req.organization._id,
    });

    res.json({
      msg: "Exam added successfully",
      exam: {
        id: exam._id,
        name: exam.name,
        dateOf: exam.dateOf,
        totalMark: exam.totalMark,
        organization: req.organization.name
      }
    });
  } catch (error) {
    if (error instanceof TeacherControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code,
      });
    }

    const wrappedError = new TeacherControllerError("Failed to create exam", "CREATE_EXAM_ERROR", 500);
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code,
    });
  }
};

exports.deleteExam = async (req, res) => {
  try {
    if (!req.organization) {
      throw new TeacherControllerError("Organization context required", "NO_ORG_CONTEXT", 403);
    }

    const exam = await Exam.findOneAndDelete({
      _id: req.params.examId,
      organizationId: req.organization._id
    });

    if (!exam) {
      throw new TeacherControllerError("Exam not found in your organization", "EXAM_NOT_FOUND", 404);
    }

    res.json({
      msg: "Exam deleted successfully",
      exam: {
        id: exam._id,
        name: exam.name,
        organization: req.organization.name
      }
    });
  } catch (error) {
    if (error instanceof TeacherControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code,
      });
    }

    const wrappedError = new TeacherControllerError("Failed to delete exam", "DELETE_EXAM_ERROR", 500);
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code,
    });
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
    
    if (req?.file?.s3Url) {
      updateData.profileImage = req.file.s3Url;
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
