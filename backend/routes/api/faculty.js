const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../../db');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

// Admin registration
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ error: 'username, password, and role are required' });
    }

    if (!['exam_controller', 'faculty', 'super_admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be exam_controller, faculty, or super_admin' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO admins (username, password_hash, role) VALUES ($1, $2, $3) RETURNING admin_id, username, role, created_at',
      [username, hashedPassword, role]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Username already exists' });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to register admin' });
  }
});

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const result = await pool.query(
      'SELECT * FROM admins WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const admin = result.rows[0];
    const validPassword = await bcrypt.compare(password, admin.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { admin_id: admin.admin_id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      admin: {
        admin_id: admin.admin_id,
        username: admin.username,
        role: admin.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get all admins
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT admin_id, username, role, created_at FROM admins ORDER BY username'
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
});

// Get admin profile (protected)
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT admin_id, username, role, created_at FROM admins WHERE admin_id = $1',
      [req.admin.admin_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Get all courses
router.get('/courses', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM courses ORDER BY course_code'
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Add new course
router.post('/courses', authMiddleware, async (req, res) => {
  try {
    const { course_code, course_name, department, credits, semester } = req.body;

    if (!course_code || !course_name || !credits || !semester) {
      return res.status(400).json({ error: 'course_code, course_name, credits, and semester are required' });
    }

    const result = await pool.query(
      'INSERT INTO courses (course_code, course_name, department, credits, semester) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [course_code, course_name, department, credits, semester]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Course code already exists' });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// Get exams
router.get('/exams', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM exams ORDER BY exam_date DESC'
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch exams' });
  }
});

// Add new exam
router.post('/exams', authMiddleware, async (req, res) => {
  try {
    const { exam_name, exam_date, semester, academic_year } = req.body;

    if (!exam_name || !exam_date || !semester || !academic_year) {
      return res.status(400).json({ error: 'exam_name, exam_date, semester, and academic_year are required' });
    }

    const result = await pool.query(
      'INSERT INTO exams (exam_name, exam_date, semester, academic_year) VALUES ($1, $2, $3, $4) RETURNING *',
      [exam_name, exam_date, semester, academic_year]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create exam' });
  }
});

// Log audit action
router.post('/audit-log', authMiddleware, async (req, res) => {
  try {
    const { action, details } = req.body;

    if (!action) {
      return res.status(400).json({ error: 'action is required' });
    }

    const result = await pool.query(
      'INSERT INTO audit_log (admin_id, action, details) VALUES ($1, $2, $3) RETURNING *',
      [req.admin.admin_id, action, details]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to log action' });
  }
});

module.exports = router;
