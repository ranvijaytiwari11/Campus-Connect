const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: [true, 'Assignment reference is required'],
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required'],
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Submission content/link is required'],
      trim: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    marksObtained: {
      type: Number,
      default: null,
    },
    feedback: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Submitted', 'Graded', 'Late'],
      default: 'Submitted',
    },
  },
  {
    timestamps: true,
  }
);

// One submission per student per assignment
submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);
