const DEFAULT_CATEGORIES = [
  { _id: '67a000000000000000000011', name: 'Product Enquiry', isActive: true },
  { _id: '67a000000000000000000012', name: 'Technical Support', isActive: true },
  { _id: '67a000000000000000000013', name: 'Billing & Invoicing', isActive: true },
  { _id: '67a000000000000000000014', name: 'Partnership & Sales', isActive: true },
  { _id: '67a000000000000000000015', name: 'General Information', isActive: true },
];

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    if (!categories || categories.length === 0) {
      return res.status(200).json({
        success: true,
        count: DEFAULT_CATEGORIES.length,
        data: DEFAULT_CATEGORIES,
      });
    }
    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      count: DEFAULT_CATEGORIES.length,
      data: DEFAULT_CATEGORIES,
    });
  }
};

/**
 * @desc    Get single category by ID
 * @route   GET /api/categories/:id
 * @access  Public
 */
const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }
    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new category
 * @route   POST /api/categories
 * @access  Private (Admin only)
 */
const createCategory = async (req, res, next) => {
  try {
    const { name, isActive } = req.body;
    const category = await Category.create({
      name: name.trim(),
      isActive: isActive !== undefined ? isActive : true,
    });
    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a category
 * @route   PUT /api/categories/:id
 * @access  Private (Admin only)
 */
const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a category
 * @route   DELETE /api/categories/:id
 * @access  Private (Admin only)
 */
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
