
# PingNotes - Cursor AI Context

## Project Summary
PingNotes is a MERN stack app that allows teachers to send notes to students. Files are stored on Google Drive using a service account. Authentication is JWT based. Subjects have nested Topics, and Files are linked to them.

## Key Features
- Users: Admin, Teacher, Student
- Google Drive integration with signed URLs
- Subjects → Topics → Files hierarchy
- REST API (Express)

## Folder Structure
- **controllers/** for route logic
- **models/** Mongoose schemas
- **routes/** API endpoints
- **services/googleDrive.service.js** manages Drive API
- **middleware/auth.middleware.js** for JWT protection

## APIs
- `/api/admin`
- `/api/user`
- `/api/teacher`
- `/api/subject`
- `/api/topic`
- `/api/file`

## Important Notes
- Files are private in Drive.
- Frontend is being built with React + Tailwind.

---
