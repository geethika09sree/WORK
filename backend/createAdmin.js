require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/User");

async function updateAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password || password.length < 12) {
      throw new Error("Check admin email and password.");
    }

    const admin = await User.findOne({ role: "Admin" });

    if (!admin) {
      throw new Error("No existing Admin account found.");
    }

    admin.email = email;
    admin.password = password;
    admin.role = "Admin";

    await admin.save();

    console.log("Admin credentials updated successfully!");
    console.log("Email:", email);

  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

updateAdmin();