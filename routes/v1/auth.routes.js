const express = require("express");
const passport = require("passport");
const upload = require("multer")();

const {
  registerUser,
  loginUser,
  googleLoginCallback,
  logoutUser,
  checkAuth,
  forgotPassword,
  sendOtpToRegisteredUser,
  verifyRegisteredUserOtp,
  sendOtpToAnyUser,
  veriyAnyOtp,
  resetPassword,
} = require("../controllers/auth.controllers.js");
const { verifyJwt } = require("../middlewares/verifyJWT.js");
const { verifyAdmin } = require("../middlewares/verifyAdmin.js");

const auth = express.Router();

// User Registration & Login
auth.post("/register", registerUser);
auth.post("/login", loginUser);

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
auth.post("/logout", logoutUser);

// Check Authentication Status
auth.get("/checkAuth", verifyJwt, checkAuth);

// Password Management
auth.post("/forgot-password", forgotPassword);
auth.post("/reset-password", resetPassword);

// OTP Routes for Registered Users
auth.post("/registered/get-otp", sendOtpToRegisteredUser);
auth.post("/registered/verify-otp", verifyRegisteredUserOtp);

// OTP Routes for Any User (General Use)
auth.post("/get-otp", sendOtpToAnyUser);
auth.post("/verify-otp", veriyAnyOtp);

module.exports = {  auth };
