import Teacher from "../../models/teacher.model.js";

export const getAllTeachers = async (req, res) => {
  const teachers = await Teacher.find();
  res.json(teachers);
};

export const createNewTeacher = async (req, res) => {
  const { name, email, subject } = req.body;

  if (!name || !email || !subject) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const teacher = new Teacher({ name, email, subject });
    await teacher.save();
    res.status(201).json(teacher);
  } catch (error) {
    console.error("Error creating teacher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTeacher = async (req, res) => {
  const { id } = req.params;
  const { name, email, subject } = req.body;

  if (!name || !email || !subject) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const teacher = await Teacher.findByIdAndUpdate(
      id,
      { name, email, subject },
      { new: true }
    );
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.json(teacher);
  } catch (error) {
    console.error("Error updating teacher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTeacher = async (req, res) => {
  const { id } = req.params;

  try {
    const teacher = await Teacher.findByIdAndDelete(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.json({ message: "Teacher deleted successfully" });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
