# PingNotes Frontend

This is the React frontend for the PingNotes application.

## Setup and Connection with Backend

### Prerequisites
- Node.js (v16 or higher)
- Backend server running on port 5000

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (or the next available port).

### Backend Connection

The frontend is configured to connect to the backend through:

1. **Vite Proxy Configuration**: The `vite.config.js` file includes a proxy that forwards API calls to the backend server running on `http://localhost:5000`.

2. **API Service**: All backend communication is handled through the centralized `src/services/api.js` service.

### Environment Variables

Create a `.env` file in the frontend directory (optional):
```
VITE_API_URL=http://localhost:5000
```

### API Endpoints

The frontend can access the following backend endpoints:

- **Authentication**: `/api/auth/*`, `/api/admin/*`
- **Users**: `/api/users/*`
- **Groups**: `/api/groups/*`
- **Notes**: `/api/notes/*`
- **Subjects**: `/api/subjects/*`
- **Teachers**: `/api/teachers/*`
- **Files**: `/api/files/*`

### Authentication

The application uses JWT tokens stored in localStorage:
- `adminToken` for admin users
- `userToken` for regular users

### Running Both Frontend and Backend

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Troubleshooting

1. **CORS Issues**: The backend has CORS enabled, but if you encounter issues, check that the backend is running on port 5000.

2. **API Connection**: If API calls fail, verify:
   - Backend server is running
   - Proxy configuration in `vite.config.js` is correct
   - API endpoints match between frontend and backend

3. **Authentication**: If login fails, check:
   - Backend authentication routes are working
   - JWT token is being stored correctly
   - API service is using the correct endpoints

### Development Workflow

1. Make changes to frontend components
2. The Vite dev server will hot-reload changes
3. API calls will be proxied to the backend automatically
4. Test authentication and data flow between frontend and backend
