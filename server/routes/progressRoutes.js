import express from 'express';
// ✅ Ensure you import generateCertificate along with your other progress functions
import { markLessonComplete, getCourseProgress, generateCertificate } from '../controllers/progressController.js'; 
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Existing routes (example)
router.post('/mark-complete', protect, markLessonComplete);
router.get('/:courseId', protect, getCourseProgress);

// ✅ The missing Certificate Route (Must match the 404 error URL)
router.get('/certificate/:courseId', protect, generateCertificate);

export default router;