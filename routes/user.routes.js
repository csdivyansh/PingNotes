import express from "express";
import {
  loginUser,
  createNewUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user/user.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public route
router.post("/login", loginUser);

// Protected routes
router.use(requireAuth);

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createNewUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
