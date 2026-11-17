import Course from '../models/Course.js';

// @desc    Get dashboard stats and courses for the logged-in instructor
// @route   GET /api/instructor/dashboard
// @access  Private/Instructor
export const getInstructorDashboard = async (req, res) => {
  try {
    // 🔒 SABSE ZAROORI STEP: Sirf wahi courses find karo jiska owner logged-in user hai
    const myCourses = await Course.find({ instructor: req.user._id }).sort({ createdAt: -1 });

    let totalRevenue = 0;
    let totalEnrollments = 0;

    myCourses.forEach((course) => {
      const enrollments = course.studentsEnrolled.length;
      totalEnrollments += enrollments;
      totalRevenue += enrollments * course.price;
    });

    res.status(200).json({
      totalCourses: myCourses.length,
      totalRevenue,
      totalEnrollments,
      courses: myCourses, // Instructor ke khud ke courses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};