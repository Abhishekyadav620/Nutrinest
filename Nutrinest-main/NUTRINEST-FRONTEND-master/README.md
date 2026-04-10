# NUTRINEST Frontend

This is the React frontend for the NutriNest E-commerce application.

## Features
- **Authentication**: Login, Signup, Forgot Password using JWT.
- **Products**: Browse products, view details, and reviews.
- **Cart**: Add/remove items, view summary.
- **Checkout**: Address selection, COD, and Razorpay integration.
- **User Profile**: Manage saved addresses.

## Tech Stack
- React + Vite
- TailwindCSS
- Axios (API Client)
- React Router DOM
- Razorpay (Payments)

## Prerequisites
- Node.js installed
- Backend API running on `http://localhost:5000` (or configure in `.env`)

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id_here
   ```

3. **Run Locally**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Folder Structure
- `src/api`: Axios client setup
- `src/components`: Reusable UI components
- `src/context`: Global state (Auth, Cart)
- `src/pages`: Application pages (Auth, Shop, User)
- `src/utils`: Helper functions

## Payment Integration
Razorpay is integrated for online payments. Ensure you provide a valid `VITE_RAZORPAY_KEY_ID` in the `.env` file to test the flow. The verification endpoint `/api/payment/verify` is called after a successful transaction.
