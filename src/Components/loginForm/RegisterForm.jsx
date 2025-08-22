import React, { useState } from 'react'
import './RegisterForm.css';
import cors from 'cors';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../App';


const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Memproses...');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Enhanced validation using utility functions
    const errors = [];

    if (!validation.required(formData.username)) {
      errors.push('Username harus diisi');
    } else if (!validation.username(formData.username)) {
      errors.push('Username harus 3-20 karakter, hanya huruf, angka, dan underscore');
    }

    if (!validation.required(formData.email)) {
      errors.push('Email harus diisi');
    } else if (!validation.email(formData.email)) {
      errors.push('Format email tidak valid');
    }

    if (!validation.required(formData.password)) {
      errors.push('Password harus diisi');
    } else if (!validation.password(formData.password)) {
      errors.push('Password minimal 8 karakter dengan huruf besar, kecil, dan angka');
    }

    if (!validation.required(formData.confirmPassword)) {
      errors.push('Konfirmasi password harus diisi');
    } else if (formData.password !== formData.confirmPassword) {
      errors.push('Password dan konfirmasi password tidak sama');
    }

    if (errors.length > 0) {
      setError(errors[0]); // Show first error
      setLoading(false);
      return;
    }

    try {
      setLoadingMessage('Mendaftarkan akun...');
      const result = await register(formData.username, formData.email, formData.password, formData.confirmPassword);
      
      if (result.success) {
        if (result.autoLogin) {
          // Jika auto-login berhasil
          setLoadingMessage('Login otomatis...');
          setSuccess('🎉 Registrasi berhasil! Anda telah otomatis login. Mengarahkan ke homepage...');
          
          // Clear form
          setFormData({
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
          });
          
          // Redirect ke homepage setelah 1.5 detik
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } else {
          // Jika auto-login gagal, redirect ke login page
          setSuccess('🎉 Registrasi berhasil! Silakan login dengan akun Anda.');
          
          // Clear form
          setFormData({
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
          });
          
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      } else {
        if (result.errors && result.errors.length > 0) {
          setError(result.errors[0]);
        } else {
          setError(result.message || 'Registrasi gagal');
        }
      }
    } catch (error) {
      const errorMessage = errorHandler.handleApiError(error);
      setError(errorMessage);
    } finally {
      setLoading(false);
      setLoadingMessage('Memproses...');
    }
  };

  return (
    <div>
        <div className="form-container">
            <form onSubmit={handleSubmit}>
            <div className="form-title">
                <img src="/logo/logo.png" alt="logo" />
                <h1>Selamat Datang</h1>
                <p>Masukkan informasi yang diperlukan di bawah ini untuk membuat akun baru. Pastikan data yang Anda masukkan sudah benar.</p>
            </div>

            {error && (
              <div className="error-message" style={{
                color: 'red',
                backgroundColor: '#ffebee',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '15px',
                border: '1px solid #ffcdd2'
              }}>
                {error}
              </div>
            )}

            {success && (
              <div className="success-message" style={{
                color: 'green',
                backgroundColor: '#e8f5e8',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '15px',
                border: '1px solid #c8e6c9'
              }}>
                {success}
              </div>
            )}

            <div className="input-group">
                <label htmlFor="username">Username</label>
                <input 
                  type="text" 
                  id="username" 
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Masukkan username Anda" 
                  required
                />
                
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Masukkan email Anda" 
                  required
                />
                
                <label htmlFor="password">Password</label> 
                <input 
                  type="password" 
                  id="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Masukkan password Anda (min. 6 karakter)" 
                  required
                />

                <label htmlFor="confirmPassword">Konfirmasi Password</label> 
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Konfirmasi password Anda" 
                  required
                />
            </div>
            
            <div className="actions">
                <button 
                  type="submit" 
                  className="btn-login" 
                  disabled={loading}
                >
                  {loading ? loadingMessage : 'Daftar'}
                </button>
                <Link to="/login" className='daftar'>Sudah punya akun? Masuk disini</Link>
            </div>
            </form>
        </div>
    </div>
  )
}

export default RegisterForm