import express from 'express';
import { getInstructorDashboard } from '../controllers/instructorController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route ko protect karna zaroori hai
router.get('/dashboard', protect, getInstructorDashboard);

export default router;