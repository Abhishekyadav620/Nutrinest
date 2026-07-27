const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const addressSchema = new mongoose.Schema({
  name: String,
  line1: String,
  line2: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,
  phone: String,
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  username: { type: String, required: true, unique: true, trim: true },
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String },
  phone: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  firebaseUid: { type: String, unique: true, sparse: true },
  authProvider: { type: String, enum: ["password", "google", "phone"], default: "password" },
  avatar: { type: String, trim: true },
  addresses: [addressSchema],
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  resetOtp: String,
  resetOtpExpires: Date,
  createdAt: { type: Date, default: Date.now },
});

// hash password before save
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("User", userSchema);
