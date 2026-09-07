const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required'],
      index: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course reference is required'],
      index: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Teacher reference is required'],
    },
    examType: {
      type: String,
      enum: ['Midterm', 'Final', 'Quiz', 'Practical'],
      default: 'Final',
      required: true,
    },
    marks: {
      type: Number,
      required: [true, 'Marks obtained is required'],
      min: 0,
      max: 100,
    },
    totalMarks: {
      type: Number,
      required: true,
      default: 100,
    },
    grade: {
      type: String,
      enum: ['A+', 'A', 'B', 'C', 'D', 'F'],
      required: true,
    },
    remarks: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate grade entry for the same student, course, and examType
resultSchema.index({ student: 1, course: 1, examType: 1 }, { unique: true });

module.exports = mongoose.model('Result', resultSchema);
