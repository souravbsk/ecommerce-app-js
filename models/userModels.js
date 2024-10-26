// src/models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (value) => validator.isEmail(value), // Use the validator library for email validation
      message: (props) => `${props.value} is not a valid email!`, // Custom error message
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 7, // Corrected to 'minlength' for consistency
    trim: true,
    validate: {
      validator: (value) => {
        // Check if password contains the word 'password'
        return !value.toLowerCase().includes("password");
      },
      message: () => 'Password mustn\'t contain the word "password"', // Custom error message
    },
  },
  phone: {
    type: String,
    unique: true,
    match: /^\+?[1-9]\d{1,14}$/, // International phone number format
    sparse: true, // Allows multiple documents with no phone
  },
  role: {
    type: String,
    enum: ["admin", "client"], // Only allows these roles
    default: "client",
  },
  address: {
    street: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    postalCode: {
      type: String,
      trim: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false, // For email verification
  },
  verificationToken: {
    type: String,
    sparse: true, // Allows multiple documents with no token
  },
  passwordResetToken: {
    type: String,
    sparse: true,
  },
  passwordResetExpires: {
    type: Date,
    sparse: true,
  },
  timestamps: true,
});

// Update timestamp before saving or updating
userSchema.pre(["save", "findOneAndUpdate"], function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("User", userSchema);
