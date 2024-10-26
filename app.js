// src/app.js
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { mediaRoutes } = require("./routes/v1/media.routes");
const setupSwagger = require("./swagger");
require("dotenv").config(); // Load environment variables from .env file
const app = express();
const path = require('path')


// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // For parsing application/json

// Connect to MongoDB
connectDB();
// Use the user routes

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



setupSwagger(app);
app.use("/api/v1/media", mediaRoutes);

// Set up Swagger

// Health check route
app.get("/test", (req, res) => {
  res.send("API test hellow fds is running...");
});
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

module.exports = app;
