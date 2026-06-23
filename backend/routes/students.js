const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get student results by roll number
router.get('/by-roll/:rollNumber', async (req, res) => {
  try {
    const { rollNumber } = req.params;

    const result = await pool.query(
      `SELECT 
        s.student_id, s.first_name, s.last_name, s.roll_number, s.email, s.department,
        c.course_code, c.course_name, c.credits,
        e.exam_name, e.exam_date, e.academic_year,
        r.marks_obtained, r.grade, r.published_at
      FROM students s
      LEFT JOIN results r ON s.student_id = r.student_id
      LEFT JOIN courses c ON r.course_id = c.course_id
      LEFT JOIN exams e ON r.exam_id = e.exam_id
      WHERE s.roll_number = $1
      ORDER BY e.semester DESC, c.course_code`,
      [rollNumber]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const student = {
      student_id: result.rows[0].student_id,
      first_name: result.rows[0].first_name,
      last_name: result.rows[0].last_name,
      roll_number: result.rows[0].roll_number,
      email: result.rows[0].email,
      department: result.rows[0].department,
      results: result.rows.filter(r => r.course_code).map(r => ({
        course_code: r.course_code,
        course_name: r.course_name,
        credits: r.credits,
        marks_obtained: r.marks_obtained,
        grade: r.grade,
        exam_name: r.exam_name,
        exam_date: r.exam_date,
        academic_year: r.academic_year,
        published_at: r.published_at
      }))
    };

    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch student results' });
  }
});

// Get all students (admin view)
router.get('/all', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.student_id, s.first_name, s.last_name, s.roll_number, s.email, s.phone, s.department,
       COUNT(DISTINCT r.result_id) as result_count
      FROM students s
      LEFT JOIN results r ON s.student_id = r.student_id
      GROUP BY s.student_id, s.first_name, s.last_name, s.roll_number, s.email, s.phone, s.department
      ORDER BY s.first_name, s.last_name`
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Get student details with results
router.get('/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;

    const studentResult = await pool.query(
      'SELECT * FROM students WHERE student_id = $1',
      [studentId]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const resultsResult = await pool.query(
      `SELECT 
        c.course_code, c.course_name, c.credits,
        e.exam_name, e.exam_date, e.academic_year,
        r.marks_obtained, r.grade, r.published_at
      FROM results r
      JOIN courses c ON r.course_id = c.course_id
      JOIN exams e ON r.exam_id = e.exam_id
      WHERE r.student_id = $1
      ORDER BY e.semester DESC, c.course_code`,
      [studentId]
    );

    const student = {
      ...studentResult.rows[0],
      results: resultsResult.rows
    };

    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

// Add new student (admin)
router.post('/', async (req, res) => {
  try {
    const { roll_number, first_name, last_name, dob, email, phone, department, admission_year } = req.body;

    if (!roll_number || !first_name || !dob || !admission_year) {
      return res.status(400).json({ error: 'roll_number, first_name, dob, and admission_year are required' });
    }

    const result = await pool.query(
      `INSERT INTO students (roll_number, first_name, last_name, dob, email, phone, department, admission_year) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [roll_number, first_name, last_name, dob, email, phone, department, admission_year]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Roll number or email already exists' });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// Update student
router.put('/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { first_name, last_name, email, phone, department } = req.body;

    const result = await pool.query(
      `UPDATE students SET first_name = $1, last_name = $2, email = $3, phone = $4, department = $5 
       WHERE student_id = $6 RETURNING *`,
      [first_name, last_name, email, phone, department, studentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// Delete student
router.delete('/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;

    const result = await pool.query(
      'DELETE FROM students WHERE student_id = $1 RETURNING *',
      [studentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

module.exports = router;
