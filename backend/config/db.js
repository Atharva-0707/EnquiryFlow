const mongoose = require('mongoose');

/**
 * Automatically seeds default metadata & demo users if the database is blank
 */
const autoSeedIfEmpty = async () => {
  try {
    const User = require('../models/User');
    const Category = require('../models/Category');
    const Status = require('../models/Status');

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 [Auto-Seeder]: Empty user collection detected. Seeding default demo accounts...');
      await User.create([
        {
          name: 'System Administrator',
          email: 'admin@example.com',
          password: 'admin123',
          role: 'admin',
        },
        {
          name: 'Employee Staff',
          email: 'employee@example.com',
          password: 'employee123',
          role: 'employee',
        },
      ]);
      console.log('✅ [Auto-Seeder]: Default Admin & Employee accounts created successfully.');
    }

    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      console.log('🌱 [Auto-Seeder]: Seeding default categories...');
      await Category.create([
        { name: 'Product Enquiry', isActive: true },
        { name: 'Technical Support', isActive: true },
        { name: 'Billing & Invoicing', isActive: true },
        { name: 'Partnership & Sales', isActive: true },
        { name: 'General Information', isActive: true },
      ]);
      console.log('✅ [Auto-Seeder]: Default categories created.');
    }

    const statusCount = await Status.countDocuments();
    if (statusCount === 0) {
      console.log('🌱 [Auto-Seeder]: Seeding default lifecycle statuses...');
      await Status.create([
        { name: 'New', isActive: true },
        { name: 'In Progress', isActive: true },
        { name: 'Follow Up', isActive: true },
        { name: 'Converted', isActive: true },
        { name: 'Closed', isActive: true },
      ]);
      console.log('✅ [Auto-Seeder]: Default statuses created.');
    }
  } catch (seedErr) {
    console.warn('⚠️ [Auto-Seeder Warning]:', seedErr.message);
  }
};

/**
 * Connect to MongoDB database via Mongoose
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
    console.warn('\n⚠️  [MongoDB Warning]: MONGODB_URI in backend/.env contains placeholder credentials.');
    console.warn('👉 Please update backend/.env with your real MongoDB Atlas connection string to connect to the database.\n');
    return null;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ [MongoDB Connected]: ${conn.connection.host} (${conn.connection.name})`);

    // Auto-seed if database is fresh
    await autoSeedIfEmpty();

    return conn;
  } catch (error) {
    console.error(`❌ [MongoDB Connection Error]: ${error.message}`);
    // Don't crash immediately in development so server can display helpful messages
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    return null;
  }
};

module.exports = connectDB;
