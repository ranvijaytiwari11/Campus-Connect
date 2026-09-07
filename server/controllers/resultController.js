const Result = require('../models/Result');

/**
 * Helper to compute letter grade from percentage
 */
const computeGrade = (percentage) => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
};

/**
 * @desc    Enter or update student result/grade
 * @route   POST /api/results
 * @access  Private (Teacher, Admin)
 */
const enterResult = async (req, res, next) => {
  try {
    const { studentId, courseId, examType, marks, totalMarks, remarks } = req.body;

    if (!studentId || !courseId || marks === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide studentId, courseId, and marks',
      });
    }

    const max = totalMarks || 100;
    if (marks < 0 || marks > max) {
      return res.status(400).json({
        success: false,
        message: `Marks must be between 0 and ${max}`,
      });
    }

    const percentage = (marks / max) * 100;
    const grade = computeGrade(percentage);

    const result = await Result.findOneAndUpdate(
      {
        student: studentId,
        course: courseId,
        examType: examType || 'Final',
      },
      {
        teacher: req.user._id,
        marks,
        totalMarks: max,
        grade,
        remarks: remarks || '',
      },
      { new: true, upsert: true }
    )
      .populate('student', 'name email rollNumber department')
      .populate('course', 'code title')
      .populate('teacher', 'name');

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get results for the authenticated student
 * @route   GET /api/results/my-results
 * @access  Private (Student)
 */
const getMyResults = async (req, res, next) => {
  try {
    const results = await Result.find({ student: req.user._id })
      .populate('course', 'code title credits department')
      .populate('teacher', 'name')
      .sort({ createdAt: -1 });

    // Calculate GPA / Average percentage
    let totalScore = 0;
    let totalMax = 0;
    results.forEach((r) => {
      totalScore += r.marks;
      totalMax += r.totalMarks;
    });

    const averagePercentage = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
    const overallGrade = computeGrade(averagePercentage);

    res.status(200).json({
      success: true,
      summary: {
        totalExams: results.length,
        averagePercentage,
        overallGrade,
      },
      results,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get results for a course
 * @route   GET /api/results/course/:courseId
 * @access  Private (Teacher, Admin)
 */
const getCourseResults = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const results = await Result.find({ course: courseId })
      .populate('student', 'name email rollNumber department')
      .populate('teacher', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  enterResult,
  getMyResults,
  getCourseResults,
};
