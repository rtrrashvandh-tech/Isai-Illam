const { handler } = require('@netlify/functions');
const express = require('express');
const serverless = require('serverless-http');
const app = express();
app.use(express.json());

// Import your routes
const registrationRoutes = require('../../backend/routes/registrationRoutes');
app.use('/api/register', registrationRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', message: 'Something went wrong!' });
});

const serverlessHandler = serverless(app);

exports.handler = async (event, context) => {
  return await serverlessHandler(event, context);
};