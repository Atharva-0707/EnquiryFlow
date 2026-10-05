const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    enquiryCode: {
      type: String,
      unique: true,
      trim: true,
      index: true,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      minlength: [2, 'Customer name must be at least 2 characters long'],
      maxlength: [100, 'Customer name cannot exceed 100 characters'],
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        'Please provide a valid email address',
      ],
    },
    customerPhone: {
      type: String,
      required: [true, 'Customer phone number is required'],
      trim: true,
      minlength: [5, 'Phone number must be at least 5 digits'],
      maxlength: [25, 'Phone number cannot exceed 25 characters'],
    },
    message: {
      type: String,
      required: [true, 'Enquiry message is required'],
      trim: true,
      maxlength: [3000, 'Enquiry message cannot exceed 3000 characters'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category reference is required'],
    },
    status: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Status',
      required: [true, 'Status reference is required'],
    },
    enquiryType: {
      type: String,
      trim: true,
      default: 'General',
      maxlength: [100, 'Enquiry type cannot exceed 100 characters'],
    },
    isConverted: {
      type: Boolean,
      default: false,
    },
    enquiryDate: {
      type: Date,
      default: Date.now,
    },
    followUpDate: {
      type: Date,
      default: null,
    },
    feedback: {
      type: String,
      trim: true,
      default: '',
      maxlength: [2000, 'Feedback cannot exceed 2000 characters'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate friendly enquiryCode before saving (e.g., ENQ-1001)
enquirySchema.pre('save', async function (next) {
  if (!this.enquiryCode) {
    const count = await this.constructor.countDocuments();
    const nextNumber = 1001 + count;
    this.enquiryCode = `ENQ-${nextNumber}`;
  }
  next();
});

module.exports = mongoose.model('Enquiry', enquirySchema);
