require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const categoryRoutes = require("./routes/categoryRoutes");
const bookRoutes = require("./routes/bookRoutes");
const memberRoutes = require("./routes/memberRoutes");
const borrowRoutes = require("./routes/borrowRoutes");
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

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "📚 Library Management API is running!",
    version: "2.0.0",
    endpoints: {
      categories: "/api/categories",
      books: "/api/books",
      members: "/api/members",
      borrows: "/api/borrows",
    },
  });
});

app.use("/api/categories", categoryRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/borrows", borrowRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("============================================================");
  console.log("📚  Library Management System — Backend API");
  console.log("============================================================");
  console.log(`🚀 Server running in ${process.env.NODE_ENV || "development"} mode`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
  console.log("============================================================");
});
