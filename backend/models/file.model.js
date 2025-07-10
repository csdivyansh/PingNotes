import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  path: { type: String }, // Local path (optional if using Drive)
  mimetype: { type: String },
  size: { type: Number },
  drive_file_id: { type: String }, // Google Drive file ID
  drive_file_url: { type: String }, // Google Drive public link
  uploaded_by: { 
    type: mongoose.Schema.Types.ObjectId, 
    refPath: "uploaded_by_role",
    required: true 
  },
  uploaded_by_role: { 
    type: String, 
    enum: ["User", "Teacher"], 
    required: true 
  },
  linked_subject: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Subject",
    default: null
  },
  linked_topic: { 
    type: mongoose.Schema.Types.ObjectId, 
    default: null
  },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("File", fileSchema);
