import express from "express";
import {
    getAllSubjects,
    createNewSubject
} from "../controllers/subject/subject.controller.js";

const router = express.Router();

router.get("/", getAllSubjects);
router.post("/", createNewSubject);

export default router;
