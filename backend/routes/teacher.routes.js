import express from "express";
import {
  loginTeacher,
  getAllTeachers,
  createNewTeacher,
  updateTeacher,
  deleteTeacher,
  getTeacherById,
} from "../controllers/teacher/teacher.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public
router.post("/login", loginTeacher);

// Protected
router.use(requireAuth(["teacher"]));

router.get("/", getAllTeachers);
router.post("/", createNewTeacher);
router.get("/:id", getTeacherById);
router.put("/:id", updateTeacher);
router.delete("/:id", deleteTeacher);

export default router;
