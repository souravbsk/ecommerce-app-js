const mongoose = require("mongoose");
const config = require("./config");
require("dotenv").config(); // Load environment variables from .env file


const connectDB = async () => {
  try {
    const connection = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 20000, // Wait 20s for initial connection
      connectTimeoutMS: 20000,         // Wait 20s for each connection attempt
      bufferCommands: false,           // Disable buffering for faster error detection
    });

    console.log(`Connected to MongoDB at host: ${connection.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
