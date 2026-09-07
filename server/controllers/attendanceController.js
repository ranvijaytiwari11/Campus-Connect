const Attendance = require('../models/Attendance');
const Course = require('../models/Course');
const User = require('../models/User');

/**
 * @desc    Bulk mark or update attendance for a class
 * @route   POST /api/attendance
 * @access  Private (Teacher)
 */
const markAttendance = async (req, res, next) => {
  try {
    const { courseId, date, records } = req.body;

    if (!courseId || !records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide courseId, date, and student attendance records',
      });
    }

    const attendanceDate = date ? new Date(date) : new Date();
    // Normalize date to YYYY-MM-DD start of day for clean daily indexing
    attendanceDate.setHours(0, 0, 0, 0);

    const operations = records.map((record) => ({
      updateOne: {
        filter: {
          course: courseId,
          student: record.studentId,
          date: attendanceDate,
        },
        update: {
          $set: {
            teacher: req.user._id,
            status: record.status || 'Present',
            remarks: record.remarks || '',
          },
        },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(operations);

    res.status(200).json({
      success: true,
      message: `Attendance recorded successfully for ${records.length} students`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get attendance for a specific course on a specific date (or all records)
 * @route   GET /api/attendance/course/:courseId
 * @access  Private (Teacher, Admin)
 */
const getCourseAttendance = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { date } = req.query;

    const filter = { course: courseId };
    if (date) {
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      const nextDate = new Date(selectedDate);
      nextDate.setDate(nextDate.getDate() + 1);

      filter.date = {
        $gte: selectedDate,
        $lt: nextDate,
      };
    }

    const records = await Attendance.find(filter)
      .populate('student', 'name email rollNumber department')
      .populate('teacher', 'name')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      records,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get attendance records for the authenticated student
 * @route   GET /api/attendance/my-attendance
 * @access  Private (Student)
 */
const getMyAttendance = async (req, res, next) => {
  try {
    const studentId = req.user._id;

    const records = await Attendance.find({ student: studentId })
      .populate('course', 'code title department')
      .populate('teacher', 'name')
      .sort({ date: -1 });

    // Calculate aggregated metrics
    const totalLectures = records.length;
    const presentLectures = records.filter((r) => r.status === 'Present').length;
    const lateLectures = records.filter((r) => r.status === 'Late').length;
    const absentLectures = records.filter((r) => r.status === 'Absent').length;

    const percentage = totalLectures > 0
      ? Math.round(((presentLectures + lateLectures * 0.5) / totalLectures) * 100)
      : 100;

    res.status(200).json({
      success: true,
      summary: {
        totalLectures,
        presentLectures,
        lateLectures,
        absentLectures,
        percentage,
      },
      records,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  markAttendance,
  getCourseAttendance,
  getMyAttendance,
};
