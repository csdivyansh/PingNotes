import express from "express";
import multer from "multer";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  uploadFile,
  getAllFiles,
  getFileById,
  deleteFile,
} from "../controllers/file/file.controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // files stored in /uploads

// 🔒 All file routes require authentication
router.use(requireAuth(["admin", "teacher", "user"]));

router.post("/upload", upload.single("file"), uploadFile);
router.get("/", getAllFiles);
router.get("/:id", getFileById);
router.delete("/:id", deleteFile);

export default router;
