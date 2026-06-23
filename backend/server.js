require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database initialization
const initializeDatabase = async () => {
  try {
    await pool.query(`
      -- Students table
      CREATE TABLE IF NOT EXISTS students (
          student_id SERIAL PRIMARY KEY,
          roll_number VARCHAR(20) UNIQUE NOT NULL,
          first_name VARCHAR(50) NOT NULL,
          last_name VARCHAR(50),
          dob DATE NOT NULL,
          email VARCHAR(100) UNIQUE,
          phone VARCHAR(15),
          department VARCHAR(50),
          admission_year INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Courses table
      CREATE TABLE IF NOT EXISTS courses (
          course_id SERIAL PRIMARY KEY,
          course_code VARCHAR(20) UNIQUE NOT NULL,
          course_name VARCHAR(100) NOT NULL,
          department VARCHAR(50),
          credits INT NOT NULL,
          semester INT NOT NULL
      );

      -- Exams table
      CREATE TABLE IF NOT EXISTS exams (
          exam_id SERIAL PRIMARY KEY,
          exam_name VARCHAR(100) NOT NULL,
          exam_date DATE NOT NULL,
          semester INT NOT NULL,
          academic_year VARCHAR(20) NOT NULL
      );

      -- Results table
      CREATE TABLE IF NOT EXISTS results (
          result_id SERIAL PRIMARY KEY,
          student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
          course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
          exam_id INT REFERENCES exams(exam_id) ON DELETE CASCADE,
          marks_obtained NUMERIC(5,2) NOT NULL,
          grade VARCHAR(2) NOT NULL,
          published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(student_id, course_id, exam_id)
      );

      -- Admins table (for publishing authority)
      CREATE TABLE IF NOT EXISTS admins (
          admin_id SERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role VARCHAR(20) CHECK (role IN ('exam_controller','faculty','super_admin')),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Audit log (optional, for tracking result publishing)
      CREATE TABLE IF NOT EXISTS audit_log (
          log_id SERIAL PRIMARY KEY,
          admin_id INT REFERENCES admins(admin_id) ON DELETE SET NULL,
          action VARCHAR(100) NOT NULL,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          details TEXT
      );

      -- Create indexes for performance
      CREATE INDEX IF NOT EXISTS idx_student_roll ON students(roll_number);
      CREATE INDEX IF NOT EXISTS idx_results_student ON results(student_id);
      CREATE INDEX IF NOT EXISTS idx_results_course ON results(course_id);
      CREATE INDEX IF NOT EXISTS idx_results_exam ON results(exam_id);
      CREATE INDEX IF NOT EXISTS idx_audit_admin ON audit_log(admin_id);
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Initialize database on startup
initializeDatabase();

// Routes
app.use('/api/students', require('./routes/students'));
app.use('/api/faculty', require('./routes/faculty'));
app.use('/api/results', require('./routes/results'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});


app.get('/students', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));