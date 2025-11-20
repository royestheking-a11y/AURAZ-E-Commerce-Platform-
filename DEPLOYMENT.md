# Vercel Deployment Guide

## Prerequisites

1. MongoDB Atlas account with database created
2. Vercel account (hobby plan is sufficient)
3. Git repository (GitHub, GitLab, or Bitbucket)

## MongoDB Setup

1. Create a MongoDB Atlas cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user with read/write permissions
3. Get your connection string from MongoDB Atlas:
   - Go to your cluster → Connect → Connect your application
   - Copy the connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`)
   - Replace `<password>` with your database user password
4. The database `auraz_ecommerce` will be automatically created on first use
5. **Important**: In MongoDB Atlas Network Access, allow all IPs (0.0.0.0/0) or add Vercel's IP ranges

## Vercel Deployment Steps

### 1. Install Vercel CLI (optional)
```bash
npm i -g vercel
```

### 2. Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 3. Set Environment Variables

**IMPORTANT**: Go to your Vercel project → Settings → Environment Variables and add:

- **`MONGODB_URI`**: Your MongoDB Atlas connection string
  - Format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
  - Replace `username`, `password`, `cluster`, and `database` with your actual values
  - **Never commit this to Git!**

- **`MONGODB_DB_NAME`** (optional): Database name (defaults to `auraz_ecommerce`)

- **`VITE_API_BASE`** (optional): API base URL (defaults to `/api` for Vercel deployment)

### 4. Deploy

Click "Deploy" and wait for the build to complete.

## API Routes

The project uses 15 serverless functions (within Vercel hobby plan limit):

1. `/api/ping` - Health check endpoint
2. `/api/test-connection` - MongoDB connection test
3. `/api/users` - User management
4. `/api/products` - Product management
5. `/api/orders` - Order management
6. `/api/carousel` - Carousel slides
7. `/api/vouchers` - Voucher codes
8. `/api/promo-cards` - Promotional cards
9. `/api/payments` - Payment verifications
10. `/api/refunds` - Refund requests
11. `/api/notifications` - Notifications
12. `/api/reviews` - Product reviews
13. `/api/conversations` - AI conversations
14. `/api/settings` - Delivery settings
15. `/api/wishlist` - User wishlist management

## Post-Deployment

1. The app will automatically initialize with default data on first load
2. Check the browser console for any connection errors
3. Test the admin panel: `/admin/login`
   - Email: `auraz@admin.com`
   - Password: `auraz878`

## Troubleshooting

### API Routes Not Working
- Check that environment variables are set correctly
- Verify MongoDB connection string is correct
- Check Vercel function logs for errors

### Database Connection Issues
- Verify MongoDB Atlas IP whitelist allows all IPs (0.0.0.0/0) for development
- Check MongoDB connection string format
- Verify database user has proper permissions

### Build Errors
- Ensure all dependencies are in `package.json`
- Check Node.js version compatibility (18.x recommended)
- Review build logs in Vercel dashboard

## Local Development

1. Install dependencies: `npm install`
2. Create `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string_here
   MONGODB_DB_NAME=auraz_ecommerce
   VITE_API_BASE=/api
   ```
   **Note**: Copy `.env.example` and fill in your actual MongoDB connection string.

3. Start the development server:
   ```bash
   # Option 1: Run frontend only (uses Vite proxy to localhost:3001)
   npm run dev
   
   # Option 2: Run both frontend and backend
   npm run dev:all
   ```

4. Frontend will be available at `http://localhost:3000`
5. Backend API (if running separately) will be at `http://localhost:3001`
6. API routes will be available at `http://localhost:3000/api/*` (proxied to backend)

## Notes

- Cart and wishlist remain in localStorage (user-specific)
- User session remains in localStorage
- All other data is stored in MongoDB
- The app initializes with default data if database is empty


