const express = require("express");
const passport = require("passport");
const {
  registerUser,
  loginUser,
  logoutUser,
  googleLoginCallback,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
} = require("../../controllers/v1/auth.controllers.js");
const upload = require("multer")();
const authRouter = express.Router();

// const { verifyJwt } = require("../middlewares/verifyJWT.js");
// const { verifyAdmin } = require("../middlewares/verifyAdmin.js");

// User Registration & Login
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);

// Logout and Refresh Tokens
authRouter.post("/logout", logoutUser);
authRouter.post("/refresh-token", refreshTokens);

// Google OAuth
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
authRouter.get(
  "/google/callback",
  passport.authenticate("google"),
  googleLoginCallback
);

// auth.get("/checkAuth", verifyJwt, checkAuth);

// Password Management
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);

// Email Verification
authRouter.get("/verify-email", verifyEmail);

// // OTP Routes for Registered Users
// auth.post("/registered/get-otp", sendOtpToRegisteredUser);
// auth.post("/registered/verify-otp", verifyRegisteredUserOtp);

// OTP Routes for Any User (General Use)
// auth.post("/get-otp", sendOtpToAnyUser);
// auth.post("/verify-otp", veriyAnyOtp);

module.exports = { authRouter };
