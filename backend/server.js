const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const statusRoutes = require('./routes/statusRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Security Middlewares
app.use(helmet());

// CORS configuration
const explicitOrigins = [
  process.env.CLIENT_URL,
  'https://enquiry-management-system-three.vercel.app',
  'http://localhost:4200',
  'http://127.0.0.1:4200',
].flatMap((url) => (url ? url.split(',') : [])).map((s) => s.trim().replace(/\/$/, '')).filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, '');
      let isAllowed = explicitOrigins.includes(cleanOrigin) || process.env.NODE_ENV === 'development';
      if (!isAllowed) {
        try {
          const parsed = new URL(origin);
          if (parsed.hostname.endsWith('.vercel.app') || parsed.hostname === 'localhost') {
            isAllowed = true;
          }
        } catch (_) {}
      }
      if (isAllowed) {
        return callback(null, true);
      }
      return callback(new Error('CORS policy: Access denied for this origin'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EnquiryFlow API is running',
    service: 'EnquiryFlow CRM REST API',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/statuses', statusRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 [EnquiryFlow Server]: Listening on ${HOST}:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`📡 [API Health Check]: http://${HOST}:${PORT}/api/health`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const nextPort = Number(PORT) + 1;
    console.warn(`⚠️ [Port ${PORT} in use]: Attempting fallback port ${nextPort}...`);
    server.listen(nextPort, HOST, () => {
      console.log(`🚀 [EnquiryFlow Server]: Listening on fallback port ${nextPort}`);
    });
  } else {
    console.error('Server error:', err);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`💥 [Unhandled Rejection]: ${err.message}`);
});

module.exports = app;
