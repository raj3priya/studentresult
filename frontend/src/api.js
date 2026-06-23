//const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_URL = "https://student-result-dashboard-diqn.onrender.com";


export const studentAPI = {
  getResultsByRoll: (rollNumber) =>
    fetch(`${API_URL}/students/by-roll/${rollNumber}`).then(r => r.json()),
  getAllStudents: () =>
    fetch(`${API_URL}/students/all`).then(r => r.json()),
  getStudentById: (studentId) =>
    fetch(`${API_URL}/students/${studentId}`).then(r => r.json()),
  addStudent: (data) =>
    fetch(`${API_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
  updateStudent: (studentId, data) =>
    fetch(`${API_URL}/students/${studentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
  deleteStudent: (studentId) =>
    fetch(`${API_URL}/students/${studentId}`, { method: 'DELETE' }).then(r => r.json())
};

export const resultsAPI = {
  addResult: (data) =>
    fetch(`${API_URL}/results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
  getResultsByCourse: (courseId) =>
    fetch(`${API_URL}/results/course/${courseId}`).then(r => r.json()),
  getResultsByExam: (examId) =>
    fetch(`${API_URL}/results/exam/${examId}`).then(r => r.json()),
  getResultsBySemester: (semester) =>
    fetch(`${API_URL}/results/semester/${semester}`).then(r => r.json()),
  updateResult: (resultId, data) =>
    fetch(`${API_URL}/results/${resultId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
  deleteResult: (resultId) =>
    fetch(`${API_URL}/results/${resultId}`, { method: 'DELETE' }).then(r => r.json())
};

export const adminAPI = {
  register: (data) =>
    fetch(`${API_URL}/faculty/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
  login: (data) =>
    fetch(`${API_URL}/faculty/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
  getProfile: (token) =>
    fetch(`${API_URL}/faculty/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json()),
  getAllAdmins: () =>
    fetch(`${API_URL}/faculty`).then(r => r.json()),
  getCourses: () =>
    fetch(`${API_URL}/faculty/courses`).then(r => r.json()),
  addCourse: (data, token) =>
    fetch(`${API_URL}/faculty/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    }).then(r => r.json()),
  getExams: () =>
    fetch(`${API_URL}/faculty/exams`).then(r => r.json()),
  addExam: (data, token) =>
    fetch(`${API_URL}/faculty/exams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    }).then(r => r.json()),
  logAudit: (data, token) =>
    fetch(`${API_URL}/faculty/audit-log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    }).then(r => r.json())
};

// Keep facultyAPI as alias for backward compatibility
export const facultyAPI = adminAPI;
