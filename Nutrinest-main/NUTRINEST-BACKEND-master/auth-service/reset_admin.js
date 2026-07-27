require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./models/admin");

const email = "admin123@gmail.com";
const password = "admin123";

const reset = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Auth Service: connected to MongoDB");

    await Admin.deleteMany({
      email: { $in: ["admin_123", "admin@nutrinest.com", email] },
    });

    await Admin.create({ email, password });
    console.log(`[RESET] Admin ready — email: ${email}, password: ${password}`);
  } catch (err) {
    console.error("[ERROR]", err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

reset();
