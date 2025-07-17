import Group from "../../models/group.model.js";
import User from "../../models/user.model.js";

export const getGroups = async (req, res) => {
  const groups = await Group.find();
  res.json(groups);
};

export const createGroup = async (req, res) => {
  const { name, groupAdmin, members } = req.body;

  if (!name || !groupAdmin) {
    return res
      .status(400)
      .json({ message: "Group name and admin are required" });
  }

  try {
    const group = new Group({
      name,
      groupAdmin,
      members: members || [groupAdmin],
    });
    await group.save();
    res.status(201).json(group);
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Join group by email (admin only)
export const joinGroupByEmail = async (req, res) => {
  const { groupId, email } = req.body;
  const userId = req.user.id;
  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });
    if (group.groupAdmin.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Only group admin can add members" });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (group.members.includes(user._id)) {
      return res.status(400).json({ message: "User already in group" });
    }
    group.members.push(user._id);
    await group.save();
    res.json({ message: "User added to group", group });
  } catch (error) {
    console.error("Join group by email error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Remove member by email (admin only)
export const removeMemberByEmail = async (req, res) => {
  const { groupId, email } = req.body;
  const userId = req.user.id;
  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });
    if (group.groupAdmin.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Only group admin can remove members" });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    group.members = group.members.filter(
      (memberId) => memberId.toString() !== user._id.toString()
    );
    await group.save();
    res.json({ message: "User removed from group", group });
  } catch (error) {
    console.error("Remove member by email error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// List all groups a user belongs to
export const getUserGroups = async (req, res) => {
  try {
    console.log("getUserGroups: req.user =", req.user);
    const userId = req.user.id;
    const groups = await Group.find({ members: userId });
    console.log("getUserGroups: found groups =", groups);
    res.json(groups);
  } catch (error) {
    console.error("Get user groups error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// List all members of a group
export const getGroupMembers = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId).populate(
      "members",
      "name email"
    );
    if (!group) return res.status(404).json({ message: "Group not found" });
    res.json(group.members);
  } catch (error) {
    console.error("Get group members error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteGroup = async (req, res) => {
  const { groupId } = req.params;
  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });
    // Only admin can delete
    if (group.groupAdmin.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only group admin can delete the group" });
    }
    await group.deleteOne();
    res.json({ message: "Group deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete group" });
  }
};
