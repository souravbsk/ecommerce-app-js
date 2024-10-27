// src/app.js
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { mediaRoutes } = require("./routes/v1/media.routes");
const setupSwagger = require("./swagger");
require("dotenv").config(); // Load environment variables from .env file
const app = express();
const path = require("path");
const config = require("./config/config");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const { auth } = require("./routes/v1/auth.routes");
const passport = require("./config/passportConfig");
// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // For parsing application/json
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.raw({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
  session({
    secret: config.ACCESS_TOKEN_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

console.log(config.ACCESS_TOKEN_SECRET)

app.use(passport.initialize());
app.use(passport.session());
  



// Connect to MongoDB
connectDB();
// Use the user routes

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

setupSwagger(app);
app.use("/api/v1/media", mediaRoutes);
app.use("/api/v1/auth", auth);

// Set up Swagger




// Global error handler
app.use((err, req, res, next) => {
  console.error(err); // Log the error (could be sent to an external service)
  
  // Respond with a 500 status and error message
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});




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
