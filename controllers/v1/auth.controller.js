const bcrypt = require("bcryptjs");
const { User } = require("../../models/userModels.js");
const { generateJWT } = require("../../services/jwtService.js");
const passport = require("passport");
const config = require("../../config/config.js");

const registerUser = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const username = email.split("@")[0];

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(firstName, lastName, email, hashedPassword);

    const newUser = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      username,
      password: hashedPassword,
    });

    await newUser.save();

    const token = generateJWT(newUser);
    const expiresIn = 1728000;

    res.status(201).json({
      success: true,
      token,
      expiresIn,
      user: {
        id: newUser._id, // Ensure you return the user's ID
        username: newUser.username,
        email: newUser.email,
        roles: [newUser.role], // Ensure role is included
      },
    });
  } catch (err) {
    next(err);
  }
};

const loginUser = (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ success: false, message: info.message });
    }

    // Assuming generateJWT is a function that takes the user object and generates a token
    const token = generateJWT(user);

    console.log(config.NODE_ENV);

    try {
      // Update last_LoginAt with the current date/time
      await User.findByIdAndUpdate(user._id, { last_LoginAt: new Date() });
      // Respond with the token and user details
      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          roles: [user.role],
        },
        expiresIn: 1728000, // Adjust token expiry time as needed (20 days here)
      });
    } catch (updateError) {
      console.error("Error updating last_LoginAt:", updateError);
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating login time.",
      });
    }
  })(req, res, next);
};

const googleLoginCallback = async (req, res) => {
  if (req.user) {
    const user = req.user;
    const token = generateJWT(user);

    // Clear the JWT cookie
    // const cookieDomain = config.COOKIE_DOMAIN;
    // const isProduction = config.NODE_ENV === "production";

    // res.cookie("jwt-token", token, {
    //   domain: cookieDomain,
    //   path: "/",
    //   httpOnly: true,
    //   sameSite: isProduction ? "Strict" : "Lax",
    //   secure: isProduction,
    // });

    // res.redirect(`${process.env.DOMAIN}/store`);
    res.json({
      success: true,
      token,
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        roles: [req.user.role],
      },
      expiresIn: 1728000, // 20 days in seconds
    });
  } else {
    res.redirect(`${process.env.DOMAIN}/login`);
  }
};

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
          return res.status(500).json({
            success: false,
            message: "Error destroying session.",
          });
        }

        // Clear the JWT cookie
        const cookieDomain = config.COOKIE_DOMAIN;
        const isProduction = config.NODE_ENV === "production";

        res.clearCookie("jwt-token", {
          domain: cookieDomain,
          path: "/",
          httpOnly: true,
          sameSite: isProduction ? "Strict" : "Lax",
          secure: isProduction,
        });

        return res.status(200).json({
          success: true,
          message: "Logged out successfully.",
        });
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

// Other functions like `forgotPassword`, `resetPassword`, etc., would follow similar patterns
module.exports = {
  registerUser,
  loginUser,
  googleLoginCallback,
  logoutUser,
  // ...other functions
};
