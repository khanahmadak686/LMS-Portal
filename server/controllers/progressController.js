import PDFDocument from 'pdfkit';
import Course from '../models/Course.js';
import CourseProgress from '../models/CourseProgress.js'; // Ensure you have this model

// @desc    Get user's progress in a course
// @route   GET /api/progress/:courseId
// @access  Private/Student
export const getCourseProgress = async (req, res) => {
  try {
    const progress = await CourseProgress.findOne({
      student: req.user._id,
      course: req.params.courseId
    });
    
    // Agar progress nahi bani hai toh khali array bhej dein
    res.status(200).json(progress || { completedLessons: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark a lesson as complete
// @route   POST /api/progress/mark-complete
// @access  Private/Student
export const markLessonComplete = async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;
    
    let progress = await CourseProgress.findOne({
      student: req.user._id,
      course: courseId
    });

    if (!progress) {
      // Agar pehli baar lesson complete kar raha hai
      progress = await CourseProgress.create({
        student: req.user._id,
        course: courseId,
        completedLessons: [lessonId]
      });
    } else {
      // Agar progress document already hai
      if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
        await progress.save();
      }
    }

    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate & Download PDF Certificate
// @route   GET /api/progress/certificate/:courseId
// @access  Private/Student
export const generateCertificate = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    const user = req.user; 

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // 1. Initialize PDF in Landscape Mode
    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4',
    });

    // 2. Set Response Headers so browser knows it's a file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Certificate_${user.name.replace(/\s+/g, '_')}.pdf`);

    // Pipe the PDF directly to the response
    doc.pipe(res);

    // 3. Draw the Certificate Design
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(4).stroke('#10b981');
    doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).lineWidth(1).stroke('#10b981');

    doc.moveDown(2);
    doc.fontSize(45).fillColor('#0f172a').text('CERTIFICATE OF COMPLETION', { align: 'center' });
    doc.moveDown(1.5);

    doc.fontSize(20).fillColor('#64748b').text('This is proudly presented to', { align: 'center' });
    doc.moveDown(1);

    doc.fontSize(38).fillColor('#4f46e5').text(user.name.toUpperCase(), { align: 'center' });
    doc.moveDown(1);

    doc.fontSize(18).fillColor('#64748b').text('for successfully completing the comprehensive course:', { align: 'center' });
    doc.moveDown(0.5);
    
    doc.fontSize(26).fillColor('#0f172a').text(course.title, { align: 'center' });
    doc.moveDown(3);

    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    doc.fontSize(16).fillColor('#64748b').text(`Date: ${date}`, 100, doc.page.height - 120);
    doc.fontSize(16).fillColor('#64748b').text('LMS Academy Platform', doc.page.width - 280, doc.page.height - 120);
    doc.lineWidth(1).moveTo(doc.page.width - 280, doc.page.height - 125).lineTo(doc.page.width - 100, doc.page.height - 125).stroke('#cbd5e1');

    doc.end();

  } catch (error) {
    res.status(500).json({ message: 'Could not generate certificate' });
  }
};