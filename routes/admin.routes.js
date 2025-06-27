import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { getAllAdmins, createNewAdmin, deleteAdmin, updateAdmin, getAdminById, loginAdmin} from "../controllers/admin/admin.controller.js";

const router = express.Router();

// 🔓 Public route
router.post("/login", loginAdmin);


// 🔐 Protected routes
router.use(requireAuth);
router.post("/", createNewAdmin);
router.get("/", getAllAdmins);
router.get("/:id", getAdminById);
router.delete("/:id", deleteAdmin); 
router.put("/:id", updateAdmin);

export default router;
