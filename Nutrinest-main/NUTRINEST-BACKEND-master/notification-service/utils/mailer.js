const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendResetEmail = async (email, resetUrl) => {
  try {
    const mailOptions = {
      from: `"NutriNest" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request - NutriNest",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">NutriNest</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Healthy Living, Happy Life</p>
          </div>
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 18px; margin-bottom: 20px;">Hello,</p>
            <p style="margin-bottom: 20px;">You requested a password reset for your NutriNest account.</p>
            <p style="margin-bottom: 20px;">Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="display: inline-block; background: #10B981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Reset Password
              </a>
            </div>
            <p style="margin-bottom: 20px;">This link is valid for 1 hour.</p>
            <p style="margin-bottom: 20px;">If you didn't request this password reset, please ignore this email.</p>
            <p style="margin-bottom: 20px;">Thank you for choosing NutriNest.</p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #6B7280; font-size: 12px;">
            <p>This is an automated email. Please do not reply.</p>
            <p>&copy; ${new Date().getFullYear()} NutriNest. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending reset email:", error);
    return false;
  }
};

module.exports = { sendResetEmail };
