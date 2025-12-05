const express = require('express');
const serverless = require('serverless-http');

const app = express();
app.use(express.json({ limit: '10mb' })); // Increase limit for base64 images

// Import your routes
const registrationRoutes = require('../../backend/routes/registrationRoutes');

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log('=== Request Details ===');
  console.log('Path:', req.path);
  console.log('Original URL:', req.originalUrl);
  console.log('Base URL:', req.baseUrl);
  console.log('Method:', req.method);
  console.log('======================');
  next();
});

// Middleware to normalize paths for Netlify serverless-http
// serverless-http may pass different paths depending on how the function is called
app.use((req, res, next) => {
  // Normalize the path - extract /register from any path that contains it
  if (req.path.includes('/register')) {
    // If path is /api/register or /.netlify/functions/api/register, normalize to /register
    if (req.path === '/api/register' || req.path === '/register' || req.path.endsWith('/register')) {
      req.url = '/register';
    }
  }
  next();
});

// Mount registration routes
// registrationRoutes.js has router.post('/', ...) 
// So mounting at /register handles POST /register
app.use('/register', registrationRoutes);

// Root path handler (health check)
app.get('/', (req, res) => {
  res.json({ 
    message: 'ISAI ILLAM Registration API is running',
    endpoints: {
      register: 'POST /api/register or POST /register'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error stack:', err.stack);
  console.error('Error message:', err.message);
  res.status(500).json({ 
    status: 'error', 
    message: err.message || 'Something went wrong!' 
  });
});

// 404 handler - should be last
app.use((req, res) => {
  console.log('404 - Route not found:', req.path);
  res.status(404).json({ 
    status: 'error', 
    message: `Route not found: ${req.path}` 
  });
});

const serverlessHandler = serverless(app, {
  binary: ['image/*', 'application/pdf']
});

// Export the handler
exports.handler = serverlessHandler;
