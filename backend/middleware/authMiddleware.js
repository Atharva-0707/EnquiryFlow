const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

/**
 * Protect routes: verifies JWT and attaches user to request
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'enquiryflow_crm_default_secret');

      let user = null;
      if (mongoose.connection.readyState === 1) {
        try {
          user = await User.findById(decoded.id).select('-password');
        } catch (e) {
          // Ignore error if format or lookup mismatch
        }
      }

      // Check fallback demo/in-memory accounts if not yet found in MongoDB
      if (!user) {
        if (decoded.id === '67a000000000000000000001' || decoded.role === 'admin') {
          user = {
            _id: decoded.id || '67a000000000000000000001',
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'admin',
          };
        } else if (decoded.id === '67a000000000000000000002' || decoded.role === 'employee') {
          user = {
            _id: decoded.id || '67a000000000000000000002',
            name: 'Employee Staff',
            email: 'employee@example.com',
            role: 'employee',
          };
        } else if (decoded.id) {
          user = {
            _id: decoded.id,
            name: 'Authenticated User',
            email: 'user@example.com',
            role: decoded.role || 'employee',
          };
        }
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists',
        });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, invalid or expired token',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided in Authorization header',
    });
  }
};

/**
 * Optional authentication: attaches user if token is valid, but does not block
 */
const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'enquiryflow_crm_default_secret');

      let user = null;
      if (mongoose.connection.readyState === 1) {
        try {
          user = await User.findById(decoded.id).select('-password');
        } catch (e) {
          // ignore
        }
      }

      if (!user) {
        user = {
          _id: decoded.id,
          name: decoded.role === 'admin' ? 'Admin User' : 'Employee Staff',
          email: decoded.role === 'admin' ? 'admin@example.com' : 'employee@example.com',
          role: decoded.role || 'employee',
        };
      }

      req.user = user;
    } catch (e) {
      // Ignore token failure for public access
    }
  }
  next();
};

module.exports = {
  protect,
  optionalAuth,
};
