const mongoose = require("mongoose");

const classSchema = mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    subjects: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subject",
        },
      ],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Class", classSchema);
