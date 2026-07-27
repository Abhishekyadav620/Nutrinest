const express = require("express");
const router = express.Router();
const { signup, login, googleLogin, forgotPassword, resetPassword, sendOTP, verifyOTP, resetPasswordWithOTP } = require("../controllers/authControllers");

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password-with-otp", resetPasswordWithOTP);
router.post("/create-admin-dev", require("../controllers/authControllers").createAdminDev);

module.exports = router;
