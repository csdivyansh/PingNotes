import { google } from "googleapis";
import fs from "fs";
import { refreshGoogleToken } from "./googleAuth.service.js";

// User-specific auth function
const getUserAuth = (accessToken) => {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  return auth;
};

// Upload to user's Google Drive
export const uploadToUserDrive = async (file, userAccessToken) => {
  try {
    console.log("Starting upload to user's Drive:", file.originalname);

    const auth = getUserAuth(userAccessToken);
    const drive = google.drive({ version: "v3", auth });

    const fileMetadata = {
      name: file.originalname,
      parents: ["root"], // Upload to user's root folder
    };

    const media = {
      mimeType: file.mimetype,
      body: fs.createReadStream(file.path),
    };

    console.log("Creating file in Drive with metadata:", fileMetadata);

    const response = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: "id, webViewLink, webContentLink, name, size",
    });

    console.log("File created in Drive:", response.data.id);

    // Make file accessible to anyone with the link (optional)
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    console.log("Permissions set for file:", response.data.id);

    return response.data;
  } catch (error) {
    console.error("Error uploading to user's Drive:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      status: error.status,
      stack: error.stack,
    });
    throw error;
  }
};

// Delete from user's Drive
export const deleteFromUserDrive = async (fileId, userAccessToken) => {
  try {
    const auth = getUserAuth(userAccessToken);
    const drive = google.drive({ version: "v3", auth });
    await drive.files.delete({ fileId });
  } catch (error) {
    console.error("Error deleting from user's Drive:", error);
    throw error;
  }
};

// Get user's Drive files
export const getUserDriveFiles = async (userAccessToken) => {
  try {
    const auth = getUserAuth(userAccessToken);
    const drive = google.drive({ version: "v3", auth });

    const response = await drive.files.list({
      pageSize: 50,
      fields: "files(id, name, webViewLink, size, createdTime)",
    });

    return response.data.files;
  } catch (error) {
    console.error("Error getting user's Drive files:", error);
    throw error;
  }
};
