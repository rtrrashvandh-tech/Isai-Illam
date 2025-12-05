#!/bin/bash
# Exit on any error
set -e

# Install frontend dependencies and build
echo "Building frontend..."
npm install
npm run build

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
cd ..