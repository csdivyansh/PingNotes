import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  createGroup,
  getGroups,
  joinGroupByEmail,
  removeMemberByEmail,
  getUserGroups,
  getGroupMembers,
  deleteGroup,
} from "../controllers/group/group.controller.js";

const router = express.Router();
router.use(requireAuth(["admin", "teacher", "user"]));
router.post("/", createGroup);
router.get("/", getGroups);
router.post("/join-by-email", joinGroupByEmail);
router.post("/remove-member-by-email", removeMemberByEmail);
router.get("/my-groups", getUserGroups);
router.get("/:groupId/members", getGroupMembers);
router.delete("/:groupId", deleteGroup);

export default router;
