import File from "../../models/file.model.js";

export const getAllFiles = async (req, res) => {
  const files = await File.find().populate("note_id");
  res.json(files);
};
