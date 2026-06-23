# Architecture Overview

## System Design

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTP/REST
       ▼
┌─────────────────┐
│  React Frontend │
├─────────────────┤
│ StudentPortal   │
│ FacultyAuth     │
│ FacultyDashboard│
└────────┬────────┘
         │ API Calls
         ▼
┌─────────────────────────────────┐
│   Express.js Backend Server     │
├─────────────────────────────────┤
│ Routes:                         │
│  /api/students/*                │
│  /api/faculty/*                 │
│  /api/results/*                 │
│                                 │
│ Middleware:                     │
│  - CORS                         │
│  - JSON Parser                  │
│  - Auth (JWT)                   │
└────────┬────────────────────────┘
         │ SQL Queries
         ▼
┌──────────────────┐
│   PostgreSQL DB  │
├──────────────────┤
│ students         │
│ faculty          │
│ courses          │
│ results          │
└──────────────────┘
```

## Authentication Flow

### Faculty Login
1. User submits credentials (faculty_id, password)
2. Backend verifies credentials against faculty table
3. Password checked with bcrypt
4. JWT token generated and sent to frontend
5. Frontend stores token in localStorage
6. Token sent with Authorization header for protected routes

### Student Access
- No authentication required
- Search by register number
- All student data publicly accessible (configurable)

## Data Flow

### Student Checking Results
1. Student enters register number
2. Frontend calls `/api/students/by-register/{registerNumber}`
3. Backend queries students + results + courses tables
4. Returns joined data with student info and all results
5. Frontend displays results with GPA calculation

### Faculty Adding Result
1. Faculty logs in (JWT token obtained)
2. Faculty selects student and enters marks
3. Frontend calls `/api/results` with student_id, course_id, marks
4. Backend validates and inserts into results table
5. Grade auto-calculated if not provided
6. Frontend refreshes student details

## Security Considerations

1. **Password Security**
   - Stored as bcrypt hash
   - Never sent in plain text
   - Never logged

2. **JWT Tokens**
   - Signed with JWT_SECRET
   - Expires after 7 days
   - Stored in localStorage (consider improving with httpOnly cookies)

3. **API Validation**
   - Input validation on all routes
   - SQL injection prevention via parameterized queries
   - CORS enabled for frontend origin

4. **Database**
   - Foreign key constraints
   - Unique constraints on register_number, course_code, faculty_id
   - Cascading deletes for data integrity

## Scalability Considerations

### Current Architecture
- Single Express server
- Connection pooling with pg module
- Simple file-based routing

### For Production
- Load balancing (Nginx)
- Multiple server instances
- Redis caching for frequently accessed data
- Database replication
- CDN for frontend assets
- API rate limiting

## Performance Optimizations

1. **Database**
   - Indexes on frequently queried columns
   - Join queries vs. multiple requests

2. **Frontend**
   - Component lazy loading
   - Memoization for expensive computations

3. **Caching**
   - Student list cached in faculty dashboard
   - Minimal re-fetches

## Error Handling

### Backend
- Catch-all error middleware
- Specific error messages for client
- HTTP status codes (400, 401, 404, 500)

### Frontend
- Try-catch blocks
- User-friendly error messages
- Error state management

## Future Architecture

Consider migrating to:
- GraphQL instead of REST
- Microservices (Auth Service, Results Service, etc.)
- Event-driven architecture with message queues
- WebSockets for real-time updates
- Document database for flexible schemas
