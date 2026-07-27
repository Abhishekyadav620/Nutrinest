# NUTRINEST Backend

This is the Node.js/Express backend for the NutriNest E-commerce application.

## Features
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Products**: CRUD operations for products
- **Cart**: Add/remove items, view cart
- **Orders**: Order management with payment integration
- **Reviews**: Product review system
- **Admin**: Admin panel for managing orders and products
- **Payment**: Razorpay integration for online payments

## Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT (Authentication)
- Razorpay (Payment Gateway)
- Socket.io (Real-time updates)
- Nodemailer (Email notifications)

## Prerequisites
- Node.js installed
- MongoDB running locally or MongoDB Atlas connection string

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Update the `.env` file with your actual values:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/nutrinest
   JWT_SECRET=your_jwt_secret_here
   RAZORPAY_KEY_ID=your_razorpay_key_id_here
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
   ```

3. **Run Locally**
   ```bash
   npm run dev
   ```
   Or for production:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item quantity
- `DELETE /api/cart/:itemId` - Remove item from cart

### Orders
- `POST /api/orders` - Create order (COD)
- `GET /api/orders` - Get user orders
- `GET /api/orders/all` - Get all orders (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `DELETE /api/orders/:id` - Delete order (Admin)

### Payment (Razorpay)
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify Razorpay payment signature

### Reviews
- `POST /api/reviews` - Add product review
- `GET /api/reviews/product/:productId` - Get product reviews

### Admin
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update delivery status
- `DELETE /api/admin/orders/:id` - Delete order
- `GET /api/admin/products` - Get all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

## Payment Integration (Razorpay)

### Setup Razorpay
1. Create account at [https://razorpay.com](https://razorpay.com)
2. Generate Test Mode keys from Settings → API Keys
3. Add keys to `.env` file:
   - `RAZORPAY_KEY_ID` - Public key (used by frontend)
   - `RAZORPAY_KEY_SECRET` - Secret key (used by backend only)

### Payment Flow
1. Frontend calls `/api/payment/create-order` with amount
2. Backend creates Razorpay order and returns order ID
3. Frontend opens Razorpay checkout with order ID
4. User completes payment
5. On success, frontend calls `/api/payment/verify` with:
   - `razorpayOrderId`
   - `razorpayPaymentId`
   - `razorpaySignature`
6. Backend verifies signature using HMAC SHA256
7. If valid, order is saved with payment details

### Security
- Never expose `RAZORPAY_KEY_SECRET` to frontend
- Always verify payment signature on backend
- Use HTTPS in production

## Database Models

### User
- username, email, password
- addresses array
- reset password tokens

### Product
- name, description, price, stock
- category, image
- reviews

### Cart
- user reference
- items array (product, quantity)

### Order
- user reference
- items array
- address
- paymentMethod (COD, RAZORPAY, UPI, CARD)
- paymentStatus (pending, paid, failed, cancelled)
- paymentResult (razorpayOrderId, razorpayPaymentId, razorpaySignature)
- totalAmount
- status
- deliveryStatus (pending, shipped, delivered, cancelled)
- paidAt

## Seed Data

To seed admin user and products:
```bash
node seed_admin.js
node seed_products.js
```

## Folder Structure
- `src/config` - Database configuration
- `src/controllers` - Route controllers
- `src/middleware` - Auth, error handling
- `src/models` - Mongoose models
- `src/routes` - API routes
- `src/utils` - Helpers (Razorpay, Socket, Mailer)
- `src/server.js` - Entry point
