# NutriNest Payment Service

Payment microservice for NutriNest. Handles Razorpay payment processing, order creation, and payment verification.

## Features

- **Razorpay Integration**: Create and verify Razorpay payments
- **Order Creation**: Create Razorpay orders for checkout
- **Payment Verification**: Verify payment signatures
- **Product Validation**: Validates products via Product Service before payment

## Installation

```bash
cd payment-service
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
| PAYMENT_SERVICE_PORT | Port for Payment Service | Yes (default: 5005) |
| MONGODB_URI | MongoDB connection string | Yes |
| RAZORPAY_KEY_ID | Razorpay Key ID | Yes |
| RAZORPAY_KEY_SECRET | Razorpay Key Secret | Yes |
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
GET http://localhost:5005/health
```

### Payment Routes

#### Create Razorpay Order
```bash
POST /api/payment/create-order
Body: { amount, items }
```

#### Verify Payment
```bash
POST /api/payment/verify
Body: { razorpayOrderId, razorpayPaymentId, razorpaySignature }
```

## Architecture

```
Frontend
    ↓
API Gateway (Port 5000)
    ↓
Payment Service (Port 5005)
    ↓
Razorpay API
    ↓
Product Service (Port 5002) for product validation
```

## Folder Structure

```
payment-service/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   └── paymentController.js # Payment logic
├── middleware/
│   └── errorHandler.js   # Global error handler
├── routes/
│   └── payment.js        # Payment routes
├── utils/
│   └── razorpayHelper.js # Razorpay helper
├── .env                  # Environment variables
├── .env.example          # Environment variables template
├── package.json          # Dependencies
├── server.js             # Service entry point
└── README.md             # This file
```

## Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **axios**: HTTP client for Razorpay API
- **razorpay**: Razorpay SDK
- **crypto**: Crypto for signature verification
- **cors**: CORS middleware
- **dotenv**: Environment variables

## Testing

### Test Health Check

```bash
curl http://localhost:5005/health
```

### Test Create Order

```bash
curl http://localhost:5005/api/payment/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount":100,"items":[{"product":"product_id","quantity":1}]}'
```
