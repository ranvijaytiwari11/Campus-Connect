import React, { useState, useEffect } from 'react';
import { courseService } from '../../services/courseService';
import { userService } from '../../services/userService';
import { attendanceService } from '../../services/attendanceService';
import { Alert } from '../../components/Alert';
import { CalendarCheck, Check, X, Clock } from 'lucide-react';

export const MarkAttendance = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({}); // { studentId: 'Present' | 'Absent' | 'Late' }
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  // Load courses on mount
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await courseService.getAllCourses();
        if (res.success && res.courses.length > 0) {
          setCourses(res.courses);
          setSelectedCourse(res.courses[0]._id);
        }
      } catch (err) {
        setAlert({ type: 'danger', message: 'Failed to fetch courses' });
      }
    };
    loadCourses();
  }, []);

  // Load students when course changes
  useEffect(() => {
    const loadStudents = async () => {
      if (!selectedCourse) return;
      try {
        setLoading(true);
        // In a full implementation, you could query course enrollments; for demo, fetch students
        const res = await userService.getAllUsers('student');
        if (res.success) {
          setStudents(res.users);
          // Default all students to 'Present'
          const defaultMap = {};
          res.users.forEach((s) => {
            defaultMap[s._id] = 'Present';
          });
          setAttendanceMap(defaultMap);
        }
      } catch (err) {
        setAlert({ type: 'danger', message: 'Failed to fetch enrolled students' });
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [selectedCourse]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSubmitAttendance = async (e) => {
    e.preventDefault();
    if (!selectedCourse || students.length === 0) return;

    try {
      setLoading(true);
      const records = students.map((s) => ({
        studentId: s._id,
        status: attendanceMap[s._id] || 'Present',
      }));

      const res = await attendanceService.markAttendance({
        courseId: selectedCourse,
        date,
        records,
      });

      if (res.success) {
        setAlert({ type: 'success', message: `Attendance saved successfully for ${records.length} students on ${date}!` });
      }
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.message || 'Failed to submit attendance' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Daily Attendance Register</h1>
          <p className="page-subtitle">Record and synchronize daily student class presence</p>
        </div>
      </div>

      <Alert
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: '', message: '' })}
      />

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <label className="form-label">Select Course</label>
            <select
              className="form-select"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.code} — {c.title} ({c.department})
                </option>
              ))}
            </select>
          </div>

          <div style={{ width: '200px' }}>
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmitAttendance}>
        <div className="table-container" style={{ marginBottom: '1.5rem' }}>
          <table>
            <thead>
              <tr>
                <th>Roll Number</th>
                <th>Student Name & Email</th>
                <th>Department</th>
                <th>Attendance Status</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    No student records found.
                  </td>
                </tr>
              ) : (
                students.map((s) => {
                  const currentStatus = attendanceMap[s._id] || 'Present';
                  return (
                    <tr key={s._id}>
                      <td style={{ fontWeight: 700 }}>{s.rollNumber || 'CS-DEMO'}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{s.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{s.email}</div>
                      </td>
                      <td>{s.department}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(s._id, 'Present')}
                            className={`btn btn-sm ${currentStatus === 'Present' ? 'btn-success' : 'btn-secondary'}`}
                          >
                            <Check size={14} /> Present
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(s._id, 'Late')}
                            className={`btn btn-sm ${currentStatus === 'Late' ? 'btn-primary' : 'btn-secondary'}`}
                          >
                            <Clock size={14} /> Late
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(s._id, 'Absent')}
                            className={`btn btn-sm ${currentStatus === 'Absent' ? 'btn-danger' : 'btn-secondary'}`}
                          >
                            <X size={14} /> Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {students.length > 0 && (
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <CalendarCheck size={18} />
            {loading ? 'Saving Attendance...' : 'Save & Synchronize Attendance'}
          </button>
        )}
      </form>
    </div>
  );
};
