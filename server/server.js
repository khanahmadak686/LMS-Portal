import 'dotenv/config'; // ✅ Automatically loads .env variables
import express from 'express';
import cors from 'cors';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';

import connectDB from './config/db.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import instructorRoutes from './routes/instructorRoutes.js';
import messageRoutes from './routes/messageRoutes.js'; 

// Import Model for saving chats
import Message from './models/Message.js'; 

// ✅ connectDB() ko bina dotenv.config() ke call karna hai
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/messages', messageRoutes); 

// ==========================================
// 🚀 PRODUCTION SETUP (React Integration)
// ==========================================
const __dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
  // Serve React build files
  app.use(express.static(path.join(__dirname, '../client/dist')));

  // Handle React frontend routes
  app.get('*', (req, res) => {
    res.sendFile(
      path.resolve(__dirname, '../client', 'dist', 'index.html')
    );
  });
} else {
  // Health Check for development
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      message: 'LMS Backend is running successfully!'
    });
  });
}

// ==========================================
// 🔴 SOCKET.IO REAL-TIME CHAT SETUP
// ==========================================
const PORT = process.env.PORT || 5000;

// Wrap Express app inside HTTP server
const server = http.createServer(app);

// Initialize Socket.io on the HTTP server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Frontend dev server URL
    methods: ['GET', 'POST'],
  },
});

// Listen for connections
io.on('connection', (socket) => {
  console.log(`Live User Connected: ${socket.id}`);

  // When a user opens a course page, they join a specific "room"
  socket.on('join_course', (courseId) => {
    socket.join(courseId);
    console.log(`User joined course room: ${courseId}`);
  });

  // When someone types and sends a message in the forum
  socket.on('send_message', async (data) => {
    const { courseId, senderId, senderName, text } = data;

    try {
      // 1. Save the chat message permanently in MongoDB
      const newMessage = await Message.create({ 
        course: courseId, 
        sender: senderId, 
        senderName, 
        text 
      });

      // 2. Broadcast the message instantly to everyone else in that same course room
      io.to(courseId).emit('receive_message', newMessage);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('User Disconnected:', socket.id);
  });
});

// ==========================================
// 🟢 START SERVER
// ==========================================
// IMPORTANT: Use server.listen() instead of app.listen() for WebSockets to work!
server.listen(PORT, () => {
  console.log(`Server & Live Socket.io are running on port ${PORT}`);
});