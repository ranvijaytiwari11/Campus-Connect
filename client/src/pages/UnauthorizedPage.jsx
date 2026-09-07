import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const UnauthorizedPage = () => {
  const { user } = useAuth();

  const getDashboardPath = () => {
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'teacher') return '/teacher/dashboard';
    return '/student/dashboard';
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'var(--danger-bg)',
        color: 'var(--danger)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem',
      }}>
        <ShieldAlert size={36} />
      </div>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>403 - Access Forbidden</h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', marginBottom: '2rem' }}>
        You do not have administrative permissions to view this resource. Your role (<strong>{user?.role}</strong>) is restricted from accessing this route.
      </p>
      <Link to={getDashboardPath()} className="btn btn-primary">
        <ArrowLeft size={16} />
        Back to My Dashboard
      </Link>
    </div>
  );
};
