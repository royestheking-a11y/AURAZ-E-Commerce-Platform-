# ✅ MongoDB Connection Guide - Complete Setup

## Current Status

✅ **MongoDB Connection: WORKING**
- Database: `auraz_ecommerce`
- Collections: 14 collections with data
- Connection: Verified and tested

## Connection Architecture

```
┌─────────────┐
│   Frontend  │ (React/Vite - Port 3000)
│  (Browser)  │
└──────┬──────┘
       │ HTTP Requests
       │ /api/*
       ▼
┌─────────────┐
│   Vite      │ (Development Proxy)
│   Proxy     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Server    │ (Express - Port 3001)
│  server.js  │
└──────┬──────┘
       │ MongoDB Driver
       ▼
┌─────────────┐
│  MongoDB    │ (MongoDB Atlas)
│  Database   │
└─────────────┘
```

## Files Involved

### 1. **Server Connection** (`server.js`)
- Loads MongoDB URI from `.env.local`
- Connects to MongoDB on startup
- Provides REST API endpoints at `/api/*`

### 2. **API Serverless Functions** (`api/*.ts`)
- For Vercel deployment
- Each file is a serverless function
- Uses `api/mongodb.ts` for connection

### 3. **Frontend API Client** (`src/lib/mongodbApi.ts`)
- Makes HTTP requests to `/api/*`
- In development: Uses Vite proxy to `localhost:3001`
- In production: Uses direct `/api/*` routes (Vercel)

## Setup Instructions

### Step 1: Environment Variables

Create `.env.local` in project root:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auraz_ecommerce?retryWrites=true&w=majority
MONGODB_DB_NAME=auraz_ecommerce
VITE_API_BASE=/api
```

### Step 2: Start the Server

**Option A: Run Both Frontend and Backend**
```bash
npm run dev:all
```

**Option B: Run Separately**
```bash
# Terminal 1 - Backend Server
npm run dev:server

# Terminal 2 - Frontend
npm run dev
```

### Step 3: Verify Connection

**Test MongoDB Connection:**
```bash
node test-mongodb-connection.js
```

**Test All API Endpoints:**
```bash
node verify-all-connections.js
```

**Test in Browser:**
- Open: http://localhost:3000
- Check browser console for connection status
- Test API: http://localhost:3001/api/ping

## API Endpoints

All endpoints are available at `http://localhost:3001/api/*`:

1. ✅ `/api/ping` - Health check
2. ✅ `/api/test-connection` - MongoDB connection test
3. ✅ `/api/users` - User management
4. ✅ `/api/products` - Product management
5. ✅ `/api/orders` - Order management
6. ✅ `/api/carousel` - Carousel slides
7. ✅ `/api/vouchers` - Voucher codes
8. ✅ `/api/promo-cards` - Promotional cards
9. ✅ `/api/payments` - Payment verifications
10. ✅ `/api/refunds` - Refund requests
11. ✅ `/api/notifications` - Notifications
12. ✅ `/api/reviews` - Product reviews
13. ✅ `/api/conversations` - AI conversations
14. ✅ `/api/settings` - Delivery settings
15. ✅ `/api/wishlist` - User wishlist

## Data Flow

### Frontend → API → MongoDB

1. **User Action** (e.g., view products)
2. **Frontend** calls `productsApi.getAll()`
3. **HTTP Request** to `/api/products`
4. **Vite Proxy** forwards to `http://localhost:3001/api/products`
5. **Server** (`server.js`) receives request
6. **MongoDB Query** executed via `getDB()`
7. **Response** sent back to frontend
8. **UI Updates** with data

## Current Database Status

✅ **14 Collections with Data:**
- `products`: 71 documents
- `users`: 8 documents
- `orders`: 10 documents
- `carousel_slides`: 7 documents
- `vouchers`: 15 documents
- `promo_cards`: 4 documents
- `payment_verifications`: 4 documents
- `refund_requests`: 2 documents
- `notifications`: 10 documents
- `reviews`: 12 documents
- `conversations`: 2 documents
- `user_wishlists`: 3 documents
- `delivery_settings`: 1 document
- `test_connection`: 0 documents

## Troubleshooting

### Server Won't Start

**Error: MONGODB_URI not found**
```bash
# Solution: Create .env.local file
cat > .env.local << EOF
MONGODB_URI=your_connection_string_here
MONGODB_DB_NAME=auraz_ecommerce
EOF
```

### API Returns 500 Errors

**Check:**
1. Is server running? `npm run dev:server`
2. Is MongoDB URI correct in `.env.local`?
3. Check server console for errors
4. Test MongoDB connection: `node test-mongodb-connection.js`

### Frontend Can't Connect to API

**Check:**
1. Is Vite proxy configured? (Yes, in `vite.config.ts`)
2. Is server running on port 3001?
3. Check browser console for CORS errors
4. Test API directly: http://localhost:3001/api/ping

### MongoDB Connection Fails

**Check:**
1. MongoDB Atlas Network Access - Allow `0.0.0.0/0` (all IPs)
2. Database user credentials are correct
3. Connection string format is correct
4. MongoDB cluster is running

## Quick Start Commands

```bash
# 1. Install dependencies (if not done)
npm install

# 2. Verify MongoDB connection
node test-mongodb-connection.js

# 3. Start development server
npm run dev:all

# 4. In another terminal, verify all connections
node verify-all-connections.js

# 5. Open browser
# http://localhost:3000
```

## Production Deployment (Vercel)

For Vercel deployment:
1. Set environment variables in Vercel dashboard
2. `MONGODB_URI` - Your MongoDB connection string
3. `MONGODB_DB_NAME` - `auraz_ecommerce`
4. `VITE_API_BASE` - `/api`

The serverless functions in `api/` folder will handle API requests.

---

## ✅ Connection Status

- ✅ MongoDB: Connected and tested
- ✅ Server: Ready to start
- ✅ API Routes: All configured
- ✅ Frontend: Ready to connect

**Everything is properly connected and ready to use!** 🚀

