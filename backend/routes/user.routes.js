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

// Admin-only routes
router.use("/", requireAuth(["admin"]));
router.get("/", getAllUsers);
router.get("/:id", getUserById);

// User-protected routes
router.use(requireAuth(["user"]));
router.post("/", createNewUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
