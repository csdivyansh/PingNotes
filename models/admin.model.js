import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  admin_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  is_active: { type: Boolean, default: true },
  is_deleted: { type: Boolean, default: false },
});

export default mongoose.model("Admin", adminSchema);