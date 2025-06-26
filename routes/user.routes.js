import express from "express";
import { getAllUsers, createNewUser } from "../controllers/user/user.controller.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/create", createNewUser);

export default router;
