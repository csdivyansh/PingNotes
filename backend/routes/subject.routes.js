import express from "express";
import {
  getAllSubjects,
  getSubjectById,
  createNewSubject,
  updateSubject,
  deleteSubject,
  addTopic,
  getTopicById,
  updateTopic,
  deleteTopic,
  addFileToTopic,
  removeFileFromTopic,
  aiLinkSubjectToFile,
} from "../controllers/subject/subject.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(requireAuth(["admin", "teacher", "user"]));

// Subject CRUD operations
router.get("/", getAllSubjects);
router.post("/", createNewSubject);

// Topic management within subjects
router.post("/:subjectId/topics", addTopic);
router.get("/:subjectId/topics/:topicId", getTopicById);
router.put("/:subjectId/topics/:topicId", updateTopic);
router.delete("/:subjectId/topics/:topicId", deleteTopic);

// Topic file management
router.post("/:subjectId/topics/:topicId/files", addFileToTopic);
router.delete("/:subjectId/topics/:topicId/files/:fileId", removeFileFromTopic);

// AI subject association
router.post("/ai-link", aiLinkSubjectToFile);

// Subject CRUD operations (specific subject)
router.get("/:id", getSubjectById);
router.put("/:id", updateSubject);
router.delete("/:id", deleteSubject);

export default router;
