import express from "express";
import { getAllAdmins, createNewAdmin, deleteAdmin } from "../controllers/admin/admin.controller.js";

const router = express.Router();

router.get("/", getAllAdmins);
router.post("/create", createNewAdmin);
router.delete("/delete/:id", deleteAdmin); 
router.put("/update/:id", createNewAdmin);

export default router;
