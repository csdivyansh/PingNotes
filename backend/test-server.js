import express from "express";
import cors from 'cors';
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'PingNotes API is running!' });
});

// Admin login route (mock)
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock authentication - accept any email/password for testing
  if (email && password) {
    res.json({
      success: true,
      message: 'Login successful',
      token: 'mock-jwt-token-for-testing',
      user: {
        id: '1',
        email: email,
        role: 'admin'
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }
});

// Mock API routes for testing
app.get('/api/notes', (req, res) => {
  res.json([
    {
      _id: '1',
      title: 'Sample Note 1',
      content: 'This is a sample note for testing the frontend-backend connection.',
      subject: { name: 'Computer Science' },
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      title: 'Sample Note 2',
      content: 'Another sample note to demonstrate the API connection.',
      subject: { name: 'Mathematics' },
      createdAt: new Date().toISOString()
    }
  ]);
});

app.get('/api/groups', (req, res) => {
  res.json([
    {
      _id: '1',
      name: 'Study Group A',
      description: 'A sample study group for testing',
      members: ['user1', 'user2'],
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      name: 'Project Team B',
      description: 'Another sample group',
      members: ['user3', 'user4', 'user5'],
      createdAt: new Date().toISOString()
    }
  ]);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: `Route ${req.originalUrl} not found`,
    error: 'Not Found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📚 PingNotes API ready at http://localhost:${PORT}`);
  console.log(`🔗 Frontend can connect at http://localhost:5173`);
}); 