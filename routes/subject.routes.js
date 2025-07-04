import express from "express";
import {
    getAllSubjects,
    createNewSubject
} from "../controllers/subject/subject.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(requireAuth(["admin", "teacher", "user"]));

router.get("/", getAllSubjects);
router.post("/", createNewSubject);

export default router;
