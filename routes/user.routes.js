import express from "express";
import { getAllUsers, createNewUser, updateUser, deleteUser, getUserById } from "../controllers/user/user.controller.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createNewUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser)

export default router;
