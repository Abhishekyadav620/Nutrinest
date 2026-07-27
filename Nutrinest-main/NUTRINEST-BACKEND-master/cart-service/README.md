# NutriNest Cart Service

Cart microservice for NutriNest. Handles shopping cart operations and communicates with Product Service for product details.

## Features

- **Cart Management**: Add, update, remove items from cart
- **Product Verification**: Validates products via Product Service
- **User-specific Carts**: Each user has their own cart
- **Quantity Management**: Update item quantities
- **Inter-service Communication**: Calls Product Service for product details

## Installation

```bash
cd cart-service
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
| CART_SERVICE_PORT | Port for Cart Service | Yes (default: 5003) |
| MONGODB_URI | MongoDB connection string | Yes |
| JWT_SECRET | Secret key for JWT verification | Yes |
| AUTH_SERVICE_URL | Auth Service URL | Yes |
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
GET http://localhost:5003/health
```

### Cart Routes (Protected - Requires JWT)

#### Get Cart
```bash
GET /api/cart
Headers: Authorization: Bearer <token>
```

#### Add to Cart
```bash
POST /api/cart
Headers: Authorization: Bearer <token>
Body: { productId, quantity }
```

#### Update Cart Item
```bash
PUT /api/cart/:id
Headers: Authorization: Bearer <token>
Body: { quantity }
```

#### Delete Cart Item
```bash
DELETE /api/cart/:id
Headers: Authorization: Bearer <token>
```

## Architecture

```
Frontend
    ↓
API Gateway (Port 5000)
    ↓
Cart Service (Port 5003)
    ↓
Product Service (Port 5002) for product details
    ↓
MongoDB
```

## Folder Structure

```
cart-service/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   └── cartControllers.js # Cart logic
├── middleware/
│   ├── auth.js           # JWT middleware
│   └── errorHandler.js   # Global error handler
├── models/
│   ├── cart.js           # Cart model
│   └── user.js           # User model (for auth)
├── routes/
│   └── cart.js           # Cart routes
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
curl http://localhost:5003/health
```

### Test Get Cart (requires token)

```bash
curl http://localhost:5003/api/cart \
  -H "Authorization: Bearer <your_token>"
```
