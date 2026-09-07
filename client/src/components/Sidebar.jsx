import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CalendarCheck,
  FileText,
  Award,
  GraduationCap,
} from 'lucide-react';

export const Sidebar = () => {
  const { user } = useAuth();

  const getLinks = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { to: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
          { to: '/admin/users', label: 'Manage Users', icon: <Users size={18} /> },
          { to: '/admin/courses', label: 'Manage Courses', icon: <BookOpen size={18} /> },
        ];
      case 'teacher':
        return [
          { to: '/teacher/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
          { to: '/teacher/attendance', label: 'Mark Attendance', icon: <CalendarCheck size={18} /> },
          { to: '/teacher/assignments', label: 'Assignments', icon: <FileText size={18} /> },
          { to: '/teacher/results', label: 'Enter Results', icon: <Award size={18} /> },
        ];
      case 'student':
        return [
          { to: '/student/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
          { to: '/student/attendance', label: 'My Attendance', icon: <CalendarCheck size={18} /> },
          { to: '/student/assignments', label: 'My Assignments', icon: <FileText size={18} /> },
          { to: '/student/results', label: 'My Results', icon: <Award size={18} /> },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--bg-sidebar)',
      color: 'var(--text-light)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <GraduationCap size={22} color="#ffffff" />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em' }}>
            CampusConnect
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {user?.role} portal
          </div>
        </div>
      </div>

      <nav style={{ padding: '1rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius)',
              color: isActive ? '#ffffff' : '#94a3b8',
              backgroundColor: isActive ? 'var(--primary)' : 'transparent',
              textDecoration: 'none',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.875rem',
              transition: 'var(--transition)',
            })}
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{
        padding: '1rem 1.25rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
      }}>
        <div>Signed in as:</div>
        <div style={{ fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {user?.email}
        </div>
      </div>
    </aside>
  );
};
