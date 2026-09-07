import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Lock, Mail, ArrowRight } from 'lucide-react';
import { Alert } from '../components/Alert';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'teacher') navigate('/teacher/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (role) => {
    if (role === 'admin') {
      setEmail('admin@campusconnect.com');
      setPassword('password123');
    } else if (role === 'teacher') {
      setEmail('sarah.smith@campusconnect.com');
      setPassword('password123');
    } else if (role === 'student') {
      setEmail('alex.johnson@campusconnect.com');
      setPassword('password123');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <GraduationCap />
        </div>
        <h1 className="auth-title">CampusConnect</h1>
        <p className="auth-subtitle">College Management & Academic Portal</p>

        <Alert type="danger" message={error} onClose={() => setError('')} />

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                className="form-input"
                placeholder="name@campusconnect.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="demo-accounts">
          <div className="demo-title">Quick Demo Logins</div>
          <div className="demo-buttons">
            <button
              type="button"
              className="demo-btn"
              onClick={() => setDemoCredentials('admin')}
            >
              Admin
            </button>
            <button
              type="button"
              className="demo-btn"
              onClick={() => setDemoCredentials('teacher')}
            >
              Teacher
            </button>
            <button
              type="button"
              className="demo-btn"
              onClick={() => setDemoCredentials('student')}
            >
              Student
            </button>
          </div>
        </div>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Create Account</Link>
        </div>
      </div>
    </div>
  );
};
