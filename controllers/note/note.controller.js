import Note from "../../models/note.model.js";

export const getAllNotes = async (req, res) => {
  const notes = await Note.find().populate("group_id").populate("teacher_id");
  res.json(notes);
};
