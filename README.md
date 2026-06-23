# Student Result Dashboard

A full-stack web application for publishing and managing student results. Built with Node.js/Express backend, React frontend, and PostgreSQL database.

## Features

### Student Portal
- Search results by register number
- View marks, grades, and GPA
- See course information and academic history
- Responsive and user-friendly interface

### Faculty Portal
- Secure login/registration system
- View all students
- Add new students
- Add and manage student results
- Track student performance

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - API client
- **CSS3** - Styling

## Project Structure

```
Result dashboard app/
├── backend/
│   ├── routes/
│   │   ├── students.js      # Student routes
│   │   ├── faculty.js       # Faculty auth & routes
│   │   └── results.js       # Results routes
│   ├── middleware/
│   │   └── authMiddleware.js # JWT authentication
│   ├── db.js                # Database configuration
│   ├── server.js            # Express server
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── StudentPortal.js
    │   │   ├── FacultyAuth.js
    │   │   └── FacultyDashboard.js
    │   ├── api.js            # API calls
    │   ├── App.js            # Main app component
    │   └── index.js
    ├── public/
    │   └── index.html
    └── package.json
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=student_results_db
JWT_SECRET=your_secret_key_here
NODE_ENV=development
PORT=5000
REACT_APP_API_URL=http://localhost:5000
```

5. Create PostgreSQL database:
```bash
createdb student_results_db
```

6. Start the backend server:
```bash
npm run dev
```

The server will start at `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## API Documentation

### Student Endpoints

- `GET /api/students/by-register/:registerNumber` - Get student results by register number
- `GET /api/students/all` - Get all students
- `GET /api/students/:id` - Get specific student details
- `POST /api/students` - Add new student (Faculty only)
- `PUT /api/students/:id` - Update student information
- `DELETE /api/students/:id` - Delete student

### Faculty Endpoints

- `POST /api/faculty/register` - Register new faculty member
- `POST /api/faculty/login` - Faculty login (returns JWT token)
- `GET /api/faculty` - Get all faculty members
- `GET /api/faculty/profile` - Get logged-in faculty profile (Protected)
- `GET /api/faculty/:id/courses` - Get faculty courses
- `POST /api/faculty/courses` - Add new course (Protected)

### Results Endpoints

- `GET /api/results/course/:courseId` - Get results by course
- `GET /api/results/semester/:semester` - Get results by semester
- `POST /api/results` - Add new result
- `PUT /api/results/:id` - Update result
- `DELETE /api/results/:id` - Delete result

## Database Schema

### Students Table
```sql
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  register_number VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  faculty_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Faculty Table
```sql
CREATE TABLE faculty (
  id SERIAL PRIMARY KEY,
  faculty_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  password_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Courses Table
```sql
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  course_code VARCHAR(50) UNIQUE NOT NULL,
  course_name VARCHAR(100) NOT NULL,
  credits INTEGER,
  faculty_id INTEGER REFERENCES faculty(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Results Table
```sql
CREATE TABLE results (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES courses(id),
  marks_obtained DECIMAL(5, 2),
  total_marks DECIMAL(5, 2),
  grade VARCHAR(5),
  semester INTEGER,
  academic_year VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, course_id, semester, academic_year)
);
```

## Usage

### For Students

1. Open the application
2. Click "Student Portal"
3. Enter your register number
4. View your results, marks, and GPA

### For Faculty

1. Click "Faculty Login"
2. Register (if new) or Login with credentials
3. In the dashboard:
   - View all students
   - Add new students
   - Add results for students
   - Manage student information

## Features in Detail

### Grade Calculation
- A: 90-100%
- B: 80-89%
- C: 70-79%
- D: 60-69%
- F: Below 60%

### GPA Calculation
- Based on grade points and course credits
- Grade Points: A=4, B=3, C=2, D=1, F=0

### Security
- JWT-based authentication for faculty
- Password hashing with bcryptjs
- Protected API endpoints
- Input validation on backend

## Deployment

### Backend Deployment

1. Set `NODE_ENV=production` in `.env`
2. Build for production
3. Deploy to services like Heroku, AWS, etc.

### Frontend Deployment

1. Build production version:
```bash
npm run build
```

2. Deploy the `build` folder to services like Vercel, Netlify, AWS S3, etc.

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check DB credentials in `.env`
- Verify database name exists

### CORS Error
- Ensure backend CORS is properly configured
- Check API URL in frontend `.env`

### Port Already in Use
- Change PORT in `.env` or `.env` file
- Or kill the process using the port

## Future Enhancements

- Email notifications for result updates
- Student attendance tracking
- Assignment and exam scheduling
- PDF report generation
- Mobile app
- Student performance analytics
- Batch upload of results

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License
