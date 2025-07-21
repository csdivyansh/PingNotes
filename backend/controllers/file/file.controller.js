import File from "../../models/file.model.js";
import fs from "fs";
import {
  uploadToUserDrive,
  deleteFromUserDrive,
} from "../../services/googleDrive.service.js";
import { refreshGoogleToken } from "../../services/googleAuth.service.js";
import User from "../../models/user.model.js";
import Teacher from "../../models/teacher.model.js";
import { extractTextFromFile } from "../../utils/fileTextExtractor.js";
import { suggestSubjectFromText } from "../../utils/subjectSuggester.js";
import mongoose from "mongoose";
import Subject from "../../models/subject.model.js";

export const uploadFiles = async (req, res) => {
  if (!req.files || req.files.length === 0)
    return res.status(400).json({ message: "No files uploaded" });

  try {
    console.log("Upload request received:", {
      filesCount: req.files.length,
      userRole: req.user.role,
      userId: req.user.id,
      subjectId: req.body.subject_id,
      topicId: req.body.topic_id,
    });

    const savedFiles = [];
    let userAccessToken = null;
    let suggestedSubject = null; // <-- Move here, outside the loop

    // Get user's Google access token
    if (req.user.role === "user") {
      const user = await User.findById(req.user.id);
      console.log("User found:", {
        userId: user?._id,
        hasAccessToken: !!user?.googleAccessToken,
      });
      if (user?.googleAccessToken) {
        userAccessToken = user.googleAccessToken;
      }
    } else if (req.user.role === "teacher") {
      const teacher = await Teacher.findById(req.user.id);
      console.log("Teacher found:", {
        teacherId: teacher?._id,
        hasAccessToken: !!teacher?.googleAccessToken,
      });
      if (teacher?.googleAccessToken) {
        userAccessToken = teacher.googleAccessToken;
      }
    }

    if (!userAccessToken) {
      console.log("No Google access token found for user");
      return res
        .status(401)
        .json({ message: "You must log in with Google to upload files." });
    }

    console.log("Processing files with access token");

    for (const file of req.files) {
      console.log("Processing file:", file.originalname);
      let driveFile;
      try {
        driveFile = await uploadToUserDrive(file, userAccessToken);
        console.log("File uploaded to Drive:", driveFile.id);
      } catch (error) {
        console.error("Drive upload error:", error);
        // If token expired, try to refresh and upload again
        if (error.code === 401) {
          try {
            const user =
              req.user.role === "user"
                ? await User.findById(req.user.id)
                : await Teacher.findById(req.user.id);
            console.log("Refreshing token for user:", user._id);
            const newAccessToken = await refreshGoogleToken(
              user.googleRefreshToken
            );
            user.googleAccessToken = newAccessToken;
            await user.save();
            driveFile = await uploadToUserDrive(file, newAccessToken);
            console.log("File uploaded with refreshed token:", driveFile.id);
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            return res.status(401).json({
              message: "Google authentication expired. Please log in again.",
            });
          }
        } else {
          console.error("Upload error:", error);
          return res
            .status(500)
            .json({ message: "Error uploading file to Google Drive." });
        }
      }

      try {
        const newFile = new File({
          name: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          drive_file_id: driveFile.id,
          drive_file_url: driveFile.webContentLink, // Use direct download link
          uploaded_by: req.user.id,
          uploaded_by_role:
            req.user.role.charAt(0).toUpperCase() + req.user.role.slice(1),
          linked_subject: req.body.subject_id || null,
          linked_topic: req.body.topic_id || null,
          shared_with_groups: req.body.shared_with_groups || [],
        });
        await newFile.save();
        console.log("File saved to database:", newFile._id);
        // Link file to topic's files array if subject and topic are provided
        if (req.body.subject_id && req.body.topic_id) {
          const Subject = (await import("../../models/subject.model.js"))
            .default;
          const subject = await Subject.findById(req.body.subject_id);
          if (subject) {
            const topic = subject.topics.id(req.body.topic_id);
            if (topic) {
              topic.files.push(newFile._id);
              await subject.save();
            }
          }
        }
        savedFiles.push(newFile);
      } catch (dbError) {
        console.error("Database save error:", dbError);
        return res
          .status(500)
          .json({ message: "Error saving file to database." });
      }

      // --- AI-powered subject suggestion ---
      try {
        const text = await extractTextFromFile(file.path, file.mimetype);
        suggestedSubject = await suggestSubjectFromText(text);
        console.log("Final subject for file:", suggestedSubject);
      } catch (extractErr) {
        console.error("Text extraction/subject suggestion error:", extractErr);
      }

      try {
        fs.unlinkSync(file.path); // �� Clean temp
        console.log("Temp file cleaned:", file.path);
      } catch (cleanupError) {
        console.error("File cleanup error:", cleanupError);
        // Don't fail the upload for cleanup errors
      }

      // Only process the first file for subject suggestion for now
      break;
    }

    console.log("Upload completed successfully:", savedFiles.length, "files");
    res.status(201).json({
      message: `${savedFiles.length} file(s) uploaded successfully`,
      files: savedFiles,
      suggestedSubject: savedFiles.length > 0 ? suggestedSubject : null,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      message: "Error uploading files",
      error: error.message,
    });
  }
};

// Get all files
export const getAllFiles = async (req, res) => {
  try {
    const files = await File.find({
      uploaded_by: req.user.id,
      uploaded_by_role:
        req.user.role.charAt(0).toUpperCase() + req.user.role.slice(1),
      is_deleted: false,
    })
      .populate("uploaded_by", "name email role")
      .populate("linked_subject", "name");
    res.json(files);
  } catch (error) {
    console.error("Fetch all files error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get file by ID
export const getFileById = async (req, res) => {
  const { id } = req.params;
  try {
    const file = await File.findById(id)
      .populate("uploaded_by", "name email role")
      .populate("linked_subject", "name");
    if (!file) return res.status(404).json({ message: "File not found" });
    res.json(file);
  } catch (error) {
    console.error("Fetch by ID error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete file
export const deleteFile = async (req, res) => {
  const { id } = req.params;
  if (!id || id === "undefined") {
    return res.status(400).json({ message: "Invalid file ID" });
  }
  try {
    const file = await File.findById(id);
    if (!file) return res.status(404).json({ message: "File not found" });
    file.is_deleted = true;
    await file.save();
    res.json({ message: "File moved to trash (soft deleted)" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Error deleting file" });
  }
};

export const restoreFile = async (req, res) => {
  const { id } = req.params;
  if (!id || id === "undefined") {
    return res.status(400).json({ message: "Invalid file ID" });
  }
  try {
    const file = await File.findById(id);
    if (!file) return res.status(404).json({ message: "File not found" });
    file.is_deleted = false;
    await file.save();
    res.json({ message: "File restored from trash" });
  } catch (error) {
    console.error("Restore error:", error);
    res.status(500).json({ message: "Error restoring file" });
  }
};

export const permanentDeleteFile = async (req, res) => {
  const { id } = req.params;
  if (!id || id === "undefined") {
    return res.status(400).json({ message: "Invalid file ID" });
  }
  try {
    const file = await File.findById(id);
    if (!file) return res.status(404).json({ message: "File not found" });
    // Remove from Google Drive and topic as before
    let userAccessToken = null;
    if (req.user.role === "user") {
      const user = await User.findById(req.user.id);
      userAccessToken = user?.googleAccessToken;
    } else if (req.user.role === "teacher") {
      const teacher = await Teacher.findById(req.user.id);
      userAccessToken = teacher?.googleAccessToken;
    }
    if (!userAccessToken) {
      return res
        .status(401)
        .json({ message: "You must log in with Google to delete files." });
    }
    try {
      await deleteFromUserDrive(file.drive_file_id, userAccessToken);
    } catch (error) {
      // Try to refresh token and retry, or ignore if already deleted
    }
    // Remove from topic.files
    if (file.linked_subject && file.linked_topic) {
      const Subject = (await import("../../models/subject.model.js")).default;
      const subject = await Subject.findById(file.linked_subject);
      if (subject) {
        const topic = subject.topics.id(file.linked_topic);
        if (topic) {
          topic.files = topic.files.filter(
            (fId) => fId.toString() !== file._id.toString()
          );
          await subject.save();
        }
      }
    }
    await file.deleteOne();
    res.json({ message: "File permanently deleted" });
  } catch (error) {
    console.error("Permanent delete error:", error);
    res.status(500).json({ message: "Error permanently deleting file" });
  }
};

export const emptyTrash = async (req, res) => {
  try {
    const files = await File.find({
      uploaded_by: req.user.id,
      uploaded_by_role:
        req.user.role.charAt(0).toUpperCase() + req.user.role.slice(1),
      is_deleted: true,
    });
    for (const file of files) {
      try {
        // Remove from Google Drive
        let userAccessToken = null;
        if (req.user.role === "user") {
          const user = await User.findById(req.user.id);
          userAccessToken = user?.googleAccessToken;
        } else if (req.user.role === "teacher") {
          const teacher = await Teacher.findById(req.user.id);
          userAccessToken = teacher?.googleAccessToken;
        }
        if (userAccessToken) {
          try {
            await deleteFromUserDrive(file.drive_file_id, userAccessToken);
          } catch (err) {
            // Ignore errors if already deleted
          }
        }
        await file.deleteOne();
      } catch (err) {
        console.error("Error deleting file from trash:", err);
      }
    }
    res.json({ message: "Trash emptied successfully" });
  } catch (error) {
    console.error("Error emptying trash:", error);
    res.status(500).json({ message: "Error emptying trash" });
  }
};

// List all files shared in a group
export const getFilesSharedWithGroup = async (req, res) => {
  const { groupId } = req.params;
  try {
    const files = await File.find({
      shared_with_groups: groupId,
      is_deleted: false,
    })
      .populate("uploaded_by", "name email role")
      .populate("linked_subject", "name");
    res.json(files);
  } catch (error) {
    console.error("Fetch files shared with group error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const shareFile = async (req, res) => {
  const { id } = req.params; // file id
  const { friendIdsOrEmails } = req.body; // array of user IDs or emails
  if (!Array.isArray(friendIdsOrEmails) || friendIdsOrEmails.length === 0) {
    return res.status(400).json({ message: "No friends specified" });
  }
  try {
    const file = await File.findById(id);
    if (!file) return res.status(404).json({ message: "File not found" });
    // Find subject and topic info if present
    let subject = null;
    let topic = null;
    if (file.linked_subject) {
      subject = await Subject.findById(file.linked_subject);
    }
    if (subject && file.linked_topic) {
      topic = subject.topics.id(file.linked_topic);
    }
    // For each friend (by email or ID)
    for (const friendKey of friendIdsOrEmails) {
      let friend = null;
      if (mongoose.Types.ObjectId.isValid(friendKey)) {
        friend = await User.findById(friendKey);
      }
      if (!friend) {
        // Try by email
        friend = await User.findOne({ email: friendKey });
      }
      if (!friend) {
        // Optionally, skip or create a new user (invite flow)
        continue;
      }
      // Add as friend if not already
      if (!friend.friends.includes(req.user.id)) {
        friend.friends.push(req.user.id);
        await friend.save();
      }
      // Find or create subject for friend
      let friendSubject = null;
      if (subject) {
        friendSubject = await Subject.findOne({
          name: subject.name,
          created_by: friend._id,
          created_by_role: friend.role,
        });
        if (!friendSubject) {
          friendSubject = new Subject({
            name: subject.name,
            subject_code: subject.subject_code + "_shared_" + friend._id,
            created_by: friend._id,
            created_by_role: friend.role || "user",
            topics: [],
          });
          await friendSubject.save();
        }
      }
      // Find or create topic for friend
      let friendTopic = null;
      if (topic && friendSubject) {
        friendTopic = friendSubject.topics.find((t) => t.name === topic.name);
        if (!friendTopic) {
          friendSubject.topics.push({
            name: topic.name,
            description: topic.description,
          });
          await friendSubject.save();
          friendTopic = friendSubject.topics.find((t) => t.name === topic.name);
        }
      }
      // Duplicate the file entry for the friend
      const newFile = new File({
        name: file.name,
        mimetype: file.mimetype,
        size: file.size,
        drive_file_id: file.drive_file_id, // Optionally, copy in Drive
        drive_file_url: file.drive_file_url,
        uploaded_by: friend._id,
        uploaded_by_role: friend.role
          ? friend.role.charAt(0).toUpperCase() + friend.role.slice(1)
          : "User",
        linked_subject: friendSubject ? friendSubject._id : null,
        linked_topic: friendTopic ? friendTopic._id : null,
        shared_with_groups: [],
        is_shared: true,
        original_file: file._id,
      });
      await newFile.save();
      // Add file to topic's files array if applicable
      if (friendSubject && friendTopic) {
        const freshSubject = await Subject.findById(friendSubject._id);
        const freshTopic = freshSubject.topics.id(friendTopic._id);
        if (freshTopic) {
          freshTopic.files.push(newFile._id);
          await freshSubject.save();
        }
      }
    }
    res.json({ message: "File shared successfully" });
  } catch (error) {
    console.error("Share file error:", error);
    res.status(500).json({ message: "Error sharing file" });
  }
};
