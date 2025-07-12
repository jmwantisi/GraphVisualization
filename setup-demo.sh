#!/bin/bash

echo "🚀 Setting up Malawi Graph Visualization Demo"
echo "=============================================="

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Start the React development server
echo "🌐 Starting React development server..."
echo "Demo will be available at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run react:dev 