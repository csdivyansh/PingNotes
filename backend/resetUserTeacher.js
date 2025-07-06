import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/user.model.js";
import Teacher from "./models/teacher.model.js";

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

const resetPasswords = async () => {
  const hashedUserPassword = await bcrypt.hash("user123", 10);
  const hashedTeacherPassword = await bcrypt.hash("teach123", 10);

  await User.updateMany({}, { password: hashedUserPassword });
  console.log("✅ All user passwords reset to 'user123'");

  await Teacher.updateMany({}, { password: hashedTeacherPassword });
  console.log("✅ All teacher passwords reset to 'teach123'");

  mongoose.disconnect();
};

resetPasswords();
