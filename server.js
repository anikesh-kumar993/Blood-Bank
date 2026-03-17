/**
 * Digital Blood Network - Main Server
 * Express server entry point with all route mounting and middleware configuration
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');

// Initialize Express app
const app = express();

// Request logging middleware to debug 404s/405s
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.url} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from root directory (no public/ subfolder)
app.use(express.static(path.join(__dirname)));

// Health check and connection test endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Digital Blood Network API is running' });
});

app.post('/api/ping', (req, res) => {
  res.json({ status: 'OK', message: 'POST request received successfully', data: req.body });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/donors', require('./routes/donors'));
app.use('/api/requests', require('./routes/patients'));
app.use('/api/hospitals', require('./routes/hospitals'));
app.use('/api/admin', require('./routes/admin'));

// 405 Catch-all for API routes (if method not matched)
app.use('/api', (req, res, next) => {
  if (!res.headersSent) {
    console.warn(`[WRONG METHOD] ${req.method} on ${req.url}`);
    res.status(405).json({ 
      message: `Method ${req.method} not allowed on ${req.url}. Please verify the API documentation.` 
    });
  } else {
    next();
  }
});

// Serve index.html for any non-API routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║     Digital Blood Network Server         ║
  ║     Running on port ${PORT}                  ║
  ║     http://localhost:${PORT}                 ║
  ╚══════════════════════════════════════════╝
  `);
});
