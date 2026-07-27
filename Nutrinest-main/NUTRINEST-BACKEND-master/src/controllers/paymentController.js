const axios = require("axios");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Order = require("../models/order");
const User = require("../models/user");
const Cart = require("../models/cart");
const Product = require("../models/product");
const socketHelper = require("../utils/socket");

exports.createOrder = async (req, res, next) => {
  try {
    const { amount, items } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // Validate the products before a Razorpay order is created. This prevents
    // placeholder frontend IDs (for example, "p1") from being charged and
    // then failing only after Razorpay reports a successful payment.
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    const productIds = items.map((item) => item?.product);
    if (productIds.some((id) => !mongoose.isValidObjectId(id))) {
      return res.status(400).json({ message: "One or more products are unavailable" });
    }

    const availableProductCount = await Product.countDocuments({
      _id: { $in: productIds },
    });
    if (availableProductCount !== new Set(productIds.map(String)).size) {
      return res.status(400).json({ message: "One or more products are unavailable" });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1,
    };

    // Use Axios directly here instead of razorpay.orders.create(). The
    // installed Razorpay SDK dereferences err.response on network errors,
    // masking the actual provider error with "reading 'status'".
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
      address,
      items,
      paymentMethod,
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

    let orderItems = [];
    let total = 0;

    if (items && Array.isArray(items) && items.length) {
      orderItems = await Promise.all(
        items.map(async (it) => {
          const prod = await Product.findById(it.product);
          if (!prod) throw new Error("Product not found");
          total += prod.price * (it.quantity || 1);
          return {
            product: prod._id,
            quantity: it.quantity || 1,
            priceAtPurchase: prod.price,
          };
        })
      );
    } else {
      const cart = await Cart.findOne({ user: req.user._id }).populate(
        "items.product"
      );
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }
      orderItems = cart.items.map((i) => {
        const price = i.product.price;
        total += price * i.quantity;
        return {
          product: i.product._id,
          quantity: i.quantity,
          priceAtPurchase: price,
        };
      });
    }

    const userId = req.user && req.user._id ? req.user._id : null;
    const newOrder = await Order.create({
      user: userId,
      items: orderItems,
      address,
      paymentMethod: paymentMethod || "RAZORPAY",
      paymentResult: {
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
      },
      totalAmount: total,
      paymentStatus: "paid",
      status: "paid",
      deliveryStatus: "pending",
      paidAt: Date.now(),
    });

    const stockUpdates = [];
    try {
      await Promise.all(
        orderItems.map(async (it) => {
          const prod = await Product.findById(it.product);
          if (!prod) return;
          prod.stock = Math.max(0, (prod.stock || 0) - it.quantity);
          await prod.save();
          stockUpdates.push({ product: prod._id, stock: prod.stock });
        })
      );
    } catch (e) {
      console.error("Error updating product stock:", e.message || e);
    }

    if (req.user && req.user._id) {
      await Cart.findOneAndDelete({ user: req.user._id });
    }

    try {
      await newOrder.populate("user", "name username email");
      await newOrder.populate("items.product", "name image");
    } catch (e) {
      console.error("Error populating order:", e.message || e);
    }

    try {
      const io = socketHelper.getIO();
      if (io) {
        io.emit("newOrder", newOrder);
        if (stockUpdates.length) io.emit("productStockUpdate", stockUpdates);
      }
    } catch (e) {
      console.error("Socket emit error:", e.message || e);
    }

    res.status(201).json({
      success: true,
      order: newOrder,
      message: "Payment verified and order placed successfully",
    });
  } catch (error) {
    next(error);
  }
};
