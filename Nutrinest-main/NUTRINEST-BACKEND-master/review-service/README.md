# NutriNest Review Service

Review microservice for NutriNest. Handles product reviews, site testimonials, and ratings.

## Features

- **Product Reviews**: Add and view product reviews
- **Site Reviews**: Add and view site-wide testimonials
- **Rating System**: 1-5 star rating system
- **User Authentication**: Protected routes for adding reviews
- **Product Validation**: Verifies products via Product Service

## Installation

```bash
cd review-service
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
| REVIEW_SERVICE_PORT | Port for Review Service | Yes (default: 5006) |
| MONGODB_URI | MongoDB connection string | Yes |
| JWT_SECRET | Secret key for JWT verification | Yes |
| PRODUCT_SERVICE_URL | Product Service URL | Yes |
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
GET http://localhost:5006/health
```

### Review Routes

#### Get Product Reviews
```bash
GET /api/reviews/:id
Query Params: limit
```

#### Add Product Review (Protected)
```bash
POST /api/reviews/:id
Headers: Authorization: Bearer <token>
Body: { rating, text }
```

#### Get Site Reviews
```bash
GET /api/reviews/site
Query Params: limit
```

#### Add Site Review (Protected)
```bash
POST /api/reviews/site
Headers: Authorization: Bearer <token>
Body: { rating, text }
```

## Architecture

```
Frontend
    ↓
API Gateway (Port 5000)
    ↓
Review Service (Port 5006)
    ↓
Product Service (Port 5002) for product validation
    ↓
MongoDB
```

## Folder Structure

```
review-service/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   └── reviewController.js # Review logic
├── middleware/
│   ├── auth.js           # JWT middleware
│   └── errorHandler.js   # Global error handler
├── models/
│   ├── review.js         # Review model
│   └── user.js           # User model (for auth)
├── routes/
│   └── review.js         # Review routes
├── .env                  # Environment variables
├── .env.example          # Environment variables template
├── package.json          # Dependencies
├── server.js             # Service entry point
└── README.md             # This file
```

## Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **axios**: HTTP client for inter-service communication
- **jsonwebtoken**: JWT verification
- **bcrypt**: Password hashing (for User model)
- **cors**: CORS middleware
- **dotenv**: Environment variables

## Testing

### Test Health Check

```bash
curl http://localhost:5006/health
```

### Test Get Site Reviews

```bash
curl http://localhost:5006/api/reviews/site
```
