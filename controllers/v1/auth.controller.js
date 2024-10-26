const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { ObjectId } = require("mongodb");
const { users } = require("../models/userModel.js");
const { generateOtp, sendMail } = require("../utils/emailUtils.js");
const { generateJWT } = require("../services/jwtService.js");
require("dotenv").config();

const registerUser = async (req, res, next) => {
  try {
    const { email, password, displayName, role } = req.body;
    const username = email.split("@")[0];

    const existingUser = await users.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new users({
      email,
      username,
      password: hashedPassword,
      displayName,
      isEmailVerify: false,
      role,
      isBlocked: false,
    });
    
    await newUser.save();

    const token = generateJWT(newUser.email, newUser._id);
    res.status(201).json({ success: true, token });
  } catch (err) {
    next(err);
  }
};

// const loginUser = (req, res, next) => {
//   passport.authenticate("local", (err, user, info) => {
//     if (err) return next(err);
//     if (!user) {
//       return res.status(401).json({ success: false, message: info.message });
//     }
    
//     const token = generateJWT(user.email, user._id);
//     res.json({ success: true, token });
//   })(req, res, next);
// };

// const googleLoginCallback = async (req, res) => {
//   if (req.user) {
//     const user = req.user;
//     const token = generateJWT(user.email, user._id);

//     const isProduction = process.env.NODE_ENV === "production";
//     const cookieDomain = isProduction ? ".sabhyasha.com" : "localhost";

//     res.cookie("jwt-token", token, {
//       domain: cookieDomain,
//       path: "/",
//       httpOnly: true,
//       secure: isProduction,
//       sameSite: "Strict",
//     });

//     res.redirect(`${process.env.DOMAIN}/store`);
//   } else {
//     res.redirect(`${process.env.DOMAIN}/login`);
//   }
// };

// const logoutUser = (req, res) => {
//   req.logout((err) => {
//     if (err) return res.status(500).json({ success: false, message: "Logout failed" });

//     const isProduction = process.env.NODE_ENV === "production";
//     const cookieDomain = isProduction ? ".sabhyasha.com" : "localhost";

//     res.clearCookie("jwt-token", {
//       domain: cookieDomain,
//       path: "/",
//       httpOnly: true,
//       sameSite: "Strict",
//     });

//     res.status(200).json({ success: true, message: "Logged out successfully" });
//   });
// };

// Other functions like `forgotPassword`, `resetPassword`, etc., would follow similar patterns
module.exports = {
  registerUser,
  // loginUser,
  // googleLoginCallback,
  // logoutUser,
  // ...other functions
};
