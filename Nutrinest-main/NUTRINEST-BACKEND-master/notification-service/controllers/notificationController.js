const { sendOTPEmail } = require("../services/emailService");
const { sendResetEmail } = require("../utils/mailer");
const twilio = require("../config/twilio");
const firebaseAdmin = require("../config/firebaseAdmin");

exports.sendOTP = async (req, res, next) => {
  try {
    const { email, phone, otp } = req.body;
    
    if (email) {
      const success = await sendOTPEmail(email, otp);
      if (success) {
        res.json({ message: "OTP sent successfully via email" });
      } else {
        res.status(500).json({ message: "Failed to send OTP email" });
      }
    } else if (phone && twilio) {
      try {
        await twilio.verify
          .services(process.env.TWILIO_VERIFY_SERVICE_SID)
          .verifications.create({ to: phone, channel: "sms" });
        res.json({ message: "OTP sent successfully via SMS" });
      } catch (error) {
        console.error("Twilio error:", error);
        res.status(500).json({ message: "Failed to send OTP SMS" });
      }
    } else {
      res.status(400).json({ message: "Email or phone required" });
    }
  } catch (err) {
    next(err);
  }
};

exports.verifyOTP = async (req, res, next) => {
  try {
    const { phone, code } = req.body;
    
    if (phone && twilio) {
      try {
        const verification = await twilio.verify
          .services(process.env.TWILIO_VERIFY_SERVICE_SID)
          .verificationChecks.create({ to: phone, code });
        
        if (verification.status === "approved") {
          res.json({ message: "OTP verified successfully" });
        } else {
          res.status(400).json({ message: "Invalid OTP" });
        }
      } catch (error) {
        console.error("Twilio verification error:", error);
        res.status(500).json({ message: "Failed to verify OTP" });
      }
    } else {
      res.status(400).json({ message: "Phone required for SMS verification" });
    }
  } catch (err) {
    next(err);
  }
};

exports.sendPasswordResetEmail = async (req, res, next) => {
  try {
    const { email, resetUrl } = req.body;
    
    const success = await sendResetEmail(email, resetUrl);
    if (success) {
      res.json({ message: "Password reset email sent successfully" });
    } else {
      res.status(500).json({ message: "Failed to send password reset email" });
    }
  } catch (err) {
    next(err);
  }
};

exports.sendPushNotification = async (req, res, next) => {
  try {
    const { token, title, body } = req.body;
    
    if (firebaseAdmin && token) {
      const message = {
        notification: {
          title: title,
          body: body,
        },
        token: token,
      };
      
      await firebaseAdmin.messaging().send(message);
      res.json({ message: "Push notification sent successfully" });
    } else {
      res.status(400).json({ message: "Firebase not initialized or token missing" });
    }
  } catch (err) {
    next(err);
  }
};
