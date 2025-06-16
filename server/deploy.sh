#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Error: node_modules not found after npm install"
    exit 1
fi

# Start the server
echo "Starting server..."
node index.js 