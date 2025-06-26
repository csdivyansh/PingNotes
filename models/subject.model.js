import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  subject_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  subject_name: { type: String, required: true },
});

export default mongoose.model("Subject", subjectSchema);
