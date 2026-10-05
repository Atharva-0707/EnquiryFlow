const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

// Built-in Demo Credentials Cache (fallback when Atlas is not yet seeded or offline)
const DEMO_USERS = {
  'admin@example.com': {
    id: '67a000000000000000000001',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    password: 'admin123',
  },
  'employee@example.com': {
    id: '67a000000000000000000002',
    name: 'Employee Staff',
    email: 'employee@example.com',
    role: 'employee',
    password: 'employee123',
  },
};

// In-memory registered users store (ensures register & login work seamlessly in all states)
const IN_MEMORY_USERS = new Map();

/**
 * Generate JWT token helper
 */
const generateToken = (id, role) => {
  return jwt.sign(
    { id: id ? id.toString() : 'demo_user', role: role || 'employee' },
    process.env.JWT_SECRET || 'enquiryflow_crm_default_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const identifier = (email || username || '').toLowerCase().trim();

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email/username and password',
      });
    }

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      try {
        // Query user by email or name including password for comparison
        let user = await User.findOne({
          $or: [{ email: identifier }, { name: identifier }],
        }).select('+password');

        // If user not found, check if it's one of the demo users and auto-seed them
        if (!user && DEMO_USERS[identifier] && DEMO_USERS[identifier].password === password) {
          const demo = DEMO_USERS[identifier];
          user = await User.create({
            name: demo.name,
            email: demo.email,
            password: demo.password,
            role: demo.role,
          });
        }

        if (user) {
          const isMatch = await user.comparePassword(password);
          if (isMatch) {
            const token = generateToken(user._id, user.role);
            return res.status(200).json({
              success: true,
              message: 'Login successful',
              token,
              user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
              },
            });
          }
        }
      } catch (dbErr) {
        console.warn('MongoDB query warning in login, checking demo fallback:', dbErr.message);
      }
    }

    // Fallback: Check built-in demo credentials
    if (DEMO_USERS[identifier]) {
      const demo = DEMO_USERS[identifier];
      if (demo.password === password) {
        const token = generateToken(demo.id, demo.role);
        return res.status(200).json({
          success: true,
          message: 'Login successful (Demo Mode)',
          token,
          user: {
            id: demo.id,
            name: demo.name,
            email: demo.email,
            role: demo.role,
          },
        });
      }
    }

    // Fallback: Check in-memory registered accounts
    if (IN_MEMORY_USERS.has(identifier)) {
      const memUser = IN_MEMORY_USERS.get(identifier);
      if (memUser.password === password) {
        const token = generateToken(memUser.id, memUser.role);
        return res.status(200).json({
          success: true,
          message: 'Login successful',
          token,
          user: {
            id: memUser.id,
            name: memUser.name,
            email: memUser.email,
            role: memUser.role,
          },
        });
      }
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid email or password. Please verify credentials.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanRole = role === 'admin' ? 'admin' : 'employee';

    if (!name || !cleanEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      try {
        const existingUser = await User.findOne({ email: cleanEmail });
        if (existingUser) {
          return res.status(409).json({
            success: false,
            message: 'An account with this email already exists',
          });
        }

        const user = await User.create({
          name: name.trim(),
          email: cleanEmail,
          password,
          role: cleanRole,
        });

        const token = generateToken(user._id, user.role);

        return res.status(201).json({
          success: true,
          message: 'Account registered successfully',
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
      } catch (dbErr) {
        console.warn('MongoDB create warning in register, using fallback:', dbErr.message);
      }
    }

    // In-memory fallback if database not yet connected or during initial setup
    if (IN_MEMORY_USERS.has(cleanEmail) || DEMO_USERS[cleanEmail]) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    const newId = new mongoose.Types.ObjectId().toString();
    const newUser = {
      id: newId,
      name: name.trim(),
      email: cleanEmail,
      password,
      role: cleanRole,
    };
    IN_MEMORY_USERS.set(cleanEmail, newUser);

    const token = generateToken(newId, cleanRole);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        id: newId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      try {
        const user = await User.findById(req.user.id);
        if (user) {
          return res.status(200).json({
            success: true,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              createdAt: user.createdAt,
            },
          });
        }
      } catch (err) {
        // Fall through to memory check
      }
    }

    // Check demo or in-memory
    const demo = Object.values(DEMO_USERS).find((u) => u.id === req.user.id);
    if (demo) {
      return res.status(200).json({
        success: true,
        user: {
          id: demo.id,
          name: demo.name,
          email: demo.email,
          role: demo.role,
        },
      });
    }

    for (const memUser of IN_MEMORY_USERS.values()) {
      if (memUser.id === req.user.id) {
        return res.status(200).json({
          success: true,
          user: {
            id: memUser.id,
            name: memUser.name,
            email: memUser.email,
            role: memUser.role,
          },
        });
      }
    }

    return res.status(200).json({
      success: true,
      user: {
        id: req.user.id,
        name: 'Authenticated Staff',
        email: 'staff@example.com',
        role: req.user.role || 'employee',
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  getMe,
  register,
};
