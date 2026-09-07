const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

/**
 * @desc    Create a new assignment
 * @route   POST /api/assignments
 * @access  Private (Teacher)
 */
const createAssignment = async (req, res, next) => {
  try {
    const { title, description, courseId, dueDate, maxMarks } = req.body;

    if (!title || !description || !courseId || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide assignment title, description, courseId, and dueDate',
      });
    }

    const assignment = await Assignment.create({
      title,
      description,
      course: courseId,
      teacher: req.user._id,
      dueDate,
      maxMarks: maxMarks || 100,
    });

    const populated = await Assignment.findById(assignment._id)
      .populate('course', 'code title')
      .populate('teacher', 'name email');

    res.status(201).json({
      success: true,
      assignment: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get assignments (with optional course filter)
 * @route   GET /api/assignments
 * @access  Private (Admin, Teacher, Student)
 */
const getAssignments = async (req, res, next) => {
  try {
    const { courseId } = req.query;
    const filter = {};
    if (courseId) filter.course = courseId;

    const assignments = await Assignment.find(filter)
      .populate('course', 'code title department')
      .populate('teacher', 'name email')
      .sort({ dueDate: 1 });

    // If student, check whether they have already submitted each assignment
    let assignmentsWithStatus = assignments;
    if (req.user.role === 'student') {
      const submissions = await Submission.find({ student: req.user._id });
      const subMap = new Map();
      submissions.forEach((s) => subMap.set(s.assignment.toString(), s));

      assignmentsWithStatus = assignments.map((a) => {
        const doc = a.toObject();
        doc.submission = subMap.get(a._id.toString()) || null;
        return doc;
      });
    }

    res.status(200).json({
      success: true,
      count: assignmentsWithStatus.length,
      assignments: assignmentsWithStatus,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit an assignment
 * @route   POST /api/assignments/:id/submit
 * @access  Private (Student)
 */
const submitAssignment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const assignmentId = req.params.id;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Submission content or link is required',
      });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const isLate = new Date() > new Date(assignment.dueDate);

    // Upsert student submission
    const submission = await Submission.findOneAndUpdate(
      { assignment: assignmentId, student: req.user._id },
      {
        content,
        submittedAt: new Date(),
        status: isLate ? 'Late' : 'Submitted',
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      submission,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all submissions for an assignment
 * @route   GET /api/assignments/:id/submissions
 * @access  Private (Teacher, Admin)
 */
const getAssignmentSubmissions = async (req, res, next) => {
  try {
    const assignmentId = req.params.id;

    const submissions = await Submission.find({ assignment: assignmentId })
      .populate('student', 'name email rollNumber department')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Grade a student submission
 * @route   PUT /api/assignments/submissions/:submissionId/grade
 * @access  Private (Teacher)
 */
const gradeSubmission = async (req, res, next) => {
  try {
    const { marksObtained, feedback } = req.body;
    const { submissionId } = req.params;

    if (marksObtained === undefined || marksObtained === null) {
      return res.status(400).json({
        success: false,
        message: 'Please provide marksObtained',
      });
    }

    const submission = await Submission.findById(submissionId).populate('assignment');
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    if (marksObtained < 0 || marksObtained > submission.assignment.maxMarks) {
      return res.status(400).json({
        success: false,
        message: `Marks must be between 0 and ${submission.assignment.maxMarks}`,
      });
    }

    submission.marksObtained = marksObtained;
    submission.feedback = feedback || '';
    submission.status = 'Graded';

    await submission.save();

    res.status(200).json({
      success: true,
      submission,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAssignment,
  getAssignments,
  submitAssignment,
  getAssignmentSubmissions,
  gradeSubmission,
};
