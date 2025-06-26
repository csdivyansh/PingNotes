import mongoose from "mongoose";

const studentGroupJoinSchema = new mongoose.Schema({
  student_group_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
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
