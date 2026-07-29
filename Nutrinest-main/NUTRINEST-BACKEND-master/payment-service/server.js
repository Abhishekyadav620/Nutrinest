require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const paymentRoutes = require("./routes/payment");

const app = express();
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

// Routes
app.use("/api/payment", paymentRoutes);

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "NutriNest Payment Service",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Root Endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    message: "NutriNest Payment Service",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      payment: "/api/payment/*",
    },
  });
});

// Error Handler
app.use(errorHandler);

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

const PORT = process.env.PORT || process.env.PAYMENT_SERVICE_PORT || 5005;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║          NutriNest Payment Service Started                  ║
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
  console.log("SIGTERM signal received: closing Payment Service");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing Payment Service");
  process.exit(0);
});

module.exports = app;
