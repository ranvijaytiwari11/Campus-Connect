import React, { useState, useEffect } from 'react';
import { assignmentService } from '../../services/assignmentService';
import { Alert } from '../../components/Alert';
import { Modal } from '../../components/Modal';
import { FileText, Send, CheckCircle2, Clock } from 'lucide-react';

export const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionContent, setSubmissionContent] = useState('');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(true);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await assignmentService.getAssignments();
      if (res.success) {
        setAssignments(res.assignments);
      }
    } catch (err) {
      setAlert({ type: 'danger', message: 'Failed to fetch assignments' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleOpenSubmit = (assignment) => {
    setSelectedAssignment(assignment);
    setSubmissionContent(assignment.submission?.content || '');
    setIsSubmitModalOpen(true);
  };

  const handleSubmitDeliverable = async (e) => {
    e.preventDefault();
    if (!selectedAssignment || !submissionContent) return;

    try {
      const res = await assignmentService.submitAssignment(
        selectedAssignment._id,
        submissionContent
      );

      if (res.success) {
        setAlert({
          type: 'success',
          message: `Work for "${selectedAssignment.title}" submitted successfully!`,
        });
        setIsSubmitModalOpen(false);
        fetchAssignments();
      }
    } catch (err) {
      setAlert({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to submit assignment',
      });
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Course Assignments</h1>
          <p className="page-subtitle">Access course homework, submit deliverables, and view instructor feedback</p>
        </div>
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
              <th>Assignment</th>
              <th>Course</th>
              <th>Instructor</th>
              <th>Due Date</th>
              <th>Max Score</th>
              <th>Status / Grade</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  No assignments available for your enrolled courses.
                </td>
              </tr>
            ) : (
              assignments.map((a) => {
                const sub = a.submission;
                const isLate = new Date() > new Date(a.dueDate);
                return (
                  <tr key={a._id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{a.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {a.description}
                      </div>
                    </td>
                    <td><span className="badge badge-primary">{a.course?.code}</span></td>
                    <td>{a.teacher?.name}</td>
                    <td>
                      <span style={{ color: isLate && !sub ? 'var(--danger)' : 'inherit', fontWeight: isLate && !sub ? 700 : 400 }}>
                        {new Date(a.dueDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td>{a.maxMarks} pts</td>
                    <td>
                      {sub ? (
                        <div>
                          <span className={`badge badge-${sub.status === 'Graded' ? 'success' : 'primary'}`}>
                            {sub.status === 'Graded' ? `Graded: ${sub.marksObtained}/${a.maxMarks}` : 'Submitted'}
                          </span>
                          {sub.feedback && (
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                              "{sub.feedback}"
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="badge badge-warning">Pending</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleOpenSubmit(a)}
                        className={`btn btn-sm ${sub ? 'btn-secondary' : 'btn-primary'}`}
                      >
                        {sub ? 'Resubmit / Edit' : 'Submit Work'}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title={`Submit Deliverable: ${selectedAssignment?.title}`}
      >
        <form onSubmit={handleSubmitDeliverable}>
          <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <strong>Course:</strong> {selectedAssignment?.course?.code} — {selectedAssignment?.course?.title}<br />
            <strong>Max Score:</strong> {selectedAssignment?.maxMarks} points<br />
            <strong>Due Date:</strong> {selectedAssignment && new Date(selectedAssignment.dueDate).toLocaleDateString()}
          </div>

          <div className="form-group">
            <label className="form-label">Submission Content / URL / Answer</label>
            <textarea
              required
              className="form-textarea"
              placeholder="Paste your GitHub repository link, Google Docs URL, or text solution here..."
              value={submissionContent}
              onChange={(e) => setSubmissionContent(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            <Send size={16} /> Submit Assignment
          </button>
        </form>
      </Modal>
    </div>
  );
};
