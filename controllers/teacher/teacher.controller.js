import User from "../../models/user.model.js";

export const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};
