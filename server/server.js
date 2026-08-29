const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const postsRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Static files (optional for direct uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/posts', postsRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Daily Bugle / Spider-Man Comic CMS',
    timestamp: new Date().toISOString(),
    edition: 'Marvel Multiverse Vol. 61'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Spider-Sense Alert: The requested headline/endpoint does not exist!'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal printing press error! Daily Bugle servers are recovering.',
    error: err.message
  });
});

// Start Server
app.listen(PORT, () => {
  console.log('===================================================');
  console.log('🕷️ DAILY BUGLE COMIC CMS BACKEND ONLINE! 📰');
  console.log(`🚀 REST API listening on http://localhost:${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📑 Posts endpoint: http://localhost:${PORT}/api/posts`);
  console.log(`🔐 Auth endpoint: http://localhost:${PORT}/api/auth`);
  console.log('===================================================');
});

module.exports = app;
