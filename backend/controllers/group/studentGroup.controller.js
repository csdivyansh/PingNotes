import StudentGroupJoin from "../../models/studentGroupJoin.model.js";

export const getAllStudentGroupJoins = async (req, res) => {
  const joins = await StudentGroupJoin.find()
    .populate("user_id")
    .populate("group_id");
  res.json(joins);
};
