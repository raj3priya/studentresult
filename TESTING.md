# Testing & Sample Data

## Sample SQL Queries for Testing

Run these queries in PostgreSQL to populate test data:

```sql
-- Insert Sample Students
INSERT INTO students (register_number, name, email, phone) VALUES
('BEE001', 'Rajesh Kumar', 'rajesh@example.com', '9876543210'),
('BEE002', 'Priya Singh', 'priya@example.com', '9876543211'),
('BEE003', 'Amit Patel', 'amit@example.com', '9876543212'),
('CSE001', 'Neha Verma', 'neha@example.com', '9876543213'),
('CSE002', 'Vikram Sharma', 'vikram@example.com', '9876543214');

-- Insert Sample Faculty
INSERT INTO faculty (faculty_id, name, email, password_hash) VALUES
('FAC001', 'Dr. Smith', 'smith@college.com', '$2a$10$abcdefghijklmnopqrstuvwxyz'),
('FAC002', 'Prof. Johnson', 'johnson@college.com', '$2a$10$abcdefghijklmnopqrstuvwxyz');

-- Insert Sample Courses
INSERT INTO courses (course_code, course_name, credits, faculty_id) VALUES
('CS101', 'Data Structures', 3, 1),
('CS102', 'Database Management', 4, 1),
('CS103', 'Web Development', 3, 2),
('BEE201', 'Circuit Theory', 3, 1),
('BEE202', 'Electromagnetics', 4, 2);

-- Insert Sample Results
INSERT INTO results (student_id, course_id, marks_obtained, total_marks, grade, semester, academic_year) VALUES
(1, 1, 85, 100, 'B', 1, '2023-24'),
(1, 2, 92, 100, 'A', 1, '2023-24'),
(1, 4, 78, 100, 'C', 2, '2023-24'),
(2, 1, 88, 100, 'B', 1, '2023-24'),
(2, 3, 95, 100, 'A', 1, '2023-24'),
(3, 1, 72, 100, 'C', 1, '2023-24'),
(4, 3, 90, 100, 'A', 1, '2023-24'),
(4, 5, 86, 100, 'B', 2, '2023-24'),
(5, 2, 80, 100, 'B', 1, '2023-24');
```

## Using Test Data

### View Results
1. Go to Student Portal
2. Enter register number: `BEE001`
3. Click Search to view results

### Faculty Login
1. Go to Faculty Login
2. **Register a new faculty** (will create hash of password):
   - Faculty ID: `TEST_FAC_001`
   - Name: `Test Faculty`
   - Email: `test@college.com`
   - Password: `testpass123`
3. Login with same credentials

### Add New Student via Faculty
1. In Faculty Dashboard click "+ Add Student"
2. Fill in:
   - Register Number: `BEE004`
   - Name: `New Student`
   - Email: `new@example.com`
   - Phone: `9999999999`
3. Click "Add Student"

### Add Result via Faculty
1. Select a student from list
2. Click "+ Add Result"
3. Fill in:
   - Course ID: `1` (or any existing course ID)
   - Marks Obtained: `85`
   - Total Marks: `100`
   - Grade: `B` (leave empty for auto-calculation)
   - Semester: `1`
   - Academic Year: `2023-24`
4. Click "Add Result"

## API Testing with cURL

### Get All Students
```bash
curl http://localhost:5000/api/students/all
```

### Get Student Results
```bash
curl http://localhost:5000/api/students/by-register/BEE001
```

### Faculty Registration
```bash
curl -X POST http://localhost:5000/api/faculty/register \
  -H "Content-Type: application/json" \
  -d '{
    "faculty_id": "FAC003",
    "name": "New Faculty",
    "email": "newfaculty@example.com",
    "password": "password123"
  }'
```

### Faculty Login
```bash
curl -X POST http://localhost:5000/api/faculty/login \
  -H "Content-Type: application/json" \
  -d '{
    "faculty_id": "FAC001",
    "password": "password123"
  }'
```

### Add Result
```bash
curl -X POST http://localhost:5000/api/results \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": 1,
    "course_id": 1,
    "marks_obtained": 88,
    "total_marks": 100,
    "grade": "B",
    "semester": 1,
    "academic_year": "2023-24"
  }'
```

### Get Results by Course
```bash
curl http://localhost:5000/api/results/course/1
```

## Testing Scenarios

### Scenario 1: Student Checking Results
1. Start frontend and backend
2. Navigate to Student Portal
3. Search with `BEE001`
4. Verify results are displayed correctly
5. Check GPA calculation

### Scenario 2: Faculty Adding Student
1. Login as faculty
2. Click "Add Student"
3. Enter valid data
4. Verify student appears in list
5. Try to add duplicate register number (should fail)

### Scenario 3: Adding and Viewing Results
1. Select a student
2. Add a result
3. Verify result appears in table
4. Update marks
5. Verify update is reflected

### Scenario 4: Error Handling
1. Try to login with wrong password (should fail)
2. Try to add student with duplicate register number (should fail)
3. Try to access student API with invalid register number (should return 404)
4. Try protected endpoint without token (should return 401)

## Grade Calculation Testing

Test that grades are calculated correctly:

- 95/100 (95%) → Grade A
- 85/100 (85%) → Grade B
- 75/100 (75%) → Grade C
- 65/100 (65%) → Grade D
- 55/100 (55%) → Grade F

## Performance Testing

### Load Testing
Test with multiple concurrent requests:

```bash
# Using Apache Bench
ab -n 100 -c 10 http://localhost:5000/api/students/all

# Using wrk (if installed)
wrk -t4 -c100 -d30s http://localhost:5000/api/students/all
```

### Database Query Performance
Check slow queries:

```sql
-- Check execution time
EXPLAIN ANALYZE 
SELECT s.*, r.* FROM students s 
LEFT JOIN results r ON s.id = r.student_id 
WHERE s.register_number = 'BEE001';
```

## Debug Mode

Add console logging:

### Backend
```javascript
// In routes, add:
console.log('Incoming request:', req.method, req.path);
console.log('Request body:', req.body);
```

### Frontend
```javascript
// Add to api.js for logging all requests
console.log('API Request:', method, url);
console.log('Response:', data);
```

## Common Test Issues

### Issue: Register number not found
**Solution:** Check exact spelling and case in database

### Issue: Password login fails
**Solution:** Ensure password was hashed during registration

### Issue: CORS error
**Solution:** Backend CORS is configured for all origins in dev

### Issue: Database connection error
**Solution:** Verify .env file and PostgreSQL is running

## Automated Testing (Optional)

For Jest testing framework:

```bash
npm install --save-dev jest @testing-library/react
npm test
```

Create test files like:
- `StudentPortal.test.js`
- `api.test.js`
- `server.test.js`
