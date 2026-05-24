import { isProduction } from "../config/env.js";

export function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    message: statusCode === 500 ? "Internal server error" : error.message,
    details: error.details,
    stack: isProduction ? undefined : error.stack
  });
}

export function routeNotFound(req, res) {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
}
