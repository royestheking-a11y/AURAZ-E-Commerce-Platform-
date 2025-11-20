# MongoDB Setup & Migration Guide

## Issue: Collections Not Created

If MongoDB collections haven't been created, it means the connection isn't working properly. Follow these steps:

## Step 1: Test MongoDB Connection

1. Start the dev server: `npm run dev`
2. Navigate to: `http://localhost:3000/mongo-test`
3. Click "Test MongoDB Connection"
4. Check if connection is successful

## Step 2: Migrate Existing Data

1. On the test page, click "Migrate localStorage to MongoDB"
2. This will transfer all existing localStorage data to MongoDB
3. Collections will be automatically created when data is inserted

## Step 3: Verify Collections

After migration, test the connection again. You should see:
- `users` collection
- `products` collection
- `orders` collection
- `carousel_slides` collection
- `vouchers` collection
- `promo_cards` collection
- `payment_verifications` collection
- `refund_requests` collection
- `notifications` collection
- `reviews` collection
- `conversations` collection
- `delivery_settings` collection

## Troubleshooting

### Connection Fails

1. **Check MongoDB Connection String:**
   - Current: `mongodb+srv://royesblog_db_user:BrSl41Di2Oxxh71H@auraz-ecommerce.wann5gb.mongodb.net/?appName=auraz-ecommerce`
   - Verify in MongoDB Atlas dashboard

2. **Check IP Whitelist:**
   - In MongoDB Atlas, go to Network Access
   - Add `0.0.0.0/0` to allow all IPs (for development)
   - Or add your specific IP address

3. **Check Database User:**
   - Username: `royesblog_db_user`
   - Password: `BrSl41Di2Oxxh71H`
   - Verify user has read/write permissions

4. **Check Environment Variables:**
   - In Vercel: Set `MONGODB_URI` environment variable
   - Locally: Create `.env.local` with `MONGODB_URI=...`

### API Routes Not Working in Development

In development mode, Vite dev server doesn't handle API routes. You have two options:

**Option 1: Use Vercel CLI (Recommended)**
```bash
npm i -g vercel
vercel dev
```

**Option 2: Deploy to Vercel**
- Push to Git
- Deploy to Vercel
- Test on deployed URL

### Collections Still Not Created

1. Check browser console for errors
2. Check MongoDB Atlas dashboard → Collections tab
3. Try manually inserting a document:
   ```javascript
   // In MongoDB Atlas shell or Compass
   use auraz_ecommerce
   db.users.insertOne({ id: "test", name: "Test User" })
   ```

## Automatic Migration

The app will automatically:
1. Check for localStorage data on first load
2. Migrate it to MongoDB if found
3. Initialize with default data if database is empty

## Manual Migration Script

If automatic migration doesn't work, use the test page:
1. Go to `/mongo-test`
2. Click "Migrate localStorage to MongoDB"
3. Wait for completion
4. Refresh the app

## Verification

After successful migration:
1. Check MongoDB Atlas → Collections
2. You should see all collections with data
3. The app should load data from MongoDB
4. New data should be saved to MongoDB

## Next Steps

Once collections are created:
1. Remove the test page route (optional)
2. Continue using the app normally
3. All data will be stored in MongoDB
4. Cart and wishlist remain in localStorage (by design)

