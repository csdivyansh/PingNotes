import Subject from "../../models/subject.model.js";

export const getAllSubjects = async (req, res) => {
  const subjects = await Subject.find();
  res.json(subjects);
};

export const createNewSubject = async (req, res) => {
  const { subject_name, subject_code } = req.body;

  if (!subject_name || !subject_code) {
    return res.status(400).json({ message: "Name and code are required" });
  }

  try {
    const newSubject = new Subject({ subject_name, subject_code });
    await newSubject.save();
    res.status(201).json(newSubject);
  } catch (error) {
    console.error("Error creating subject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};  