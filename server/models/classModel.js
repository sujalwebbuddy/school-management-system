const mongoose = require("mongoose");

const classSchema = mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
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

classSchema.index({ organizationId: 1, className: 1 }, { unique: true });

module.exports = mongoose.model("Class", classSchema);
