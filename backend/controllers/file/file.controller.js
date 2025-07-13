import File from "../../models/file.model.js";
import fs from "fs";
import {
  uploadToUserDrive,
  deleteFromUserDrive,
} from "../../services/googleDrive.service.js";
import { refreshGoogleToken } from "../../services/googleAuth.service.js";
import User from "../../models/user.model.js";
import Teacher from "../../models/teacher.model.js";

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
          drive_file_url: driveFile.webViewLink,
          uploaded_by: req.user.id,
          uploaded_by_role: req.user.role,
          linked_subject: req.body.subject_id || null,
          linked_topic: req.body.topic_id || null,
        });
        await newFile.save();
        console.log("File saved to database:", newFile._id);
        savedFiles.push(newFile);
      } catch (dbError) {
        console.error("Database save error:", dbError);
        return res
          .status(500)
          .json({ message: "Error saving file to database." });
      }

      try {
        fs.unlinkSync(file.path); // 🧹 Clean temp
        console.log("Temp file cleaned:", file.path);
      } catch (cleanupError) {
        console.error("File cleanup error:", cleanupError);
        // Don't fail the upload for cleanup errors
      }
    }

    console.log("Upload completed successfully:", savedFiles.length, "files");
    res.status(201).json({
      message: `${savedFiles.length} file(s) uploaded successfully`,
      files: savedFiles,
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
    const files = await File.find()
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
  try {
    const file = await File.findById(id);
    if (!file) return res.status(404).json({ message: "File not found" });

    // Check if user has Google access token
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
      // If token expired, try to refresh and delete again
      if (error.code === 401) {
        try {
          const user =
            req.user.role === "user"
              ? await User.findById(req.user.id)
              : await Teacher.findById(req.user.id);
          const newAccessToken = await refreshGoogleToken(
            user.googleRefreshToken
          );
          user.googleAccessToken = newAccessToken;
          await user.save();
          await deleteFromUserDrive(file.drive_file_id, newAccessToken);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          return res.status(401).json({
            message: "Google authentication expired. Please log in again.",
          });
        }
      } else {
        console.error("Delete error:", error);
        return res
          .status(500)
          .json({ message: "Error deleting file from Google Drive." });
      }
    }

    // Delete from DB
    await file.deleteOne();
    res.json({ message: "File deleted from Google Drive & DB" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Error deleting file" });
  }
};
