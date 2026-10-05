const express = require('express');
const router = express.Router();
const {
  getEnquiries,
  getEnquiryById,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
} = require('../controllers/enquiryController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validateEnquiry } = require('../middleware/validationMiddleware');

router
  .route('/')
  .get(protect, getEnquiries)
  .post(optionalAuth, validateEnquiry, createEnquiry);

router
  .route('/:id')
  .get(protect, getEnquiryById)
  .put(protect, authorizeRoles('admin', 'employee'), updateEnquiry)
  .delete(protect, authorizeRoles('admin'), deleteEnquiry);

module.exports = router;
