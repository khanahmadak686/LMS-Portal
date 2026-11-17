import Lesson from '../models/Lesson.js';
import Course from '../models/Course.js';

// @desc    Get all lessons for a specific course
// @route   GET /api/lessons/:courseId
// @access  Public
export const getCourseLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId });
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new lesson to a course (with Video & PDF)
// @route   POST /api/lessons/:courseId
// @access  Private/Instructor
export const addLesson = async (req, res) => {
  try {
    // Extract new fields including video and pdf URLs
    const { title, videoUrl, pdfUrl } = req.body;
    const courseId = req.params.courseId;

    // 1. Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // 2. Security Check: Only course owner or admin can add lessons
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to add lessons to this course' });
    }

    // 3. Create the lesson in the database
    const lesson = await Lesson.create({
      title,
      videoUrl, // Save Cloudinary video URL
      pdfUrl,   // Save Cloudinary PDF URL (Optional)
      course: courseId,
    });

    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};