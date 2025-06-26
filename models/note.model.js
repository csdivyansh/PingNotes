import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  note_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  title: { type: String, required: true },
  description: { type: String },
  group_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Note", noteSchema);
