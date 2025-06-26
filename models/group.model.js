import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  group_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
});

export default mongoose.model("Group", groupSchema);
