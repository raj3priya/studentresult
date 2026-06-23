import React, { useState, useEffect } from 'react';
import { studentAPI, resultsAPI, adminAPI } from '../api';
import './FacultyDashboard.css';

const FacultyDashboard = ({ faculty, onLogout }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showResultForm, setShowResultForm] = useState(false);
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [newStudent, setNewStudent] = useState({
    roll_number: '',
    first_name: '',
    last_name: '',
    dob: '',
    email: '',
    phone: '',
    department: '',
    admission_year: new Date().getFullYear()
  });
  const [newResult, setNewResult] = useState({
    student_id: '',
    course_id: '',
    exam_id: '',
    marks_obtained: '',
    grade: ''
  });

  useEffect(() => {
    fetchStudents();
    fetchExams();
    fetchCourses();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await studentAPI.getAllStudents();
      setStudents(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setLoading(false);
    }
  };

  const fetchExams = async () => {
    try {
      const data = await adminAPI.getExams();
      setExams(data);
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const data = await adminAPI.getCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleSelectStudent = async (student) => {
    setSelectedStudent(student);
    try {
      const details = await studentAPI.getStudentById(student.student_id);
      if (details.error) {
        console.error('Error fetching student details:', details.error);
        alert('Error: ' + details.error);
        setStudentDetails(null);
      } else {
        setStudentDetails(details);
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
      alert('Error fetching student details');
      setStudentDetails(null);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const result = await studentAPI.addStudent(newStudent);
      if (result.error) {
        alert('Error: ' + result.error);
      } else {
        setNewStudent({
          roll_number: '',
          first_name: '',
          last_name: '',
          dob: '',
          email: '',
          phone: '',
          department: '',
          admission_year: new Date().getFullYear()
        });
        setShowAddForm(false);
        fetchStudents();
        alert('Student added successfully');
      }
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Error adding student');
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentAPI.deleteStudent(studentId);
        fetchStudents();
        setSelectedStudent(null);
        setStudentDetails(null);
        alert('Student deleted successfully');
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Error deleting student');
      }
    }
  };

  const handleAddResult = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const result = await resultsAPI.addResult({
        ...newResult,
        student_id: parseInt(newResult.student_id),
        course_id: parseInt(newResult.course_id),
        exam_id: parseInt(newResult.exam_id),
        marks_obtained: parseFloat(newResult.marks_obtained)
      });
      if (result.error) {
        alert('Error: ' + result.error);
      } else {
        setNewResult({
          student_id: '',
          course_id: '',
          exam_id: '',
          marks_obtained: '',
          grade: ''
        });
        setShowResultForm(false);
        if (selectedStudent) {
          handleSelectStudent(selectedStudent);
        }
        alert('Result added successfully');
      }
    } catch (error) {
      console.error('Error adding result:', error);
      alert('Error adding result');
    }
  };

  return (
    <div className="faculty-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {faculty.username} ({faculty.role})</span>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        <div className="students-list">
          <div className="list-header">
            <h2>Students</h2>
            <button 
              onClick={() => setShowAddForm(!showAddForm)} 
              className="btn-add"
            >
              {showAddForm ? 'Cancel' : '+ Add Student'}
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddStudent} className="add-form">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Roll Number"
                  value={newStudent.roll_number}
                  onChange={(e) => setNewStudent({...newStudent, roll_number: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="First Name"
                  value={newStudent.first_name}
                  onChange={(e) => setNewStudent({...newStudent, first_name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Last Name"
                  value={newStudent.last_name}
                  onChange={(e) => setNewStudent({...newStudent, last_name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <input
                  type="date"
                  placeholder="Date of Birth"
                  value={newStudent.dob}
                  onChange={(e) => setNewStudent({...newStudent, dob: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                />
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  placeholder="Phone"
                  value={newStudent.phone}
                  onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Department"
                  value={newStudent.department}
                  onChange={(e) => setNewStudent({...newStudent, department: e.target.value})}
                />
              </div>
              <div className="form-group">
                <input
                  type="number"
                  placeholder="Admission Year"
                  value={newStudent.admission_year}
                  onChange={(e) => setNewStudent({...newStudent, admission_year: parseInt(e.target.value)})}
                  required
                />
              </div>
              <button type="submit" className="btn-submit">Add Student</button>
            </form>
          )}

          <div className="student-items">
            {loading ? (
              <p>Loading students...</p>
            ) : students.length === 0 ? (
              <p>No students found</p>
            ) : (
              students.map(student => (
                <div
                  key={student.student_id}
                  className={`student-item ${selectedStudent?.student_id === student.student_id ? 'active' : ''}`}
                  onClick={() => handleSelectStudent(student)}
                >
                  <div className="student-item-header">
                    <strong>{student.first_name} {student.last_name}</strong>
                  </div>
                  <div className="student-item-details">
                    <small>{student.roll_number}</small>
                    <small>{student.result_count} results</small>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="student-details">
          {studentDetails ? (
            <>
              <div className="details-header">
                <h2>{studentDetails.first_name} {studentDetails.last_name}</h2>
                <button
                  onClick={() => handleDeleteStudent(studentDetails.student_id)}
                  className="btn-delete"
                >
                  Delete Student
                </button>
              </div>

              <div className="student-info-box">
                <p><strong>Roll Number:</strong> {studentDetails.roll_number}</p>
                <p><strong>Email:</strong> {studentDetails.email || 'N/A'}</p>
                <p><strong>Phone:</strong> {studentDetails.phone || 'N/A'}</p>
                <p><strong>Department:</strong> {studentDetails.department || 'N/A'}</p>
                <p><strong>Admission Year:</strong> {studentDetails.admission_year || 'N/A'}</p>
              </div>

              <div className="results-section">
                <div className="results-header">
                  <h3>Results</h3>
                  <button
                    onClick={() => setShowResultForm(!showResultForm)}
                    className="btn-add-result"
                  >
                    {showResultForm ? 'Cancel' : '+ Add Result'}
                  </button>
                </div>

                {showResultForm && (
                  <form onSubmit={handleAddResult} className="result-form">
                    <div className="form-group">
                      <select
                        value={newResult.course_id}
                        onChange={(e) => setNewResult({...newResult, course_id: e.target.value})}
                        required
                      >
                        <option value="">Select Course</option>
                        {courses.map(course => (
                          <option key={course.course_id} value={course.course_id}>
                            {course.course_code} - {course.course_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <select
                        value={newResult.exam_id}
                        onChange={(e) => setNewResult({...newResult, exam_id: e.target.value})}
                        required
                      >
                        <option value="">Select Exam</option>
                        {exams.map(exam => (
                          <option key={exam.exam_id} value={exam.exam_id}>
                            {exam.exam_name} ({exam.academic_year})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <input
                        type="number"
                        placeholder="Marks Obtained"
                        step="0.01"
                        value={newResult.marks_obtained}
                        onChange={(e) => setNewResult({...newResult, marks_obtained: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Grade (A, B, C, D, F)"
                        value={newResult.grade}
                        onChange={(e) => setNewResult({...newResult, grade: e.target.value})}
                      />
                    </div>
                    <button type="submit" className="btn-submit">Add Result</button>
                  </form>
                )}

                {studentDetails.results && studentDetails.results.length > 0 ? (
                  <table className="results-table">
                    <thead>
                      <tr>
                        <th>Course</th>
                        <th>Credits</th>
                        <th>Marks</th>
                        <th>Grade</th>
                        <th>Exam</th>
                        <th>Year</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentDetails.results.map((result, idx) => (
                        <tr key={idx}>
                          <td>{result.course_code}</td>
                          <td>{result.credits}</td>
                          <td>{result.marks_obtained}</td>
                          <td className={`grade grade-${result.grade}`}>{result.grade}</td>
                          <td>{result.exam_name}</td>
                          <td>{result.academic_year}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-results">No results added yet</p>
                )}
              </div>
            </>
          ) : (
            <div className="no-selection">
              <p>Select a student to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
