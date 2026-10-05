const DEFAULT_STATUSES = [
  { _id: '67a000000000000000000021', name: 'New', isActive: true },
  { _id: '67a000000000000000000022', name: 'In Progress', isActive: true },
  { _id: '67a000000000000000000023', name: 'Follow Up', isActive: true },
  { _id: '67a000000000000000000024', name: 'Converted', isActive: true },
  { _id: '67a000000000000000000025', name: 'Closed', isActive: true },
];

/**
 * @desc    Get all statuses
 * @route   GET /api/statuses
 * @access  Public
 */
const getStatuses = async (req, res, next) => {
  try {
    const statuses = await Status.find({ isActive: true }).sort({ createdAt: 1 });
    if (!statuses || statuses.length === 0) {
      return res.status(200).json({
        success: true,
        count: DEFAULT_STATUSES.length,
        data: DEFAULT_STATUSES,
      });
    }
    return res.status(200).json({
      success: true,
      count: statuses.length,
      data: statuses,
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      count: DEFAULT_STATUSES.length,
      data: DEFAULT_STATUSES,
    });
  }
};

/**
 * @desc    Get single status by ID
 * @route   GET /api/statuses/:id
 * @access  Public
 */
const getStatusById = async (req, res, next) => {
  try {
    const status = await Status.findById(req.params.id);
    if (!status) {
      return res.status(404).json({
        success: false,
        message: 'Status not found',
      });
    }
    return res.status(200).json({
      success: true,
      data: status,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new status
 * @route   POST /api/statuses
 * @access  Private (Admin only)
 */
const createStatus = async (req, res, next) => {
  try {
    const { name, isActive } = req.body;
    const status = await Status.create({
      name: name.trim(),
      isActive: isActive !== undefined ? isActive : true,
    });
    return res.status(201).json({
      success: true,
      message: 'Status created successfully',
      data: status,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a status
 * @route   PUT /api/statuses/:id
 * @access  Private (Admin only)
 */
const updateStatus = async (req, res, next) => {
  try {
    const status = await Status.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!status) {
      return res.status(404).json({
        success: false,
        message: 'Status not found',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: status,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a status
 * @route   DELETE /api/statuses/:id
 * @access  Private (Admin only)
 */
const deleteStatus = async (req, res, next) => {
  try {
    const status = await Status.findByIdAndDelete(req.params.id);
    if (!status) {
      return res.status(404).json({
        success: false,
        message: 'Status not found',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Status deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStatuses,
  getStatusById,
  createStatus,
  updateStatus,
  deleteStatus,
};
