import mongoose from "mongoose";

export const topicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  files: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "File" // References files from File collection
  }],
  created_at: { type: Date, default: Date.now }
});

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject_code: { type: String, unique: true, sparse: true },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "created_by_role",
    required: true
  },
  created_by_role: {
    type: String,
    enum: ["User", "Teacher"],
    required: true
  },
  topics: [topicSchema], // Each topic now supports linked files
  created_at: { type: Date, default: Date.now }
});

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;
