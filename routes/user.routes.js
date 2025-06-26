import express from "express";
import { getAllUsers, createNewUser, updateUser, deleteUser } from "../controllers/user/user.controller.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/create", createNewUser);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser)

export default router;
