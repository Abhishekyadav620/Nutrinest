require("dotenv").config();

/**
 * Proxy Configuration for API Gateway
 * 
 * This configuration defines how requests are routed to backend services.
 * Phase 9: All services now extracted and routed to their respective services
 * Auth: 5001, Product: 5002, Cart: 5003, Order: 5004, Payment: 5005, Review: 5006, Notification: 5007
 */

const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://localhost:5001";
const productServiceUrl = process.env.PRODUCT_SERVICE_URL || "http://localhost:5002";
const cartServiceUrl = process.env.CART_SERVICE_URL || "http://localhost:5003";
const orderServiceUrl = process.env.ORDER_SERVICE_URL || "http://localhost:5004";
const paymentServiceUrl = process.env.PAYMENT_SERVICE_URL || "http://localhost:5005";
const reviewServiceUrl = process.env.REVIEW_SERVICE_URL || "http://localhost:5006";
const notificationServiceUrl = process.env.NOTIFICATION_SERVICE_URL || "http://localhost:5007";

const proxyConfig = {
  // Auth Service Routes - Proxy to Auth Service
  "/api/auth": {
    target: authServiceUrl,
    changeOrigin: true,
    pathRewrite: {
      "^/api/auth": "/api/auth",
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[Gateway] Proxying ${req.method} ${req.path} to Auth Service`);
    },
    onError: (err, req, res) => {
      console.error(`[Gateway] Proxy Error for ${req.path}:`, err.message);
      res.status(500).json({
        error: "Proxy Error",
        message: "Failed to connect to Auth Service",
        details: err.message,
      });
    },
  },

  // Admin order routes — must be registered before /api/admin in the gateway
  "/api/admin/orders": {
    target: orderServiceUrl,
    changeOrigin: true,
    pathRewrite: {
      "^/api/admin/orders": "/api/admin/orders",
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[Gateway] Proxying ${req.method} ${req.path} to Order Service`);
    },
    onError: (err, req, res) => {
      console.error(`[Gateway] Proxy Error for ${req.path}:`, err.message);
      res.status(500).json({
        error: "Proxy Error",
        message: "Failed to connect to Order Service",
        details: err.message,
      });
    },
  },

  // Admin auth/profile routes — Auth Service
  "/api/admin": {
    target: authServiceUrl,
    changeOrigin: true,
    pathRewrite: {
      "^/api/admin": "/api/admin",
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[Gateway] Proxying ${req.method} ${req.path} to Auth Service`);
    },
    onError: (err, req, res) => {
      console.error(`[Gateway] Proxy Error for ${req.path}:`, err.message);
      res.status(500).json({
        error: "Proxy Error",
        message: "Failed to connect to Auth Service",
        details: err.message,
      });
    },
  },

  // Product Service Routes - Proxy to Product Service
  "/api/products": {
    target: productServiceUrl,
    changeOrigin: true,
    pathRewrite: {
      "^/api/products": "/api/products",
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[Gateway] Proxying ${req.method} ${req.path} to Product Service`);
    },
    onError: (err, req, res) => {
      console.error(`[Gateway] Proxy Error for ${req.path}:`, err.message);
      res.status(500).json({
        error: "Proxy Error",
        message: "Failed to connect to Product Service",
        details: err.message,
      });
    },
  },

  // Cart Service Routes - Proxy to Cart Service
  "/api/cart": {
    target: cartServiceUrl,
    changeOrigin: true,
    pathRewrite: {
      "^/api/cart": "/api/cart",
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[Gateway] Proxying ${req.method} ${req.path} to Cart Service`);
    },
    onError: (err, req, res) => {
      console.error(`[Gateway] Proxy Error for ${req.path}:`, err.message);
      res.status(500).json({
        error: "Proxy Error",
        message: "Failed to connect to Cart Service",
        details: err.message,
      });
    },
  },

  // Order Service Routes - Proxy to Order Service
  "/api/orders": {
    target: orderServiceUrl,
    changeOrigin: true,
    pathRewrite: {
      "^/api/orders": "/api/orders",
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[Gateway] Proxying ${req.method} ${req.path} to Order Service`);
    },
    onError: (err, req, res) => {
      console.error(`[Gateway] Proxy Error for ${req.path}:`, err.message);
      res.status(500).json({
        error: "Proxy Error",
        message: "Failed to connect to Order Service",
        details: err.message,
      });
    },
  },

  // Payment Service Routes - Proxy to Payment Service
  "/api/payment": {
    target: paymentServiceUrl,
    changeOrigin: true,
    pathRewrite: {
      "^/api/payment": "/api/payment",
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[Gateway] Proxying ${req.method} ${req.path} to Payment Service`);
    },
    onError: (err, req, res) => {
      console.error(`[Gateway] Proxy Error for ${req.path}:`, err.message);
      res.status(500).json({
        error: "Proxy Error",
        message: "Failed to connect to Payment Service",
        details: err.message,
      });
    },
  },

  // Review Service Routes - Proxy to Review Service
  "/api/reviews": {
    target: reviewServiceUrl,
    changeOrigin: true,
    pathRewrite: {
      "^/api/reviews": "/api/reviews",
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[Gateway] Proxying ${req.method} ${req.path} to Review Service`);
    },
    onError: (err, req, res) => {
      console.error(`[Gateway] Proxy Error for ${req.path}:`, err.message);
      res.status(500).json({
        error: "Proxy Error",
        message: "Failed to connect to Review Service",
        details: err.message,
      });
    },
  },

  // Notification Service Routes - Proxy to Notification Service
  "/api/notifications": {
    target: notificationServiceUrl,
    changeOrigin: true,
    pathRewrite: {
      "^/api/notifications": "/api/notifications",
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[Gateway] Proxying ${req.method} ${req.path} to Notification Service`);
    },
    onError: (err, req, res) => {
      console.error(`[Gateway] Proxy Error for ${req.path}:`, err.message);
      res.status(500).json({
        error: "Proxy Error",
        message: "Failed to connect to Notification Service",
        details: err.message,
      });
    },
  },
};

module.exports = proxyConfig;
