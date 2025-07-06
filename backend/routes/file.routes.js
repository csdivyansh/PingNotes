import express from "express";
import multer from "multer";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  uploadFiles, // 🔥 unified handler
  getAllFiles,
  getFileById,
  deleteFile
} from "../controllers/file/file.controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// 🔒 Protect all routes
router.use(requireAuth(["admin", "teacher", "user"]));

// 🚀 Single or Multiple uploads handled here
router.post("/upload", upload.any(), uploadFiles); 
router.get("/", getAllFiles);
router.get("/:id", getFileById);
router.delete("/:id", deleteFile);

export default router;
