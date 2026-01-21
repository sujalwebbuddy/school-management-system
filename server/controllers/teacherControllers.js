const User = require("../models/userModel");
const Classroom = require("../models/classModel");
const Subject = require("../models/subjectModel");
const Exam = require("../models/examModel");
const Homework = require("../models/homeworkModel");
const mongoose = require("mongoose");

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
    if (!req.organization) {
      throw new TeacherControllerError("Organization context required", "NO_ORG_CONTEXT", 403);
    }

    let subjectIdObjectId = null;
    if (req.query.subjectId || req.query.subject) {
      const subjectToFind = req.query.subjectId || req.query.subject;
      if (mongoose.Types.ObjectId.isValid(subjectToFind)) {
        subjectIdObjectId = subjectToFind;
        // Verify the subject belongs to the organization
        const foundSubject = await Subject.findOne({
          _id: subjectIdObjectId,
          organizationId: req.organization._id
        });
        if (!foundSubject) {
          throw new TeacherControllerError("Subject not found in your organization", "SUBJECT_NOT_FOUND", 404);
        }
      } else {
        const foundSubject = await Subject.findOne({
          name: subjectToFind,
          organizationId: req.organization._id
        });
        if (!foundSubject) {
          throw new TeacherControllerError(`Subject "${subjectToFind}" not found in your organization`, "SUBJECT_NOT_FOUND", 404);
        }
        subjectIdObjectId = foundSubject._id;
      }
    }

    const query = {
      ...(subjectIdObjectId && { subjectId: subjectIdObjectId }),
      organizationId: req.organization._id
    };

    const exams = await Exam.find(query)
      .populate("classId")
      .populate("subjectId");

    res.status(200).json({
      msg: "list of exams",
      exams,
      organization: req.organization.name
    });
  } catch (error) {
    if (error instanceof TeacherControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code,
      });
    }

    console.log(error);
    const wrappedError = new TeacherControllerError("Failed to retrieve exams", "GET_EXAMS_ERROR", 500);
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code,
    });
  }
};

exports.updateExam = async (req, res) => {
  try {
    if (!req.organization) {
      throw new TeacherControllerError("Organization context required", "NO_ORG_CONTEXT", 403);
    }

    let updateData = { ...req.body };

    if (updateData.subjectId || updateData.subject) {
      const subjectToFind = updateData.subjectId || updateData.subject;
      if (mongoose.Types.ObjectId.isValid(subjectToFind)) {
        updateData.subjectId = subjectToFind;
        // Verify the subject belongs to the organization
        const foundSubject = await Subject.findOne({
          _id: subjectToFind,
          organizationId: req.organization._id
        });
        if (!foundSubject) {
          throw new TeacherControllerError("Subject not found in your organization", "SUBJECT_NOT_FOUND", 404);
        }
      } else {
        const foundSubject = await Subject.findOne({
          name: subjectToFind,
          organizationId: req.organization._id
        });
        if (!foundSubject) {
          throw new TeacherControllerError(`Subject "${subjectToFind}" not found in your organization`, "SUBJECT_NOT_FOUND", 404);
        }
        updateData.subjectId = foundSubject._id;
      }
      delete updateData.subject;
    }

    if (updateData.classId || updateData.classname || updateData.className) {
      const classToFind = updateData.classId || updateData.classname || updateData.className;
      if (mongoose.Types.ObjectId.isValid(classToFind)) {
        updateData.classId = classToFind;
        // Verify the class belongs to the organization
        const foundClass = await Classroom.findOne({
          _id: classToFind,
          organizationId: req.organization._id
        });
        if (!foundClass) {
          throw new TeacherControllerError("Class not found in your organization", "CLASS_NOT_FOUND", 404);
        }
      } else {
        const foundClass = await Classroom.findOne({
          className: classToFind,
          organizationId: req.organization._id
        });
        if (!foundClass) {
          throw new TeacherControllerError(`Class "${classToFind}" not found in your organization`, "CLASS_NOT_FOUND", 404);
        }
        updateData.classId = foundClass._id;
      }
      delete updateData.classname;
      delete updateData.className;
    }

    if (updateData.dateOf) {
      updateData.dateOf = new Date(updateData.dateOf);
      if (isNaN(updateData.dateOf.getTime())) {
        throw new TeacherControllerError("Invalid date format", "INVALID_DATE", 400);
      }
    }

    const exam = await Exam.findOneAndUpdate(
      {
        _id: req.params.examId,
        organizationId: req.organization._id
      },
      updateData,
      {
        new: true,
      }
    ).populate(["classId", "subjectId"]);

    if (!exam) {
      throw new TeacherControllerError("Exam not found in your organization", "EXAM_NOT_FOUND", 404);
    }

    res.status(200).json({
      msg: "Exam updated",
      exam,
      organization: req.organization.name
    });
  } catch (error) {
    if (error instanceof TeacherControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code,
      });
    }

    console.log(error);
    const wrappedError = new TeacherControllerError("Failed to update exam", "UPDATE_EXAM_ERROR", 500);
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code,
    });
  }
};

exports.submitMark = async (req, res) => {
  try {
    if (!req.organization) {
      throw new TeacherControllerError("Organization context required", "NO_ORG_CONTEXT", 403);
    }

    const { examname, examId, exammarks } = req.body;
    const teacherId = req.userId || req.headers.userid;

    let exam = null;
    if (examId && mongoose.Types.ObjectId.isValid(examId)) {
      exam = await Exam.findOne({
        _id: examId,
        organizationId: req.organization._id
      });
    } else if (examname) {
      exam = await Exam.findOne({
        name: examname,
        organizationId: req.organization._id
      });
    } else {
      throw new TeacherControllerError("examId or examname is required", "MISSING_EXAM_ID", 400);
    }

    if (!exam) {
      throw new TeacherControllerError("Exam not found in your organization", "EXAM_NOT_FOUND", 404);
    }
    
    const marksMap = new Map(exam.marks || new Map());
    if (exammarks && typeof exammarks === "object") {
      for (const [studentId, markValue] of Object.entries(exammarks)) {
        const mark = parseInt(typeof markValue === "object" ? markValue.mark : markValue);
        if (typeof mark === "number" && mark >= 0 && mark <= exam.totalMark) {
          // Verify student belongs to the organization
          const student = await User.findOne({
            _id: studentId,
            organizationId: req.organization._id,
            role: "student"
          });
          if (!student) {
            throw new TeacherControllerError(`Student ${studentId} not found in your organization`, "STUDENT_NOT_FOUND", 404);
          }

          marksMap.set(studentId.toString(), {
            mark: mark,
            submittedAt: new Date(),
            submittedBy: teacherId ? mongoose.Types.ObjectId(teacherId) : null,
          });
        } else {
          throw new TeacherControllerError(
            `Invalid mark ${mark} for student ${studentId}. Must be between 0 and ${exam.totalMark}`,
            "INVALID_MARK",
            400
          );
        }
      }
    }

    exam.marks = marksMap;
    await exam.save();

    res.status(200).json({
      msg: "Marks updated",
      exam,
      organization: req.organization.name
    });
  } catch (error) {
    if (error instanceof TeacherControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code,
      });
    }

    console.log(error);
    const wrappedError = new TeacherControllerError("Failed to submit marks", "SUBMIT_MARKS_ERROR", 500);
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code,
    });
  }
};

function validateQuestions(questions) {
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new TeacherControllerError("At least one question is required", "MISSING_QUESTIONS", 400);
  }

  for (let i = 0; i < questions.length; i += 1) {
    const question = questions[i];
    if (!question.questionText || !question.questionText.trim()) {
      throw new TeacherControllerError(`Question ${i + 1}: Question text is required`, "INVALID_QUESTION_TEXT", 400);
    }
    if (!question.optionA || !question.optionA.trim()) {
      throw new TeacherControllerError(`Question ${i + 1}: Option A is required`, "INVALID_OPTION_A", 400);
    }
    if (!question.optionB || !question.optionB.trim()) {
      throw new TeacherControllerError(`Question ${i + 1}: Option B is required`, "INVALID_OPTION_B", 400);
    }
    if (!question.optionC || !question.optionC.trim()) {
      throw new TeacherControllerError(`Question ${i + 1}: Option C is required`, "INVALID_OPTION_C", 400);
    }
    if (!question.optionD || !question.optionD.trim()) {
      throw new TeacherControllerError(`Question ${i + 1}: Option D is required`, "INVALID_OPTION_D", 400);
    }
    if (!question.correct || !["A", "B", "C", "D"].includes(question.correct)) {
      throw new TeacherControllerError(`Question ${i + 1}: Valid correct answer (A, B, C, or D) is required`, "INVALID_CORRECT_ANSWER", 400);
    }
  }
}

function resolveClassId(classId, classname, className, organizationId) {
  if (classId && mongoose.Types.ObjectId.isValid(classId)) {
    return Classroom.findOne({
      _id: classId,
      organizationId: organizationId,
    }).then((foundClass) => {
      if (!foundClass) {
        throw new TeacherControllerError("Class not found in your organization", "CLASS_NOT_FOUND", 404);
      }
      return classId;
    });
  } else if (classname || className) {
    const classToFind = classname || className;
    return Classroom.findOne({
      className: classToFind,
      organizationId: organizationId,
    }).then((foundClass) => {
      if (!foundClass) {
        throw new TeacherControllerError(`Class "${classToFind}" not found in your organization`, "CLASS_NOT_FOUND", 404);
      }
      return foundClass._id;
    });
  } else {
    throw new TeacherControllerError("classId, classname, or className is required", "MISSING_CLASS", 400);
  }
}

function resolveSubjectId(subjectId, subject, organizationId) {
  if (subjectId && mongoose.Types.ObjectId.isValid(subjectId)) {
    return Subject.findOne({
      _id: subjectId,
      organizationId: organizationId,
    }).then((foundSubject) => {
      if (!foundSubject) {
        throw new TeacherControllerError("Subject not found in your organization", "SUBJECT_NOT_FOUND", 404);
      }
      return subjectId;
    });
  } else if (subject) {
    return Subject.findOne({
      name: subject,
      organizationId: organizationId,
    }).then((foundSubject) => {
      if (!foundSubject) {
        throw new TeacherControllerError(`Subject "${subject}" not found in your organization`, "SUBJECT_NOT_FOUND", 404);
      }
      return foundSubject._id;
    });
  } else {
    throw new TeacherControllerError("subjectId or subject is required", "MISSING_SUBJECT", 400);
  }
}

exports.newHomework = async (req, res) => {
  try {
    if (!req.organization) {
      throw new TeacherControllerError("Organization context required", "NO_ORG_CONTEXT", 403);
    }

    const {
      name,
      dateOf,
      description,
      subject,
      subjectId,
      classname,
      className,
      classId,
      questions,
    } = req.body;

    if (!name || !name.trim()) {
      throw new TeacherControllerError("Homework name is required", "MISSING_HOMEWORK_NAME", 400);
    }

    const dateOfDate = dateOf ? new Date(dateOf) : new Date();
    if (isNaN(dateOfDate.getTime())) {
      throw new TeacherControllerError("Invalid date format", "INVALID_DATE", 400);
    }

    validateQuestions(questions);

    const classIdObjectId = await resolveClassId(classId, classname, className, req.organization._id);
    const subjectIdObjectId = await resolveSubjectId(subjectId, subject, req.organization._id);

    const processedQuestions = questions.map((q) => ({
      questionText: q.questionText.trim(),
      optionA: q.optionA.trim(),
      optionB: q.optionB.trim(),
      optionC: q.optionC.trim(),
      optionD: q.optionD.trim(),
      correct: q.correct,
    }));

    await Homework.create({
      name: name.trim(),
      dateOf: dateOfDate,
      description: description ? description.trim() : "",
      subjectId: subjectIdObjectId,
      classId: classIdObjectId,
      organizationId: req.organization._id,
      questions: processedQuestions,
    });

    res.status(200).json({
      msg: "Homework added successfully",
      organization: req.organization.name,
    });
  } catch (error) {
    if (error instanceof TeacherControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code,
      });
    }

    const wrappedError = new TeacherControllerError("Failed to create homework", "CREATE_HOMEWORK_ERROR", 500);
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
      throw new TeacherControllerError("Organization context required", "NO_ORG_CONTEXT", 403);
    }

    let subjectIdObjectId = null;
    if (req.query.subjectId || req.query.subject) {
      const subjectToFind = req.query.subjectId || req.query.subject;
      if (mongoose.Types.ObjectId.isValid(subjectToFind)) {
        subjectIdObjectId = subjectToFind;
        // Verify the subject belongs to the organization
        const foundSubject = await Subject.findOne({
          _id: subjectIdObjectId,
          organizationId: req.organization._id
        });
        if (!foundSubject) {
          throw new TeacherControllerError("Subject not found in your organization", "SUBJECT_NOT_FOUND", 404);
        }
      } else {
        const foundSubject = await Subject.findOne({
          name: subjectToFind,
          organizationId: req.organization._id
        });
        if (!foundSubject) {
          throw new TeacherControllerError(`Subject "${subjectToFind}" not found in your organization`, "SUBJECT_NOT_FOUND", 404);
        }
        subjectIdObjectId = foundSubject._id;
      }
    }

    const query = {
      ...(subjectIdObjectId && { subjectId: subjectIdObjectId }),
      organizationId: req.organization._id
    };

    const homeworks = await Homework.find(query)
      .populate(["classId", "subjectId"]);

    res.status(200).json({
      homeworks,
      organization: req.organization.name
    });
  } catch (error) {
    if (error instanceof TeacherControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code,
      });
    }

    console.log(error);
    const wrappedError = new TeacherControllerError("Failed to retrieve homeworks", "GET_HOMEWORKS_ERROR", 500);
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code,
    });
  }
};

exports.deleteHomework = async (req, res) => {
  try {
    if (!req.organization) {
      throw new TeacherControllerError("Organization context required", "NO_ORG_CONTEXT", 403);
    }

    const homework = await Homework.findOneAndDelete({
      _id: req.params.homeId,
      organizationId: req.organization._id
    });

    if (!homework) {
      throw new TeacherControllerError("Homework not found in your organization", "HOMEWORK_NOT_FOUND", 404);
    }

    res.status(200).json({
      msg: "homework deleted successfully",
      homework,
      organization: req.organization.name
    });
  } catch (error) {
    if (error instanceof TeacherControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code,
      });
    }

    console.log(error);
    const wrappedError = new TeacherControllerError("Failed to delete homework", "DELETE_HOMEWORK_ERROR", 500);
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    if (!req.organization) {
      throw new TeacherControllerError("Organization context required", "NO_ORG_CONTEXT", 403);
    }

    let updateData = { ...req.body };

    if (updateData.subject) {
      if (mongoose.Types.ObjectId.isValid(updateData.subject)) {
        // Verify the subject belongs to the organization
        const foundSubject = await Subject.findOne({
          _id: updateData.subject,
          organizationId: req.organization._id
        });
        if (!foundSubject) {
          throw new TeacherControllerError("Subject not found in your organization", "SUBJECT_NOT_FOUND", 404);
        }
      } else {
        const foundSubject = await Subject.findOne({
          name: updateData.subject,
          organizationId: req.organization._id
        });
        if (!foundSubject) {
          throw new TeacherControllerError(`Subject "${updateData.subject}" not found in your organization`, "SUBJECT_NOT_FOUND", 404);
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
    ).populate("subject");

    if (!user) {
      throw new TeacherControllerError("User not found in your organization", "USER_NOT_FOUND", 404);
    }

    res.status(200).json({
      msg: "Profile updated successfully",
      user,
      organization: req.organization.name
    });
  } catch (error) {
    if (error instanceof TeacherControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code,
      });
    }

    console.log(error);
    const wrappedError = new TeacherControllerError("Failed to update profile", "UPDATE_PROFILE_ERROR", 500);
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code,
    });
  }
};
