const nodemailer = require('nodemailer');
const config = require('../config/envConfig');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS,
    },
  });
};

// Email templates
const emailTemplates = {
  passwordReset: (userName, resetUrl) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2563EB; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Password Reset Request</h1>
        </div>
        <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Hello ${userName},</p>
          <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
            You have requested to reset your password. Please click the button below to reset your password:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}"
               style="background-color: #2563EB; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">
              Reset Password
            </a>
          </div>
          <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <p style="font-size: 14px; color: #92400e; margin: 0;">
              <strong>⚠️ Important:</strong> This link will expire in 1 hour for security reasons.
            </p>
          </div>
          <p style="font-size: 14px; color: #6b7280; margin-bottom: 20px;">
            If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">
            This is an automated email. Please do not reply to this message.
          </p>
        </div>
      </div>
    `
  }),

  userApproval: (userName, organizationName, email, password) => ({
    subject: `Your ${organizationName} account information`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #10B981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Welcome to ${organizationName}!</h1>
        </div>
        <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Hello ${userName},</p>
          <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
            Welcome to ${organizationName}! Your account has been approved and is ready to use.
          </p>
          <div style="background-color: #f3f4f6; border-radius: 6px; padding: 20px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #374151;">Your Account Details:</h3>
            <p style="margin: 5px 0; color: #374151;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0; color: #374151;"><strong>Password:</strong> ${password}</p>
          </div>
          <div style="background-color: #dbeafe; border: 1px solid #3b82f6; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <p style="font-size: 14px; color: #1e40af; margin: 0;">
              <strong>🔐 Security Note:</strong> Please change your password after first login for better security.
            </p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}"
               style="background-color: #2563EB; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Login to Your Account
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">
            This is an automated email. Please do not reply to this message.
          </p>
        </div>
      </div>
    `
  })
};

// Send email function
const sendEmail = async (to, templateName, templateData) => {
  try {
    const transporter = createTransporter();
    const template = emailTemplates[templateName];

    if (!template) {
      throw new Error(`Email template '${templateName}' not found`);
    }

    const emailContent = template(...templateData);

    const mailOptions = {
      from: config.EMAIL_USER,
      to,
      subject: emailContent.subject,
      html: emailContent.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

// Convenience functions for specific email types
const sendPasswordResetEmail = async (to, userName, resetUrl) => {
  return sendEmail(to, 'passwordReset', [userName, resetUrl]);
};

const sendUserApprovalEmail = async (to, userName, organizationName, email, password) => {
  return sendEmail(to, 'userApproval', [userName, organizationName, email, password]);
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendUserApprovalEmail,
  createTransporter
};
