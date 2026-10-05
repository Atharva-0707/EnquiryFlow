const express = require('express');
const router = express.Router();
const {
  getStatuses,
  getStatusById,
  createStatus,
  updateStatus,
  deleteStatus,
} = require('../controllers/statusController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validateStatus } = require('../middleware/validationMiddleware');

router
  .route('/')
  .get(getStatuses)
  .post(protect, authorizeRoles('admin'), validateStatus, createStatus);

router
  .route('/:id')
  .get(getStatusById)
  .put(protect, authorizeRoles('admin'), updateStatus)
  .delete(protect, authorizeRoles('admin'), deleteStatus);

module.exports = router;
