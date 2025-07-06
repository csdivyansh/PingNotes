import { google } from "googleapis";
import fs from "fs";
import { refreshGoogleToken } from "./googleAuth.service.js";

// Service account auth (for admin operations)
const serviceAuth = new google.auth.GoogleAuth({
  keyFile: "config/drive-service-account.json",
  scopes: ["https://www.googleapis.com/auth/drive"]
});

// User-specific auth function
const getUserAuth = (accessToken) => {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  return auth;
};

// Upload to user's Google Drive
export const uploadToUserDrive = async (file, userAccessToken) => {
  try {
    const auth = getUserAuth(userAccessToken);
    const drive = google.drive({ version: "v3", auth });

    const fileMetadata = { 
      name: file.originalname,
      parents: ['root'] // Upload to user's root folder
    };
    
    const media = {
      mimeType: file.mimetype,
      body: fs.createReadStream(file.path)
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: "id, webViewLink, webContentLink, name, size"
    });

    // Make file accessible to anyone with the link (optional)
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: "reader",
        type: "anyone"
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading to user's Drive:", error);
    throw error;
  }
};

// Upload to service account Drive (existing functionality)
export const uploadToDrive = async (file) => {
  const drive = google.drive({ version: "v3", auth: serviceAuth });

  const fileMetadata = { name: file.originalname };
  const media = {
    mimeType: file.mimetype,
    body: fs.createReadStream(file.path)
  };

  const response = await drive.files.create({
    resource: fileMetadata,
    media,
    fields: "id, webViewLink, webContentLink"
  });

  // Public by default
  await drive.permissions.create({
    fileId: response.data.id,
    requestBody: {
      role: "reader",
      type: "anyone"
    }
  });

  return response.data;
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

// Delete from service account Drive (existing functionality)
export const deleteFromDrive = async (fileId) => {
  const drive = google.drive({ version: "v3", auth: serviceAuth });
  await drive.files.delete({ fileId });
};

// Get user's Drive files
export const getUserDriveFiles = async (userAccessToken) => {
  try {
    const auth = getUserAuth(userAccessToken);
    const drive = google.drive({ version: "v3", auth });
    
    const response = await drive.files.list({
      pageSize: 50,
      fields: "files(id, name, webViewLink, size, createdTime)"
    });
    
    return response.data.files;
  } catch (error) {
    console.error("Error getting user's Drive files:", error);
    throw error;
  }
};
