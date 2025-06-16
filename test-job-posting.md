# Job Posting Debug Guide

## Steps to Test Job Posting

### 1. Start the Servers

```bash
# Terminal 1 - Start MongoDB (if not running)
mongod

# Terminal 2 - Start Backend
cd server
npm start

# Terminal 3 - Start Frontend
cd frontend
npm run dev
```

### 2. Register as an Employer

1. Go to http://localhost:5173/register
2. Fill in the form with:
   - Name: Test Employer
   - Email: employer@test.com
   - Password: password123
   - Role: Employer
3. Click "Create Account"

### 3. Check Authentication

1. Open browser console (F12)
2. Look for these logs:
   - "Checking auth with token: exists"
   - "Auth check response: {user data}"
   - "Request to: /api/auth/me Token: exists"

### 4. Try to Post a Job

1. Go to http://localhost:5173/post-job
2. Fill in the job form
3. Submit and check console for:
   - "Calling jobService.createJob with data: {job data}"
   - "Request to: /api/jobs Token: exists"
   - Any error messages

### 5. Check Backend Logs

Look for these logs in the server terminal:

- "Creating job with data: {job data}"
- "User: {user object}"
- Any error messages

## Common Issues and Solutions

### Issue: 401 Unauthorized

- **Cause**: User not authenticated or token expired
- **Solution**: Re-register or re-login

### Issue: 403 Forbidden

- **Cause**: User is not an employer
- **Solution**: Register with role "employer"

### Issue: 500 Server Error

- **Cause**: Database connection or validation error
- **Solution**: Check MongoDB is running and Job model validation

### Issue: Network Error

- **Cause**: Backend server not running
- **Solution**: Start the backend server

## Debug Commands

### Check MongoDB Connection

```bash
# In server terminal
curl http://localhost:5000/health
```

### Test Job Creation API

```bash
# Replace TOKEN with actual token from localStorage
curl -X POST http://localhost:5000/api/jobs \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Job",
    "company": "Test Company",
    "location": "Remote",
    "type": "full-time",
    "experience": "entry",
    "description": "Test job description",
    "requirements": ["Test requirement"],
    "skills": ["Test skill"]
  }'
```
