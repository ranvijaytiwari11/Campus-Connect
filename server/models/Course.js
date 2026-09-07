const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Please provide course code (e.g., CS101)'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide course title'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Please specify department'],
      trim: true,
    },
    semester: {
      type: Number,
      required: [true, 'Please specify semester number'],
      min: 1,
      max: 8,
      default: 1,
    },
    credits: {
      type: Number,
      required: true,
      default: 3,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Course', courseSchema);
