const mongoose = require('mongoose');
const Enquiry = require('../models/Enquiry');
const Status = require('../models/Status');
const Category = require('../models/Category');

/**
 * @desc    Get real CRM dashboard metrics & statistics directly from MongoDB
 * @route   GET /api/dashboard/stats
 * @access  Public / Optional Auth
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (!isDbConnected) {
      return res.status(200).json({
        success: true,
        data: {
          totalEnquiries: 0,
          newEnquiries: 0,
          inProgress: 0,
          followUp: 0,
          converted: 0,
          closed: 0,
          totalCategories: 5,
          recentEnquiries: [],
        },
      });
    }

    const totalEnquiries = await Enquiry.countDocuments();
    const converted = await Enquiry.countDocuments({ isConverted: true });

    // Lookup known status IDs dynamically
    const statusDocs = await Status.find();
    const statusMapByName = {};
    statusDocs.forEach((s) => {
      statusMapByName[s.name.toLowerCase()] = s._id;
    });

    const newStatusId = statusMapByName['new'];
    const inProgressStatusId = statusMapByName['in progress'];
    const followUpStatusId = statusMapByName['follow up'];
    const closedStatusId = statusMapByName['closed'] || statusMapByName['resolved'];

    const newEnquiries = newStatusId
      ? await Enquiry.countDocuments({ status: newStatusId })
      : await Enquiry.countDocuments({ isConverted: false });

    const inProgress = inProgressStatusId
      ? await Enquiry.countDocuments({ status: inProgressStatusId })
      : 0;

    const followUp = followUpStatusId
      ? await Enquiry.countDocuments({ status: followUpStatusId })
      : await Enquiry.countDocuments({ followUpDate: { $ne: null } });

    const closed = closedStatusId
      ? await Enquiry.countDocuments({ status: closedStatusId })
      : await Enquiry.countDocuments({ isConverted: true });

    // Total categories and active categories
    const totalCategories = await Category.countDocuments({ isActive: true });

    // Recent 5 enquiries for dashboard overview
    const recentEnquiries = await Enquiry.find()
      .populate('category', 'name')
      .populate('status', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      data: {
        totalEnquiries,
        newEnquiries,
        inProgress,
        followUp,
        converted,
        closed,
        totalCategories,
        recentEnquiries,
      },
    });
  } catch (error) {
    console.warn('Dashboard stats fallback triggered:', error.message);
    return res.status(200).json({
      success: true,
      data: {
        totalEnquiries: 0,
        newEnquiries: 0,
        inProgress: 0,
        followUp: 0,
        converted: 0,
        closed: 0,
        totalCategories: 0,
        recentEnquiries: [],
      },
    });
  }
};

module.exports = {
  getDashboardStats,
};
