const express = require("express");
const router = express.Router();
const { sendOTP, verifyOTP, sendPasswordResetEmail, sendPushNotification } = require("../controllers/notificationController");

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/password-reset", sendPasswordResetEmail);
router.post("/push", sendPushNotification);

module.exports = router;
