import express from 'express';
import { getCourseLessons, addLesson } from '../controllers/lessonController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:courseId')
  .get(getCourseLessons)
  .post(protect, authorizeRoles('instructor', 'admin'), addLesson);

export default router;