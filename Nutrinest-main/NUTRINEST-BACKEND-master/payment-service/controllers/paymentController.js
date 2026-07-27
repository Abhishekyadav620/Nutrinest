const axios = require("axios");
const crypto = require("crypto");
const mongoose = require("mongoose");

exports.createOrder = async (req, res, next) => {
  try {
    const { amount, items } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // Validate the products before a Razorpay order is created
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    const productIds = items.map((item) => item?.product);
    if (productIds.some((id) => !mongoose.isValidObjectId(id))) {
      return res.status(400).json({ message: "One or more products are unavailable" });
    }

    // Verify products exist via Product Service
    const productsResponse = await axios.post(
      `${process.env.PRODUCT_SERVICE_URL || 'http://localhost:5002'}/api/products/batch`,
      { ids: productIds }
    ).catch(() => ({ data: { products: [] } }));
    
    if (productsResponse.data.products.length !== new Set(productIds.map(String)).size) {
      return res.status(400).json({ message: "One or more products are unavailable" });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1,
    };

    // Use Axios directly instead of razorpay.orders.create()
    let order;
    try {
      const response = await axios.post(
        "https://api.razorpay.com/v1/orders",
        options,
        {
          auth: {
            username: process.env.RAZORPAY_KEY_ID,
            password: process.env.RAZORPAY_KEY_SECRET,
          },
          timeout: 15000,
        }
      );
      order = response.data;
    } catch (error) {
      const providerMessage = error.response?.data?.error?.description;
      console.error("Razorpay order creation failed:", {
        code: error.code,
        status: error.response?.status,
        message: providerMessage || error.message,
      });
      return res.status(error.response?.status || 502).json({
        message:
          providerMessage ||
          "Unable to connect to Razorpay. Please try again in a moment.",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Payment verified successfully
    // Order creation is handled by Order Service
    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      paymentId: razorpayPaymentId,
    });
  } catch (error) {
    next(error);
  }
};
