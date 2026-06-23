# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

Faculty endpoints use Bearer token authentication:

```
Authorization: Bearer <JWT_TOKEN>
```

## Student Endpoints

### Get Student Results by Register Number

```
GET /students/by-register/:registerNumber
```

**Parameters:**
- `registerNumber` (string, path) - Student's register number

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "register_number": "BEE001",
  "email": "john@example.com",
  "results": [
    {
      "course_code": "CS101",
      "course_name": "Data Structures",
      "credits": 3,
      "marks_obtained": 85,
      "total_marks": 100,
      "grade": "B",
      "semester": 1,
      "academic_year": "2023-24"
    }
  ]
}
```

### Get All Students

```
GET /students/all
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "register_number": "BEE001",
    "email": "john@example.com",
    "phone": "9999999999",
    "result_count": 5
  }
]
```

### Get Student Details by ID

```
GET /students/:id
```

**Parameters:**
- `id` (integer, path) - Student ID

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "register_number": "BEE001",
  "email": "john@example.com",
  "phone": "9999999999",
  "results": [...]
}
```

### Add Student

```
POST /students
```

**Request Body:**
```json
{
  "register_number": "BEE002",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "8888888888"
}
```

**Response:** (201 Created)
```json
{
  "id": 2,
  "register_number": "BEE002",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "8888888888",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Update Student

```
PUT /students/:id
```

**Parameters:**
- `id` (integer, path) - Student ID

**Request Body:**
```json
{
  "name": "Jane Updated",
  "email": "jane.updated@example.com",
  "phone": "7777777777"
}
```

**Response:**
```json
{
  "id": 2,
  "register_number": "BEE002",
  "name": "Jane Updated",
  "email": "jane.updated@example.com",
  "phone": "7777777777",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Delete Student

```
DELETE /students/:id
```

**Parameters:**
- `id` (integer, path) - Student ID

**Response:**
```json
{
  "message": "Student deleted successfully"
}
```

## Faculty Endpoints

### Register Faculty

```
POST /faculty/register
```

**Request Body:**
```json
{
  "faculty_id": "FAC001",
  "name": "Prof. Smith",
  "email": "smith@example.com",
  "password": "securepassword123"
}
```

**Response:** (201 Created)
```json
{
  "id": 1,
  "faculty_id": "FAC001",
  "name": "Prof. Smith",
  "email": "smith@example.com"
}
```

### Faculty Login

```
POST /faculty/login
```

**Request Body:**
```json
{
  "faculty_id": "FAC001",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "faculty": {
    "id": 1,
    "faculty_id": "FAC001",
    "name": "Prof. Smith",
    "email": "smith@example.com"
  }
}
```

### Get Faculty Profile (Protected)

```
GET /faculty/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "faculty_id": "FAC001",
  "name": "Prof. Smith",
  "email": "smith@example.com",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Get All Faculty

```
GET /faculty
```

**Response:**
```json
[
  {
    "id": 1,
    "faculty_id": "FAC001",
    "name": "Prof. Smith",
    "email": "smith@example.com",
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

### Get Faculty Courses

```
GET /faculty/:id/courses
```

**Parameters:**
- `id` (integer, path) - Faculty ID

**Response:**
```json
[
  {
    "id": 1,
    "course_code": "CS101",
    "course_name": "Data Structures",
    "credits": 3,
    "faculty_id": 1,
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

### Add Course (Protected)

```
POST /faculty/courses
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "course_code": "CS201",
  "course_name": "Algorithms",
  "credits": 4
}
```

**Response:** (201 Created)
```json
{
  "id": 2,
  "course_code": "CS201",
  "course_name": "Algorithms",
  "credits": 4,
  "faculty_id": 1,
  "created_at": "2024-01-15T10:30:00Z"
}
```

## Results Endpoints

### Get Results by Course

```
GET /results/course/:courseId
```

**Parameters:**
- `courseId` (integer, path) - Course ID

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "register_number": "BEE001",
    "marks_obtained": 85,
    "total_marks": 100,
    "grade": "B",
    "semester": 1,
    "academic_year": "2023-24"
  }
]
```

### Get Results by Semester

```
GET /results/semester/:semester
```

**Parameters:**
- `semester` (integer, path) - Semester number

**Response:**
```json
[
  {
    "name": "John Doe",
    "register_number": "BEE001",
    "course_code": "CS101",
    "course_name": "Data Structures",
    "marks_obtained": 85,
    "total_marks": 100,
    "grade": "B",
    "academic_year": "2023-24"
  }
]
```

### Add Result

```
POST /results
```

**Request Body:**
```json
{
  "student_id": 1,
  "course_id": 1,
  "marks_obtained": 85,
  "total_marks": 100,
  "grade": "B",
  "semester": 1,
  "academic_year": "2023-24"
}
```

**Response:** (201 Created)
```json
{
  "id": 1,
  "student_id": 1,
  "course_id": 1,
  "marks_obtained": 85,
  "total_marks": 100,
  "grade": "B",
  "semester": 1,
  "academic_year": "2023-24",
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Note:** If grade is not provided, it will be auto-calculated based on percentage.

### Update Result

```
PUT /results/:id
```

**Parameters:**
- `id` (integer, path) - Result ID

**Request Body:**
```json
{
  "marks_obtained": 90,
  "total_marks": 100,
  "grade": "A"
}
```

**Response:**
```json
{
  "id": 1,
  "student_id": 1,
  "course_id": 1,
  "marks_obtained": 90,
  "total_marks": 100,
  "grade": "A",
  "semester": 1,
  "academic_year": "2023-24",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Delete Result

```
DELETE /results/:id
```

**Parameters:**
- `id` (integer, path) - Result ID

**Response:**
```json
{
  "message": "Result deleted successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid token"
}
```

### 404 Not Found
```json
{
  "error": "Student not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

Not implemented in current version. Recommended for production.

## Testing

Use tools like:
- Postman
- Thunder Client
- cURL
- API documentation tools

Example cURL request:
```bash
curl -X GET http://localhost:5000/api/students/all
curl -X POST http://localhost:5000/api/faculty/login \
  -H "Content-Type: application/json" \
  -d '{"faculty_id":"FAC001","password":"password123"}'
```
