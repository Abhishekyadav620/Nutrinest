# NutriNest Order Service

Order microservice for NutriNest. Handles order creation, management, tracking, and communicates with Product, Cart, and Payment services.

## Features

- **Order Creation**: Create orders from cart or direct checkout
- **Order Management**: View user orders, admin order management
- **Order Tracking**: Update delivery status with email notifications
- **Payment Integration**: Integrates with Payment Service for Razorpay
- **Stock Management**: Updates product stock via Product Service
- **Real-time Updates**: Socket.io for real-time order notifications
- **Email Notifications**: Order status emails via Nodemailer

## Installation

```bash
cd order-service
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
| ORDER_SERVICE_PORT | Port for Order Service | Yes (default: 5004) |
| MONGODB_URI | MongoDB connection string | Yes |
| JWT_SECRET | Secret key for JWT verification | Yes |
| AUTH_SERVICE_URL | Auth Service URL | Yes |
| PRODUCT_SERVICE_URL | Product Service URL | Yes |
| CART_SERVICE_URL | Cart Service URL | Yes |
| PAYMENT_SERVICE_URL | Payment Service URL | Yes |
| NOTIFICATION_SERVICE_URL | Notification Service URL | Yes |
| EMAIL_USER | Email for notifications | Yes |
| EMAIL_PASS | Email password | Yes |
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
GET http://localhost:5004/health
```

### Order Routes (Protected - Requires JWT)

#### Create Order
```bash
POST /api/orders
Headers: Authorization: Bearer <token>
Body: { paymentMethod, address, items (optional) }
```

#### Get User Orders
```bash
GET /api/orders
Headers: Authorization: Bearer <token>
```

#### Get All Orders (Admin)
```bash
GET /api/orders/all
Headers: Authorization: Bearer <admin_token>
```

#### Update Order Status (Admin)
```bash
PATCH /api/orders/:id/status
Headers: Authorization: Bearer <admin_token>
Body: { status }
```

#### Delete Order (Admin)
```bash
DELETE /api/orders/:id
Headers: Authorization: Bearer <admin_token>
```

## Architecture

```
Frontend
    ↓
API Gateway (Port 5000)
    ↓
Order Service (Port 5004)
    ↓
Product Service (Port 5002) for product details & stock
Cart Service (Port 5003) for cart items
Payment Service (Port 5005) for payment processing
    ↓
MongoDB
```

## Folder Structure

```
order-service/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   └── orderControllers.js # Order logic
├── middleware/
│   ├── auth.js           # JWT middleware
│   ├── adminMiddleware.js # Admin verification
│   └── errorHandler.js   # Global error handler
├── models/
│   ├── order.js          # Order model
│   └── user.js           # User model (for auth)
├── routes/
│   └── order.js          # Order routes
├── services/
│   └── orderEmailService.js # Email notifications
├── utils/
│   └── socket.js         # Socket.io setup
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
- **nodemailer**: Email notifications
- **socket.io**: Real-time updates
- **cors**: CORS middleware
- **dotenv**: Environment variables

## Testing

### Test Health Check

```bash
curl http://localhost:5004/health
```

### Test Create Order (requires token)

```bash
curl http://localhost:5004/api/orders \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"paymentMethod":"COD","address":{"name":"Test","line1":"123 St","city":"City","postalCode":"12345","phone":"1234567890"}}'
```
