# NutriNest Notification Service

Notification microservice for NutriNest. Handles all email, SMS, and push notifications.

## Features

- **Email Notifications**: OTP emails, password reset emails
- **SMS Notifications**: OTP verification via Twilio
- **Push Notifications**: Firebase Cloud Messaging
- **Multi-channel Support**: Email, SMS, and push notifications

## Installation

```bash
cd notification-service
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
| NOTIFICATION_SERVICE_PORT | Port for Notification Service | Yes (default: 5007) |
| MONGODB_URI | MongoDB connection string | Yes |
| EMAIL_USER | Email for notifications | Yes |
| EMAIL_PASS | Email password | Yes |
| EMAIL_HOST | SMTP host | Yes |
| EMAIL_PORT | SMTP port | Yes |
| FIREBASE_PROJECT_ID | Firebase project ID | Yes |
| FIREBASE_PRIVATE_KEY | Firebase private key | Yes |
| FIREBASE_CLIENT_EMAIL | Firebase client email | Yes |
| TWILIO_ACCOUNT_SID | Twilio account SID | Yes |
| TWILIO_AUTH_TOKEN | Twilio auth token | Yes |
| TWILIO_VERIFY_SERVICE_SID | Twilio verify service SID | Yes |
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
GET http://localhost:5007/health
```

### Notification Routes

#### Send OTP (Email or SMS)
```bash
POST /api/notifications/send-otp
Body: { email, phone, otp }
```

#### Verify OTP (SMS)
```bash
POST /api/notifications/verify-otp
Body: { phone, code }
```

#### Send Password Reset Email
```bash
POST /api/notifications/password-reset
Body: { email, resetUrl }
```

#### Send Push Notification
```bash
POST /api/notifications/push
Body: { token, title, body }
```

## Architecture

```
Frontend
    ↓
API Gateway (Port 5000)
    ↓
Notification Service (Port 5007)
    ↓
Email (SMTP), SMS (Twilio), Push (Firebase)
```

## Folder Structure

```
notification-service/
├── config/
│   ├── db.js              # MongoDB connection
│   ├── firebaseAdmin.js   # Firebase config
│   └── twilio.js          # Twilio config
├── controllers/
│   └── notificationController.js # Notification logic
├── middleware/
│   └── errorHandler.js   # Global error handler
├── routes/
│   └── notification.js   # Notification routes
├── services/
│   └── emailService.js    # Email service
├── utils/
│   └── mailer.js          # Mailer utility
├── .env                  # Environment variables
├── .env.example          # Environment variables template
├── package.json          # Dependencies
├── server.js             # Service entry point
└── README.md             # This file
```

## Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **nodemailer**: Email sending
- **firebase-admin**: Firebase push notifications
- **twilio**: SMS notifications
- **cors**: CORS middleware
- **dotenv**: Environment variables

## Testing

### Test Health Check

```bash
curl http://localhost:5007/health
```

### Test Send OTP Email

```bash
curl http://localhost:5007/api/notifications/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'
```
