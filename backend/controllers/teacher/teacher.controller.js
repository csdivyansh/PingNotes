import Teacher from "../../models/teacher.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const loginTeacher = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const teacher = await Teacher.findOne({ email });

  if (!teacher || teacher.is_deleted || !teacher.is_active) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await teacher.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: teacher._id, role: "teacher" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    token,
    teacher: {
      id: teacher._id,
      name: teacher.name,
      email: teacher.email,
    },
    message: "Login successful",
  });
};

export const getAllTeachers = async (req, res) => {
  const teachers = await Teacher.find();
  res.json(teachers);
};

export const getTeacherById = async (req, res) => {
  const { id } = req.params;

  try {
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.json(teacher);
  } catch (error) {
    console.error("Error fetching teacher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const createNewTeacher = async (req, res) => {
  const { name, email, password, subject } = req.body;

  if (!name || !email || !password || !subject) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existing = await Teacher.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Teacher with this email already exists" });
    }

    const teacher = new Teacher({ name, email, password, subject });
    await teacher.save();
    res.status(201).json(teacher);
  } catch (error) {
    console.error("Error creating teacher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTeacher = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, subject } = req.body;

  try {
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    if (name) teacher.name = name;
    if (email) teacher.email = email;
    if (password) teacher.password = password;
    if (subject) teacher.subject = subject;

    teacher.updated_at = new Date();
    await teacher.save();

    res.json({ message: "Teacher updated successfully", teacher });
  } catch (error) {
    console.error("Error updating teacher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTeacher = async (req, res) => {
  const { id } = req.params;

  try {
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    teacher.is_deleted = true;
    teacher.is_active = false;
    await teacher.save();

    res.json({ message: "Teacher deleted successfully" });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
