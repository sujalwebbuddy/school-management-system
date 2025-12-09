const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      required: true,
      enum: ["Open", "InProgress", "Testing", "Close"],
      default: "Open",
      index: true,
    },
    priority: {
      type: String,
      required: true,
      enum: ["Low", "Normal", "High", "Critical"],
      default: "Normal",
      index: true,
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    estimate: {
      type: Number,
      min: 0,
    },
    dueDate: {
      type: Date,
    },
    rankId: {
      type: Number,
      default: 0,
      index: true,
    },
    color: {
      type: String,
      default: "#02897B",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
taskSchema.index({ status: 1, priority: 1 });
taskSchema.index({ assignee: 1, status: 1 });
taskSchema.index({ createdBy: 1 });
taskSchema.index({ createdAt: -1 });
taskSchema.index({ dueDate: 1 });

module.exports = mongoose.model("Task", taskSchema);
