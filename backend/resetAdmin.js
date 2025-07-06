import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "./models/admin.model.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const resetPassword = async () => {
  const email = "sysadmin@pingnotes.com"; // change if needed
  const newPassword = "admin123"; // new plaintext password

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const admin = await Admin.findOneAndUpdate(
    { email },
    { password: hashedPassword },
    { new: true }
  );

  if (admin) {
    console.log(`✅ Password reset for ${email}`);
  } else {
    console.log(`❌ Admin not found with email: ${email}`);
  }

  mongoose.disconnect();
};

resetPassword();
