import TeacherGroupJoin from "../../models/teacherGroupJoin.model.js";

export const getAllTeacherGroupJoins = async (req, res) => {
  const joins = await TeacherGroupJoin.find()
    .populate("teacher_id")
    .populate("group_id");
  res.json(joins);
};
