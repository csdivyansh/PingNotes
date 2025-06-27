import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

export default mongoose.model("Group", groupSchema);
