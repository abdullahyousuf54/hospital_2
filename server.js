// ============================================================
// server.js — Application Entry Point
// ============================================================
// This is the HEART of the application. It:
//   1. Loads environment variables from .env
//   2. Creates the Express application
//   3. Connects to MongoDB
//   4. Sets up middleware (body parser, CORS, etc.)
//   5. Mounts API routes
//   6. Starts listening for requests on a port
// ============================================================

// Load .env variables FIRST — before anything else!
require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const patientRoutes = require("./routes/patientRoutes");
const authRoutes = require("./routes/authRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// ── Initialize Express App ────────────────────────────────
const app = express();

// ── Connect to MongoDB ────────────────────────────────────
connectDB();

// ── Global Middleware ─────────────────────────────────────
// These run on EVERY incoming request before routes handle them

// Parse incoming JSON request bodies
// Without this, req.body would be undefined
app.use(express.json());

// Parse URL-encoded form data (e.g., from HTML forms)
app.use(express.urlencoded({ extended: true }));

// Basic CORS headers (allows frontend apps to call this API)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// Request logger — logs every incoming request to the console
app.use((req, res, next) => {
  console.log(`📨 [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ── Health Check Route ────────────────────────────────────
// A simple route to verify the server is running
// Useful for deployment platforms like Render
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🏥 Hospital Patient Management API is running!",
    version: "1.0.0",
    endpoints: {
      patients: "/api/patients",
      search: "/api/patients/search?name=xyz OR ?disease=xyz",
      auth: "/auth",
    },
  });
});

// ── Mount API Routes ──────────────────────────────────────
// Auth routes are prefixed with /auth
app.use("/auth", authRoutes);

// All patient-related routes are prefixed with /api/patients
app.use("/api/patients", patientRoutes);

// ── Error Handling Middleware ─────────────────────────────
// These MUST come AFTER all routes
app.use(notFound);      // Handle 404 - route not found
app.use(errorHandler);  // Handle all other errors

// ── Start Server ──────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("============================================================");
  console.log("🏥  Hospital Patient Management System — Backend API");
  console.log("============================================================");
  console.log(`🚀 Server running in ${process.env.NODE_ENV || "development"} mode`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
  console.log(`📋 Patients API: http://localhost:${PORT}/api/patients`);
  console.log("============================================================");
});
