/**
 * Request Logger Middleware
 * 
 * Logs incoming requests with relevant details for debugging and monitoring.
 * Uses Morgan for HTTP request logging.
 */

const morgan = require("morgan");

// Custom token for request duration
morgan.token("duration", (req, res) => {
  const duration = res.get("X-Response-Time");
  return duration ? `${duration}ms` : "-";
});

// Custom format for logging
const logFormat = process.env.LOG_LEVEL === "production"
  ? "combined"
  : ":method :url :status :res[content-length] - :response-time ms";

const logger = morgan(logFormat);

module.exports = logger;
