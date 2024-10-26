// src/config/config.js

const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const config = {
  development: {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce",
    jwtSecret: process.env.JWT_SECRET || "dev_secret_key",
    email: {
      service: process.env.EMAIL_SERVICE || "gmail",
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    paymentGatewayApiKey: process.env.PAYMENT_GATEWAY_API_KEY,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    BASE_URL: process.env.BASE_URL || "http://localhost:5000",
  },
  production: {
    port: process.env.PORT || 80,
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    email: {
      service: process.env.EMAIL_SERVICE,
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    paymentGatewayApiKey: process.env.PAYMENT_GATEWAY_API_KEY,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    BASE_URL: process.env.BASE_URL,
  },
};

// Get the current environment
const currentEnv = process.env.NODE_ENV || "development";

// Export the configuration for the current environment
module.exports = config[currentEnv];
