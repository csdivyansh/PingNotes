import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { getAllAdmins, createNewAdmin, deleteAdmin, updateAdmin, getAdminById, loginAdmin, getDashboardStats } from "../controllers/admin/admin.controller.js";

const router = express.Router();

// 🔓 Public route
router.post("/login", loginAdmin);


// 🔐 Protected routes
router.use(requireAuth(["admin"]));
router.post("/", createNewAdmin);
router.get("/", getAllAdmins);
router.get("/stats", getDashboardStats);
router.get("/:id", getAdminById);
router.delete("/:id", deleteAdmin);
router.put("/:id", updateAdmin);

export default router;
