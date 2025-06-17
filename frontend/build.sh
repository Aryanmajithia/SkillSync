#!/bin/bash

# Clean install for Vercel deployment
echo "Cleaning node_modules..."
rm -rf node_modules
rm -rf package-lock.json

echo "Installing dependencies..."
npm install

echo "Building project..."
npm run build

echo "Build completed!" 