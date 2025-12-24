const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    message: {
      text: { type: String, required: true },
    },
    chat: {
          type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },
    sender: {
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
    readBy: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      readAt: {
        type: Date,
        default: Date.now,
      },
    }],
    messageType: {
      type: String,
      enum: ["text", "system"],
      default: "text",
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
MessageSchema.index({ organizationId: 1, chat: 1, createdAt: -1 });
MessageSchema.index({ organizationId: 1, sender: 1, createdAt: -1 });

module.exports = mongoose.model("Message", MessageSchema);
