const mongoose = require("mongoose");
const config = require("./config");
require("dotenv").config(); // Load environment variables from .env file

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit process with failure
  }

  try {
    mongoose
      .connect(config.mongoUri)
      .then((success) => {
        console.log(success.connection.host);
      })
      .catch((fail) => {
        console.error("MongoDB connection error:", error.message);
      });
  } catch (error) {
    console.log("failed to connect the DB");
  }
};

module.exports = connectDB;
