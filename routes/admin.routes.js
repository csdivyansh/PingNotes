import express from "express";
import { getAllAdmins } from "../controllers/admin/admin.controller.js";

const router = express.Router();

router.get("/", getAllAdmins);

export default router;
