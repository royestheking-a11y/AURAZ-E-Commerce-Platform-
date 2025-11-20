#!/bin/bash

echo "🔧 FIXING AND STARTING AURAZ SERVER"
echo "===================================="
echo ""

# Step 1: Kill all processes
echo "1️⃣  Killing all old processes..."
pkill -9 -f "node.*server" 2>/dev/null
pkill -9 -f "vite" 2>/dev/null
pkill -9 -f "concurrently" 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null
sleep 2
echo "✅ All processes stopped"
echo ""

# Step 2: Check .env.local
echo "2️⃣  Checking environment..."
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found! Creating it..."
    cat > .env.local << 'EOF'
# MongoDB Configuration for Local Development
MONGODB_URI=mongodb+srv://royesblog_db_user:BrSl41Di2Oxxh71H@auraz-ecommerce.wann5gb.mongodb.net/auraz_ecommerce?retryWrites=true&w=majority&appName=auraz-ecommerce
MONGODB_DB_NAME=auraz_ecommerce
VITE_API_BASE=/api
EOF
    echo "✅ .env.local created"
else
    echo "✅ .env.local exists"
fi
echo ""

# Step 3: Test MongoDB
echo "3️⃣  Testing MongoDB connection..."
if node test-mongodb-connection.js > /dev/null 2>&1; then
    echo "✅ MongoDB connection successful"
else
    echo "❌ MongoDB connection failed!"
    exit 1
fi
echo ""

# Step 4: Start server and frontend
echo "4️⃣  Starting server and frontend..."
echo ""
echo "🚀 Starting on:"
echo "   - Backend Server: http://localhost:3001"
echo "   - Frontend: http://localhost:3000"
echo ""
echo "📋 Test endpoints:"
echo "   - http://localhost:3001/api/ping"
echo "   - http://localhost:3001/api/products"
echo ""
echo "Press Ctrl+C to stop"
echo ""
echo "===================================="
echo ""

npm run dev:all

