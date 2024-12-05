// src/app.js
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const setupSwagger = require("./swagger");
require("dotenv").config(); // Load environment variables from .env file
const app = express();
const path = require("path");
const config = require("./config/config");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const http = require("http");
const socketIo = require("socket.io");

const passport = require("./config/passportConfig");
const router = require("./routes");
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

app.use(passport.initialize());
app.use(passport.session());

//socket io setup

// Create an HTTP server
const server = http.createServer(app);

// Set up Socket.IO with the server
const io = socketIo(server);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Handle room joining
  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  // Broadcast message to a specific room
  socket.on("sendMessageToRoom", ({ room, message }) => {
    io.to(room).emit("message", { room, message });
    console.log(`Message sent to room ${room}: ${message}`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Connect to MongoDB
connectDB();
// Use the user routes

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

setupSwagger(app);
app.use("/api/v1", router);

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
  if (err) {
    res.status(400).json({ success: false, message: "Something went wrong!" });
  }
});

module.exports = app;
