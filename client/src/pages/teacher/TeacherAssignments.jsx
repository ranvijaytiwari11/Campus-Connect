import React, { useState, useEffect } from 'react';
import { assignmentService } from '../../services/assignmentService';
import { courseService } from '../../services/courseService';
import { Alert } from '../../components/Alert';
import { Modal } from '../../components/Modal';
import { Plus, FileText, CheckCircle, ExternalLink } from 'lucide-react';

export const TeacherAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(true);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmissionsOpen, setIsSubmissionsOpen] = useState(false);

  // New assignment form
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    courseId: '',
    dueDate: '',
    maxMarks: 100,
  });

  // Grading form
  const [gradeData, setGradeData] = useState({
    submissionId: '',
    marksObtained: '',
    feedback: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assignRes, coursesRes] = await Promise.all([
        assignmentService.getAssignments(),
        courseService.getAllCourses(),
      ]);

      if (assignRes.success) setAssignments(assignRes.assignments);
      if (coursesRes.success && coursesRes.courses.length > 0) {
        setCourses(coursesRes.courses);
        setNewAssignment((prev) => ({ ...prev, courseId: coursesRes.courses[0]._id }));
      }
    } catch (err) {
      setAlert({ type: 'danger', message: 'Failed to load assignments or courses' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      const res = await assignmentService.createAssignment(newAssignment);
      if (res.success) {
        setAlert({ type: 'success', message: 'Assignment created successfully' });
        setIsCreateOpen(false);
        setNewAssignment({
          title: '',
          description: '',
          courseId: courses[0]?._id || '',
          dueDate: '',
          maxMarks: 100,
        });
        fetchData();
      }
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.message || 'Failed to create assignment' });
    }
  };

  const handleOpenSubmissions = async (assignment) => {
    setSelectedAssignment(assignment);
    try {
      const res = await assignmentService.getSubmissions(assignment._id);
      if (res.success) {
        setSubmissions(res.submissions);
        setIsSubmissionsOpen(true);
      }
    } catch (err) {
      setAlert({ type: 'danger', message: 'Failed to fetch student submissions' });
    }
  };

  const handleGradeSubmission = async (e, submissionId) => {
    e.preventDefault();
    try {
      const res = await assignmentService.gradeSubmission(submissionId, {
        marksObtained: Number(gradeData.marksObtained),
        feedback: gradeData.feedback,
      });

      if (res.success) {
        setAlert({ type: 'success', message: 'Submission evaluated & graded successfully!' });
        // Refresh submissions view
        const subRes = await assignmentService.getSubmissions(selectedAssignment._id);
        if (subRes.success) setSubmissions(subRes.submissions);
        setGradeData({ submissionId: '', marksObtained: '', feedback: '' });
      }
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.message || 'Failed to grade submission' });
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Course Assignments</h1>
          <p className="page-subtitle">Post problem sets, review submissions, and enter feedback</p>
        </div>
        <button onClick={() => setIsCreateOpen(true)} className="btn btn-primary">
          <Plus size={16} /> Create Assignment
        </button>
      </div>

      <Alert
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: '', message: '' })}
      />

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Title & Description</th>
              <th>Course</th>
              <th>Due Date</th>
              <th>Max Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  No assignments created yet.
                </td>
              </tr>
            ) : (
              assignments.map((a) => (
                <tr key={a._id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{a.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{a.description}</div>
                  </td>
                  <td><span className="badge badge-primary">{a.course?.code}</span></td>
                  <td>{new Date(a.dueDate).toLocaleDateString()}</td>
                  <td>{a.maxMarks} pts</td>
                  <td>
                    <button
                      onClick={() => handleOpenSubmissions(a)}
                      className="btn btn-secondary btn-sm"
                    >
                      <FileText size={14} /> View Submissions
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Assignment Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Assignment"
      >
        <form onSubmit={handleCreateAssignment}>
          <div className="form-group">
            <label className="form-label">Course</label>
            <select
              className="form-select"
              value={newAssignment.courseId}
              onChange={(e) => setNewAssignment({ ...newAssignment, courseId: e.target.value })}
            >
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.code} — {c.title}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Assignment Title</label>
            <input
              type="text"
              required
              className="form-input"
              value={newAssignment.title}
              onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description / Instructions</label>
            <textarea
              required
              className="form-textarea"
              value={newAssignment.description}
              onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Due Date</label>
              <input
                type="date"
                required
                className="form-input"
                value={newAssignment.dueDate}
                onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Max Marks</label>
              <input
                type="number"
                min="10"
                max="500"
                required
                className="form-input"
                value={newAssignment.maxMarks}
                onChange={(e) => setNewAssignment({ ...newAssignment, maxMarks: Number(e.target.value) })}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            Publish Assignment
          </button>
        </form>
      </Modal>

      {/* Submissions Modal */}
      <Modal
        isOpen={isSubmissionsOpen}
        onClose={() => setIsSubmissionsOpen(false)}
        title={`Submissions: ${selectedAssignment?.title}`}
      >
        <div>
          {submissions.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>
              No student submissions received yet for this assignment.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {submissions.map((sub) => (
                <div key={sub._id} style={{
                  padding: '1rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  background: '#f8fafc',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div>
                      <span style={{ fontWeight: 700 }}>{sub.student?.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
                        ({sub.student?.rollNumber || sub.student?.email})
                      </span>
                    </div>
                    <span className={`badge badge-${sub.status === 'Graded' ? 'success' : sub.status === 'Late' ? 'warning' : 'primary'}`}>
                      {sub.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.85rem', marginBottom: '0.75rem', wordBreak: 'break-all' }}>
                    <strong>Submission Content:</strong>{' '}
                    <span style={{ color: 'var(--primary)' }}>{sub.content}</span>
                  </div>

                  {sub.marksObtained !== null ? (
                    <div style={{ fontSize: '0.85rem', background: '#ecfdf5', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                      <strong>Score:</strong> {sub.marksObtained} / {selectedAssignment?.maxMarks} pts
                      {sub.feedback && <div><strong>Feedback:</strong> {sub.feedback}</div>}
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => handleGradeSubmission(e, sub._id)}
                      style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', alignItems: 'center' }}
                    >
                      <input
                        type="number"
                        placeholder="Marks"
                        min="0"
                        max={selectedAssignment?.maxMarks}
                        required
                        className="form-input"
                        style={{ width: '90px' }}
                        onChange={(e) => setGradeData({ ...gradeData, marksObtained: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="Optional feedback..."
                        className="form-input"
                        style={{ flex: 1 }}
                        onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                      />
                      <button type="submit" className="btn btn-primary btn-sm">
                        Grade
                      </button>
                    </form>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
