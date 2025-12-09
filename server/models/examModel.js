const mongoose = require("mongoose");

const examSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    totalMark: {
      type: Number,
      required: true,
      min: 0,
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
    marks: {
      type: Map,
      of: {
        mark: {
          type: Number,
          min: 0,
        },
        submittedAt: {
          type: Date,
          default: Date.now,
        },
        submittedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
      default: new Map(),
    },
  },
  {
    timestamps: true,
  }
);

examSchema.index({ subjectId: 1, classId: 1 });
examSchema.index({ classId: 1, dateOf: -1 });

examSchema.pre("save", function (next) {
  if (this.marks && this.marks instanceof Map) {
    for (const [studentId, markData] of this.marks.entries()) {
      const mark = typeof markData === "object" && markData !== null ? markData.mark : markData;
      if (typeof mark === "number" && mark > this.totalMark) {
        return next(new Error(`Mark ${mark} exceeds total mark ${this.totalMark} for student ${studentId}`));
      }
    }
  }
  next();
});

examSchema.methods.toJSON = function () {
  const obj = this.toObject();
  if (obj.marks && obj.marks instanceof Map) {
    obj.marks = Object.fromEntries(obj.marks);
  }
  return obj;
};

module.exports = mongoose.model("Exam", examSchema);
