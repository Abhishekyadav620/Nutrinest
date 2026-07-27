require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { createProxyMiddleware } = require("http-proxy-middleware");
const proxyConfig = require("./config/proxy.config");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./middleware/logger");

const app = express();
const PORT = process.env.GATEWAY_PORT || 5000;

// Security Middleware
app.use(helmet());

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Do NOT parse JSON/urlencoded bodies on the gateway — it breaks POST proxying.
// http-proxy-middleware needs the raw request stream to forward to backend services.

// Request Logging
app.use(logger);

// Health Check Endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "NutriNest API Gateway",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Root Endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    message: "NutriNest API Gateway",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      api: "/api/*",
    },
  });
});

// Proxy Routes Configuration — longest/most-specific paths first
const proxyRoutes = Object.keys(proxyConfig).sort((a, b) => b.length - a.length);
proxyRoutes.forEach((route) => {
  const config = proxyConfig[route];
  app.use(route, createProxyMiddleware(config));
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: "Route not found",
      path: req.path,
    },
  });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║          NutriNest API Gateway Started                     ║
║                                                            ║
║          Port: ${PORT}                                     
║          Environment: ${process.env.NODE_ENV || "development"}                    
║          Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}       
║                                                            ║
║          Health Check: http://localhost:${PORT}/health      
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

// Graceful Shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  process.exit(0);
});

module.exports = app;
