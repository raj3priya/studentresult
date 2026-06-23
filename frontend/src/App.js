import React, { useState, useEffect } from 'react';
import StudentPortal from './components/StudentPortal';
import FacultyAuth from './components/FacultyAuth';
import FacultyDashboard from './components/FacultyDashboard';
import './App.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      setFaculty(JSON.parse(storedAdmin));
      setCurrentPage('faculty-dashboard');
    }
    setLoading(false);
  }, []);

  const handleFacultyLogin = (adminData) => {
    setFaculty(adminData);
    setCurrentPage('faculty-dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setFaculty(null);
    setCurrentPage('home');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      {currentPage === 'home' && !faculty && (
        <div className="home-page">
          <header className="navbar">
            <div className="navbar-content">
              <h1 className="logo">Student Result Dashboard</h1>
              <nav className="nav-links">
                <button 
                  onClick={() => setCurrentPage('student')}
                  className="nav-btn"
                >
                  Student Portal
                </button>
                <button 
                  onClick={() => setCurrentPage('faculty-auth')}
                  className="nav-btn"
                >
                  Faculty Login
                </button>
              </nav>
            </div>
          </header>

          <div className="hero">
            <div className="hero-content">
              <h2>Welcome to Student Result Dashboard</h2>
              <p>Check your results or manage student information</p>
              <div className="cta-buttons">
                <button 
                  onClick={() => setCurrentPage('student')}
                  className="btn-primary"
                >
                  Student Portal
                </button>
                <button 
                  onClick={() => setCurrentPage('faculty-auth')}
                  className="btn-secondary"
                >
                  Faculty Login
                </button>
              </div>
            </div>
          </div>

          <div className="features">
            <div className="feature-card">
              <h3>Student Portal</h3>
              <p>Search your results by register number and view your marks, grades, and GPA</p>
            </div>
            <div className="feature-card">
              <h3>Faculty Dashboard</h3>
              <p>Manage students, add results, and track academic performance</p>
            </div>
            <div className="feature-card">
              <h3>Secure Access</h3>
              <p>Secure login system for faculty members with JWT authentication</p>
            </div>
          </div>
        </div>
      )}

      {currentPage === 'student' && (
        <div className="page-wrapper">
          <header className="navbar">
            <div className="navbar-content">
              <h1 className="logo">Student Result Dashboard</h1>
              <button 
                onClick={() => setCurrentPage('home')}
                className="back-btn"
              >
                Back to Home
              </button>
            </div>
          </header>
          <StudentPortal />
        </div>
      )}

      {currentPage === 'faculty-auth' && !faculty && (
        <div className="page-wrapper">
          <header className="navbar">
            <div className="navbar-content">
              <h1 className="logo">Student Result Dashboard</h1>
              <button 
                onClick={() => setCurrentPage('home')}
                className="back-btn"
              >
                Back to Home
              </button>
            </div>
          </header>
          <FacultyAuth onLoginSuccess={handleFacultyLogin} />
        </div>
      )}

      {currentPage === 'faculty-dashboard' && faculty && (
        <FacultyDashboard 
          faculty={faculty}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default App;
