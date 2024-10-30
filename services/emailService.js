// services/emailService.js
const crypto = require("crypto");
const { transporter } = require("../config/nodemailConfig");
const { getTemplate } = require("../utils/templateManager");

/**
 * Sends an email using the specified template and dynamic data.
 * @param {Object} params - Email parameters.
 * @param {string} params.to - Recipient email address.
 * @param {string} params.subject - Email subject.
 * @param {string} params.template - Template name for the email.
 * @param {Object} params.dynamicData - Dynamic data to be injected into the template.
 * @throws Will throw an error if sending the email fails.
 */
const sendEmail = async ({ to, subject, template, dynamicData }) => {
  try {
    const htmlContent = getTemplate(template, dynamicData);

    const mailOptions = {
      from: `"Support Team" <${process.env.SMTP_USER}>`, // Ensure your sender email is the same as your SMTP user
      to,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to} successfully!`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Propagate the error to the caller for handling
  }
};

// Send Verification Email
const sendVerificationEmail = async (user) => {
  const verificationToken = crypto.randomBytes(20).toString("hex");
  user.verificationToken = verificationToken;
  await user.save({ validateModifiedOnly: true }); // Save the user with the new verification token

  const verificationUrl = `${process.env.DOMAIN}/verify-email?token=${verificationToken}`; // Ensure DOMAIN is set in your env variables

  await sendEmail({
    to: user.email,
    subject: "Verify Your Email",
    template: "verifyEmail",
    dynamicData: { verificationUrl },
  });
  console.log('firstemail')
};

module.exports = { sendEmail, sendVerificationEmail };
