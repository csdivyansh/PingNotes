import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";
import Teacher from "./models/teacher.model.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const users = [
  { name: "Alice Sharma", email: "alice@gla.edu", password: "pass123" },
  { name: "Ravi Patel", email: "ravi@gla.edu", password: "pass123" },
  { name: "Karan Mehta", email: "karan@gla.edu", password: "pass123" },
  { name: "Divya Chauhan", email: "divya@gla.edu", password: "pass123" },
  { name: "Mehul Sinha", email: "mehul@gla.edu", password: "pass123" },
  { name: "Tanvi Gupta", email: "tanvi@gla.edu", password: "pass123" },
  { name: "Ankit Yadav", email: "ankit@gla.edu", password: "pass123" },
  { name: "Pooja Nair", email: "pooja@gla.edu", password: "pass123" },
  { name: "Vikas Tiwari", email: "vikas@gla.edu", password: "pass123" },
  { name: "Sneha Rathi", email: "sneha@gla.edu", password: "pass123" },
];

const teachers = [
  {
    name: "Dr. Neha Singh",
    email: "neha@gla.edu",
    password: "pass123",
    department: "Physics",
  },
  {
    name: "Mr. Aman Joshi",
    email: "aman@gla.edu",
    password: "pass123",
    department: "Maths",
  },
  {
    name: "Mrs. Renu Verma",
    email: "renu@gla.edu",
    password: "pass123",
    department: "Chemistry",
  },
  {
    name: "Dr. Suresh Rana",
    email: "suresh@gla.edu",
    password: "pass123",
    department: "Biology",
  },
  {
    name: "Ms. Priya Desai",
    email: "priya@gla.edu",
    password: "pass123",
    department: "English",
  },
];

try {
  await User.deleteMany({});
  await Teacher.deleteMany({});

  const insertedUsers = [];
  for (const u of users) {
    const user = new User(u);
    await user.save();
    insertedUsers.push(user);
  }

  const insertedTeachers = [];
  for (const t of teachers) {
    const teacher = new Teacher({
      name: t.name,
      email: t.email,
      password: t.password,
      department: t.department, // assuming your schema uses `subject`
    });
    await teacher.save();
    insertedTeachers.push(teacher);
  }


  console.log("✔️ Users inserted:", insertedUsers.length);
  console.log("✔️ Teachers inserted:", insertedTeachers.length);
} catch (err) {
  console.error("❌ Seeding failed:", err);
} finally {
  await mongoose.disconnect();
}
