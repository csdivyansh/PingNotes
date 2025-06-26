import express from "express";
import { getAllTeachers, updateTeacher, createNewTeacher, deleteTeacher } from "../controllers/teacher/teacher.controller.js";

const router = express.Router();

router.get("/", getAllTeachers);
router.post("/create", createNewTeacher);
router.put("/update/:id", updateTeacher);
router.delete("/delete/:id", deleteTeacher);

export default router;
