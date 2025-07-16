import Admin from "../../models/admin.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Note from "../../models/note.model.js";
import User from "../../models/user.model.js";
import Teacher from "../../models/teacher.model.js";
import Group from "../../models/group.model.js";
import Subject from "../../models/subject.model.js";
dotenv.config();

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const admin = await Admin.findOne({ email });

  if (!admin || admin.is_deleted || !admin.is_active) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await admin.matchPassword(password);
  console.log("Password Match?", isMatch);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: admin._id, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
    },
    message: "Login successful",
  });
};

export const getAllAdmins = async (req, res) => {
  const admins = await Admin.find();
  res.json(admins);
};

export const getAdminById = async (req, res) => {
  const { id } = req.params;
  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json(admin);
  } catch (error) {
    console.error("Error fetching admin:", error);
    res.status(500).json({ message: "Internal server error" });
  } 
}


export const createNewAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(409)
        .json({ message: "Admin with this email already exists" });
    }

    const admin = new Admin({ name, email, password });
    await admin.save();
    res.status(201).json(admin);
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const deleteAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    admin.is_deleted = true;
    admin.is_active = false;
    await admin.save();

    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (name) admin.name = name;
    if (email) admin.email = email;
    if (password) admin.password = password; // if hashing enabled, it will rehash via pre-save hook

    admin.updated_at = new Date();
    await admin.save();

    res.json({ message: "Admin updated successfully", admin });
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const [notes, users, teachers, groups, subjects, admins] = await Promise.all([
      Note.countDocuments(),
      User.countDocuments({ is_deleted: { $ne: true } }),
      Teacher.countDocuments({ is_deleted: { $ne: true } }),
      Group.countDocuments(),
      Subject.countDocuments(),
      Admin.countDocuments({ is_deleted: { $ne: true } })
    ]);
    res.json({
      notes,
      users,
      teachers,
      groups,
      subjects,
      admins
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};