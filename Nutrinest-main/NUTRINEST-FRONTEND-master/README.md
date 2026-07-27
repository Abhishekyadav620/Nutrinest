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

## Payment Integration (Razorpay)

### How to Create Razorpay Account and Generate Test Keys

1. **Sign up for Razorpay**
   - Go to [https://razorpay.com](https://razorpay.com)
   - Click on "Sign Up" and create an account using your email
   - Verify your email address

2. **Generate Test Mode Keys**
   - After logging in, navigate to "Settings" → "API Keys"
   - You will see two modes: "Test Mode" and "Live Mode"
   - Ensure "Test Mode" is selected (for development/testing)
   - Click on "Generate Key" if keys don't exist
   - You will get:
     - **Key ID** (e.g., `rzp_test_XXXXXXXXXXXXX`)
     - **Key Secret** (e.g., `XXXXXXXXXXXXXXXXXXXXXXXX`)

3. **Configure Keys in Project**

   **Backend (.env):**
   ```env
   RAZORPAY_KEY_ID=your_razorpay_key_id_here
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
   ```

   **Frontend (.env):**
   ```env
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id_here
   ```

   **Important:** Never commit the actual keys to version control. Use `.env` files and add them to `.gitignore`.

### Payment Flow

1. User selects "Credit/Debit Card" or "UPI" as payment method at checkout
2. Frontend calls `/api/payment/create-order` to create a Razorpay order
3. Backend returns Razorpay order ID
4. Razorpay checkout popup opens
5. User completes payment
6. On success, frontend calls `/api/payment/verify` with payment details
7. Backend verifies signature using HMAC SHA256
8. After verification, order is saved, cart is cleared, and user is redirected to success page

### Testing Payments

- Use Razorpay Test Mode for development
- Test card: `4242 4242 4242 4242` (Visa)
- Test card expiry: Any future date (e.g., `12/25`)
- Test CVV: Any 3 digits (e.g., `123`)
- No OTP required in Test Mode

### Switching to Live Mode

- When ready for production:
  - Switch to "Live Mode" in Razorpay dashboard
  - Generate Live Mode keys
  - Update keys in both backend and frontend `.env` files
  - Ensure KYC is completed for receiving payments
