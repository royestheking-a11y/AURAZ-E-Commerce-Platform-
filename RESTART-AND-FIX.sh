#!/bin/bash

# Complete restart and fix script

cd "$(dirname "$0")"

echo "🛑 Stopping everything..."
pkill -f "node.*server.js" 2>/dev/null
pkill -f "vite" 2>/dev/null
sleep 3

echo "🧹 Cleaning up..."
rm -f /tmp/server*.log 2>/dev/null

echo ""
echo "🚀 Starting MongoDB API Server..."
node server.js > server.log 2>&1 &
SERVER_PID=$!
echo "   Server PID: $SERVER_PID"

echo "⏳ Waiting for server to initialize..."
sleep 8

echo ""
echo "🧪 Testing server..."
if curl -s -m 5 http://localhost:3001/api/ping > /dev/null 2>&1; then
    echo "✅ Server is working!"
    echo ""
    echo "📊 Testing endpoints..."
    curl -s http://localhost:3001/api/ping | python3 -m json.tool 2>/dev/null | head -3
    echo ""
    curl -s "http://localhost:3001/api/products" | python3 -c "import sys, json; d=json.load(sys.stdin); print(f\"Products: {len(d.get('data', []))} items\")" 2>/dev/null
    echo ""
else
    echo "❌ Server is not responding"
    echo "📋 Server logs:"
    tail -20 server.log
    echo ""
    echo "⚠️  Please check the error messages above"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

echo ""
echo "✅ Server is ready!"
echo ""
echo "🌐 Next steps:"
echo "   1. Start frontend: npm run dev"
echo "   2. Open: http://localhost:3000 (or the port Vite shows)"
echo ""
echo "📡 Server running on: http://localhost:3001"
echo "📝 Server logs: tail -f server.log"
echo ""

