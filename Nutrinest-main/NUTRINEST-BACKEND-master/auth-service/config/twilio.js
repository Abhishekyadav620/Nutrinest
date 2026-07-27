const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

if (!accountSid || !authToken || !verifyServiceSid) {
  console.warn("WARNING: Twilio environment variables are missing from process.env! SMS verifications may fail.");
}

const twilioClient = twilio(accountSid, authToken);

module.exports = {
  twilioClient,
  verifyServiceSid,
};
