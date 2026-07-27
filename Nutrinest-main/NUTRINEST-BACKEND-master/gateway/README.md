# NutriNest API Gateway

The API Gateway serves as the single entry point for all client requests to the NutriNest microservices architecture. It handles routing, CORS, security, and request logging.

## Features

- **Request Routing**: Proxies requests to appropriate backend services
- **CORS Configuration**: Handles cross-origin requests from frontend
- **Security**: Helmet middleware for security headers
- **Logging**: Morgan middleware for HTTP request logging
- **Error Handling**: Centralized error handling
- **Health Check**: Endpoint for monitoring gateway status

## Installation

```bash
cd gateway
npm install
```

## Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| GATEWAY_PORT | Port for API Gateway | 5000 |
| MONOLITHIC_BACKEND_URL | URL of monolithic backend (Phase 2) | http://localhost:5000 |
| AUTH_SERVICE_URL | URL of Auth Service (Phase 3+) | http://localhost:5001 |
| PRODUCT_SERVICE_URL | URL of Product Service (Phase 4+) | http://localhost:5002 |
| CART_SERVICE_URL | URL of Cart Service (Phase 5+) | http://localhost:5003 |
| ORDER_SERVICE_URL | URL of Order Service (Phase 6+) | http://localhost:5004 |
| PAYMENT_SERVICE_URL | URL of Payment Service (Phase 7+) | http://localhost:5005 |
| REVIEW_SERVICE_URL | URL of Review Service (Phase 8+) | http://localhost:5006 |
| NOTIFICATION_SERVICE_URL | URL of Notification Service (Phase 9+) | http://localhost:5007 |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:5173 |
| LOG_LEVEL | Logging level (info/production) | info |

## Running the Gateway

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
GET http://localhost:5000/health
```

Response:
```json
{
  "status": "OK",
  "service": "NutriNest API Gateway",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

### Proxied Routes

All API routes are proxied to backend services:

- `/api/auth/*` → Auth Service
- `/api/products/*` → Product Service
- `/api/cart/*` → Cart Service
- `/api/orders/*` → Order Service
- `/api/payment/*` → Payment Service
- `/api/reviews/*` → Review Service
- `/api/admin/*` → Admin Service

## Architecture

```
Frontend (React)
     ↓
API Gateway (Port 5000)
     ↓
┌─────────────────────────────────────┐
│  Monolithic Backend (Phase 2)       │
│  Port 5000                          │
└─────────────────────────────────────┘

Later Phases:
     ↓
┌─────────────────────────────────────┐
│  Auth Service (Port 5001)           │
│  Product Service (Port 5002)        │
│  Cart Service (Port 5003)            │
│  Order Service (Port 5004)           │
│  Payment Service (Port 5005)        │
│  Review Service (Port 5006)         │
│  Notification Service (Port 5007)   │
└─────────────────────────────────────┘
```

## Testing

### Test Health Check

```bash
curl http://localhost:5000/health
```

### Test Proxy to Backend

```bash
# Test Products API
curl http://localhost:5000/api/products

# Test Auth API
curl http://localhost:5000/api/auth/login -X POST -H "Content-Type: application/json" -d '{"username":"test","password":"test"}'
```

## Folder Structure

```
gateway/
├── config/
│   └── proxy.config.js    # Proxy configuration for all routes
├── middleware/
│   ├── errorHandler.js    # Global error handler
│   └── logger.js          # Request logger (Morgan)
├── .env                   # Environment variables
├── .env.example           # Environment variables template
├── package.json           # Dependencies
├── server.js              # Gateway entry point
└── README.md              # This file
```

## Dependencies

- **express**: Web framework
- **cors**: CORS middleware
- **helmet**: Security headers
- **http-proxy-middleware**: Proxy middleware
- **morgan**: HTTP request logger
- **dotenv**: Environment variables

## Migration Notes

### Phase 2 (Current)
- All routes proxy to monolithic backend on port 5000
- Monolithic backend needs to run on port 5000
- Gateway runs on port 5000 (will need to change in Phase 3)

### Phase 3+
- Individual routes will be updated to point to specific services
- Gateway port will change to 5000
- Monolithic backend port will change to 5001 (Auth Service)
- Services will be extracted one by one

## Troubleshooting

### Gateway fails to start
- Check if port 5000 is already in use
- Verify `.env` file exists and is configured correctly

### Proxy errors
- Ensure backend service is running
- Check service URL in `.env`
- Check backend service logs

### CORS errors
- Verify FRONTEND_URL in `.env` matches your frontend URL
- Check browser console for specific CORS errors
