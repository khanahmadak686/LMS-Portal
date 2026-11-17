import express from 'express';
import { getCourseMessages } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/:courseId', protect, getCourseMessages);

export default router;