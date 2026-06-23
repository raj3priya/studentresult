const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get all results for a course
router.get('/course/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;

    const result = await pool.query(
      `SELECT 
        s.student_id, s.first_name, s.last_name, s.roll_number,
        r.result_id, r.marks_obtained, r.grade, 
        e.exam_name, e.exam_date, e.semester, e.academic_year
      FROM results r
      JOIN students s ON r.student_id = s.student_id
      JOIN exams e ON r.exam_id = e.exam_id
      WHERE r.course_id = $1
      ORDER BY e.semester DESC, s.first_name, s.last_name`,
      [courseId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// Get results by exam
router.get('/exam/:examId', async (req, res) => {
  try {
    const { examId } = req.params;

    const result = await pool.query(
      `SELECT 
        s.first_name, s.last_name, s.roll_number,
        c.course_code, c.course_name,
        r.marks_obtained, r.grade, e.exam_name, e.academic_year
      FROM results r
      JOIN students s ON r.student_id = s.student_id
      JOIN courses c ON r.course_id = c.course_id
      JOIN exams e ON r.exam_id = e.exam_id
      WHERE r.exam_id = $1
      ORDER BY s.first_name, s.last_name, c.course_code`,
      [examId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// Get results by semester
router.get('/semester/:semester', async (req, res) => {
  try {
    const { semester } = req.params;

    const result = await pool.query(
      `SELECT 
        s.first_name, s.last_name, s.roll_number,
        c.course_code, c.course_name,
        r.marks_obtained, r.grade, e.exam_name, e.academic_year
      FROM results r
      JOIN students s ON r.student_id = s.student_id
      JOIN courses c ON r.course_id = c.course_id
      JOIN exams e ON r.exam_id = e.exam_id
      WHERE c.semester = $1
      ORDER BY e.academic_year DESC, s.first_name, s.last_name, c.course_code`,
      [semester]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// Add result for a student
router.post('/', async (req, res) => {
  try {
    const { student_id, course_id, exam_id, marks_obtained, grade } = req.body;

    if (!student_id || !course_id || !exam_id || marks_obtained === undefined) {
      return res.status(400).json({ error: 'student_id, course_id, exam_id, and marks_obtained are required' });
    }

    // Calculate grade if not provided
    let gradeToSave = grade;
    if (!gradeToSave) {
      if (marks_obtained >= 90) gradeToSave = 'A';
      else if (marks_obtained >= 80) gradeToSave = 'B';
      else if (marks_obtained >= 70) gradeToSave = 'C';
      else if (marks_obtained >= 60) gradeToSave = 'D';
      else gradeToSave = 'F';
    }

    const result = await pool.query(
      `INSERT INTO results (student_id, course_id, exam_id, marks_obtained, grade)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [student_id, course_id, exam_id, marks_obtained, gradeToSave]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Result already exists for this student, course, and exam' });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to add result' });
  }
});

// Update result
router.put('/:resultId', async (req, res) => {
  try {
    const { resultId } = req.params;
    const { marks_obtained, grade } = req.body;

    let gradeToSave = grade;
    if (!gradeToSave) {
      if (marks_obtained >= 90) gradeToSave = 'A';
      else if (marks_obtained >= 80) gradeToSave = 'B';
      else if (marks_obtained >= 70) gradeToSave = 'C';
      else if (marks_obtained >= 60) gradeToSave = 'D';
      else gradeToSave = 'F';
    }

    const result = await pool.query(
      `UPDATE results SET marks_obtained = $1, grade = $2
       WHERE result_id = $3 RETURNING *`,
      [marks_obtained, gradeToSave, resultId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Result not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update result' });
  }
});

// Delete result
router.delete('/:resultId', async (req, res) => {
  try {
    const { resultId } = req.params;

    const result = await pool.query(
      'DELETE FROM results WHERE result_id = $1 RETURNING *',
      [resultId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Result not found' });
    }

    res.json({ message: 'Result deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete result' });
  }
});

module.exports = router;
