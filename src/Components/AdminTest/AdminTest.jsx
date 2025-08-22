import React, { useState } from 'react';
import { authUtils } from '../../utils/auth';
import apiService from '../../services/api';
import './AdminTest.css';

const AdminTest = () => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(authUtils.getUser());
  const [adminStats, setAdminStats] = useState(null);

  const handleInputChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await apiService.login(loginData);
      
      if (response.success) {
        authUtils.login(response.user, response.token);
        setUser(response.user);
        setMessage(`✅ Login berhasil! Role: ${response.user.role}, Admin: ${authUtils.isAdmin()}`);
      }
    } catch (error) {
      setMessage(`❌ Login gagal: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authUtils.logout();
    setUser(null);
    setAdminStats(null);
    setMessage('✅ Logout berhasil');
  };

  const testAdminAccess = async () => {
    setLoading(true);
    try {
      const stats = await apiService.getAdminStats();
      setAdminStats(stats.stats);
      setMessage('✅ Admin access berhasil!');
    } catch (error) {
      setMessage(`❌ Admin access gagal: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setLoginData({
      username: 'NE Administrator',
      password: 'BARA@ssmm123'
    });
  };

  const fillUserCredentials = () => {
    setLoginData({
      username: 'user1',
      password: 'password123'
    });
  };

  return (
    <div className="admin-test-container">
      <h2>🧪 Test Login Admin System</h2>
      
      {/* Current User Status */}
      <div className="user-status">
        <h3>Status Saat Ini:</h3>
        {user ? (
          <div className="user-info">
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Is Admin:</strong> {authUtils.isAdmin() ? '✅ Ya' : '❌ Tidak'}</p>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        ) : (
          <p>❌ Belum login</p>
        )}
      </div>

      {/* Login Form */}
      {!user && (
        <div className="login-section">
          <h3>Login Test:</h3>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username/Email:</label>
              <input
                type="text"
                name="username"
                value={loginData.username}
                onChange={handleInputChange}
                placeholder="Masukkan username atau email"
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleInputChange}
                placeholder="Masukkan password"
                required
              />
            </div>
            <div className="button-group">
              <button type="submit" disabled={loading} className="btn-login">
                {loading ? 'Loading...' : 'Login'}
              </button>
            </div>
          </form>

          <div className="quick-fill">
            <h4>Quick Fill:</h4>
            <button onClick={fillAdminCredentials} className="btn-fill-admin">
              Fill Admin Credentials
            </button>
            <button onClick={fillUserCredentials} className="btn-fill-user">
              Fill User Credentials
            </button>
          </div>
        </div>
      )}

      {/* Admin Test Section */}
      {user && authUtils.isAdmin() && (
        <div className="admin-section">
          <h3>🔐 Admin Features Test:</h3>
          <button onClick={testAdminAccess} disabled={loading} className="btn-test-admin">
            Test Admin API Access
          </button>
          
          {adminStats && (
            <div className="admin-stats">
              <h4>📊 Admin Statistics:</h4>
              <ul>
                <li>Total Properties: {adminStats.totalProperties}</li>
                <li>Total Users: {adminStats.totalUsers}</li>
                <li>Properties by Status: {JSON.stringify(adminStats.propertiesByStatus)}</li>
                <li>Properties by Type: {JSON.stringify(adminStats.propertiesByType)}</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Message Display */}
      {message && (
        <div className={`message ${message.includes('❌') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {/* Instructions */}
      <div className="instructions">
        <h3>📋 Instruksi Test:</h3>
        <ol>
          <li><strong>Test Admin Login:</strong> Gunakan username "NE Administrator" dan password "BARA@ssmm123"</li>
          <li><strong>Test User Login:</strong> Gunakan username "user1" dan password "password123"</li>
          <li><strong>Verifikasi Role:</strong> Cek apakah sistem mendeteksi admin dengan benar</li>
          <li><strong>Test Admin Access:</strong> Jika login sebagai admin, test akses ke API admin</li>
        </ol>
      </div>
    </div>
  );
};

export default AdminTest;