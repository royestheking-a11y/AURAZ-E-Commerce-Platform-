#!/bin/bash

# AURAZ E-Commerce Platform - Complete Startup
# Starts MongoDB API Server + Frontend

cd "$(dirname "$0")"

echo "🚀 AURAZ E-Commerce Platform - Starting Everything..."
echo ""

# Kill old processes
echo "🧹 Cleaning up..."
pkill -f "node.*server.js" 2>/dev/null
pkill -f "vite" 2>/dev/null
sleep 2

# Check environment
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local not found!"
    exit 1
fi

echo "📡 Starting MongoDB API Server (Port 3001)..."
node server.js &
SERVER_PID=$!
sleep 6

# Verify server
if ! curl -s http://localhost:3001/api/ping > /dev/null; then
    echo "❌ Server failed to start!"
    exit 1
fi

echo "✅ Server running: http://localhost:3001"
echo ""

echo "🎨 Starting Frontend (Port 3000)..."
npm run dev &
FRONTEND_PID=$!
sleep 3

echo ""
echo "✅ Everything Started Successfully!"
echo ""
echo "🌐 Website: http://localhost:3000"
echo "📡 API: http://localhost:3001/api/ping"
echo ""
echo "📊 MongoDB Data Available:"
echo "   - Products: 71 items"
echo "   - Users: 8 users"
echo "   - Orders: 10 orders"
echo "   - And more..."
echo ""
echo "🛑 Press Ctrl+C to stop everything"
echo ""

# Wait for user interrupt
trap "echo ''; echo '🛑 Stopping...'; kill $SERVER_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait

