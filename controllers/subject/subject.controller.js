import Subject from "../../models/subject.model.js";

export const getAllSubjects = async (req, res) => {
  const subjects = await Subject.find();
  res.json(subjects);
};
