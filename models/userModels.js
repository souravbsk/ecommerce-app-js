// src/models/User.js

const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
    },
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

    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true, // Convert to lowercase
      validate: {
        validator: async function (value) {
          // Check if the username is already taken
          const existingUser = await this.constructor.findOne({
            username: value,
          });
          return !existingUser; // return true if no existing user found
        },
        message: (props) =>
          `The username "${props.value}" is already taken. Please choose another one.`,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => {
          // Check if the email is valid and only allow gmail or yahoo domains
          return (
            validator.isEmail(value) &&
            (value.endsWith("@gmail.com") || value.endsWith("@yahoo.com"))
          );
        },
        message: (props) =>
          `${props.value} is not a valid email! Only Gmail and Yahoo are allowed.`, // Custom error message
      },
    },
    country_code: {
      type: String,
      default: "+88", // Default country code for Bangladesh
    },
    password: {
      type: String,
      required: true,
      minlength: 8, // Minimum length set to 8
      trim: true,
      // validate: {
      //   validator: (value) => {
      //     const passwordRegex =
      //       /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z\d]{8,}$/;
      //     return passwordRegex.test(value); // Returns true if password is valid
      //   },
      //   message: () =>
      //     "Password must be at least 8 characters long, contain at least one lowercase letter, one number, and one special character.",
      // },
    },

    phone: {
      type: String,
      unique: true,
      match: /^\+?[1-9]\d{1,14}$/, // International phone number format
      sparse: true, // Allows multiple documents with no phone
    },
    role: {
      type: String,
      enum: ["admin", "editor", "subscriber"],
      default: "subscriber",
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

    last_LoginAt: {
      type: Date,
      default: Date.now,
    },
    isMobileVerified: {
      type: Boolean,
      default: false, // For Number verification
    },

    isEmailVerified: {
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
  },
  {
    timestamps: true,
  }
);

// Update timestamp before saving or updating
userSchema.pre(["save", "findOneAndUpdate"], function (next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = {
  User,
};
