// ============================================================
// middleware/errorMiddleware.js — Global Error Handler
// ============================================================
// Middleware functions run BETWEEN the request and response.
// This specific middleware is an "error handler" — it catches
// any errors that controllers pass via next(error).
//
// Express recognizes error-handling middleware by its 4 params:
//   (err, req, res, next) — the "err" as first param is key!
// ============================================================

// ── 404 Handler: Route Not Found ──────────────────────────
// This runs when no route matched the incoming request
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404);
  next(error); // pass to the error handler below
};

// ── Global Error Handler ──────────────────────────────────
// This catches ALL errors from anywhere in the app
const errorHandler = (err, req, res, next) => {
  // Sometimes Express sets the status to 200 even on errors
  // If that happens, default to 500 (Internal Server Error)
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Something went wrong on the server";

  // ── Handle specific Mongoose errors ──────────────────
  // Mongoose Validation Error (e.g., required field missing)
  if (err.name === "ValidationError") {
    statusCode = 400;
    // Extract all validation error messages into one readable string
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Duplicate key error (e.g., same email registered twice)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `A patient with this ${field} already exists`;
  }

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ID format: ${err.value}`;
  }

  // ── Send consistent error response ───────────────────
  res.status(statusCode).json({
    success: false,
    message,
    // Only show detailed stack trace in development mode
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = { notFound, errorHandler };
