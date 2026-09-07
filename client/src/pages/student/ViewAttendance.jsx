import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../services/attendanceService';
import { StatCard } from '../../components/StatCard';
import { CalendarCheck, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Alert } from '../../components/Alert';

export const ViewAttendance = () => {
  const [data, setData] = useState({ summary: {}, records: [] });
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await attendanceService.getMyAttendance();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        setAlert({ type: 'danger', message: 'Failed to fetch attendance logs' });
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const summary = data.summary || {};

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Attendance Report</h1>
          <p className="page-subtitle">Track your lecture attendance, class presence, and compliance</p>
        </div>
      </div>

      <Alert
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: '', message: '' })}
      />

      <div className="grid-stats">
        <StatCard
          icon={<CalendarCheck size={24} />}
          label="Overall Percentage"
          value={`${summary.percentage || 0}%`}
          colorClass={(summary.percentage || 0) >= 75 ? 'green' : 'red'}
        />
        <StatCard
          icon={<CheckCircle2 size={24} />}
          label="Total Present"
          value={summary.presentLectures || 0}
          colorClass="green"
        />
        <StatCard
          icon={<Clock size={24} />}
          label="Late Marks"
          value={summary.lateLectures || 0}
          colorClass="orange"
        />
        <StatCard
          icon={<XCircle size={24} />}
          label="Total Absent"
          value={summary.absentLectures || 0}
          colorClass="red"
        />
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.125rem', marginBottom: '1.25rem' }}>Daily Attendance Logs</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Course</th>
                <th>Instructor</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {data.records?.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    No attendance records logged yet.
                  </td>
                </tr>
              ) : (
                data.records?.map((r) => (
                  <tr key={r._id}>
                    <td>{new Date(r.date).toLocaleDateString()}</td>
                    <td>
                      <strong>{r.course?.code}</strong> — {r.course?.title}
                    </td>
                    <td>{r.teacher?.name}</td>
                    <td>
                      <span
                        className={`badge badge-${
                          r.status === 'Present'
                            ? 'success'
                            : r.status === 'Late'
                            ? 'warning'
                            : 'danger'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td>{r.remarks || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
