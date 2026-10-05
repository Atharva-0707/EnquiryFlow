const mongoose = require('mongoose');
const Enquiry = require('../models/Enquiry');
const Category = require('../models/Category');
const Status = require('../models/Status');

/**
 * @desc    Get all enquiries with search, filtering, sorting, pagination
 * @route   GET /api/enquiries
 * @access  Private (Admin / Employee) or Public depending on configuration
 */
const getEnquiries = async (req, res, next) => {
  try {
    const {
      search,
      status,
      category,
      isConverted,
      sortBy = '-createdAt',
      page = 1,
      limit = 50,
    } = req.query;

    const query = {};

    // 1. Text Search across multiple customer fields
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { customerName: searchRegex },
        { customerEmail: searchRegex },
        { customerPhone: searchRegex },
        { message: searchRegex },
        { enquiryType: searchRegex },
        { enquiryCode: searchRegex },
      ];
    }

    // 2. Filter by status (ObjectId or name)
    if (status && status !== 'all') {
      if (mongoose.Types.ObjectId.isValid(status)) {
        query.status = status;
      } else {
        const foundStatus = await Status.findOne({ name: new RegExp(`^${status}$`, 'i') });
        if (foundStatus) query.status = foundStatus._id;
      }
    }

    // 3. Filter by category (ObjectId or name)
    if (category && category !== 'all') {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        const foundCategory = await Category.findOne({ name: new RegExp(`^${category}$`, 'i') });
        if (foundCategory) query.category = foundCategory._id;
      }
    }

    // 4. Filter by conversion status
    if (isConverted !== undefined) {
      query.isConverted = isConverted === 'true' || isConverted === true;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const total = await Enquiry.countDocuments(query);

    const enquiries = await Enquiry.find(query)
      .populate('category', 'name isActive')
      .populate('status', 'name isActive')
      .populate('createdBy', 'name email role')
      .sort(sortBy)
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      count: enquiries.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      data: enquiries,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single enquiry by ID or enquiryCode
 * @route   GET /api/enquiries/:id
 * @access  Private
 */
const getEnquiryById = async (req, res, next) => {
  try {
    let enquiry;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      enquiry = await Enquiry.findById(req.params.id)
        .populate('category', 'name isActive')
        .populate('status', 'name isActive')
        .populate('createdBy', 'name email role');
    } else {
      enquiry = await Enquiry.findOne({ enquiryCode: req.params.id })
        .populate('category', 'name isActive')
        .populate('status', 'name isActive')
        .populate('createdBy', 'name email role');
    }

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: enquiry,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new enquiry
 * @route   POST /api/enquiries
 * @access  Public (intake) or Authenticated User
 */
const createEnquiry = async (req, res, next) => {
  try {
    let {
      customerName,
      customerEmail,
      customerPhone,
      message,
      category,
      categoryId,
      status,
      statusId,
      enquiryType,
      isConverted,
      enquiryDate,
      followUpDate,
      feedback,
    } = req.body;

    let targetCategory = category || categoryId;
    let targetStatus = status || statusId;

    // Fallback/Resolve category if not provided or provided as string name
    if (!targetCategory || !mongoose.Types.ObjectId.isValid(targetCategory)) {
      const defaultCat = await Category.findOne({ isActive: true });
      if (defaultCat) {
        targetCategory = defaultCat._id;
      } else {
        const newCat = await Category.create({ name: 'General Inquiries' });
        targetCategory = newCat._id;
      }
    }

    // Fallback/Resolve status if not provided or provided as string name
    if (!targetStatus || !mongoose.Types.ObjectId.isValid(targetStatus)) {
      const defaultStat = await Status.findOne({ name: 'New' }) || await Status.findOne({ isActive: true });
      if (defaultStat) {
        targetStatus = defaultStat._id;
      } else {
        const newStat = await Status.create({ name: 'New' });
        targetStatus = newStat._id;
      }
    }

    const newEnquiry = await Enquiry.create({
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      customerPhone: customerPhone.trim(),
      message: message.trim(),
      category: targetCategory,
      status: targetStatus,
      enquiryType: enquiryType ? enquiryType.trim() : 'General',
      isConverted: Boolean(isConverted),
      enquiryDate: enquiryDate ? new Date(enquiryDate) : new Date(),
      followUpDate: followUpDate ? new Date(followUpDate) : null,
      feedback: feedback ? feedback.trim() : '',
      createdBy: req.user ? req.user._id : null,
    });

    const populated = await Enquiry.findById(newEnquiry._id)
      .populate('category', 'name isActive')
      .populate('status', 'name isActive')
      .populate('createdBy', 'name email role');

    return res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing enquiry
 * @route   PUT /api/enquiries/:id
 * @access  Private (Admin / Employee)
 */
const updateEnquiry = async (req, res, next) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      message,
      category,
      categoryId,
      status,
      statusId,
      enquiryType,
      isConverted,
      enquiryDate,
      followUpDate,
      feedback,
    } = req.body;

    const updateFields = {};

    if (customerName) updateFields.customerName = customerName.trim();
    if (customerEmail) updateFields.customerEmail = customerEmail.trim().toLowerCase();
    if (customerPhone) updateFields.customerPhone = customerPhone.trim();
    if (message !== undefined) updateFields.message = message.trim();
    if (enquiryType !== undefined) updateFields.enquiryType = enquiryType.trim();
    if (isConverted !== undefined) updateFields.isConverted = Boolean(isConverted);
    if (enquiryDate) updateFields.enquiryDate = new Date(enquiryDate);
    if (followUpDate) updateFields.followUpDate = new Date(followUpDate);
    if (feedback !== undefined) updateFields.feedback = feedback.trim();

    const targetCategory = category || categoryId;
    if (targetCategory && mongoose.Types.ObjectId.isValid(targetCategory)) {
      updateFields.category = targetCategory;
    }

    const targetStatus = status || statusId;
    if (targetStatus && mongoose.Types.ObjectId.isValid(targetStatus)) {
      updateFields.status = targetStatus;
    }

    const updated = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    )
      .populate('category', 'name isActive')
      .populate('status', 'name isActive')
      .populate('createdBy', 'name email role');

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Enquiry updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an enquiry
 * @route   DELETE /api/enquiries/:id
 * @access  Private (Admin only)
 */
const deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Enquiry deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEnquiries,
  getEnquiryById,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
};
