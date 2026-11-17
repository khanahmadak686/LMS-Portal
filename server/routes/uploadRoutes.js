import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// Cloudinary storage engine setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'lms_course_files', // Cloudinary mein is naam ka folder banega
    resource_type: 'auto',      // 'auto' lagane se Image, PDF aur Video sab upload ho jayenge
  },
});

const upload = multer({ storage: storage });

// @route   POST /api/upload
// @desc    Upload any file to Cloudinary
// @access  Public (Can be protected later)
router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }
    
    // Upload success - send back the Cloudinary URL
    res.status(200).json({
      message: 'File uploaded successfully',
      url: req.file.path,
      type: req.file.mimetype
    });
  } catch (error) {
    res.status(500).json({ message: 'File upload failed', error: error.message });
  }
});

export default router;