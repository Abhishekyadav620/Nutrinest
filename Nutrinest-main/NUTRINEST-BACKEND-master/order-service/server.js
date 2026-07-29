require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const socketHelper = require("./utils/socket");

const orderRoutes = require("./routes/order");
const adminOrderRoutes = require("./routes/adminOrders");

const app = express();
connectDB();

const PORT = process.env.PORT || process.env.ORDER_SERVICE_PORT || 5004;
const http = require("http");
const server = http.createServer(app);

// initialize socket.io and attach to server
const io = socketHelper.init(server, {
  cors: { origin: "*" },
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

// Routes
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/orders", orderRoutes);

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "NutriNest Order Service",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Root Endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    message: "NutriNest Order Service",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      orders: "/api/orders/*",
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

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║          NutriNest Order Service Started                    ║
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
  console.log("SIGTERM signal received: closing Order Service");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing Order Service");
  process.exit(0);
});

module.exports = app;
