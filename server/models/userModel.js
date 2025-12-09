const mongoose = require("mongoose");
const config = require("../config/envConfig");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Please provide a valid email address",
      },
    },
    password: {
      type: String,
      required: function () {
        return this.isApproved === true;
      },
      select: false,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      min: 0,
      max: 150,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    phoneNumber: {
      type: String,
      required: function () {
        return this.role !== "admin";
      },
    },
    role: {
      type: String,
      required: true,
      enum: ["teacher", "student", "parent", "admin"],
      index: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
      index: true,
    },
    classIn: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      index: true,
      required: function () {
        return this.role === "student" && this.isApproved === true;
      },
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      index: true,
      required: function () {
        return this.role === "teacher" && this.isApproved === true;
      },
    },
    children: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      index: true,
    },
    profileImage: {
      type: String,
      default: config.DEFAULT_PROFILE_IMAGE_URL,
    },
    avatarImage: {
      type: String,
      default: "",
    },
    isAvatarImageSet: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ role: 1, isApproved: 1 });
userSchema.index({ classIn: 1, role: 1 });
userSchema.index({ subject: 1, role: 1 });

// userSchema.pre("validate", function (next) {
//   if (this.role === "student" && !this.classIn) {
//     this.invalidate("classIn", "Students must be assigned to a class");
//   }
//   if (this.role === "teacher" && !this.subject) {
//     this.invalidate("subject", "Teachers must be assigned a subject");
//   }
//   next();
// });

module.exports = mongoose.model("User", userSchema);
