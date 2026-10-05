const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validateCategory } = require('../middleware/validationMiddleware');

router
  .route('/')
  .get(getCategories)
  .post(protect, authorizeRoles('admin'), validateCategory, createCategory);

router
  .route('/:id')
  .get(getCategoryById)
  .put(protect, authorizeRoles('admin'), updateCategory)
  .delete(protect, authorizeRoles('admin'), deleteCategory);

module.exports = router;
