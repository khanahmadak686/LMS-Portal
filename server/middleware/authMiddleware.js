
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// 1. Protect routes (Ensure user is logged in)
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token payload (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          message: 'User not found'
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        message: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      message: 'Not authorized, no token'
    });
  }
};

// 2. Role authorization
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role (${req.user?.role || 'unknown'}) is not allowed to access this resource`
      });
    }

    next();
  };
};

// 3. Admin authorization
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  } else {
    return res.status(401).json({
      message: 'Not authorized as an admin'
    });
  }
};
