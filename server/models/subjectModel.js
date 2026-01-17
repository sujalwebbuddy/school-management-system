const mongoose = require("mongoose");

const subjectSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    code: {
      type: String,
      trim: true,
      sparse: true,
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
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

subjectSchema.index({ organizationId: 1, name: 1 }, { unique: true });
subjectSchema.index({ organizationId: 1, code: 1 }, { unique: true });

module.exports = mongoose.model("Subject", subjectSchema);

