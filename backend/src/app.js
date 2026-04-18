const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config/env');

// Import routes
const generateRoutes = require('./routes/generate.routes');

const app = express();

// Basic middleware
app.use(helmet());
app.use(cors({ origin: config.CORS_ORIGINS }));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api', generateRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const linkedinRoutes = require('./routes/linkedin.routes');
app.use('/api', linkedinRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;