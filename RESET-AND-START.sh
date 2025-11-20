#!/bin/bash

echo "🔄 RESETTING AND STARTING AURAZ E-COMMERCE PLATFORM"
echo "=================================================="
echo ""

# Step 1: Kill all processes
echo "1️⃣  Killing all existing processes..."
pkill -9 -f "node.*server" 2>/dev/null
pkill -9 -f "vite" 2>/dev/null
pkill -9 -f "concurrently" 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null
sleep 2
echo "✅ All processes stopped"
echo ""

# Step 2: Check .env.local
echo "2️⃣  Checking environment variables..."
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found! Creating it..."
    cat > .env.local << 'EOF'
# MongoDB Configuration for Local Development
MONGODB_URI=mongodb+srv://royesblog_db_user:BrSl41Di2Oxxh71H@auraz-ecommerce.wann5gb.mongodb.net/auraz_ecommerce?retryWrites=true&w=majority&appName=auraz-ecommerce
MONGODB_DB_NAME=auraz_ecommerce

# Frontend API Configuration
VITE_API_BASE=/api
EOF
    echo "✅ .env.local created"
else
    echo "✅ .env.local exists"
fi
echo ""

# Step 3: Test MongoDB connection
echo "3️⃣  Testing MongoDB connection..."
if node test-mongodb-connection.js > /dev/null 2>&1; then
    echo "✅ MongoDB connection successful"
else
    echo "❌ MongoDB connection failed!"
    echo "💡 Please check your MongoDB connection string"
    exit 1
fi
echo ""

# Step 4: Install dependencies if needed
echo "4️⃣  Checking dependencies..."
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.bin/vite" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies installed"
fi
echo ""

# Step 5: Start server and frontend
echo "5️⃣  Starting server and frontend..."
echo ""
echo "🚀 Starting on:"
echo "   - Backend Server: http://localhost:3001"
echo "   - Frontend: http://localhost:3000"
echo ""
echo "📋 Test endpoints:"
echo "   - http://localhost:3001/api/ping"
echo "   - http://localhost:3001/api/test-connection"
echo "   - http://localhost:3001/api/products"
echo ""
echo "Press Ctrl+C to stop"
echo ""
echo "=================================================="
echo ""

npm run dev:all

