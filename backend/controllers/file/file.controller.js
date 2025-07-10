import File from "../../models/file.model.js";
import fs from "fs";
import { uploadToDrive, deleteFromDrive, uploadToUserDrive, deleteFromUserDrive } from "../../services/googleDrive.service.js";
import { refreshGoogleToken } from "../../services/googleAuth.service.js";
import User from "../../models/user.model.js";
import Teacher from "../../models/teacher.model.js";

export const uploadFiles = async (req, res) => {
  if (!req.files || req.files.length === 0)
    return res.status(400).json({ message: "No files uploaded" });

  try {
    const savedFiles = [];
    let userAccessToken = null;

    // Get user's Google access token
    if (req.user.role === "user") {
      const user = await User.findById(req.user.id);
      if (user?.googleAccessToken) {
        userAccessToken = user.googleAccessToken;
      }
    } else if (req.user.role === "teacher") {
      const teacher = await Teacher.findById(req.user.id);
      if (teacher?.googleAccessToken) {
        userAccessToken = teacher.googleAccessToken;
      }
    }

    for (const file of req.files) {
      let driveFile;
      
      if (userAccessToken) {
        // Upload to user's Google Drive
        try {
          driveFile = await uploadToUserDrive(file, userAccessToken);
        } catch (error) {
          // If token expired, try to refresh and upload again
          if (error.code === 401) {
            try {
              const user = req.user.role === "user" 
                ? await User.findById(req.user.id) 
                : await Teacher.findById(req.user.id);
              
              const newAccessToken = await refreshGoogleToken(user.googleRefreshToken);
              
              // Update user's access token
              user.googleAccessToken = newAccessToken;
              await user.save();
              
              // Try upload again with new token
              driveFile = await uploadToUserDrive(file, newAccessToken);
            } catch (refreshError) {
              console.error("Token refresh failed:", refreshError);
              // Fallback to service account upload
              driveFile = await uploadToDrive(file);
            }
          } else {
            // Fallback to service account upload
            driveFile = await uploadToDrive(file);
          }
        }
      } else {
        // Upload to service account Drive (fallback)
        driveFile = await uploadToDrive(file);
      }

      const newFile = new File({
        name: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        drive_file_id: driveFile.id,
        drive_file_url: driveFile.webViewLink,
        uploaded_by: req.user.id,
        uploaded_by_role: req.user.role,
        linked_subject: req.body.subject_id || null,
        linked_topic: req.body.topic_id || null
      });
      await newFile.save();
      savedFiles.push(newFile);

      fs.unlinkSync(file.path); // 🧹 Clean temp
    }

    res.status(201).json({
      message: `${savedFiles.length} file(s) uploaded successfully`,
      files: savedFiles
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Error uploading files" });
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

    // Delete from Google Drive
    if (userAccessToken) {
      try {
        await deleteFromUserDrive(file.drive_file_id, userAccessToken);
      } catch (error) {
        // If token expired, try to refresh and delete again
        if (error.code === 401) {
          try {
            const user = req.user.role === "user" 
              ? await User.findById(req.user.id) 
              : await Teacher.findById(req.user.id);
            
            const newAccessToken = await refreshGoogleToken(user.googleRefreshToken);
            
            // Update user's access token
            user.googleAccessToken = newAccessToken;
            await user.save();
            
            // Try delete again with new token
            await deleteFromUserDrive(file.drive_file_id, newAccessToken);
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            // Fallback to service account delete
            await deleteFromDrive(file.drive_file_id);
          }
        } else {
          // Fallback to service account delete
          await deleteFromDrive(file.drive_file_id);
        }
      }
    } else {
      // Delete from service account Drive
      await deleteFromDrive(file.drive_file_id);
    }

    // Delete from DB
    await file.deleteOne();

    res.json({ message: "File deleted from Google Drive & DB" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Error deleting file" });
  }
};
