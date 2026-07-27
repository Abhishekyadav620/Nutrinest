const twilio = require("twilio");

const client = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

if (!client) {
  console.warn("Twilio not initialized - missing credentials");
}

module.exports = client;
