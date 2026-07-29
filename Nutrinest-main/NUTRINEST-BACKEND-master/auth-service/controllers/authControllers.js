const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/user");
const Admin = require("../models/admin");
const { sendResetEmail } = require("../utils/mailer");
const { sendOTPEmail } = require("../services/emailService");
const getFirebaseAuth = require("../config/firebaseAdmin");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, name: user.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

exports.signup = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;
    const exist = await User.findOne({ $or: [{ email }, { username }] });
    if (exist)
      return res
        .status(400)
        .json({ message: "Username or email already in use" });
    const user = await User.create({ name, username, email, password });
    const token = generateToken(user);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server Error: " + err.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // 1. Try finding as User
    let user = await User.findOne({ username });

    // If not found by username, maybe they entered email? (Optional enhancement for User)
    if (!user) {
      user = await User.findOne({ email: username });
    }

    if (user) {
      const isMatch = await user.matchPassword(password);
      if (isMatch) {
        const token = generateToken(user);
        return res.json({
          token,
          role: "user",
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: "user",
          },
        });
      }
    }

    // 2. If User not found or password failed, Try finding as Admin
    // Admin login is typically email based, so we treat 'username' input as email
    const admin = await Admin.findOne({ email: username });
    if (admin) {
      const isMatch = await admin.matchPassword(password);
      if (isMatch) {
        // Generate token (reuse generateToken or create specific admin token)
        // For now reusing generateToken provided it handles the payload correctly

        const token = jwt.sign(
          { id: admin._id, role: "admin", email: admin.email },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );

        return res.json({
          token,
          role: "admin",
          user: { id: admin._id, email: admin.email, role: "admin" },
        });
      }
    }

    return res.status(401).json({ message: "Invalid credentials" });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server Error: " + err.message });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: "Google ID token is required" });

    const firebaseAuth = getFirebaseAuth();
    const decodedToken = await firebaseAuth.verifyIdToken(idToken);
    const email = decodedToken.email?.toLowerCase();
    const picture = decodedToken.picture || "";

    if (!email || !decodedToken.email_verified) {
      return res.status(400).json({ message: "A verified Google email address is required" });
    }

    let user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!user) user = await User.findOne({ email });

    if (user?.firebaseUid && user.firebaseUid !== decodedToken.uid) {
      return res.status(409).json({
        message: "This email is already linked to a different Google account.",
      });
    }

    if (!user) {
      user = await User.create({
        name: decodedToken.name || email.split("@")[0],
        username: `google_${decodedToken.uid.slice(0, 18)}`,
        email,
        password: crypto.randomBytes(32).toString("hex"),
        firebaseUid: decodedToken.uid,
        authProvider: "google",
        avatar: picture,
      });
    } else if (!user.firebaseUid) {
      // A verified Google email may safely be linked to an existing account.
      user.firebaseUid = decodedToken.uid;
      if (!user.name && decodedToken.name) user.name = decodedToken.name;
      if (!user.avatar && picture) user.avatar = picture;
      await user.save();
    }

    const token = generateToken(user);
    return res.json({
      token,
      role: "user",
      user: { id: user._id, name: user.name, username: user.username, email: user.email, avatar: user.avatar, role: "user" },
    });
  } catch (err) {
    console.error("Google login error:", err.message);
    const isConfigurationError = err.message.includes("Firebase Admin is not configured");
    if (isConfigurationError) {
      return res.status(503).json({ message: "Google sign-in is not configured on the server." });
    }
    if (["auth/id-token-expired", "auth/id-token-revoked"].includes(err.code)) {
      return res.status(401).json({ message: "Your Google session expired. Please sign in again." });
    }
    if (["auth/argument-error", "auth/invalid-id-token"].includes(err.code)) {
      return res.status(401).json({ message: "Invalid Google sign-in token." });
    }
    return res.status(401).json({ message: "Google sign-in could not be verified. Please try again." });
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      // respond success to avoid email enumeration
      return res.json({
        message: "If that email exists, a reset link has been sent.",
      });
    }
    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await sendResetEmail(user.email, resetUrl);
    res.json({ message: "If that email exists, a reset link has been sent." });
  } catch (err) {
    next(err);
  }
};

// OTP-based password reset or Twilio Verify SMS sending
exports.sendOTP = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (phone) {
      const { twilioClient, verifyServiceSid } = require("../config/twilio");
      if (!twilioClient) {
        return res.status(503).json({ message: "Twilio SMS service is not configured on the server." });
      }
      const cleanPhone = phone.replace(/\s+/g, "");
      
      await twilioClient.verify.v2
        .services(verifyServiceSid)
        .verifications.create({ to: cleanPhone, channel: "sms" });

      return res.json({
        success: true,
        message: "OTP sent successfully"
      });
    }

    if (!email) {
      return res.status(400).json({ message: "Please provide either an email or phone number" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.resetOtp = otp;
    user.resetOtpExpires = otpExpiry;
    await user.save();

    // Send OTP email
    await sendOTPEmail(email, otp);

    res.json({ message: "OTP sent successfully to your email" });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ message: err.message || "Failed to send OTP" });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp, phone } = req.body;

    if (phone) {
      const { twilioClient, verifyServiceSid } = require("../config/twilio");
      if (!twilioClient) {
        return res.status(503).json({ message: "Twilio SMS service is not configured on the server." });
      }
      const cleanPhone = phone.replace(/\s+/g, "");

      const verificationCheck = await twilioClient.verify.v2
        .services(verifyServiceSid)
        .verificationChecks.create({ to: cleanPhone, code: otp });

      if (verificationCheck.status !== "approved") {
        return res.status(400).json({ success: false, message: "Invalid OTP" });
      }

      // Check if user exists in database
      let user = await User.findOne({ phone: cleanPhone });

      if (!user) {
        // Auto-register a new user
        const phoneDigits = cleanPhone.replace(/\D/g, "");
        const suffix = phoneDigits.slice(-4) || "User";
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        
        user = await User.create({
          name: "User",
          username: `phone_${suffix}_${randomNum}`,
          phone: cleanPhone,
          authProvider: "phone",
        });
      }

      const token = generateToken(user);
      return res.json({
        success: true,
        token,
        role: user.role || "user",
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          phone: user.phone,
          email: user.email,
          avatar: user.avatar,
          role: user.role || "user",
        },
      });
    }

    if (!email) {
      return res.status(400).json({ message: "Please provide either an email or phone number" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.resetOtp || !user.resetOtpExpires) {
      return res.status(400).json({ message: "No OTP request found. Please request a new OTP." });
    }

    if (user.resetOtpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP has expired. Please request a new OTP." });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP is valid
    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: err.message || "Failed to verify OTP" });
  }
};

exports.resetPasswordWithOTP = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.resetOtp || !user.resetOtpExpires) {
      return res.status(400).json({ message: "No OTP request found. Please request a new OTP." });
    }

    if (user.resetOtpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP has expired. Please request a new OTP." });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Update password
    user.password = newPassword;
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Failed to reset password" });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const hashed = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).json({ message: "Token invalid or expired" });
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: "Password reset successful" });
  } catch (err) {
    next(err);
  }
};

exports.createAdminDev = async (req, res) => {
  try {
    const email = "admin123@gmail.com";
    const password = "admin123";

    // Remove existing
    await Admin.deleteOne({ email });

    // Create new
    const admin = await Admin.create({ email, password });
    res.json({ message: "Admin created successfully", admin });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
