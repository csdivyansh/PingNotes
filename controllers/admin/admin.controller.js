import Admin from "../../models/admin.model.js";

export const getAllAdmins = async (req, res) => {
  const admins = await Admin.find();
  res.json(admins);
};
