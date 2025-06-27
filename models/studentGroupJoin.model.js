import mongoose from "mongoose";

const studentGroupJoinSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  group_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
});

export default mongoose.model("StudentGroupJoin", studentGroupJoinSchema);
