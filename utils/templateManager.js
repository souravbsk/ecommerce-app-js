// utils/templateManager.js
const emailTemplates = require("./emailTemplates");

/**
 * Retrieves the HTML content for the specified email template.
 * @param {string} template - The name of the email template.
 * @param {Object} dynamicData - Data to be injected into the template.
 * @returns {string} - The HTML content for the email.
 * @throws Will throw an error if the template is invalid.
 */
const getTemplate = (template, dynamicData) => {
  let htmlContent = "";

  switch (template) {
    case "resetPassword":
      htmlContent = emailTemplates.resetPasswordTemplate(dynamicData.resetUrl);
      break;
    case "verifyEmail":
      htmlContent = emailTemplates.verificationEmailTemplate(
        dynamicData.verificationUrl
      );
      break;
    default:
      throw new Error("Invalid email template");
  }

  return htmlContent;
};

module.exports = { getTemplate };
