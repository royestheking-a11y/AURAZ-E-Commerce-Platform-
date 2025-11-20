#!/bin/bash

# AURAZ E-Commerce Platform - Complete Startup Script
# This script starts both the MongoDB API server and the frontend

echo "🚀 Starting AURAZ E-Commerce Platform..."
echo ""

# Kill any existing processes
echo "🧹 Cleaning up old processes..."
pkill -f "node.*server.js" 2>/dev/null
pkill -f "vite" 2>/dev/null
sleep 2

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local file not found!"
    echo "💡 Please create .env.local with MONGODB_URI and MONGODB_DB_NAME"
    exit 1
fi

# Start server in background
echo "📡 Starting MongoDB API Server..."
node server.js > server.log 2>&1 &
SERVER_PID=$!
echo "   Server PID: $SERVER_PID"

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 5

# Test if server is running
if curl -s http://localhost:3001/api/ping > /dev/null 2>&1; then
    echo "✅ Server is running on http://localhost:3001"
else
    echo "❌ Server failed to start. Check server.log for errors."
    cat server.log
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

# Start frontend
echo "🎨 Starting Frontend..."
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"

# Wait a bit for frontend
sleep 3

echo ""
echo "✅ Everything is starting!"
echo ""
echo "📋 Access Points:"
echo "   🌐 Website: http://localhost:3000"
echo "   📡 API: http://localhost:3001/api/ping"
echo ""
echo "📝 Logs:"
echo "   Server: tail -f server.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "🛑 To stop: pkill -f 'node.*server.js' && pkill -f vite"
echo ""

# Keep script running
wait

