# Google Drive Service Account Setup

## Overview

This application uses Google Drive for file storage. There are two ways files can be uploaded:

1. **User's Google Drive** (Recommended): Users log in with Google and files are uploaded to their personal Google Drive
2. **Service Account Drive** (Fallback): Files are uploaded to a shared service account Google Drive

## Setup Instructions

### For User Google Drive (Recommended)

Users should log in with Google One Tap. The application will automatically use their Google Drive for file uploads.

### For Service Account Drive (Optional Fallback)

1. **Create a Google Cloud Project**:

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Google Drive API**:

   - Go to "APIs & Services" > "Library"
   - Search for "Google Drive API" and enable it

3. **Create a Service Account**:

   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Fill in the details and create the service account

4. **Generate Service Account Key**:

   - Click on the created service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create New Key"
   - Choose "JSON" format
   - Download the JSON file

5. **Configure the Application**:
   - Rename the downloaded JSON file to `drive-service-account.json`
   - Place it in the `backend/config/` directory
   - Replace the placeholder values in the file with your actual service account credentials

## File Structure

```
backend/config/
├── db.js                    # Database configuration
├── drive-service-account.json  # Google Drive service account (you need to add this)
└── README.md               # This file
```

## Security Notes

- Keep your service account JSON file secure and never commit it to version control
- The service account should have minimal permissions (only Google Drive access)
- Consider using environment variables for sensitive data in production

## Troubleshooting

- If you see "Google Drive service account not configured" warnings, the application will still work with user Google Drive uploads
- If file uploads fail, ensure users are logged in with Google One Tap
- Check the console logs for detailed error messages
