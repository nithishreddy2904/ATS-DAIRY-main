const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const { testConnection } = require('./config/database');

// Import routes
const farmerRoutes = require('./routes/farmers');
const supplierRoutes = require('./routes/suppliers');
const milkEntryRoutes = require('./routes/milkEntries');
const fleetManagementRoutes = require('./routes/fleetManagement');
const deliveriesRouter = require('./routes/deliveries');
const processingUnitsRouter = require('./routes/processingUnits');
const productionBatchRoutes = require('./routes/productionBatchRoutes');
const qualityControlRoutes = require('./routes/qualityControlRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const retailerRoutes = require('./routes/retailerRoutes');
const saleRoutes = require('./routes/saleRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const billRoutes = require('./routes/billRoutes');
const labQualityTestRoutes = require('./routes/labQualityTestRoutes');
const reviewRoutes = require('./routes/reviews');
const farmerFeedbackRoutes = require('./routes/farmerFeedback');
const messageRoutes = require('./routes/messages'); 
const announcementRoutes = require('./routes/announcements');
const groupMessageRoutes = require('./routes/groupMessages');
const complianceRecordRoutes = require('./routes/complianceRecords');
const certificationRoutes = require('./routes/certifications');
const auditRoutes = require('./routes/audits');
const documentRoutes = require('./routes/documents');
const app = express();
const PORT = process.env.PORT || 5000;
const http = require('http'); 
const { Server } = require('socket.io');

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',    // Main ATS app
    'http://localhost:3001',    // New admin dashboard
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cookieParser());

// Test database connection
testConnection();

// ==========================================
// CRITICAL: PLACE ALL ROUTES BEFORE 404 HANDLER
// ==========================================

// Test routes MUST come BEFORE the 404 catch-all middleware
app.get('/api/test-db', async (req, res) => {
  try {
    const db = require('./config/database');
    const [rows] = await db.query('SELECT 1 as test');
    res.json({ success: true, message: 'Database connection successful', data: rows });
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Test lab quality tests table
app.get('/api/test-lab-quality-tests', async (req, res) => {
  try {
    const db = require('./config/database');
    const [rows] = await db.query('SELECT COUNT(*) as count FROM lab_quality_tests');
    res.json({
      success: true,
      message: 'Lab quality tests table accessible',
      count: rows[0].count
    });
  } catch (error) {
    console.error('❌ Lab quality tests table test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Lab quality tests table access failed',
      error: error.message
    });
  }
});

// API Routes
app.use('/api/farmers', farmerRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/milk-entries', milkEntryRoutes);
app.use('/api/fleet-management', fleetManagementRoutes);
app.use('/api/deliveries', deliveriesRouter);
app.use('/api/processing-units', processingUnitsRouter);
app.use('/api/production-batches', productionBatchRoutes);
app.use('/api/quality-control-records', qualityControlRoutes);
app.use('/api/maintenance-records', maintenanceRoutes);
app.use('/api/retailers', retailerRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/inventory-records', inventoryRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/lab-quality-tests', labQualityTestRoutes); // Register lab quality test routes
app.use('/api/reviews', reviewRoutes);
app.use('/api/farmer-feedback', farmerFeedbackRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/group-messages', groupMessageRoutes);
app.use('/api/compliance-records', complianceRecordRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/audits', auditRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/auth', require('./routes/authRoutes'));
// Optional: API root info
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'API root. Available endpoints: /api/farmers, /api/suppliers, /api/milk-entries, /api/fleet-management, /api/deliveries, /api/lab-quality-tests, /api/test-db, /api/test-lab-quality-tests,/api/test-farmer-feedback',
    endpoints: [
      '/api/farmers',
      '/api/suppliers', 
      '/api/milk-entries',
      '/api/fleet-management',
      '/api/deliveries',
      '/api/lab-quality-tests',
      '/api/test-db',
      '/api/test-lab-quality-tests',
      '/api/test-farmer-feedback'
    ]
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Dairy Management API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// ==========================================
// CRITICAL: 404 HANDLER MUST BE LAST
// ==========================================

// 404 handler (for all other routes) - MUST BE AFTER ALL ROUTES
app.use('*', (req, res) => {
  console.log(`❌ 404 Error: Route not found - ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    requestedUrl: req.originalUrl,
    method: req.method
  });
});

// Global error handler - MUST BE LAST
app.use((error, req, res, next) => {
  console.error('Global Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});



// Create HTTP server based on Express app
const server = http.createServer(app);

// Create Socket.IO server, allow multiple local frontends (multi-app dev)
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Make io available to other files via app.set if needed
app.set('socketio', io);

// Handle Socket.IO connections (customize as needed)
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  // Example: Listen for events & broadcast (optional)
  // socket.on('message', (msg) => {
  //   io.emit('message', msg);
  // });
});

// Start server (now with WebSocket support!)
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log('🔗 Test endpoints:');
});


// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

app.use(require('./middleware/errorHandler'));
