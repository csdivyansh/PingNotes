import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  file_name: { type: String, required: true },
  file_type: { type: String, required: true },
  file_url: { type: String, required: true },
  note_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Note",
    required: true,
  },
  uploaded_at: { type: Date, default: Date.now },
});

export default mongoose.model("File", fileSchema);
