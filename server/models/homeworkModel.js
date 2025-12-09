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
    description: {
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
  {
    timestamps: true,
  }
);

homeworkSchema.index({ subjectId: 1, classId: 1 });
homeworkSchema.index({ classId: 1, dateOf: -1 });

module.exports = mongoose.model("Homework", homeworkSchema);
