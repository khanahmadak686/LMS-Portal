import Course from '../models/Course.js';
import User from '../models/User.js';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).populate('instructor', 'name email');
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single course by ID
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name email');
    if (course) {
      res.status(200).json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Instructor
export const createCourse = async (req, res) => {
  try {
    const { title, description, category, price, thumbnail } = req.body;
    
    const course = await Course.create({
      title,
      description,
      category,
      price: price || 0,
      thumbnail,
      instructor: req.user._id,
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Instructor
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body, 
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Instructor
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await course.deleteOne();
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Enroll student in a course
// @route   POST /api/courses/:id/enroll
// @access  Private/Student
export const enrollStudent = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.studentsEnrolled.includes(req.user._id)) {
      return res.status(400).json({ message: 'You are already enrolled in this course' });
    }

    course.studentsEnrolled.push(req.user._id);
    await course.save();

    res.status(200).json({ message: 'Successfully enrolled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Get courses enrolled by the student
// @route   GET /api/courses/enrolled
// @access  Private/Student
export const getEnrolledCourses = async (req, res) => {
  try {
    const courses = await Course.find({ studentsEnrolled: req.user._id })
      .populate('instructor', 'name email');
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};