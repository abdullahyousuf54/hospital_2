// ============================================================
// server.js — Application Entry Point
// ============================================================
require("dotenv").config();

const path = require("path");
const express = require("express");
const connectDB = require("./config/db");
const patientRoutes = require("./routes/patientRoutes");
const authRoutes = require("./routes/authRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use((req, res, next) => {
  console.log(`📨 [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API health check route
app.get("/api/health", (req, res) => {
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

// API routes
app.use("/auth", authRoutes);
app.use("/api/patients", patientRoutes);

app.use(express.static(path.join(__dirname, "client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("============================================================");
  console.log("🏥  Hospital Patient Management System — Backend + Frontend");
  console.log("============================================================");
  console.log(`🚀 Server running in ${process.env.NODE_ENV || "development"} mode`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`📋 Patients API: http://localhost:${PORT}/api/patients`);
  console.log("============================================================");
});
