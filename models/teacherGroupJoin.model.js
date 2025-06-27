import mongoose from "mongoose";

const teacherGroupJoinSchema = new mongoose.Schema({
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  group_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
});

export default mongoose.model("TeacherGroupJoin", teacherGroupJoinSchema);
