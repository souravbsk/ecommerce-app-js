// utils/emailTemplates.js

/**
 * Generates the HTML content for the password reset email.
 * @param {string} resetUrl - The URL for the password reset.
 * @returns {string} - The HTML content for the email.
 */
const resetPasswordTemplate = (resetUrl) => `
  <h1>Password Reset Request</h1>
  <p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>
`;

/**
 * Generates the HTML content for the email verification email.
 * @param {string} verificationUrl - The URL for email verification.
 * @returns {string} - The HTML content for the email.
 */
const verificationEmailTemplate = (verificationUrl) => `
  <h1>Email Verification</h1>
  <p>Please verify your email address by clicking <a href="${verificationUrl}">here</a>.</p>
`;

// Export the templates
module.exports = {
  resetPasswordTemplate,
  verificationEmailTemplate,
};
