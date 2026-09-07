import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { authService } from '../../services/authService';
import { Alert } from '../../components/Alert';
import { Modal } from '../../components/Modal';
import { UserPlus, Trash2, Edit2, Search } from 'lucide-react';

export const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  // Modal State for Creating User
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: 'Computer Science',
    rollNumber: '',
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers(roleFilter);
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      setAlert({ type: 'danger', message: 'Failed to fetch users' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const data = await authService.register(newUser);
      if (data.success) {
        setAlert({ type: 'success', message: `User ${newUser.name} created successfully` });
        setIsModalOpen(false);
        setNewUser({
          name: '',
          email: '',
          password: '',
          role: 'student',
          department: 'Computer Science',
          rollNumber: '',
        });
        fetchUsers();
      }
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.message || 'Failed to create user' });
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete user ${name}?`)) return;
    try {
      const data = await userService.deleteUser(id);
      if (data.success) {
        setAlert({ type: 'success', message: 'User deleted successfully' });
        setUsers(users.filter((u) => u._id !== id));
      }
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.message || 'Failed to delete user' });
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.rollNumber && u.rollNumber.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">Provision, inspect, and remove students, teachers, and admins</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <UserPlus size={16} /> Add New User
        </button>
      </div>

      <Alert
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: '', message: '' })}
      />

      <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search by name, email, or roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ width: '180px' }}>
          <select
            className="form-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="student">Students</option>
            <option value="teacher">Teachers</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name & Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Roll Number / ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  No users found matching query.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{u.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{u.email}</div>
                  </td>
                  <td>
                    <span className={`badge badge-${u.role === 'admin' ? 'danger' : u.role === 'teacher' ? 'secondary' : 'primary'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>{u.department || 'N/A'}</td>
                  <td>{u.rollNumber || '—'}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteUser(u._id, u.name)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: 'var(--danger)' }}
                      title="Delete User"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New User"
      >
        <form onSubmit={handleCreateUser}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              required
              className="form-input"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              className="form-input"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="form-input"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Department</label>
            <input
              type="text"
              className="form-input"
              value={newUser.department}
              onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
            />
          </div>
          {newUser.role === 'student' && (
            <div className="form-group">
              <label className="form-label">Roll Number</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. CS2026-105"
                value={newUser.rollNumber}
                onChange={(e) => setNewUser({ ...newUser, rollNumber: e.target.value })}
              />
            </div>
          )}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            Create Account
          </button>
        </form>
      </Modal>
    </div>
  );
};
