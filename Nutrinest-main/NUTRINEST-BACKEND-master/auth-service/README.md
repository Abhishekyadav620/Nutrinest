# NutriNest Auth Service

Authentication microservice for NutriNest. Handles user registration, login, Google authentication, password reset, OTP verification, and admin authentication.

## Features

- **User Authentication**: Signup, login, logout
- **Google Authentication**: Firebase-based Google sign-in
- **Password Reset**: Email-based password reset with token
- **OTP Verification**: Email and SMS-based OTP for password reset
- **Admin Authentication**: Admin login and profile management
- **JWT Tokens**: Secure token-based authentication
- **Email Notifications**: Nodemailer for OTP and password reset emails
- **SMS Verification**: Twilio for phone-based OTP verification

## Installation

```bash
cd auth-service
npm install
```

## Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| AUTH_SERVICE_PORT | Port for Auth Service | Yes (default: 5001) |
| MONGODB_URI | MongoDB connection string | Yes |
| JWT_SECRET | Secret key for JWT signing | Yes |
| JWT_EXPIRE | JWT expiration time | Yes (default: 7d) |
| FIREBASE_PROJECT_ID | Firebase project ID | For Google Auth |
| FIREBASE_PRIVATE_KEY | Firebase private key | For Google Auth |
| FIREBASE_CLIENT_EMAIL | Firebase client email | For Google Auth |
| EMAIL_USER | Email for Nodemailer | For email features |
| EMAIL_PASS | Email password | For email features |
| EMAIL_HOST | SMTP host | For email features |
| EMAIL_PORT | SMTP port | For email features |
| TWILIO_ACCOUNT_SID | Twilio account SID | For SMS OTP |
| TWILIO_AUTH_TOKEN | Twilio auth token | For SMS OTP |
| TWILIO_VERIFY_SERVICE_SID | Twilio verify service SID | For SMS OTP |
| FRONTEND_URL | Frontend URL for CORS | Yes |
| NODE_ENV | Environment (development/production) | Yes |

## Running the Service

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

## API Endpoints

### Health Check

```bash
GET http://localhost:5001/health
```

### Authentication Routes

#### User Signup
```bash
POST /api/auth/signup
Body: { name, username, email, password }
```

#### User Login
```bash
POST /api/auth/login
Body: { username, password }
```

#### Google Login
```bash
POST /api/auth/google
Body: { idToken }
```

#### Forgot Password (Email)
```bash
POST /api/auth/forgot-password
Body: { email }
```

#### Reset Password (Token)
```bash
POST /api/auth/reset-password/:token
Body: { password }
```

#### Send OTP
```bash
POST /api/auth/send-otp
Body: { email } or { phone }
```

#### Verify OTP
```bash
POST /api/auth/verify-otp
Body: { email, otp } or { phone, otp }
```

#### Reset Password with OTP
```bash
POST /api/auth/reset-password-with-otp
Body: { email, otp, newPassword }
```

#### Create Admin (Development)
```bash
POST /api/auth/create-admin-dev
```

### Admin Routes

#### Admin Login
```bash
POST /api/admin/login
Body: { email, password }
```

#### Admin Profile
```bash
GET /api/admin/profile
Headers: Authorization: Bearer <token>
```

#### Update Admin Profile
```bash
PUT /api/admin/profile
Headers: Authorization: Bearer <token>
Body: { email, password }
```

#### Seed Admin
```bash
POST /api/admin/seed
Body: { email, password }
```

## Architecture

```
Frontend
    ↓
API Gateway (Port 5000)
    ↓
Auth Service (Port 5001)
    ↓
MongoDB
```

## Folder Structure

```
auth-service/
├── config/
│   ├── db.js              # MongoDB connection
│   ├── firebaseAdmin.js   # Firebase Admin SDK
│   └── twilio.js         # Twilio configuration
├── controllers/
│   ├── authControllers.js # User authentication logic
│   └── adminController.js # Admin authentication logic
├── middleware/
│   ├── auth.js           # JWT middleware
│   ├── adminMiddleware.js # Admin verification
│   └── errorHandler.js   # Global error handler
├── models/
│   ├── admin.js          # Admin model
│   └── user.js           # User model
├── routes/
│   ├── auth.js           # Auth routes
│   └── admin.js          # Admin routes
├── services/
│   └── emailService.js   # Email service for OTP
├── utils/
│   └── mailer.js         # Mailer utility
├── .env                  # Environment variables
├── .env.example          # Environment variables template
├── package.json          # Dependencies
├── server.js             # Service entry point
└── README.md             # This file
```

## Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT authentication
- **bcrypt**: Password hashing
- **cors**: CORS middleware
- **nodemailer**: Email sending
- **firebase-admin**: Firebase Admin SDK
- **twilio**: SMS verification

## Testing

### Test Health Check

```bash
curl http://localhost:5001/health
```

### Test User Signup

```bash
curl http://localhost:5001/api/auth/signup \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","username":"testuser","email":"test@example.com","password":"password123"}'
```

### Test User Login

```bash
curl http://localhost:5001/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

### Test Admin Login

```bash
curl http://localhost:5001/api/admin/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nutrinest.com","password":"admin123"}'
```

## Troubleshooting

### Service fails to start
- Check if port 5001 is already in use
- Verify `.env` file exists and is configured correctly
- Check MongoDB connection string

### MongoDB connection error
- Verify MONGODB_URI is correct
- Check MongoDB Atlas IP whitelist
- Ensure MongoDB is accessible

### Email sending fails
- Verify EMAIL_USER and EMAIL_PASS are correct
- Check if Gmail allows less secure apps (or use App Passwords)
- Verify SMTP host and port

### Google Auth fails
- Verify Firebase Admin credentials
- Check serviceAccountKey.json file
- Ensure Firebase project is configured correctly

### SMS OTP fails
- Verify Twilio credentials
- Check verifyServiceSid is correct
- Ensure phone number format is correct

## Security Notes

- JWT secrets should be strong and unique
- Never commit `.env` file to version control
- Use HTTPS in production
- Implement rate limiting for auth endpoints
- Rotate JWT secrets periodically
