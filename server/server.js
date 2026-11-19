import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
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

// Database Connection
connectDB();

const app = express();

// ✅ 1. Dynamic CORS Setup (Localhost + Production & Preview Vercel URLs)
const allowedOrigins = [
  "http://localhost:5173",
  "https://lms-portal-drab.vercel.app",
  "https://lms-portal-ochre.vercel.app"
];

const corsOriginHandler = (origin, callback) => {
  if (!origin) return callback(null, true);

  if (
    allowedOrigins.includes(origin) ||
    origin.endsWith('.vercel.app')
  ) {
    return callback(null, true);
  }

  return callback(new Error('Not allowed by CORS'));
};

app.use(cors({
  origin: corsOriginHandler,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

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

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    message: 'LMS Backend is running successfully!'
  });
});

// ==========================================
// 🔴 SOCKET.IO REAL-TIME CHAT SETUP
// ==========================================
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// ✅ 2. Socket.io CORS Setup
const io = new Server(server, {
  cors: {
    origin: corsOriginHandler,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  },
});

io.on('connection', (socket) => {
  console.log(`Live User Connected: ${socket.id}`);

  socket.on('join_course', (courseId) => {
    socket.join(courseId);
    console.log(`User joined course room: ${courseId}`);
  });

  socket.on('send_message', async (data) => {
    const { courseId, senderId, senderName, text } = data;

    try {
      const newMessage = await Message.create({ 
        course: courseId, 
        sender: senderId, 
        senderName, 
        text 
      });

      io.to(courseId).emit('receive_message', newMessage);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected:', socket.id);
  });
});

// ==========================================
// 🟢 START SERVER
// ==========================================
server.listen(PORT, () => {
  console.log(`Server & Live Socket.io are running on port ${PORT}`);
});