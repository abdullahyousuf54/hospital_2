// ============================================================
// config/db.js — MongoDB Database Connection
// ============================================================
// This file connects our Express app to MongoDB using Mongoose.
// Think of Mongoose as a "translator" between our JS code and
// the MongoDB database — it lets us use JavaScript objects
// instead of raw MongoDB queries.
// ============================================================

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // mongoose.connect() returns a promise, so we await it
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected Successfully!");
    console.log(`📦 Host: ${conn.connection.host}`);
    console.log(`🗄️  Database: ${conn.connection.name}`);
  } catch (error) {
    // If connection fails, log the error and exit the process
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    console.error("👉 Check your MONGO_URI in the .env file");
    process.exit(1); // Exit with failure code 1
  }
};

module.exports = connectDB;
