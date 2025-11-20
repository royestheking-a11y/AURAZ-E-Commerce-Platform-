#!/bin/bash

# Fix and restart server

cd "$(dirname "$0")"

echo "🛑 Stopping all servers..."
pkill -f "node.*server.js" 2>/dev/null
sleep 2

echo "🚀 Starting fresh server..."
node server.js &
SERVER_PID=$!

echo "⏳ Waiting for server to start..."
sleep 8

echo "🧪 Testing server..."
if curl -s http://localhost:3001/api/ping > /dev/null 2>&1; then
    echo "✅ Server is working!"
    echo "📡 Server running on http://localhost:3001"
    echo "🆔 Server PID: $SERVER_PID"
    echo ""
    echo "Now start the frontend with: npm run dev"
else
    echo "❌ Server failed to start properly"
    echo "Check the error messages above"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

