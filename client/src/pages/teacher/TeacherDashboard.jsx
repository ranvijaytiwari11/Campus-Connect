import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { courseService } from '../../services/courseService';
import { assignmentService } from '../../services/assignmentService';
import { StatCard } from '../../components/StatCard';
import { BookOpen, CalendarCheck, FileText, Award, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TeacherDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const [coursesRes, assignRes] = await Promise.all([
          courseService.getAllCourses(),
          assignmentService.getAssignments(),
        ]);

        if (coursesRes.success) {
          // Filter courses taught by this teacher (or show all if unassigned for demo)
          const myCourses = coursesRes.courses.filter(
            (c) => c.teacher?._id === user?._id || !c.teacher
          );
          setCourses(myCourses.length > 0 ? myCourses : coursesRes.courses);
        }

        if (assignRes.success) {
          setAssignments(assignRes.assignments);
        }
      } catch (err) {
        console.error('Failed to load teacher dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [user]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Faculty Workspace</h1>
          <p className="page-subtitle">Welcome back, {user?.name}. Manage your courses, classes, and evaluations.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/teacher/attendance" className="btn btn-primary">
            <CalendarCheck size={16} /> Mark Attendance
          </Link>
          <Link to="/teacher/assignments" className="btn btn-secondary">
            <Plus size={16} /> New Assignment
          </Link>
        </div>
      </div>

      <div className="grid-stats">
        <StatCard
          icon={<BookOpen size={24} />}
          label="Courses Assigned"
          value={courses.length}
          colorClass="primary"
        />
        <StatCard
          icon={<FileText size={24} />}
          label="Active Assignments"
          value={assignments.length}
          colorClass="cyan"
        />
        <StatCard
          icon={<CalendarCheck size={24} />}
          label="Department"
          value={user?.department || 'Faculty'}
          colorClass="green"
        />
      </div>

      <div className="grid-2">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem' }}>My Courses</h3>
            <Link to="/teacher/attendance" style={{ fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
              Take Roll Call →
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {courses.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No courses assigned yet.</p>
            ) : (
              courses.map((c) => (
                <div key={c._id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius)',
                  background: '#f8fafc',
                  border: '1px solid var(--border)',
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{c.code} — {c.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Semester {c.semester} • {c.credits} Credits • {c.department}
                    </div>
                  </div>
                  <Link to={`/teacher/attendance`} className="btn btn-secondary btn-sm">
                    Attendance
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem' }}>Recent Assignments</h3>
            <Link to="/teacher/assignments" style={{ fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
              Manage All →
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {assignments.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No assignments created yet.</p>
            ) : (
              assignments.slice(0, 4).map((a) => (
                <div key={a._id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius)',
                  background: '#f8fafc',
                  border: '1px solid var(--border)',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{a.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Course: {a.course?.code} • Due: {new Date(a.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="badge badge-primary">{a.maxMarks} pts</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
