const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Status name is required'],
      unique: true,
      trim: true,
      maxlength: [50, 'Status name cannot exceed 50 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Status', statusSchema);
