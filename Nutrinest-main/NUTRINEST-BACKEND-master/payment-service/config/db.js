const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Payment Service: MongoDB connected");
  } catch (err) {
    console.error("Payment Service: MongoDB connection error:", err);
    process.exit(1);
  }
};
module.exports = connectDB;
