const Order = require("../models/order");
const User = require("../models/user");
const mongoose = require("mongoose");
const axios = require("axios");
const socketHelper = require("../utils/socket");
const crypto = require("crypto");
const { sendOrderStatusEmail } = require("../services/orderEmailService");

exports.createOrder = async (req, res, next) => {
  try {
    const {
      paymentMethod,
      address,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    let items = [];
    let total = 0;
    
    if (
      req.body.items &&
      Array.isArray(req.body.items) &&
      req.body.items.length
    ) {
      // Direct order from frontend (guest/quick checkout)
      items = await Promise.all(
        req.body.items.map(async (it) => {
          // Get product from Product Service
          const productResponse = await axios.get(
            `${process.env.PRODUCT_SERVICE_URL || 'http://localhost:5002'}/api/products/${it.product}`
          ).catch(() => ({ data: null }));
          
          const prod = productResponse.data;
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
      // Get cart from Cart Service
      const cartResponse = await axios.get(
        `${process.env.CART_SERVICE_URL || 'http://localhost:5003'}/api/cart`,
        { headers: { Authorization: req.headers.authorization } }
      ).catch(() => ({ data: [] }));
      
      const cartItems = cartResponse.data;
      if (!cartItems || cartItems.length === 0)
        return res.status(400).json({ message: "Cart is empty" });
      
      items = cartItems.map((i) => {
        const price = i.product.price;
        total += price * i.quantity;
        return {
          product: i.product._id,
          quantity: i.quantity,
          priceAtPurchase: price,
        };
      });
    }

    // If RAZORPAY, verify payment (Payment Service would handle this in full microservices)
    if (paymentMethod === "RAZORPAY") {
      if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
        // Create Razorpay order via Payment Service
        const paymentResponse = await axios.post(
          `${process.env.PAYMENT_SERVICE_URL || 'http://localhost:5005'}/api/payment/create-order`,
          { amount: total, items }
        ).catch(() => ({ data: null }));
        
        if (paymentResponse.data) {
          return res.json({ razorpayOrder: paymentResponse.data.order, total });
        }
      } else {
        // Verify signature via Payment Service
        const verifyResponse = await axios.post(
          `${process.env.PAYMENT_SERVICE_URL || 'http://localhost:5005'}/api/payment/verify`,
          { razorpayPaymentId, razorpayOrderId, razorpaySignature }
        ).catch(() => ({ data: null }));
        
        if (!verifyResponse.data) {
          return res.status(400).json({ message: "Payment verification failed" });
        }
      }
    }

    // create order (allow guest orders when req.user is not set)
    const userId = req.user && req.user._id ? req.user._id : null;
    const newOrder = await Order.create({
      user: userId,
      items,
      address,
      paymentMethod,
      paymentResult:
        paymentMethod === "RAZORPAY"
          ? { razorpayPaymentId, razorpayOrderId }
          : {},
      totalAmount: total,
      status: ["RAZORPAY", "UPI", "CARD"].includes(paymentMethod) ? "paid" : "pending",
      deliveryStatus: "Order Placed",
    });

    // decrement product stock via Product Service
    try {
      await Promise.all(
        items.map(async (it) => {
          await axios.patch(
            `${process.env.PRODUCT_SERVICE_URL || 'http://localhost:5002'}/api/products/${it.product}/stock`,
            { quantity: -it.quantity }
          ).catch(() => {});
        })
      );
    } catch (e) {
      console.error("Error updating product stock:", e.message || e);
    }

    // clear cart via Cart Service if this was a logged-in user
    if (req.user && req.user._id) {
      await axios.delete(
        `${process.env.CART_SERVICE_URL || 'http://localhost:5003'}/api/cart`,
        { headers: { Authorization: req.headers.authorization } }
      ).catch(() => {});
    }

    // populate order for admin/frontend view
    try {
      await newOrder.populate("user", "name username email");
      const productIds = items.map(i => i.product);
      const productsResponse = await axios.post(
        `${process.env.PRODUCT_SERVICE_URL || 'http://localhost:5002'}/api/products/batch`,
        { ids: productIds }
      ).catch(() => ({ data: { products: [] } }));
      
      const productsMap = new Map(
        productsResponse.data.products.map(p => [p._id.toString(), p])
      );
      
      newOrder.items = newOrder.items.map(item => ({
        ...item.toObject(),
        product: productsMap.get(item.product.toString()) || null
      }));
    } catch (e) {
      // ignore populate errors
    }

    // emit real-time events
    try {
      const io = socketHelper.getIO();
      if (io) {
        io.emit("newOrder", newOrder);
      }
    } catch (e) {
      console.error("Socket emit error:", e.message || e);
    }

    res.status(201).json(newOrder);
  } catch (err) {
    next(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    
    // Populate product details from Product Service
    const allProductIds = orders.flatMap(order => order.items.map(item => item.product));
    const productsResponse = await axios.post(
      `${process.env.PRODUCT_SERVICE_URL || 'http://localhost:5002'}/api/products/batch`,
      { ids: allProductIds }
    ).catch(() => ({ data: { products: [] } }));
    
    const productsMap = new Map(
      productsResponse.data.products.map(p => [p._id.toString(), p])
    );
    
    const ordersWithProducts = orders.map(order => ({
      ...order.toObject(),
      items: order.items.map(item => ({
        ...item.toObject(),
        product: productsMap.get(item.product.toString()) || null
      }))
    }));
    
    return res.json(ordersWithProducts);
  } catch (err) {
    next(err);
  }
};

// Admin: get all orders
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name username email");
    
    // Populate product details
    const allProductIds = orders.flatMap(order => order.items.map(item => item.product));
    const productsResponse = await axios.post(
      `${process.env.PRODUCT_SERVICE_URL || 'http://localhost:5002'}/api/products/batch`,
      { ids: allProductIds }
    ).catch(() => ({ data: { products: [] } }));
    
    const productsMap = new Map(
      productsResponse.data.products.map(p => [p._id.toString(), p])
    );
    
    const ordersWithProducts = orders.map(order => ({
      ...order.toObject(),
      items: order.items.map(item => ({
        ...item.toObject(),
        product: productsMap.get(item.product.toString()) || null
      }))
    }));
    
    res.json(ordersWithProducts);
  } catch (err) {
    next(err);
  }
};

// Admin: Update order status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = ["Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Order ID format" });
    }

    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: `Order with ID ${req.params.id} not found in database.` });

    const oldStatus = order.deliveryStatus;
    order.deliveryStatus = status;
    await order.save();

    // Populate products for email
    const productIds = order.items.map(item => item.product);
    const productsResponse = await axios.post(
      `${process.env.PRODUCT_SERVICE_URL || 'http://localhost:5002'}/api/products/batch`,
      { ids: productIds }
    ).catch(() => ({ data: { products: [] } }));
    
    const productsMap = new Map(
      productsResponse.data.products.map(p => [p._id.toString(), p])
    );
    
    const itemsWithProducts = order.items.map(item => ({
      ...item.toObject(),
      product: productsMap.get(item.product.toString()) || null
    }));

    // Send email notification if status changed
    let emailRecipient = order.address?.email;
    if (order.user) {
      try {
        const userDoc = await User.findById(order.user._id || order.user);
        if (userDoc && userDoc.email) {
          emailRecipient = userDoc.email;
        }
      } catch (err) {
        console.error("Failed to fetch latest user email during status update:", err);
      }
    }

    console.log("[EMAIL_DEBUG] order.user:", order.user);
    console.log("[EMAIL_DEBUG] order.address:", order.address);
    console.log("[EMAIL_DEBUG] Resolved emailRecipient:", emailRecipient);

    if (oldStatus !== status && emailRecipient) {
      try {
        await sendOrderStatusEmail(emailRecipient, {
          orderId: order._id.toString().slice(-8),
          customerName: order.user?.name || order.address?.name || "Customer",
          totalAmount: order.totalAmount,
          currentStatus: status,
          items: itemsWithProducts,
        });
        console.log(`[EMAIL] Status update email sent successfully to ${emailRecipient}`);
      } catch (emailError) {
        console.error("Failed to send order status email:", emailError);
      }
    }

    res.json({ message: "Order status updated", order });
  } catch (err) {
    next(err);
  }
};

// Admin: Delete order
exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    await order.deleteOne();
    res.json({ message: "Order removed successfully" });
  } catch (err) {
    next(err);
  }
};
