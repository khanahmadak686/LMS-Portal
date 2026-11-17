import express from 'express';
import { 
  getCourses, 
  getCourseById, 
  createCourse, 
  enrollStudent, 
  updateCourse, 
  deleteCourse,
  getEnrolledCourses // ✅ Imported new function
} from '../controllers/courseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCourses);
router.post('/', protect, createCourse);

// ✅ IMPORTANT: Put /enrolled BEFORE /:id so it doesn't get treated as an ID
router.get('/enrolled', protect, getEnrolledCourses); 

router.get('/:id', getCourseById);
router.put('/:id', protect, updateCourse); 
router.delete('/:id', protect, deleteCourse); 
router.post('/:id/enroll', protect, enrollStudent);

export default router;