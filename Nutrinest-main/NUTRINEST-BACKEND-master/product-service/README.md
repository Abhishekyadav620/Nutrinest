# NutriNest Product Service

Product microservice for NutriNest. Handles product management, inventory, search, and filtering.

## Features

- **Product CRUD**: Create, read products
- **Search**: Keyword search in name and description
- **Filtering**: Filter by category, price range, rating
- **Sorting**: Sort by price, rating, newest
- **Pagination**: Efficient pagination for large product lists

## Installation

```bash
cd product-service
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
| PRODUCT_SERVICE_PORT | Port for Product Service | Yes (default: 5002) |
| MONGODB_URI | MongoDB connection string | Yes |
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
GET http://localhost:5002/health
```

### Product Routes

#### Get All Products
```bash
GET /api/products
Query Params: keyword, category, minPrice, maxPrice, rating, sort, page, limit
```

#### Get Single Product
```bash
GET /api/products/:id
```

#### Create Product
```bash
POST /api/products
Body: { name, description, price, category, image, stock, ... }
```

## Architecture

```
Frontend
    ↓
API Gateway (Port 5000)
    ↓
Product Service (Port 5002)
    ↓
MongoDB
```

## Folder Structure

```
product-service/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   └── productController.js # Product logic
├── middleware/
│   └── errorHandler.js   # Global error handler
├── models/
│   └── product.js        # Product model
├── routes/
│   └── product.js        # Product routes
├── .env                  # Environment variables
├── .env.example          # Environment variables template
├── package.json          # Dependencies
├── server.js             # Service entry point
└── README.md             # This file
```

## Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **cors**: CORS middleware
- **dotenv**: Environment variables

## Testing

### Test Health Check

```bash
curl http://localhost:5002/health
```

### Test Get Products

```bash
curl http://localhost:5002/api/products
```

### Test Get Single Product

```bash
curl http://localhost:5002/api/products/<product_id>
```
