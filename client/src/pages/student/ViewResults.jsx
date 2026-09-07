import React, { useState, useEffect } from 'react';
import { resultService } from '../../services/resultService';
import { StatCard } from '../../components/StatCard';
import { Award, BookOpen, BarChart3, CheckCircle2 } from 'lucide-react';
import { Alert } from '../../components/Alert';

export const ViewResults = () => {
  const [data, setData] = useState({ summary: {}, results: [] });
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await resultService.getMyResults();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        setAlert({ type: 'danger', message: 'Failed to fetch examination results' });
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const summary = data.summary || {};

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Academic Grade Sheet</h1>
          <p className="page-subtitle">Official transcript breakdown, exam scores, and cumulative performance</p>
        </div>
      </div>

      <Alert
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: '', message: '' })}
      />

      <div className="grid-stats">
        <StatCard
          icon={<Award size={24} />}
          label="Cumulative Grade"
          value={summary.overallGrade || 'A'}
          colorClass="primary"
        />
        <StatCard
          icon={<BarChart3 size={24} />}
          label="Average Score"
          value={`${summary.averagePercentage || 0}%`}
          colorClass="cyan"
        />
        <StatCard
          icon={<BookOpen size={24} />}
          label="Evaluations Completed"
          value={summary.totalExams || 0}
          colorClass="green"
        />
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.125rem', marginBottom: '1.25rem' }}>Course-wise Examination Results</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Course Code & Title</th>
                <th>Evaluation Type</th>
                <th>Credits</th>
                <th>Marks Obtained</th>
                <th>Percentage</th>
                <th>Letter Grade</th>
                <th>Faculty Remarks</th>
              </tr>
            </thead>
            <tbody>
              {data.results?.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    No examination results published yet.
                  </td>
                </tr>
              ) : (
                data.results?.map((r) => {
                  const percentage = Math.round((r.marks / r.totalMarks) * 100);
                  return (
                    <tr key={r._id}>
                      <td>
                        <strong>{r.course?.code}</strong> — {r.course?.title}
                      </td>
                      <td>{r.examType}</td>
                      <td>{r.course?.credits || 3}</td>
                      <td>
                        {r.marks} / {r.totalMarks}
                      </td>
                      <td>{percentage}%</td>
                      <td>
                        <span
                          className={`badge badge-${
                            r.grade === 'A+' || r.grade === 'A'
                              ? 'success'
                              : r.grade === 'B' || r.grade === 'C'
                              ? 'primary'
                              : 'danger'
                          }`}
                        >
                          {r.grade}
                        </span>
                      </td>
                      <td>{r.remarks || '—'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
