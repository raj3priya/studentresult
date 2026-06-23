import React, { useState } from 'react';
import { studentAPI } from '../api';
import './StudentPortal.css';

const StudentPortal = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setStudent(null);

    try {
      const data = await studentAPI.getResultsByRoll(rollNumber);
      setStudent(data);
    } catch (err) {
      setError('Student not found or error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateGPA = () => {
    if (!student || !student.results || student.results.length === 0) return 0;
    const totalPoints = student.results.reduce((sum, r) => {
      const gradePoints = {
        'A': 4, 'B': 3, 'C': 2, 'D': 1, 'F': 0
      };
      return sum + (gradePoints[r.grade] || 0) * r.credits;
    }, 0);
    const totalCredits = student.results.reduce((sum, r) => sum + (r.credits || 0), 0);
    return (totalPoints / totalCredits).toFixed(2);
  };

  return (
    <div className="student-portal">
      <h1>Student Results Portal</h1>
      
      <form onSubmit={handleSearch} className="search-form">
        <div className="form-group">
          <label htmlFor="rollNumber">Enter Roll Number:</label>
          <input
            type="text"
            id="rollNumber"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
            placeholder="e.g., BEE001"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {student && (
        <div className="student-results">
          <div className="student-info">
            <h2>{student.first_name} {student.last_name}</h2>
            <p><strong>Roll Number:</strong> {student.roll_number}</p>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Department:</strong> {student.department}</p>
            <p><strong>GPA:</strong> {calculateGPA()}</p>
          </div>

          {student.results && student.results.length > 0 ? (
            <div className="results-section">
              <h3>Academic Results</h3>
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Course Code</th>
                    <th>Course Name</th>
                    <th>Credits</th>
                    <th>Marks Obtained</th>
                    <th>Grade</th>
                    <th>Exam Name</th>
                    <th>Academic Year</th>
                  </tr>
                </thead>
                <tbody>
                  {student.results.map((result, idx) => (
                    <tr key={idx}>
                      <td>{result.course_code}</td>
                      <td>{result.course_name}</td>
                      <td>{result.credits}</td>
                      <td>{result.marks_obtained}</td>
                      <td className={`grade grade-${result.grade}`}>{result.grade}</td>
                      <td>{result.exam_name}</td>
                      <td>{result.academic_year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-results">No results found for this student</p>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentPortal;
