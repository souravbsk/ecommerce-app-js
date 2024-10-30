const jwt = require("jsonwebtoken");
const config = require("../config/config");

/**
 * Generates an access token and a refresh token for a user.
 * @param {Object} user - The user object containing user details.
 * @param {string} user._id - The user's unique identifier.
 * @param {string} user.email - The user's email address.
 * @param {string} user.role - The user's role.
 * @returns {Object} An object containing the access token, refresh token, and their expiration times.
 */
const generateTokens = (user) => {
  if (!user || !user._id || !user.email || !user.role) {
    throw new Error("Invalid user object provided for token generation");
  }

  const accessTokenPayload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  // Short-lived access token (e.g., 15 minutes)
  const accessToken = jwt.sign(accessTokenPayload, config.jwtSecret, {
    expiresIn: "15m",
  });

  // Long-lived refresh token (e.g., 7 days)
  const refreshToken = jwt.sign({ id: user._id }, config.jwtRefreshSecret, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};


const verifyRefreshToken = (refreshToken) => {
  try {
    return jwt.verify(refreshToken, config.jwtRefreshSecret);
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};

/**
 * Verifies a JWT token.
 * @param {string} token - The JWT token to verify.
 * @param {string} secret - The secret key used for verification.
 * @returns {Object} The decoded token payload.
 */
const verifyJWT = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error("Invalid token");
  }
};

module.exports = {
  generateTokens,
  verifyJWT,
  verifyRefreshToken,
};
