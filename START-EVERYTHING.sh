#!/bin/bash

echo "🚀 STARTING AURAZ E-COMMERCE PLATFORM"
echo "====================================="
echo ""

# Kill all old processes
echo "1️⃣  Stopping all old processes..."
pkill -9 -f "node.*server" 2>/dev/null
pkill -9 -f "vite" 2>/dev/null
pkill -9 -f "concurrently" 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null
sleep 2
echo "✅ All processes stopped"
echo ""

# Check environment
echo "2️⃣  Checking environment..."
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found!"
    exit 1
fi
echo "✅ Environment configured"
echo ""

# Test MongoDB
echo "3️⃣  Testing MongoDB connection..."
if node test-mongodb-connection.js > /dev/null 2>&1; then
    echo "✅ MongoDB connection successful"
else
    echo "❌ MongoDB connection failed!"
    exit 1
fi
echo ""

# Start server and frontend
echo "4️⃣  Starting server and frontend..."
echo ""
echo "🚀 Server: http://localhost:3001"
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo "📋 Test endpoints:"
echo "   - http://localhost:3001/api/ping"
echo "   - http://localhost:3001/api/products"
echo ""
echo "Press Ctrl+C to stop"
echo ""

npm run dev:all

