import Subject from "../../models/subject.model.js";
import File from "../../models/file.model.js";
import User from "../../models/user.model.js";
import Teacher from "../../models/teacher.model.js";

export const getAllSubjects = async (req, res) => {
  try {
    // Filter subjects by the current user
    const subjects = await Subject.find({
      created_by: req.user.id,
      created_by_role: req.user.role
    });
    res.json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSubjectById = async (req, res) => {
  const { id } = req.params;

  try {
    const subject = await Subject.findById(id).populate(
      "created_by",
      "name email"
    );
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.json(subject);
  } catch (error) {
    console.error("Error fetching subject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createNewSubject = async (req, res) => {
  const { name, subject_code } = req.body;

  if (!name || !subject_code) {
    return res
      .status(400)
      .json({ message: "Name and subject_code are required" });
  }

  try {
    const existing = await Subject.findOne({ subject_code });
    if (existing) {
      return res.status(409).json({ message: "Subject code already exists" });
    }

    const subject = new Subject({
      name,
      subject_code,
      created_by: req.user.id,
      created_by_role: req.user.role,
    });
    await subject.save();

    res.status(201).json({ message: "Subject created successfully", subject });
  } catch (error) {
    console.error("Error creating subject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateSubject = async (req, res) => {
  const { id } = req.params;
  const { name, subject_code } = req.body;

  try {
    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    if (name) subject.name = name;
    if (subject_code) {
      const existing = await Subject.findOne({
        subject_code,
        _id: { $ne: id },
      });
      if (existing) {
        return res.status(409).json({ message: "Subject code already exists" });
      }
      subject.subject_code = subject_code;
    }

    await subject.save();
    res.json({ message: "Subject updated successfully", subject });
  } catch (error) {
    console.error("Error updating subject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteSubject = async (req, res) => {
  const { id } = req.params;

  try {
    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    await Subject.findByIdAndDelete(id);
    res.json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error("Error deleting subject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Topic Management Functions
export const addTopic = async (req, res) => {
  const { subjectId } = req.params;
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Topic name is required" });
  }

  try {
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // Check if topic name already exists in this subject
    const existingTopic = subject.topics.find((topic) => topic.name === name);
    if (existingTopic) {
      return res.status(409).json({
        message: "Topic with this name already exists in this subject",
      });
    }

    subject.topics.push({ name, description });
    await subject.save();

    const newTopic = subject.topics[subject.topics.length - 1];
    res
      .status(201)
      .json({ message: "Topic added successfully", topic: newTopic });
  } catch (error) {
    console.error("Error adding topic:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTopicById = async (req, res) => {
  const { subjectId, topicId } = req.params;

  try {
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const topic = subject.topics.id(topicId);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.json(topic);
  } catch (error) {
    console.error("Error fetching topic:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTopic = async (req, res) => {
  const { subjectId, topicId } = req.params;
  const { name, description } = req.body;

  try {
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const topic = subject.topics.id(topicId);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    if (name) topic.name = name;
    if (description !== undefined) topic.description = description;

    await subject.save();
    res.json({ message: "Topic updated successfully", topic });
  } catch (error) {
    console.error("Error updating topic:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTopic = async (req, res) => {
  const { subjectId, topicId } = req.params;

  try {
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const topic = subject.topics.id(topicId);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    topic.remove();
    await subject.save();

    res.json({ message: "Topic deleted successfully" });
  } catch (error) {
    console.error("Error deleting topic:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addFileToTopic = async (req, res) => {
  const { subjectId, topicId } = req.params;
  const { fileId } = req.body;

  if (!fileId) {
    return res.status(400).json({ message: "File ID is required" });
  }

  try {
    // Verify file exists
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const topic = subject.topics.id(topicId);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    // Check if file is already linked to this topic
    if (topic.files.includes(fileId)) {
      return res
        .status(409)
        .json({ message: "File is already linked to this topic" });
    }

    // Add file to topic
    topic.files.push(fileId);
    await subject.save();

    // Update file's linked_topic
    file.linked_topic = topicId;
    await file.save();

    res.json({ message: "File added to topic successfully", topic });
  } catch (error) {
    console.error("Error adding file to topic:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeFileFromTopic = async (req, res) => {
  const { subjectId, topicId, fileId } = req.params;

  try {
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const topic = subject.topics.id(topicId);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    // Remove file from topic
    topic.files = topic.files.filter((file) => file.toString() !== fileId);
    await subject.save();

    // Update file's linked_topic to null
    await File.findByIdAndUpdate(fileId, { linked_topic: null });

    res.json({ message: "File removed from topic successfully", topic });
  } catch (error) {
    console.error("Error removing file from topic:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
