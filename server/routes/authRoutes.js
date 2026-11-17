import express from 'express';
import { registerUser, loginUser, updateUserProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js'; // ✅ Make-admin route ke liye User model import kiya

const router = express.Router();

// Standard Authentication Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected Profile Route
router.put('/profile', protect, updateUserProfile);

// ==========================================
// 🛠️ TEMPORARY HACK: Make user admin via Thunder Client
// ==========================================
router.put('/make-admin', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user by email and update role to 'admin'
    const user = await User.findOneAndUpdate(
      { email: email }, 
      { role: 'admin' }, 
      { new: true }
    );

    if (user) {
      res.status(200).json({ 
        message: `Success! ${email} is now an admin.`, 
        role: user.role 
      });
    } else {
      res.status(404).json({ 
        message: "User not found in database. Check spelling." 
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;