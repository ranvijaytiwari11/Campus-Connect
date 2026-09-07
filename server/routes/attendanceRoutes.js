const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getCourseAttendance,
  getMyAttendance,
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect);

router.post('/', authorizeRoles('teacher'), markAttendance);
router.get('/course/:courseId', authorizeRoles('teacher', 'admin'), getCourseAttendance);
router.get('/my-attendance', authorizeRoles('student'), getMyAttendance);

module.exports = router;
