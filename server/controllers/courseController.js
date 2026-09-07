const Course = require('../models/Course');

/**
 * @desc    Create a new course
 * @route   POST /api/courses
 * @access  Private (Admin)
 */
const createCourse = async (req, res, next) => {
  try {
    const { code, title, department, semester, credits, description, teacher } = req.body;

    if (!code || !title || !department || !semester) {
      return res.status(400).json({
        success: false,
        message: 'Please provide course code, title, department, and semester',
      });
    }

    const courseExists = await Course.findOne({ code: code.toUpperCase() });
    if (courseExists) {
      return res.status(400).json({
        success: false,
        message: `Course with code '${code.toUpperCase()}' already exists`,
      });
    }

    const course = await Course.create({
      code: code.toUpperCase(),
      title,
      department,
      semester,
      credits: credits || 3,
      description: description || '',
      teacher: teacher || null,
    });

    const populatedCourse = await Course.findById(course._id).populate('teacher', 'name email department');

    res.status(201).json({
      success: true,
      course: populatedCourse,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all courses (with optional filters)
 * @route   GET /api/courses
 * @access  Private (Admin, Teacher, Student)
 */
const getAllCourses = async (req, res, next) => {
  try {
    const { department, semester, teacher } = req.query;
    const filter = {};

    if (department) filter.department = department;
    if (semester) filter.semester = semester;
    if (teacher) filter.teacher = teacher;

    const courses = await Course.find(filter)
      .populate('teacher', 'name email department')
      .sort({ code: 1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single course by ID
 * @route   GET /api/courses/:id
 * @access  Private
 */
const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate('teacher', 'name email department');
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update course
 * @route   PUT /api/courses/:id
 * @access  Private (Admin)
 */
const updateCourse = async (req, res, next) => {
  try {
    const { title, department, semester, credits, description, teacher } = req.body;

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (title) course.title = title;
    if (department) course.department = department;
    if (semester) course.semester = semester;
    if (credits !== undefined) course.credits = credits;
    if (description !== undefined) course.description = description;
    if (teacher !== undefined) course.teacher = teacher || null;

    const updatedCourse = await course.save();
    const populated = await Course.findById(updatedCourse._id).populate('teacher', 'name email department');

    res.status(200).json({
      success: true,
      course: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete course
 * @route   DELETE /api/courses/:id
 * @access  Private (Admin)
 */
const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
