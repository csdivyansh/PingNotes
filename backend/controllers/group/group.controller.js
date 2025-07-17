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
    if (!group) {
      console.error(`[joinGroupByEmail] Group not found: groupId=${groupId}`);
      return res.status(404).json({
        message: "Group not found",
        detail: `No group with id ${groupId}`,
      });
    }
    if (String(group.groupAdmin) !== String(userId)) {
      console.error(
        `[joinGroupByEmail] Admin check failed: groupAdmin=${group.groupAdmin}, userId=${userId}`
      );
      return res.status(403).json({
        message: "Only group admin can add members",
        detail: `You are not the admin. groupAdmin=${group.groupAdmin}, yourId=${userId}`,
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`[joinGroupByEmail] User not found: email=${email}`);
      return res.status(404).json({
        message: "User not found",
        detail: `No user with email ${email}`,
      });
    }
    if (group.members.map((id) => String(id)).includes(String(user._id))) {
      console.error(
        `[joinGroupByEmail] User already in group: userId=${user._id}, groupId=${groupId}`
      );
      return res.status(400).json({
        message: "User already in group",
        detail: `User ${email} is already a member.`,
      });
    }
    group.members.push(user._id);
    await group.save();
    res.json({ message: "User added to group", group });
  } catch (error) {
    console.error("Join group by email error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", detail: error.message });
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
    // console.log("getUserGroups: req.user =", req.user);
    const userId = req.user.id;
    const groups = await Group.find({ members: userId });
    // console.log("getUserGroups: found groups =", groups);
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

// Send a message (with optional file) to a group
export const sendGroupMessage = async (req, res) => {
  const { groupId } = req.params;
  const { text, fileId } = req.body;
  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });
    if (!group.members.includes(req.user.id)) {
      return res
        .status(403)
        .json({ message: "You are not a member of this group" });
    }
    const message = {
      sender: req.user.id,
      text: text || "",
      file: fileId || null,
      timestamp: new Date(),
    };
    group.messages.push(message);
    await group.save();
    res.status(201).json({ message: "Message sent", groupMessage: message });
  } catch (error) {
    res.status(500).json({ message: "Failed to send message" });
  }
};

// Get all messages for a group
export const getGroupMessages = async (req, res) => {
  const { groupId } = req.params;
  try {
    const group = await Group.findById(groupId)
      .populate({
        path: "messages.sender",
        select: "name email",
      })
      .populate({
        path: "messages.file",
        select: "name drive_file_url",
      });
    if (!group) return res.status(404).json({ message: "Group not found" });
    if (!group.members.includes(req.user.id)) {
      return res
        .status(403)
        .json({ message: "You are not a member of this group" });
    }
    res.json(group.messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};
