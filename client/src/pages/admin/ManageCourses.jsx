import React, { useState, useEffect } from 'react';
import { courseService } from '../../services/courseService';
import { userService } from '../../services/userService';
import { Alert } from '../../components/Alert';
import { Modal } from '../../components/Modal';
import { Plus, Trash2, BookOpen } from 'lucide-react';

export const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    code: '',
    title: '',
    department: 'Computer Science',
    semester: 1,
    credits: 3,
    description: '',
    teacher: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [coursesRes, teachersRes] = await Promise.all([
        courseService.getAllCourses(),
        userService.getAllUsers('teacher'),
      ]);

      if (coursesRes.success) setCourses(coursesRes.courses);
      if (teachersRes.success) setTeachers(teachersRes.users);
    } catch (err) {
      setAlert({ type: 'danger', message: 'Failed to load courses or faculty list' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const data = await courseService.createCourse({
        ...newCourse,
        teacher: newCourse.teacher || null,
      });

      if (data.success) {
        setAlert({ type: 'success', message: `Course ${newCourse.code} created successfully` });
        setIsModalOpen(false);
        setNewCourse({
          code: '',
          title: '',
          department: 'Computer Science',
          semester: 1,
          credits: 3,
          description: '',
          teacher: '',
        });
        fetchData();
      }
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.message || 'Failed to create course' });
    }
  };

  const handleDeleteCourse = async (id, code) => {
    if (!window.confirm(`Delete course ${code}? This cannot be undone.`)) return;
    try {
      const data = await courseService.deleteCourse(id);
      if (data.success) {
        setAlert({ type: 'success', message: 'Course deleted successfully' });
        setCourses(courses.filter((c) => c._id !== id));
      }
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.message || 'Failed to delete course' });
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Courses</h1>
          <p className="page-subtitle">Curriculum planning, course offerings, and faculty assignments</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={16} /> Add New Course
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
              <th>Course Code</th>
              <th>Title</th>
              <th>Department</th>
              <th>Semester</th>
              <th>Credits</th>
              <th>Assigned Teacher</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  No courses created yet.
                </td>
              </tr>
            ) : (
              courses.map((c) => (
                <tr key={c._id}>
                  <td><span className="badge badge-primary">{c.code}</span></td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{c.title}</div>
                    {c.description && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{c.description}</div>
                    )}
                  </td>
                  <td>{c.department}</td>
                  <td>Sem {c.semester}</td>
                  <td>{c.credits}</td>
                  <td>
                    {c.teacher ? (
                      <div>
                        <div style={{ fontWeight: 500 }}>{c.teacher.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.teacher.email}</div>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteCourse(c._id, c.code)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: 'var(--danger)' }}
                      title="Delete Course"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Course"
      >
        <form onSubmit={handleCreateCourse}>
          <div className="form-group">
            <label className="form-label">Course Code (e.g. CS101)</label>
            <input
              type="text"
              required
              className="form-input"
              value={newCourse.code}
              onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value.toUpperCase() })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Course Title</label>
            <input
              type="text"
              required
              className="form-input"
              value={newCourse.title}
              onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Department</label>
            <input
              type="text"
              required
              className="form-input"
              value={newCourse.department}
              onChange={(e) => setNewCourse({ ...newCourse, department: e.target.value })}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Semester</label>
              <input
                type="number"
                min="1"
                max="8"
                required
                className="form-input"
                value={newCourse.semester}
                onChange={(e) => setNewCourse({ ...newCourse, semester: Number(e.target.value) })}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Credits</label>
              <input
                type="number"
                min="1"
                max="6"
                required
                className="form-input"
                value={newCourse.credits}
                onChange={(e) => setNewCourse({ ...newCourse, credits: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Assign Faculty Member</label>
            <select
              className="form-select"
              value={newCourse.teacher}
              onChange={(e) => setNewCourse({ ...newCourse, teacher: e.target.value })}
            >
              <option value="">-- None (Assign Later) --</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} ({t.department})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Description / Syllabus Overview</label>
            <textarea
              className="form-textarea"
              value={newCourse.description}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            Save Course
          </button>
        </form>
      </Modal>
    </div>
  );
};
