import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Public Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';

// Components & Route Guard
import { ProtectedRoute } from './components/ProtectedRoute';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageUsers } from './pages/admin/ManageUsers';
import { ManageCourses } from './pages/admin/ManageCourses';

// Teacher Pages
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { MarkAttendance } from './pages/teacher/MarkAttendance';
import { TeacherAssignments } from './pages/teacher/TeacherAssignments';
import { EnterResults } from './pages/teacher/EnterResults';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { ViewAttendance } from './pages/student/ViewAttendance';
import { StudentAssignments } from './pages/student/StudentAssignments';
import { ViewResults } from './pages/student/ViewResults';

export const App = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary)' }}>
          Initializing CampusConnect...
        </div>
      </div>
    );
  }

  // Helper for root route redirection
  const getRootRedirect = () => {
    if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />;
    return <Navigate to="/student/dashboard" replace />;
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : getRootRedirect()} />
      <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : getRootRedirect()} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Admin Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/courses" element={<ManageCourses />} />
      </Route>

      {/* Teacher Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/attendance" element={<MarkAttendance />} />
        <Route path="/teacher/assignments" element={<TeacherAssignments />} />
        <Route path="/teacher/results" element={<EnterResults />} />
      </Route>

      {/* Student Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['student']} />}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/attendance" element={<ViewAttendance />} />
        <Route path="/student/assignments" element={<StudentAssignments />} />
        <Route path="/student/results" element={<ViewResults />} />
      </Route>

      {/* Root & Catch-all Fallback */}
      <Route path="/" element={getRootRedirect()} />
      <Route path="*" element={getRootRedirect()} />
    </Routes>
  );
};

export default App;
