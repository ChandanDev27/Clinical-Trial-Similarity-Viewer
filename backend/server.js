const express = require('express');
const cors = require('cors');
const trialsRoutes = require('./routes/trialsRoutes');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const { connectToDatabase } = require('./db');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Database connection
connectToDatabase();

// Enhanced CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(logger);

// API routes
app.use('/api/trials', trialsRoutes);

// Health check with more details
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ 
    success: false,
    message: `Route ${req.originalUrl} not found` 
  });
});

app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

module.exports = app;