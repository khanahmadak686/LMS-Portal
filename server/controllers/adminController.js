import User from '../models/User.js';
import Course from '../models/Course.js';

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    
    const courses = await Course.find({});
    const totalCourses = courses.length;

    let totalRevenue = 0;
    let totalEnrollments = 0;

    courses.forEach(course => {
      const enrollments = course.studentsEnrolled.length;
      totalEnrollments += enrollments;
      totalRevenue += enrollments * course.price;
    });

    // Mock Monthly Data for charts (In production, group by createdAt dates)
    const monthlyData = [
      { name: 'Jan', revenue: Math.floor(totalRevenue * 0.1), enrollments: Math.floor(totalEnrollments * 0.1) },
      { name: 'Feb', revenue: Math.floor(totalRevenue * 0.15), enrollments: Math.floor(totalEnrollments * 0.15) },
      { name: 'Mar', revenue: Math.floor(totalRevenue * 0.12), enrollments: Math.floor(totalEnrollments * 0.12) },
      { name: 'Apr', revenue: Math.floor(totalRevenue * 0.2), enrollments: Math.floor(totalEnrollments * 0.2) },
      { name: 'May', revenue: Math.floor(totalRevenue * 0.18), enrollments: Math.floor(totalEnrollments * 0.18) },
      { name: 'Jun', revenue: Math.floor(totalRevenue * 0.25), enrollments: Math.floor(totalEnrollments * 0.25) },
    ];

    res.status(200).json({
      totalUsers,
      totalInstructors,
      totalCourses,
      totalEnrollments,
      totalRevenue,
      monthlyData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};