const { handler } = require('@netlify/functions');
const express = require('express');
const serverless = require('serverless-http');

const app = express();

// Your existing Express routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Import your existing routes
const registrationRoutes = require('../../backend/routes/registrationRoutes');
app.use('/api/register', registrationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', message: 'Something went wrong!' });
});

// Export the serverless function
const serverlessHandler = serverless(app);

exports.handler = async (event, context) => {
  return await serverlessHandler(event, context);
};