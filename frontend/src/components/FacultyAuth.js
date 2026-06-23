import React, { useState } from 'react';
import { facultyAPI } from '../api';
import './FacultyAuth.css';

const FacultyAuth = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'faculty'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const response = await facultyAPI.login({
          username: formData.username,
          password: formData.password
        });
        if (response.error) {
          setError(response.error);
        } else {
          localStorage.setItem('token', response.token);
          localStorage.setItem('admin', JSON.stringify(response.admin));
          onLoginSuccess(response.admin);
        }
      } else {
        const response = await facultyAPI.register(formData);
        if (response.error) {
          setError(response.error);
        } else {
          setError('');
          setIsLogin(true);
          setFormData({
            username: '',
            password: '',
            role: 'faculty'
          });
          alert('Registration successful! Please login.');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="faculty-auth">
      <div className="auth-container">
        <h2>{isLogin ? 'Admin Login' : 'Admin Registration'}</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="role">Role:</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="faculty">Faculty</option>
                <option value="exam_controller">Exam Controller</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <p className="toggle-auth">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setFormData({
                username: '',
                password: '',
                role: 'faculty'
              });
            }}
          >
            {isLogin ? 'Register here' : 'Login here'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default FacultyAuth;
