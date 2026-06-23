# Setup Guide

## Quick Start

### Prerequisites
- Node.js v14+
- PostgreSQL v12+
- npm or yarn

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your database credentials:
```
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=student_results_db
JWT_SECRET=your_random_secret_key
```

Create database:
```bash
createdb student_results_db
```

Start backend:
```bash
npm run dev
```

Server runs on http://localhost:5000

## Frontend Setup

```bash
cd frontend
npm install
npm start
```

App opens at http://localhost:3000

## Database Tables

The database will be automatically created on first server startup with:
- Students table
- Faculty table  
- Courses table
- Results table

## Test Credentials

For testing, you can:

1. **Add a Student** via Faculty Dashboard:
   - Register Number: TEST001
   - Name: Test Student
   - Email: test@example.com

2. **Register Faculty**:
   - Faculty ID: FAC001
   - Name: Faculty Name
   - Email: faculty@example.com
   - Password: password123

3. **Add Results** via Faculty Dashboard:
   - Student ID: 1
   - Course ID: 1
   - Marks: 85
   - Total: 100
   - Grade: B
   - Semester: 1
   - Year: 2023-24

4. **View Results** in Student Portal:
   - Enter the register number
   - Click Search

## API Base URL

All API calls use: `http://localhost:5000/api`

## Environment Variables

### Backend (.env)
```
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=student_results_db
JWT_SECRET=your_secret_key
NODE_ENV=development
PORT=5000
```

### Frontend (.env, optional)
```
REACT_APP_API_URL=http://localhost:5000
```

## Common Issues

### Port 5000 already in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### PostgreSQL connection error
- Ensure PostgreSQL service is running
- Check credentials in .env
- Verify database was created

### CORS errors
- Backend CORS is pre-configured
- Check frontend API_URL matches backend PORT

## Stopping Services

To stop:
- Backend: Press `Ctrl+C` in terminal
- Frontend: Press `Ctrl+C` in terminal
- PostgreSQL: Use your OS's service manager

## Development

Both servers support hot reload:
- Backend: Uses nodemon (auto-restart on file changes)
- Frontend: Uses React hot reload
