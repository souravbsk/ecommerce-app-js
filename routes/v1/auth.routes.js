const express = require("express");
const passport = require("passport");
const {
  registerUser,
  loginUser,
  logoutUser,
  googleLoginCallback,
} = require("../../controllers/v1/auth.controller");
const upload = require("multer")();
const auth = express.Router();

// const { verifyJwt } = require("../middlewares/verifyJWT.js");
// const { verifyAdmin } = require("../middlewares/verifyAdmin.js");

// User Registration & Login
auth.post("/register", registerUser);
auth.post("/login", loginUser);
auth.post("/logout", logoutUser);

// Google OAuth
auth.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
auth.get(
  "/google/callback",
  passport.authenticate("google"),
  googleLoginCallback
);

// Logout

// // Check Authentication Status
// auth.get("/checkAuth", verifyJwt, checkAuth);

// // Password Management
// auth.post("/forgot-password", forgotPassword);
// auth.post("/reset-password", resetPassword);

// // OTP Routes for Registered Users
// auth.post("/registered/get-otp", sendOtpToRegisteredUser);
// auth.post("/registered/verify-otp", verifyRegisteredUserOtp);

// OTP Routes for Any User (General Use)
// auth.post("/get-otp", sendOtpToAnyUser);
// auth.post("/verify-otp", veriyAnyOtp);

module.exports = { auth };
