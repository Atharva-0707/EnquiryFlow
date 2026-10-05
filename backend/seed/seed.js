const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Status = require('../models/Status');
const Enquiry = require('../models/Enquiry');
const connectDB = require('../config/db');

const seedData = async () => {
  console.log('🌱 [Seed Script] Connecting to database...');
  const conn = await connectDB();

  if (!conn) {
    console.error('❌ [Seed Script Aborted]: Could not connect to MongoDB. Check MONGODB_URI in backend/.env');
    process.exit(1);
  }

  try {
    console.log('🧹 [Seed Script] Cleaning existing data...');
    await User.deleteMany();
    await Category.deleteMany();
    await Status.deleteMany();
    await Enquiry.deleteMany();

    // 1. Seed Users
    console.log('👤 [Seed Script] Seeding Admin & Employee accounts...');
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });

    const employeeUser = await User.create({
      name: 'Sarah Connor',
      email: 'employee@example.com',
      password: 'employee123',
      role: 'employee',
    });

    // 2. Seed Categories
    console.log('📁 [Seed Script] Seeding CRM Categories...');
    const categories = await Category.create([
      { name: 'Product Enquiry', isActive: true },
      { name: 'Technical Support', isActive: true },
      { name: 'Billing & Invoicing', isActive: true },
      { name: 'Partnership & Sales', isActive: true },
      { name: 'General Information', isActive: true },
    ]);

    // 3. Seed Statuses
    console.log('📊 [Seed Script] Seeding Enquiry Statuses...');
    const statuses = await Status.create([
      { name: 'New', isActive: true },
      { name: 'In Progress', isActive: true },
      { name: 'Follow Up', isActive: true },
      { name: 'Converted', isActive: true },
      { name: 'Closed', isActive: true },
    ]);

    // 4. Seed Realistic Enquiries
    console.log('📝 [Seed Script] Seeding Demo Enquiry Records...');
    await Enquiry.create([
      {
        enquiryCode: 'ENQ-1001',
        customerName: 'Marcus Vance',
        customerEmail: 'marcus.vance@techcorp.io',
        customerPhone: '+1 (555) 349-8812',
        message: 'Looking to evaluate the Enterprise CRM edition for a team of 45 sales executives. We require single sign-on (SSO) and custom data export capabilities.',
        category: categories[0]._id, // Product Enquiry
        status: statuses[1]._id,     // In Progress
        enquiryType: 'Enterprise Sales',
        isConverted: false,
        enquiryDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        followUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        feedback: 'Spoke with CTO; requested formal security overview.',
        createdBy: adminUser._id,
      },
      {
        enquiryCode: 'ENQ-1002',
        customerName: 'Elena Rostova',
        customerEmail: 'elena@novasolutions.com',
        customerPhone: '+1 (555) 782-9014',
        message: 'Need help resolving an automated invoice discrepancy from Q3 billing. The tax breakdown appears incomplete.',
        category: categories[2]._id, // Billing & Invoicing
        status: statuses[0]._id,     // New
        enquiryType: 'Billing Query',
        isConverted: false,
        enquiryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        followUpDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        feedback: 'Assigned to accounts team for reconciliation.',
        createdBy: employeeUser._id,
      },
      {
        enquiryCode: 'ENQ-1003',
        customerName: 'David Chen',
        customerEmail: 'dchen@apexlogistics.net',
        customerPhone: '+1 (555) 412-6733',
        message: 'Interested in partnering on API integrations for logistics tracking. Seeking technical documentation on your Webhooks.',
        category: categories[3]._id, // Partnership & Sales
        status: statuses[3]._id,     // Converted
        enquiryType: 'Integration Partner',
        isConverted: true,
        enquiryDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        followUpDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        feedback: 'Contract executed successfully. Integration in staging.',
        createdBy: adminUser._id,
      },
      {
        enquiryCode: 'ENQ-1004',
        customerName: 'Aisha Al-Mansoor',
        customerEmail: 'aisha.m@gulfenergy.ae',
        customerPhone: '+971 50 123 4567',
        message: 'Requesting clarification on regional data residency and GDPR compliance policies prior to onboarding.',
        category: categories[4]._id, // General Information
        status: statuses[2]._id,     // Follow Up
        enquiryType: 'Compliance & Legal',
        isConverted: false,
        enquiryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        followUpDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        feedback: 'Sent standard DPA and regional cloud compliance certs.',
        createdBy: employeeUser._id,
      },
      {
        enquiryCode: 'ENQ-1005',
        customerName: 'Oliver Smith',
        customerEmail: 'oliver.smith@brightpath.org',
        customerPhone: '+44 20 7946 0912',
        message: 'We experienced intermittent webhook delivery failures around 14:00 UTC yesterday. Please verify server logs.',
        category: categories[1]._id, // Technical Support
        status: statuses[4]._id,     // Closed
        enquiryType: 'Incident Report',
        isConverted: false,
        enquiryDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        followUpDate: null,
        feedback: 'Issue traced to third-party DNS provider; resolved.',
        createdBy: adminUser._id,
      },
      {
        enquiryCode: 'ENQ-1006',
        customerName: 'Samantha Reed',
        customerEmail: 's.reed@finscale.io',
        customerPhone: '+1 (555) 902-1144',
        message: 'Signed up for pilot trial. Looking to transition into full annual subscription for 20 seats.',
        category: categories[0]._id, // Product Enquiry
        status: statuses[3]._id,     // Converted
        enquiryType: 'Sales Conversion',
        isConverted: true,
        enquiryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        followUpDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        feedback: 'Paid via Stripe invoice. Account upgraded to Pro.',
        createdBy: adminUser._id,
      }
    ]);

    console.log('\n======================================================');
    console.log('🎉 [Seed Complete] Database seeded successfully!');
    console.log('------------------------------------------------------');
    console.log('🔑 Demo Admin Account:');
    console.log('   Email:    admin@example.com');
    console.log('   Password: admin123');
    console.log('🔑 Demo Employee Account:');
    console.log('   Email:    employee@example.com');
    console.log('   Password: employee123');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ [Seed Script Error]:', error);
    process.exit(1);
  }
};

seedData();
