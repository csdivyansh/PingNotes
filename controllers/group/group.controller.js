import Group from "../../models/group.model.js";

export const getGroups = async (req, res) => {
  const groups = await Group.find();
  res.json(groups);
};

export const createGroup = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Group name is required" });
  }

  try {
    const group = new Group({ name });
    await group.save();
    res.status(201).json(group);
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ message: "Internal server error" });
  }
} 