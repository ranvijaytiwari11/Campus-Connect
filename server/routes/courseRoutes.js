const express = require('express');
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.post('/', authorizeRoles('admin'), createCourse);
router.put('/:id', authorizeRoles('admin'), updateCourse);
router.delete('/:id', authorizeRoles('admin'), deleteCourse);

module.exports = router;
