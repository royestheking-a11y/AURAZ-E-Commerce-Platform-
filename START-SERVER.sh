#!/bin/bash

echo "🚀 Starting AURAZ Server..."
echo ""

# Kill old processes
pkill -9 -f "node.*server" 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null
sleep 1

# Start server
echo "Starting server on port 3001..."
node server.js

