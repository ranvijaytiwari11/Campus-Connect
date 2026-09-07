import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { attendanceService } from '../../services/attendanceService';
import { assignmentService } from '../../services/assignmentService';
import { resultService } from '../../services/resultService';
import { StatCard } from '../../components/StatCard';
import { CalendarCheck, FileText, Award, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [attendanceSummary, setAttendanceSummary] = useState({ percentage: 100, totalLectures: 0 });
  const [assignments, setAssignments] = useState([]);
  const [resultSummary, setResultSummary] = useState({ overallGrade: 'N/A', averagePercentage: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const [attRes, assignRes, resRes] = await Promise.all([
          attendanceService.getMyAttendance(),
          assignmentService.getAssignments(),
          resultService.getMyResults(),
        ]);

        if (attRes.success) setAttendanceSummary(attRes.summary);
        if (assignRes.success) setAssignments(assignRes.assignments);
        if (resRes.success) setResultSummary(resRes.summary);
      } catch (err) {
        console.error('Failed to load student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const pendingAssignments = assignments.filter((a) => !a.submission);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Academic Portal</h1>
          <p className="page-subtitle">Welcome, {user?.name} (Roll No: {user?.rollNumber || 'N/A'})</p>
        </div>
      </div>

      <div className="grid-stats">
        <StatCard
          icon={<CalendarCheck size={24} />}
          label="Attendance Rate"
          value={`${attendanceSummary.percentage}%`}
          colorClass={attendanceSummary.percentage >= 75 ? 'green' : 'red'}
        />
        <StatCard
          icon={<FileText size={24} />}
          label="Pending Assignments"
          value={pendingAssignments.length}
          colorClass={pendingAssignments.length === 0 ? 'green' : 'orange'}
        />
        <StatCard
          icon={<Award size={24} />}
          label="Average Grade"
          value={resultSummary.overallGrade || 'A'}
          colorClass="primary"
        />
        <StatCard
          icon={<CheckCircle size={24} />}
          label="Academic Standing"
          value={attendanceSummary.percentage >= 75 ? 'Good' : 'At Risk'}
          colorClass={attendanceSummary.percentage >= 75 ? 'cyan' : 'red'}
        />
      </div>

      <div className="grid-2">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.125rem' }}>Upcoming & Pending Assignments</h3>
            <Link to="/student/assignments" style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              View All →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {assignments.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No assignments assigned yet.</p>
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
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{a.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Due: {new Date(a.dueDate).toLocaleDateString()} • {a.course?.code}
                    </div>
                  </div>
                  {a.submission ? (
                    <span className="badge badge-success">Submitted</span>
                  ) : (
                    <Link to="/student/assignments" className="btn btn-primary btn-sm">
                      Submit Work
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.125rem' }}>Quick Actions</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/student/attendance" className="btn btn-secondary" style={{ justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CalendarCheck size={18} /> View Detailed Attendance Breakdown
              </span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/student/assignments" className="btn btn-secondary" style={{ justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} /> Assignment Submissions & Feedback
              </span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/student/results" className="btn btn-secondary" style={{ justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={18} /> Official Examination Results & GPA Card
              </span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
