'use strict';

const mongoose = require('mongoose');

const attendanceSchema = mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      index: true,
    },
    status: {
      type: String,
      enum: ['present', 'absent'],
      required: true,
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

attendanceSchema.index({ date: 1, studentId: 1 }, { unique: true });
attendanceSchema.index({ classId: 1, date: -1 });
attendanceSchema.index({ studentId: 1, date: -1 });

module.exports = mongoose.model('Attendance', attendanceSchema);

