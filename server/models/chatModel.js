const mongoose = require("mongoose");

const ChatSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      enum: ["direct", "group"],
      default: "direct",
    },
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["admin", "member"],
          default: "member",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
ChatSchema.index({ participants: 1 });
ChatSchema.index({ "participants.user": 1 });
ChatSchema.index({ createdBy: 1 });

// Virtual for participant count
ChatSchema.virtual("participantCount").get(function () {
  return this.participants.length;
});

// Method to check if user is participant
ChatSchema.methods.isParticipant = function (userId) {
  return this.participants.some(p => p.user.toString() === userId.toString());
};

// Method to add participant
ChatSchema.methods.addParticipant = function (userId, role = "member") {
  if (!this.isParticipant(userId)) {
    this.participants.push({
      user: userId,
      role: role,
      joinedAt: new Date(),
    });
    return true;
  }
  return false;
};

// Method to remove participant
ChatSchema.methods.removeParticipant = function (userId) {
  const index = this.participants.findIndex(p => p.user.toString() === userId.toString());
  if (index > -1) {
    this.participants.splice(index, 1);
    return true;
  }
  return false;
};

module.exports = mongoose.model("Chat", ChatSchema);
