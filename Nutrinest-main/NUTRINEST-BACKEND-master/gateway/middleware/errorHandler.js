/**
 * Global Error Handler Middleware for API Gateway
 * 
 * Catches and formats errors consistently across the gateway.
 * Handles proxy errors and application errors.
 */

const errorHandler = (err, req, res, next) => {
  console.error("[Gateway Error]", err);

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
};

module.exports = errorHandler;
