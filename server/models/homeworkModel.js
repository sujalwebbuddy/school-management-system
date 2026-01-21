const mongoose = require("mongoose");

const homeworkSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    dateOf: {
      type: Date,
      required: true,
      index: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      index: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    questions: {
      type: [
        {
          questionText: {
            type: String,
            required: true,
          },
          optionA: {
            type: String,
            required: true,
          },
          optionB: {
            type: String,
            required: true,
          },
          optionC: {
            type: String,
            required: true,
          },
          optionD: {
            type: String,
            required: true,
          },
          correct: {
            type: String,
            required: true,
            enum: ["A", "B", "C", "D"],
          },
        },
      ],
      validate: {
        validator: function (questions) {
          if (this.isNew && (!questions || questions.length === 0)) {
            return false;
          }
          return true;
        },
        message: "At least one question is required for new homeworks",
      },
    },
    optionA: {
      type: String,
    },
    optionB: {
      type: String,
    },
    optionC: {
      type: String,
    },
    optionD: {
      type: String,
    },
    correct: {
      type: String,
      enum: ["A", "B", "C", "D"],
    },
  },
  {
    timestamps: true,
  }
);

homeworkSchema.index({ organizationId: 1, subjectId: 1, classId: 1 });
homeworkSchema.index({ organizationId: 1, classId: 1, dateOf: -1 });

homeworkSchema.methods.normalizeQuestions = function () {
  if (this.questions && Array.isArray(this.questions) && this.questions.length > 0) {
    return this.questions;
  }

  if (this.optionA && this.optionB && this.optionC && this.optionD) {
    return [
      {
        questionText: this.description || "",
        optionA: this.optionA,
        optionB: this.optionB,
        optionC: this.optionC,
        optionD: this.optionD,
        correct: this.correct,
      },
    ];
  }

  return [];
};

module.exports = mongoose.model("Homework", homeworkSchema);
