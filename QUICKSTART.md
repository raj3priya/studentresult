# Quick Start Guide

Get the application running in under 5 minutes!

## Prerequisites Check

```bash
node --version  # Should be v14+
npm --version   # Should be v6+
psql --version  # Should be v12+
```

## Step 1: Database Setup (2 min)

```bash
# Create database
createdb student_results_db

# Verify
psql -U postgres -d student_results_db -c "SELECT 1"
```

## Step 2: Backend Setup (2 min)

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your PostgreSQL credentials
# DB_USER=postgres
# DB_PASSWORD=your_password
# etc.

# Start server
npm run dev
```

**Backend is ready when you see:** `Server running on port 5000`

## Step 3: Frontend Setup (1 min)

In a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start frontend
npm start
```

**Frontend opens automatically at http://localhost:3000**

## You're Ready!

### Option A: Student Portal
1. Click "Student Portal" on home page
2. Enter register number: `BEE001`
3. Search for results

### Option B: Faculty Portal
1. Click "Faculty Login"
2. Click "Register here"
3. Fill in faculty details
4. Login with your credentials
5. Add students and manage results

## Common First-Time Issues

### Port 3000 already in use
```bash
# Use different port
PORT=3001 npm start
```

### Port 5000 already in use
```bash
# Edit backend/.env
PORT=5001
```

### Database won't connect
```bash
# Check PostgreSQL is running
# Windows: Services → PostgreSQL
# macOS: brew services list
# Linux: sudo service postgresql status

# Reset database
dropdb student_results_db
createdb student_results_db
```

## Next Steps

1. **Populate test data:**
   - See `TESTING.md` for sample SQL queries

2. **Explore API:**
   - See `API_DOCS.md` for all endpoints

3. **Understand architecture:**
   - See `ARCHITECTURE.md` for system design

4. **Deploy:**
   - See `README.md` for production deployment

## File Structure Quick Reference

```
Result dashboard app/
├── backend/          # Express server
│   ├── server.js     # Main entry point
│   ├── db.js         # Database connection
│   └── routes/       # API endpoints
├── frontend/         # React app
│   ├── src/
│   │   ├── App.js    # Main component
│   │   └── components/
│   └── package.json
├── README.md         # Full documentation
├── SETUP.md          # Setup instructions
└── API_DOCS.md       # API reference
```

## Troubleshooting Commands

```bash
# Check if PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Check if Node is installed
node -v && npm -v

# See what's running on port 5000
netstat -ano | findstr :5000  # Windows
lsof -i :5000                  # macOS/Linux

# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Check npm logs
npm install --verbose
```

## Environment Variables Reference

### Backend (.env)
```
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=student_results_db
JWT_SECRET=your_secret_key_here
NODE_ENV=development
PORT=5000
```

### Frontend (.env, optional)
```
REACT_APP_API_URL=http://localhost:5000
```

## Default Ports

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **PostgreSQL:** localhost:5432

## Help & Support

If something goes wrong:

1. **Check logs** in terminal where app is running
2. **Verify .env** file is correct
3. **Check database** is running
4. **Try reinstalling:** `rm -rf node_modules && npm install`
5. **Restart everything:** Kill all processes and start fresh

## Next: Features to Explore

✅ Student result search
✅ Faculty registration & login
✅ Student management
✅ Result entry
✅ Grade calculation
✅ GPA calculation

Ready for more? See `README.md` for advanced features!
