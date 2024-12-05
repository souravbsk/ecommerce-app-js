const bcrypt = require("bcryptjs");
const { User } = require("../../models/userModels.js");
const {
  generateTokens,
  verifyRefreshToken,
} = require("../../services/jwtService.js");
const passport = require("passport");
const config = require("../../config/config.js");
const {
  sendEmail,
  sendVerificationEmail,
} = require("../../services/emailService.js");
const crypto = require("crypto");
const registerUser = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    console.log(password);
    // Validate password
    // if (!passwordValidator(password)) {
    //   return res.status(400).json({
    //     success: false,
    //     message:
    //       "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number.",
    //   });
    // }

    const username = email.split("@")[0];

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(firstName, lastName, email, hashedPassword);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      username,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(newUser);

    // Store refreshToken in httpOnly cookie
    res.cookie("refresh-token", refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send access token in the response
    res.status(201).json({
      success: true,
      accessToken,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        roles: [newUser.role],
      },
    });
  } catch (err) {
    next(err);
  }
};

//login user
const loginUser = (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ success: false, message: info.message });
    }

    // Assuming generateJWT is a function that takes the user object and generates a token

    console.log(config.NODE_ENV);

    try {
      // Update last_LoginAt with the current date/time
      await User.findByIdAndUpdate(user._id, { last_LoginAt: new Date() });

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(user);

      // Store refreshToken in httpOnly cookie
      res.cookie("refresh-token", refreshToken, {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        accessToken,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          roles: [user.role],
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred during login.",
      });
    }
  })(req, res, next);
};

const googleLoginCallback = async (req, res) => {
  if (req.user) {
    const user = req.user;
    console.log(user, "");
    // Generate tokens for the user
    const { accessToken, refreshToken } = generateTokens(user);

    // Define the domain and secure flag for the cookie based on environment
    const cookieDomain = config.COOKIE_DOMAIN;
    const isProduction = config.NODE_ENV === "production";

    // Store the refresh token in a httpOnly cookie
    res.cookie("refresh-token", refreshToken, {
      domain: cookieDomain,
      path: "/",
      httpOnly: true,
      sameSite: isProduction ? "Strict" : "Lax",
      secure: isProduction,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Redirect or respond based on the environment
    const redirectUrl = isProduction
      ? `${process.env.DOMAIN}/store`
      : `http://localhost:5173/?token=${accessToken}`;

    res.redirect(redirectUrl);
  } else {
    // Redirect to login if authentication fails
    res.redirect(`${process.env.DOMAIN}/login`);
  }
};

// Refresh tokens
const refreshTokens = (req, res, next) => {
  try {
    const refreshToken = req.cookies["refresh-token"];

    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "No refresh token provided" });
    }

    const decoded = verifyJWT(refreshToken, config.jwtRefreshSecret);

    // Find the user associated with the refresh token
    const user = User.findById(decoded.id);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid refresh token" });
    }

    // Generate new access and refresh tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    // Update the refresh token in the cookie
    res.cookie("refresh-token", newRefreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Failed to refresh tokens" });
  }
};

// User Logout
const logoutUser = (req, res) => {
  try {
    req.logout((err) => {
      if (err) {
        console.error("Error during logout:", err);
        return res.status(500).json({
          success: false,
          message: "Logout failed. Please try again later.",
        });
      }

      // Destroy the session
      req.session.destroy((sessionErr) => {
        if (sessionErr) {
          console.error("Error destroying session:", sessionErr);
          return res
            .status(500)
            .json({ success: false, message: "Error destroying session." });
        }

        res.clearCookie("refresh-token", {
          httpOnly: true,
          secure: config.NODE_ENV === "production",
          sameSite: "Strict",
        });

        return res
          .status(200)
          .json({ success: true, message: "Logged out successfully." });
      });
    });
  } catch (error) {
    console.error("Unexpected error during logout:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred during logout.",
    });
  }
};

// Forgot Password - Send Password Reset Link
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    // Use findOneAndUpdate to update user in one operation
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetUrl = `${config.DOMAIN}/reset-password?token=${resetToken}`;

    const user = await User.findOneAndUpdate(
      { email },
      {
        passwordResetToken: resetToken,
        passwordResetExpires: Date.now() + 3600000, // 1 hour expiration
        updatedAt: Date.now(), // Update the timestamp
      },
      { new: true, runValidators: true } // Returns the updated document
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Send email with reset link
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      template: "resetPassword",
      dynamicData: { resetUrl },
    });

    res.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.error("Error in forgotPassword function:", error);
    next(error); // Pass error to the error-handling middleware
  }
};

// Reset Password
const resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;
  console.log("first2");

  try {
    // Find the user with the reset token and check expiration
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }, // Check if token is still valid
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    // Hash the new password
    user.password = await bcrypt.hash(newPassword, 10);

    // Clear the reset token and expiration
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // Save the updated user document
    await user.save({ validateModifiedOnly: true }); // Optional: Only validate modified fields

    res
      .status(200)
      .json({ success: true, message: "Password has been reset successfully" });
  } catch (error) {
    next(error);
  }
};

// Verify Email
const verifyEmail = async (req, res, next) => {
  const { token } = req.query;
  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }

    user.isEmailVerified = true;
    user.verificationToken = undefined; // Clear the token
    await user.save({ validateModifiedOnly: true });

    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    next(error);
  }
};

// Other functions like `forgotPassword`, `resetPassword`, etc., would follow similar patterns
module.exports = {
  registerUser,
  loginUser,
  googleLoginCallback,
  logoutUser,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  // ...other functions
};
