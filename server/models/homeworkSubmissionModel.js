const mongoose = require("mongoose");

const homeworkSubmissionSchema = mongoose.Schema(
  {
    homeworkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Homework",
      required: true,
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    answers: {
      type: Map,
      of: String,
      default: new Map(),
    },
    submittedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    score: {
      type: Number,
      min: 0,
    },
    gradedAt: {
      type: Date,
    },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

homeworkSubmissionSchema.index({ organizationId: 1, homeworkId: 1, studentId: 1 }, { unique: true });
homeworkSubmissionSchema.index({ organizationId: 1, studentId: 1, submittedAt: -1 });

module.exports = mongoose.model("HomeworkSubmission", homeworkSubmissionSchema);

