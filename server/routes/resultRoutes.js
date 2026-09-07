const express = require('express');
const router = express.Router();
const {
  enterResult,
  getMyResults,
  getCourseResults,
} = require('../controllers/resultController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect);

router.post('/', authorizeRoles('teacher', 'admin'), enterResult);
router.get('/my-results', authorizeRoles('student'), getMyResults);
router.get('/course/:courseId', authorizeRoles('teacher', 'admin'), getCourseResults);

module.exports = router;
