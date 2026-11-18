import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Course from '../models/Course.js'; 

const router = express.Router();

// 🛡️ Middleware: Check if user is Admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};

// ==========================================
// 📊 1. Get Dashboard Stats (/api/admin/stats)
// ==========================================
router.get('/stats', protect, isAdmin, async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    
    res.status(200).json({ totalCourses, totalStudents, totalInstructors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 👨‍🏫 2. Get All Teachers/Instructors (/api/admin/instructors)
// ==========================================
router.get('/instructors', protect, isAdmin, async (req, res) => {
  try {
    const instructors = await User.find({ role: 'instructor' }).select('-password');
    res.status(200).json(instructors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 📚 3. Get All Courses (/api/admin/courses)
// ==========================================
router.get('/courses', protect, isAdmin, async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'name email');
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 👥 4. Get All Users (For Admin Dashboard) (/api/admin/users)
// ==========================================
router.get('/users', protect, isAdmin, async (req, res) => {
  try {
    // Password hata kar saare users fetch karo
    const users = await User.find({}).select('-password'); 
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 🔄 5. Update User Role (Make Instructor) (/api/admin/users/:id/role)
// ==========================================
router.put('/users/:id/role', protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Frontend se jo naya role (instructor) aayega, wo save kar do
    user.role = req.body.role; 
    await user.save();

    res.status(200).json({ message: `User role updated to ${user.role}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;