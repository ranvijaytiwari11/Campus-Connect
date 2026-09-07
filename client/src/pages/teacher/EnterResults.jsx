import React, { useState, useEffect } from 'react';
import { courseService } from '../../services/courseService';
import { userService } from '../../services/userService';
import { resultService } from '../../services/resultService';
import { Alert } from '../../components/Alert';
import { Award, Check } from 'lucide-react';

export const EnterResults = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [formData, setFormData] = useState({
    studentId: '',
    examType: 'Final',
    marks: '',
    totalMarks: 100,
    remarks: '',
  });
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, studentsRes] = await Promise.all([
          courseService.getAllCourses(),
          userService.getAllUsers('student'),
        ]);

        if (coursesRes.success && coursesRes.courses.length > 0) {
          setCourses(coursesRes.courses);
          setSelectedCourse(coursesRes.courses[0]._id);
        }
        if (studentsRes.success && studentsRes.users.length > 0) {
          setStudents(studentsRes.users);
          setFormData((prev) => ({ ...prev, studentId: studentsRes.users[0]._id }));
        }
      } catch (err) {
        setAlert({ type: 'danger', message: 'Failed to load courses or students' });
      }
    };

    fetchData();
  }, []);

  const handleSubmitResult = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await resultService.enterResult({
        ...formData,
        courseId: selectedCourse,
        marks: Number(formData.marks),
        totalMarks: Number(formData.totalMarks),
      });

      if (res.success) {
        setAlert({
          type: 'success',
          message: `Grade (${res.result.grade}) and marks (${res.result.marks}/${res.result.totalMarks}) published successfully!`,
        });
        setFormData({
          ...formData,
          marks: '',
          remarks: '',
        });
      }
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.message || 'Failed to enter result' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Examination & Grade Portal</h1>
          <p className="page-subtitle">Publish verified academic marks, computed letter grades, and GPA records</p>
        </div>
      </div>

      <Alert
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: '', message: '' })}
      />

      <div className="card" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmitResult}>
          <div className="form-group">
            <label className="form-label">Select Course</label>
            <select
              className="form-select"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.code} — {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Select Student</label>
            <select
              className="form-select"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            >
              {students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.rollNumber || s.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Examination Category</label>
            <select
              className="form-select"
              value={formData.examType}
              onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
            >
              <option value="Final">Final Examination</option>
              <option value="Midterm">Midterm Examination</option>
              <option value="Quiz">Quiz / Test</option>
              <option value="Practical">Lab / Practical</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Marks Scored</label>
              <input
                type="number"
                min="0"
                max={formData.totalMarks}
                required
                className="form-input"
                placeholder="e.g. 85"
                value={formData.marks}
                onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Total Out Of</label>
              <input
                type="number"
                min="10"
                max="200"
                required
                className="form-input"
                value={formData.totalMarks}
                onChange={(e) => setFormData({ ...formData, totalMarks: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Performance Remarks (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Outstanding analytical approach"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            <Award size={18} />
            {loading ? 'Publishing Grade...' : 'Save & Publish Official Grade'}
          </button>
        </form>
      </div>
    </div>
  );
};
