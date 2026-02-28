# Authentication Setup Guide

## Overview
Ask-Lytics now includes a complete user authentication system with JWT tokens, password hashing, and protected routes.

## Features
- ✅ User registration with validation
- ✅ Secure login with JWT tokens
- ✅ Password hashing using bcrypt
- ✅ Protected routes with authentication middleware
- ✅ Beautiful split-layout auth pages
- ✅ Inter font for UI, Fira Code for code sections

## Database Setup

### 1. Create Users Table
Run the SQL script to create the users table:

```bash
mysql -u root -p classicmodels < users_authentication.sql
```

Or manually execute the SQL:
```sql
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    mobile VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email),
    INDEX idx_mobile (mobile)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2. Configure Environment Variables
Update your `.env` file with JWT secret:

```bash
# JWT Authentication
JWT_SECRET=your-secret-key-change-in-production-use-long-random-string

# Database configuration (for authentication)
DB_USER=root
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=3306
DB_NAME=classicmodels
```

**Important:** Change `JWT_SECRET` to a strong random string in production!

Generate a secure JWT secret:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## Installation

### 1. Install Backend Dependencies
```bash
pip install -r requirements.txt
```

New packages added:
- `pyjwt==2.8.0` - JWT token generation and verification
- `bcrypt==4.1.2` - Password hashing
- `python-multipart==0.0.9` - Form data parsing

### 2. Install Frontend Dependencies
```bash
cd frontend-nextjs
npm install
```

## API Endpoints

### Authentication Endpoints

#### 1. Register User
```http
POST http://localhost:8000/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "mobile": "9876543210",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### 2. Login
```http
POST http://localhost:8000/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### 3. Get Current User
```http
GET http://localhost:8000/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "created_at": "2024-01-15T10:30:00",
    "last_login": "2024-01-15T14:20:00"
  }
}
```

## Frontend Authentication Flow

### 1. Access Login Page
Navigate to: `http://localhost:3000/login`

### 2. Register New User
Navigate to: `http://localhost:3000/register`

### 3. Protected Routes
After login, users can access:
- `/` - Dashboard
- `/ask-query` - Natural language queries
- `/sql-editor` - Direct SQL execution
- `/schema` - Database schema viewer
- `/history` - Query history
- `/settings` - Application settings

### 4. Token Storage
JWT token is stored in `localStorage`:
```javascript
localStorage.setItem('auth_token', data.token)
localStorage.setItem('user', JSON.stringify(data.user))
```

### 5. Logout
Clear localStorage:
```javascript
localStorage.removeItem('auth_token')
localStorage.removeItem('user')
window.location.href = '/login'
```

## Security Features

### Password Requirements
- Minimum 8 characters
- Recommended: Mix of uppercase, lowercase, numbers, special characters

### Password Hashing
- Uses bcrypt with 12 rounds
- Salt generated automatically
- One-way hashing (cannot be reversed)

### JWT Token
- Expires after 24 hours
- Contains user ID and email
- Signed with secret key
- Verified on protected routes

### Protected Routes
- AuthGuard component checks for token
- Redirects to login if not authenticated
- Runs on every page load

## Testing

### Sample Users (from SQL script)
```
Email: admin@asklytics.com
Password: Admin@123

Email: test@asklytics.com
Password: Test@123
```

**Note:** These are demo credentials. Change them in production!

### Test Registration
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "mobile": "9876543210",
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

### Test Protected Endpoint
```bash
TOKEN="your_jwt_token_here"
curl http://localhost:8000/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

## Typography

### UI Text - Inter Font
- **Headings:** Inter 900 (Extra Bold) with purple-white gradient
- **Body Text:** Inter 600 (Semi-Bold)
- **Labels:** Inter 800 (Extra Bold), uppercase, letter-spacing
- **Buttons:** Inter 800 (Extra Bold), uppercase

### Code Sections - Fira Code Font
- SQL Code Blocks
- Query Results
- Schema Display
- Error Messages
- Monaco Editor (SQL Editor)

## Troubleshooting

### Issue: "Connection failed"
**Solution:** Check database credentials in `.env` file

### Issue: "Invalid token"
**Solution:** Token expired or invalid. Login again.

### Issue: "Email already registered"
**Solution:** Use a different email or login with existing account

### Issue: "Password too short"
**Solution:** Use at least 8 characters

### Issue: Fonts not loading
**Solution:** 
1. Clear browser cache
2. Check network tab for font requests
3. Ensure Google Fonts CDN is accessible

### Issue: CORS error
**Solution:** Add frontend URL to `ALLOWED_ORIGINS` in `.env`:
```
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

## Production Deployment

### 1. Environment Variables
```bash
# Strong JWT secret (32+ characters)
JWT_SECRET=$(python -c "import secrets; print(secrets.token_urlsafe(32))")

# Secure database password
DB_PASSWORD=strong_password_here

# Production URLs
BACKEND_URL=https://api.yourapp.com
FRONTEND_URL=https://yourapp.com
ALLOWED_ORIGINS=https://yourapp.com
```

### 2. Security Checklist
- [ ] Change JWT_SECRET to strong random string
- [ ] Use HTTPS in production
- [ ] Set secure database password
- [ ] Remove demo users from database
- [ ] Enable rate limiting for auth endpoints
- [ ] Add CAPTCHA to prevent bot registrations
- [ ] Implement password reset flow
- [ ] Add email verification
- [ ] Set up monitoring and logging
- [ ] Configure CORS properly

### 3. Database Security
- [ ] Use environment variables for credentials
- [ ] Never commit credentials to git
- [ ] Use SSL for database connections
- [ ] Regular backups
- [ ] Restrict database access by IP

## Next Steps

### Recommended Enhancements
1. **Email Verification** - Send verification email on registration
2. **Password Reset** - Forgot password flow with email token
3. **Two-Factor Authentication** - SMS or TOTP based 2FA
4. **Session Management** - Track active sessions
5. **Rate Limiting** - Prevent brute force attacks
6. **Social Login** - Google, GitHub OAuth
7. **User Roles** - Admin, user, viewer permissions
8. **Audit Logging** - Track user actions
9. **Profile Management** - Update name, email, password
10. **Account Deletion** - GDPR compliance

### Code Examples

#### Check authentication in frontend components:
```typescript
const checkAuth = () => {
  const token = localStorage.getItem('auth_token')
  if (!token) {
    router.push('/login')
  }
}
```

#### Make authenticated API calls:
```typescript
const token = localStorage.getItem('auth_token')
const response = await fetch('http://localhost:8000/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

#### Logout user:
```typescript
const logout = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user')
  window.location.href = '/login'
}
```

## Support

For issues or questions:
1. Check this guide thoroughly
2. Review error messages in browser console
3. Check backend logs: `python app.py`
4. Verify database connection
5. Test with sample credentials first

## License

This authentication system is part of Ask-Lytics project and follows the same license terms.
