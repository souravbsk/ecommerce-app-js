const jwt = require("jsonwebtoken");
const config = require("../config/config");

// Function to generate a JWT token
const generateJWT = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email, // Include email in the JWT payload
      roles: user.role, // Keep it as roles if you plan to extend to multiple roles
    },
    config.jwtSecret,
    {
      expiresIn: "20d", // Token expiration time
    }
  );
};

// Function to verify a JWT token
const verifyJWT = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    throw new Error("Invalid token");
  }
};

module.exports = {
  generateJWT,
  verifyJWT,
};
