import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { courseService } from '../../services/courseService';
import { StatCard } from '../../components/StatCard';
import { Users, GraduationCap, BookOpen, ShieldCheck, Plus, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalAdmins: 0,
    totalUsers: 0,
  });
  const [coursesCount, setCoursesCount] = useState(0);
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const statsData = await userService.getAdminStats();
        if (statsData.success) {
          setStats(statsData.stats);
        }

        const courseData = await courseService.getAllCourses();
        if (courseData.success) {
          setCoursesCount(courseData.count);
          setRecentCourses(courseData.courses.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Administrator Hub</h1>
          <p className="page-subtitle">Platform overview and institutional control center</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/users" className="btn btn-secondary">
            <Users size={16} /> Manage Users
          </Link>
          <Link to="/admin/courses" className="btn btn-primary">
            <Plus size={16} /> Add Course
          </Link>
        </div>
      </div>

      <div className="grid-stats">
        <StatCard
          icon={<GraduationCap size={24} />}
          label="Total Students"
          value={stats.totalStudents}
          colorClass="primary"
        />
        <StatCard
          icon={<BookOpen size={24} />}
          label="Faculty Members"
          value={stats.totalTeachers}
          colorClass="cyan"
        />
        <StatCard
          icon={<BookOpen size={24} />}
          label="Active Courses"
          value={coursesCount}
          colorClass="green"
        />
        <StatCard
          icon={<ShieldCheck size={24} />}
          label="Administrators"
          value={stats.totalAdmins}
          colorClass="orange"
        />
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Curriculum & Courses</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Recently created courses across departments</p>
          </div>
          <Link to="/admin/courses" className="btn btn-secondary btn-sm">
            View All <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Course Title</th>
                <th>Department</th>
                <th>Credits</th>
                <th>Assigned Faculty</th>
              </tr>
            </thead>
            <tbody>
              {recentCourses.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    No courses found. Add courses to get started.
                  </td>
                </tr>
              ) : (
                recentCourses.map((c) => (
                  <tr key={c._id}>
                    <td><span className="badge badge-primary">{c.code}</span></td>
                    <td style={{ fontWeight: 600 }}>{c.title}</td>
                    <td>{c.department}</td>
                    <td>{c.credits}</td>
                    <td>{c.teacher ? c.teacher.name : <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>}</td>
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
