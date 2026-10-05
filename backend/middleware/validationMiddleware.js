const mongoose = require('mongoose');

const validateLogin = (req, res, next) => {
  const { email, username, password } = req.body;
  const userIdentifier = email || username;

  if (!userIdentifier || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both email/username and password',
    });
  }

  next();
};

const validateRegister = (req, res, next) => {
  const { name, email, password, role } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Full name must be at least 2 characters long');
  }

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('Please provide a valid email address');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (role && !['admin', 'employee'].includes(role)) {
    errors.push('Role must be either "admin" or "employee"');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Registration validation failed',
      errors,
    });
  }

  next();
};

const validateEnquiry = (req, res, next) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    message,
    category,
    categoryId,
    status,
    statusId,
  } = req.body;

  const targetCategory = category || categoryId;
  const targetStatus = status || statusId;

  const errors = [];

  if (!customerName || customerName.trim().length < 2) {
    errors.push('Customer name must be at least 2 characters long');
  }

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
  if (!customerEmail || !emailRegex.test(customerEmail)) {
    errors.push('Please provide a valid customer email address');
  }

  if (!customerPhone || customerPhone.trim().length < 5) {
    errors.push('Please provide a valid phone number (at least 5 characters)');
  }

  if (!message || message.trim().length === 0) {
    errors.push('Enquiry message is required');
  }

  if (!targetCategory) {
    errors.push('Category reference is required');
  } else if (!mongoose.Types.ObjectId.isValid(targetCategory)) {
    errors.push('Invalid Category ID format');
  }

  if (targetStatus && !mongoose.Types.ObjectId.isValid(targetStatus)) {
    errors.push('Invalid Status ID format');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

const validateCategory = (req, res, next) => {
  const { name } = req.body;
  if (!name || name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Category name is required',
    });
  }
  next();
};

const validateStatus = (req, res, next) => {
  const { name } = req.body;
  if (!name || name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Status name is required',
    });
  }
  next();
};

module.exports = {
  validateLogin,
  validateRegister,
  validateEnquiry,
  validateCategory,
  validateStatus,
};
