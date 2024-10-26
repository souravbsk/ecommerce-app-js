const jwt = require("jsonwebtoken");

const generateJWT = (email, userId) => {
  return jwt.sign(
    { email, id: userId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "20d" } // Token expires in 20 days
  );
};

module.exports = {
  generateJWT,
};
