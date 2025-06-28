import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  subject_name: { type: String, required: true },
  subject_code: { type: String, required: true },
});

export default mongoose.model("Subject", subjectSchema);
