const express = require('express');
const router = express.Router();
const {
  createAssignment,
  getAssignments,
  submitAssignment,
  getAssignmentSubmissions,
  gradeSubmission,
} = require('../controllers/assignmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/', getAssignments);
router.post('/', authorizeRoles('teacher'), createAssignment);
router.post('/:id/submit', authorizeRoles('student'), submitAssignment);
router.get('/:id/submissions', authorizeRoles('teacher', 'admin'), getAssignmentSubmissions);
router.put('/submissions/:submissionId/grade', authorizeRoles('teacher'), gradeSubmission);

module.exports = router;
