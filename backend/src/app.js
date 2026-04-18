const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config/env');

// Import routes
const generateRoutes = require('./routes/generate.routes');
const linkedinRoutes = require('./routes/linkedin.routes');

const app = express();

// Basic middleware
app.use(helmet());
app.use(cors({ origin: config.CORS_ORIGINS || '*' }));
app.use(express.json());
app.use(morgan('dev'));

// ============ ADD THESE ROUTES ============

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'GitHub to LinkedIn Post Generator API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      generate: '/api/generate',
      linkedinAuth: '/api/linkedin/auth-url',
      linkedinCallback: '/api/linkedin/callback',
      linkedinShare: '/api/linkedin/share'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ============ YOUR API ROUTES ============
app.use('/api', generateRoutes);
app.use('/api', linkedinRoutes);

// ============ 404 Handler for undefined routes ============
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    requestedUrl: req.originalUrl,
    availableEndpoints: [
      '/',
      '/api/health',
      '/api/generate (POST)',
      '/api/linkedin/auth-url (GET)',
      '/api/linkedin/share (POST)'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;