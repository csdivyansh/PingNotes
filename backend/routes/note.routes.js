import express from "express";
import {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from "../controllers/note/note.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ✅ All routes require authentication
router.use(requireAuth(["admin", "teacher", "user"]));

router.post("/", createNote);
router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
