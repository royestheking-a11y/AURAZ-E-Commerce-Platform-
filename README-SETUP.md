# AURAZ E-Commerce Platform - MongoDB Setup

## Quick Start

### 1. Start the API Server
```bash
npm run dev:server
```

This starts the API server on `http://localhost:3001` that connects to MongoDB and serves all data.

### 2. Start the Frontend (in another terminal)
```bash
npm run dev
```

This starts the frontend on `http://localhost:3000` (or another port if 3000 is busy).

### 3. Or Start Both Together
```bash
npm run dev:all
```

## MongoDB Connection

✅ **MongoDB is already connected!**
- Database: `auraz_ecommerce`
- Collections: 14 collections with data
- Products: 24 products available
- Users: 3 users available
- Orders: 4 orders available

## API Endpoints

All APIs are available at `http://localhost:3001/api/*`:

- `/api/products` - Get all products (for homepage)
- `/api/users` - Get all users (for admin panel)
- `/api/orders` - Get all orders (for admin panel)
- `/api/carousel` - Get carousel slides (for homepage)
- `/api/vouchers` - Get vouchers
- `/api/promo-cards` - Get promo cards (for homepage)
- `/api/payments` - Get payment verifications
- `/api/refunds` - Get refund requests
- `/api/notifications` - Get notifications
- `/api/reviews` - Get product reviews
- `/api/conversations` - Get support conversations
- `/api/settings` - Get delivery settings
- `/api/test-connection` - Test MongoDB connection

## How It Works

1. **API Server** (`server.js`) connects to MongoDB Atlas
2. **API Routes** fetch data from MongoDB collections
3. **Frontend** (`AppContext.tsx`) calls APIs to load data
4. **Website & Admin Panel** display the MongoDB data

## Verify It's Working

1. **Check API Server:**
   ```bash
   curl http://localhost:3001/api/ping
   # Should return: {"success":true,"message":"pong",...}
   ```

2. **Check Products:**
   ```bash
   curl http://localhost:3001/api/products
   # Should return products array
   ```

3. **Check Browser Console:**
   - Open `http://localhost:3000`
   - Open browser console (F12)
   - Should see: `✅ Loaded 24 products from MongoDB`

## Troubleshooting

### If API Server Won't Start:
- Check if port 3001 is in use: `lsof -i:3001`
- Kill existing process: `kill -9 $(lsof -ti:3001)`

### If Data Not Showing:
- Make sure API server is running first
- Check browser console for errors
- Verify API is responding: `curl http://localhost:3001/api/products`

### If Frontend Can't Connect:
- Make sure API server is running on port 3001
- Vite proxy automatically forwards `/api/*` to `http://localhost:3001/api/*`
- Check `vite.config.ts` proxy configuration

## Summary

**MongoDB:** ✅ Connected  
**API Server:** Run `npm run dev:server`  
**Frontend:** Run `npm run dev`  
**Or Both:** Run `npm run dev:all`

After starting both servers, refresh your browser and all MongoDB data will appear on the website and admin panel!

