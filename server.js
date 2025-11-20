// AURAZ E-Commerce Platform - MongoDB API Server
require('dotenv').config({ path: '.env.local' });

const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB Configuration
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME || 'auraz_ecommerce';

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is required');
  console.error('💡 Please check your .env.local file');
  process.exit(1);
}

// Global database connection
let db = null;
let client = null;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Connect to MongoDB
async function connectDB() {
  try {
    if (client && db) {
      try {
        await db.admin().ping();
        return db;
      } catch (e) {
        client = null;
        db = null;
      }
    }

    console.log('🔄 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    await client.connect();
    db = client.db(DB_NAME);
    console.log('✅ Connected to MongoDB:', DB_NAME);
    
    await db.admin().ping();
    console.log('✅ MongoDB connection verified');
    
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
}

// Get database helper
async function getDB() {
  try {
    if (!db || !client) {
      await connectDB();
    }
    
    if (db) {
      try {
        await db.admin().ping();
      } catch (e) {
        console.log('🔄 Connection lost, reconnecting...');
        if (client) {
          try {
            await client.close();
          } catch (closeErr) {}
        }
        client = null;
        db = null;
        await connectDB();
      }
    }
    
    if (!db) {
      throw new Error('Failed to establish database connection');
    }
    
    return db;
  } catch (error) {
    console.error('❌ Error in getDB:', error.message);
    throw error;
  }
}

// Health check
app.get('/api/ping', (req, res) => {
  res.json({ success: true, message: 'pong', timestamp: new Date().toISOString() });
});

// Test connection
app.get('/api/test-connection', async (req, res) => {
  try {
    const database = await getDB();
    const collections = await database.listCollections().toArray();
    const counts = {};
    
    for (const col of collections) {
      try {
        counts[col.name] = await database.collection(col.name).countDocuments();
      } catch (e) {
        counts[col.name] = 0;
      }
    }
    
    res.json({
      success: true,
      connected: true,
      database: DB_NAME,
      collections: collections.map(c => c.name),
      counts
    });
  } catch (error) {
    console.error('Error in /api/test-connection:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Products API
app.get('/api/products', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('products');
    
    if (req.query.id) {
      const product = await collection.findOne({ id: req.query.id });
      return res.json({ success: true, data: product });
    }
    if (req.query.category) {
      const products = await collection.find({ category: req.query.category }).toArray();
      return res.json({ success: true, data: products });
    }
    
    const products = await collection.find({}).toArray();
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error in /api/products:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Users API
app.get('/api/users', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('users');
    
    if (req.query.id) {
      const user = await collection.findOne({ id: req.query.id });
      return res.json({ success: true, data: user });
    }
    if (req.query.email) {
      const user = await collection.findOne({ email: req.query.email });
      return res.json({ success: true, data: user });
    }
    
    const users = await collection.find({}).toArray();
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Error in /api/users:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Orders API
app.get('/api/orders', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('orders');
    
    if (req.query.id) {
      const order = await collection.findOne({ id: req.query.id });
      return res.json({ success: true, data: order });
    }
    if (req.query.userId) {
      const orders = await collection.find({ userId: req.query.userId }).toArray();
      return res.json({ success: true, data: orders });
    }
    
    const orders = await collection.find({}).toArray();
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error in /api/orders:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Carousel API
app.get('/api/carousel', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('carousel_slides');
    
    if (req.query.id) {
      const slide = await collection.findOne({ id: req.query.id });
      return res.json({ success: true, data: slide });
    }
    
    const slides = await collection.find({}).toArray();
    res.json({ success: true, data: slides });
  } catch (error) {
    console.error('Error in /api/carousel:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Vouchers API
app.get('/api/vouchers', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('vouchers');
    
    if (req.query.id) {
      const voucher = await collection.findOne({ id: req.query.id });
      return res.json({ success: true, data: voucher });
    }
    
    const vouchers = await collection.find({}).toArray();
    res.json({ success: true, data: vouchers });
  } catch (error) {
    console.error('Error in /api/vouchers:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Promo Cards API
app.get('/api/promo-cards', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('promo_cards');
    
    if (req.query.id) {
      const card = await collection.findOne({ id: req.query.id });
      return res.json({ success: true, data: card });
    }
    
    const cards = await collection.find({}).toArray();
    res.json({ success: true, data: cards });
  } catch (error) {
    console.error('Error in /api/promo-cards:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Payments API
app.get('/api/payments', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('payment_verifications');
    
    if (req.query.id) {
      const payment = await collection.findOne({ id: req.query.id });
      return res.json({ success: true, data: payment });
    }
    if (req.query.userId) {
      const payments = await collection.find({ userId: req.query.userId }).sort({ createdAt: -1 }).toArray();
      return res.json({ success: true, data: payments });
    }
    
    const payments = await collection.find({}).sort({ createdAt: -1 }).toArray();
    res.json({ success: true, data: payments });
  } catch (error) {
    console.error('Error in /api/payments:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Refunds API
app.get('/api/refunds', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('refund_requests');
    
    if (req.query.id) {
      const refund = await collection.findOne({ id: req.query.id });
      return res.json({ success: true, data: refund });
    }
    if (req.query.userId) {
      const refunds = await collection.find({ userId: req.query.userId }).toArray();
      return res.json({ success: true, data: refunds });
    }
    
    const refunds = await collection.find({}).toArray();
    res.json({ success: true, data: refunds });
  } catch (error) {
    console.error('Error in /api/refunds:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Notifications API
app.get('/api/notifications', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('notifications');
    
    if (req.query.id) {
      const notification = await collection.findOne({ id: req.query.id });
      return res.json({ success: true, data: notification });
    }
    if (req.query.userId) {
      const notifications = await collection.find({
        $or: [
          { userId: req.query.userId },
          { userId: null, target: { $in: ['user', 'all'] } }
        ]
      }).sort({ createdAt: -1 }).toArray();
      return res.json({ success: true, data: notifications });
    }
    
    const notifications = await collection.find({}).sort({ createdAt: -1 }).toArray();
    res.json({ success: true, data: notifications });
  } catch (error) {
    console.error('Error in /api/notifications:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Reviews API
app.get('/api/reviews', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('reviews');
    
    if (req.query.id) {
      const review = await collection.findOne({ id: req.query.id });
      return res.json({ success: true, data: review });
    }
    if (req.query.productId) {
      const reviews = await collection.find({ productId: req.query.productId }).sort({ createdAt: -1 }).toArray();
      return res.json({ success: true, data: reviews });
    }
    
    const reviews = await collection.find({}).sort({ createdAt: -1 }).toArray();
    res.json({ success: true, data: reviews });
  } catch (error) {
    console.error('Error in /api/reviews:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Conversations API
app.get('/api/conversations', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('conversations');
    
    if (req.query.id) {
      const conversation = await collection.findOne({ id: req.query.id });
      return res.json({ success: true, data: conversation });
    }
    if (req.query.userId) {
      const conversations = await collection.find({ userId: req.query.userId }).sort({ lastMessageAt: -1 }).toArray();
      return res.json({ success: true, data: conversations });
    }
    
    const conversations = await collection.find({}).sort({ lastMessageAt: -1 }).toArray();
    res.json({ success: true, data: conversations });
  } catch (error) {
    console.error('Error in /api/conversations:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Settings API
app.get('/api/settings', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('delivery_settings');
    let settings = await collection.findOne({ id: 'default' });
    
    if (!settings) {
      settings = {
        id: 'default',
        dhakaCharge: 60,
        outsideDhakaCharge: 110,
        freeShippingThreshold: 5000
      };
      await collection.insertOne(settings);
    }
    
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error in /api/settings:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Wishlist API
app.get('/api/wishlist', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('user_wishlists');
    
    if (!req.query.userId) {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }
    
    let wishlist = await collection.findOne({ userId: req.query.userId });
    
    if (!wishlist) {
      wishlist = {
        userId: req.query.userId,
        products: [],
        updatedAt: new Date().toISOString()
      };
      await collection.insertOne(wishlist);
    }
    
    res.json({ success: true, data: wishlist });
  } catch (error) {
    console.error('Error in /api/wishlist:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST/PUT/DELETE endpoints for all collections
app.post('/api/products', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('products');
    const newProduct = req.body;
    newProduct.id = newProduct.id || `product-${Date.now()}`;
    await collection.insertOne(newProduct);
    res.json({ success: true, data: newProduct });
  } catch (error) {
    console.error('Error in POST /api/products:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/products', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('products');
    const { id, ...updates } = req.body;
    await collection.updateOne({ id }, { $set: updates });
    res.json({ success: true });
  } catch (error) {
    console.error('Error in PUT /api/products:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/products', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('products');
    await collection.deleteOne({ id: req.query.id });
    res.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/products:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('users');
    const newUser = req.body;
    newUser.id = newUser.id || `user-${Date.now()}`;
    newUser.createdAt = newUser.createdAt || new Date().toISOString();
    await collection.insertOne(newUser);
    res.json({ success: true, data: newUser });
  } catch (error) {
    console.error('Error in POST /api/users:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/users', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('users');
    const { id, ...updates } = req.body;
    await collection.updateOne({ id }, { $set: updates });
    res.json({ success: true });
  } catch (error) {
    console.error('Error in PUT /api/users:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/users', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('users');
    await collection.deleteOne({ id: req.query.id });
    res.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/users:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('orders');
    const newOrder = req.body;
    newOrder.id = newOrder.id || `order-${Date.now()}`;
    newOrder.createdAt = newOrder.createdAt || new Date().toISOString();
    await collection.insertOne(newOrder);
    res.json({ success: true, data: newOrder });
  } catch (error) {
    console.error('Error in POST /api/orders:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/orders', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('orders');
    const { id, ...updates } = req.body;
    await collection.updateOne({ id }, { $set: updates });
    res.json({ success: true });
  } catch (error) {
    console.error('Error in PUT /api/orders:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/orders', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('orders');
    await collection.deleteOne({ id: req.query.id });
    res.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/orders:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/carousel', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('carousel_slides');
    const newSlide = req.body;
    newSlide.id = newSlide.id || `slide-${Date.now()}`;
    await collection.insertOne(newSlide);
    res.json({ success: true, data: newSlide });
  } catch (error) {
    console.error('Error in POST /api/carousel:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/carousel', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('carousel_slides');
    const { id, ...updates } = req.body;
    await collection.updateOne({ id }, { $set: updates });
    res.json({ success: true });
  } catch (error) {
    console.error('Error in PUT /api/carousel:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/carousel', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('carousel_slides');
    await collection.deleteOne({ id: req.query.id });
    res.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/carousel:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/vouchers', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('vouchers');
    const newVoucher = req.body;
    newVoucher.id = newVoucher.id || `voucher-${Date.now()}`;
    await collection.insertOne(newVoucher);
    res.json({ success: true, data: newVoucher });
  } catch (error) {
    console.error('Error in POST /api/vouchers:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/vouchers', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('vouchers');
    const { id, ...updates } = req.body;
    await collection.updateOne({ id }, { $set: updates });
    res.json({ success: true });
  } catch (error) {
    console.error('Error in PUT /api/vouchers:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/vouchers', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('vouchers');
    await collection.deleteOne({ id: req.query.id });
    res.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/vouchers:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/promo-cards', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('promo_cards');
    const newCard = req.body;
    newCard.id = newCard.id || `promo-${Date.now()}`;
    await collection.insertOne(newCard);
    res.json({ success: true, data: newCard });
  } catch (error) {
    console.error('Error in POST /api/promo-cards:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/promo-cards', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('promo_cards');
    const { id, ...updates } = req.body;
    await collection.updateOne({ id }, { $set: updates });
    res.json({ success: true });
  } catch (error) {
    console.error('Error in PUT /api/promo-cards:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/promo-cards', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('promo_cards');
    await collection.deleteOne({ id: req.query.id });
    res.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/promo-cards:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/payments', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('payment_verifications');
    const newPayment = req.body;
    newPayment.id = newPayment.id || `pv-${Date.now()}`;
    newPayment.createdAt = newPayment.createdAt || new Date().toISOString();
    await collection.insertOne(newPayment);
    res.json({ success: true, data: newPayment });
  } catch (error) {
    console.error('Error in POST /api/payments:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/payments', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('payment_verifications');
    const { id, ...updates } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, error: 'Payment ID is required' });
    }
    updates.updatedAt = new Date().toISOString();
    const result = await collection.updateOne({ id }, { $set: updates });
    if (result.modifiedCount === 0) {
      return res.status(404).json({ success: false, error: 'Payment not found or no changes' });
    }
    const updated = await collection.findOne({ id });
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error in PUT /api/payments:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/payments', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('payment_verifications');
    await collection.deleteOne({ id: req.query.id });
    res.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/payments:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/refunds', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('refund_requests');
    const newRefund = req.body;
    newRefund.id = newRefund.id || `refund-${Date.now()}`;
    newRefund.createdAt = newRefund.createdAt || new Date().toISOString();
    await collection.insertOne(newRefund);
    res.json({ success: true, data: newRefund });
  } catch (error) {
    console.error('Error in POST /api/refunds:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/refunds', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('refund_requests');
    const { id, ...updates } = req.body;
    await collection.updateOne({ id }, { $set: updates });
    res.json({ success: true });
  } catch (error) {
    console.error('Error in PUT /api/refunds:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/refunds', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('refund_requests');
    await collection.deleteOne({ id: req.query.id });
    res.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/refunds:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/notifications', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('notifications');
    const newNotification = req.body;
    newNotification.id = newNotification.id || `notification-${Date.now()}`;
    newNotification.createdAt = newNotification.createdAt || new Date().toISOString();
    await collection.insertOne(newNotification);
    res.json({ success: true, data: newNotification });
  } catch (error) {
    console.error('Error in POST /api/notifications:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/notifications', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('notifications');
    const { id, ...updates } = req.body;
    await collection.updateOne({ id }, { $set: updates });
    res.json({ success: true });
  } catch (error) {
    console.error('Error in PUT /api/notifications:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/notifications', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('notifications');
    await collection.deleteOne({ id: req.query.id });
    res.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/notifications:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('reviews');
    const newReview = req.body;
    newReview.id = newReview.id || `review-${Date.now()}`;
    newReview.createdAt = newReview.createdAt || new Date().toISOString();
    await collection.insertOne(newReview);
    res.json({ success: true, data: newReview });
  } catch (error) {
    console.error('Error in POST /api/reviews:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/reviews', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('reviews');
    const { id, ...updates } = req.body;
    await collection.updateOne({ id }, { $set: updates });
    res.json({ success: true });
  } catch (error) {
    console.error('Error in PUT /api/reviews:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/reviews', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('reviews');
    await collection.deleteOne({ id: req.query.id });
    res.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/reviews:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/conversations', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('conversations');
    const newConversation = req.body;
    newConversation.id = newConversation.id || `conversation-${Date.now()}`;
    newConversation.createdAt = newConversation.createdAt || new Date().toISOString();
    await collection.insertOne(newConversation);
    res.json({ success: true, data: newConversation });
  } catch (error) {
    console.error('Error in POST /api/conversations:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/conversations', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('conversations');
    const { id, ...updates } = req.body;
    await collection.updateOne({ id }, { $set: updates });
    res.json({ success: true });
  } catch (error) {
    console.error('Error in PUT /api/conversations:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/conversations', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('conversations');
    await collection.deleteOne({ id: req.query.id });
    res.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/conversations:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('delivery_settings');
    const updates = req.body;
    await collection.updateOne({ id: 'default' }, { $set: updates }, { upsert: true });
    const updated = await collection.findOne({ id: 'default' });
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error in PUT /api/settings:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/wishlist', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('user_wishlists');
    const { userId, productId } = req.body;
    
    if (!userId || !productId) {
      return res.status(400).json({ success: false, error: 'userId and productId are required' });
    }
    
    await collection.updateOne(
      { userId },
      { $addToSet: { products: productId }, $set: { updatedAt: new Date().toISOString() } },
      { upsert: true }
    );
    
    const wishlist = await collection.findOne({ userId });
    res.json({ success: true, data: wishlist });
  } catch (error) {
    console.error('Error in POST /api/wishlist:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/wishlist', async (req, res) => {
  try {
    const database = await getDB();
    const collection = database.collection('user_wishlists');
    const { userId, productId } = req.query;
    
    if (!userId || !productId) {
      return res.status(400).json({ success: false, error: 'userId and productId are required' });
    }
    
    await collection.updateOne(
      { userId },
      { $pull: { products: productId }, $set: { updatedAt: new Date().toISOString() } }
    );
    
    const wishlist = await collection.findOne({ userId });
    res.json({ success: true, data: wishlist });
  } catch (error) {
    console.error('Error in DELETE /api/wishlist:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Migrate endpoint (for localStorage to MongoDB migration)
app.post('/api/migrate', async (req, res) => {
  try {
    const database = await getDB();
    const data = req.body;

    console.log('🔄 Starting data migration to MongoDB...');

    // Migrate users
    if (data.users && Array.isArray(data.users) && data.users.length > 0) {
      const usersCollection = database.collection('users');
      for (const user of data.users) {
        await usersCollection.updateOne(
          { id: user.id },
          { $set: user },
          { upsert: true }
        );
      }
      console.log(`✅ Migrated ${data.users.length} users`);
    }

    // Migrate products
    if (data.products && Array.isArray(data.products) && data.products.length > 0) {
      const productsCollection = database.collection('products');
      for (const product of data.products) {
        await productsCollection.updateOne(
          { id: product.id },
          { $set: product },
          { upsert: true }
        );
      }
      console.log(`✅ Migrated ${data.products.length} products`);
    }

    // Migrate orders
    if (data.orders && Array.isArray(data.orders) && data.orders.length > 0) {
      const ordersCollection = database.collection('orders');
      for (const order of data.orders) {
        await ordersCollection.updateOne(
          { id: order.id },
          { $set: order },
          { upsert: true }
        );
      }
      console.log(`✅ Migrated ${data.orders.length} orders`);
    }

    // Migrate carousel slides
    if (data.carousel && Array.isArray(data.carousel) && data.carousel.length > 0) {
      const carouselCollection = database.collection('carousel_slides');
      for (const slide of data.carousel) {
        await carouselCollection.updateOne(
          { id: slide.id },
          { $set: slide },
          { upsert: true }
        );
      }
      console.log(`✅ Migrated ${data.carousel.length} carousel slides`);
    }

    // Migrate vouchers
    if (data.vouchers && Array.isArray(data.vouchers) && data.vouchers.length > 0) {
      const vouchersCollection = database.collection('vouchers');
      for (const voucher of data.vouchers) {
        await vouchersCollection.updateOne(
          { id: voucher.id },
          { $set: voucher },
          { upsert: true }
        );
      }
      console.log(`✅ Migrated ${data.vouchers.length} vouchers`);
    }

    // Migrate promo cards
    if (data.promoCards && Array.isArray(data.promoCards) && data.promoCards.length > 0) {
      const promoCardsCollection = database.collection('promo_cards');
      for (const card of data.promoCards) {
        await promoCardsCollection.updateOne(
          { id: card.id },
          { $set: card },
          { upsert: true }
        );
      }
      console.log(`✅ Migrated ${data.promoCards.length} promo cards`);
    }

    // Migrate payment verifications
    if (data.paymentVerifications && Array.isArray(data.paymentVerifications) && data.paymentVerifications.length > 0) {
      const paymentsCollection = database.collection('payment_verifications');
      for (const payment of data.paymentVerifications) {
        await paymentsCollection.updateOne(
          { id: payment.id },
          { $set: payment },
          { upsert: true }
        );
      }
      console.log(`✅ Migrated ${data.paymentVerifications.length} payment verifications`);
    }

    // Migrate refunds
    if (data.refunds && Array.isArray(data.refunds) && data.refunds.length > 0) {
      const refundsCollection = database.collection('refund_requests');
      for (const refund of data.refunds) {
        await refundsCollection.updateOne(
          { id: refund.id },
          { $set: refund },
          { upsert: true }
        );
      }
      console.log(`✅ Migrated ${data.refunds.length} refunds`);
    }

    // Migrate notifications
    if (data.notifications && Array.isArray(data.notifications) && data.notifications.length > 0) {
      const notificationsCollection = database.collection('notifications');
      for (const notification of data.notifications) {
        await notificationsCollection.updateOne(
          { id: notification.id },
          { $set: notification },
          { upsert: true }
        );
      }
      console.log(`✅ Migrated ${data.notifications.length} notifications`);
    }

    // Migrate reviews
    if (data.reviews && Array.isArray(data.reviews) && data.reviews.length > 0) {
      const reviewsCollection = database.collection('reviews');
      for (const review of data.reviews) {
        await reviewsCollection.updateOne(
          { id: review.id },
          { $set: review },
          { upsert: true }
        );
      }
      console.log(`✅ Migrated ${data.reviews.length} reviews`);
    }

    // Migrate conversations
    if (data.conversations && Array.isArray(data.conversations) && data.conversations.length > 0) {
      const conversationsCollection = database.collection('conversations');
      for (const conversation of data.conversations) {
        await conversationsCollection.updateOne(
          { id: conversation.id },
          { $set: conversation },
          { upsert: true }
        );
      }
      console.log(`✅ Migrated ${data.conversations.length} conversations`);
    }

    // Migrate delivery settings
    if (data.deliverySettings) {
      const settingsCollection = database.collection('delivery_settings');
      await settingsCollection.updateOne(
        { id: 'default' },
        { $set: { id: 'default', ...data.deliverySettings } },
        { upsert: true }
      );
      console.log('✅ Migrated delivery settings');
    }

    console.log('✅ Migration completed successfully!');
    res.json({ success: true, message: 'Data migrated successfully' });
  } catch (error) {
    console.error('❌ Migration error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Init-data endpoint (for initializing with default data)
app.post('/api/init-data', async (req, res) => {
  try {
    const database = await getDB();
    const data = req.body;

    console.log('🔄 Initializing database with default data...');

    const results = {};

    // Initialize all collections
    if (data.users && Array.isArray(data.users)) {
      const collection = database.collection('users');
      await collection.deleteMany({});
      if (data.users.length > 0) {
        await collection.insertMany(data.users);
        results.users = data.users.length;
      }
    }

    if (data.products && Array.isArray(data.products)) {
      const collection = database.collection('products');
      await collection.deleteMany({});
      if (data.products.length > 0) {
        await collection.insertMany(data.products);
        results.products = data.products.length;
      }
    }

    if (data.orders && Array.isArray(data.orders)) {
      const collection = database.collection('orders');
      await collection.deleteMany({});
      if (data.orders.length > 0) {
        await collection.insertMany(data.orders);
        results.orders = data.orders.length;
      }
    }

    if (data.carousel && Array.isArray(data.carousel)) {
      const collection = database.collection('carousel_slides');
      await collection.deleteMany({});
      if (data.carousel.length > 0) {
        await collection.insertMany(data.carousel);
        results.carousel = data.carousel.length;
      }
    }

    if (data.vouchers && Array.isArray(data.vouchers)) {
      const collection = database.collection('vouchers');
      await collection.deleteMany({});
      if (data.vouchers.length > 0) {
        await collection.insertMany(data.vouchers);
        results.vouchers = data.vouchers.length;
      }
    }

    if (data.promoCards && Array.isArray(data.promoCards)) {
      const collection = database.collection('promo_cards');
      await collection.deleteMany({});
      if (data.promoCards.length > 0) {
        await collection.insertMany(data.promoCards);
        results.promoCards = data.promoCards.length;
      }
    }

    if (data.reviews && Array.isArray(data.reviews)) {
      const collection = database.collection('reviews');
      await collection.deleteMany({});
      if (data.reviews.length > 0) {
        await collection.insertMany(data.reviews);
        results.reviews = data.reviews.length;
      }
    }

    if (data.deliverySettings) {
      const collection = database.collection('delivery_settings');
      await collection.deleteOne({ id: 'default' });
      await collection.insertOne({ id: 'default', ...data.deliverySettings });
      results.deliverySettings = true;
    }

    console.log('✅ Database initialized successfully!');
    res.json({ success: true, results });
  } catch (error) {
    console.error('❌ Init-data error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found', path: req.path });
});

// Error Handler (must be last)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

// Start Server
async function startServer() {
  try {
    console.log('\n🚀 Starting AURAZ E-Commerce Server...\n');
    
    // Connect to MongoDB first
    await connectDB();
    
    // Start Express server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n✅ Server running on http://localhost:${PORT}`);
      console.log(`📡 API routes available at http://localhost:${PORT}/api/*`);
      console.log(`💚 Server is ready!\n`);
      console.log('📋 Available endpoints:');
      console.log('   - GET  /api/ping');
      console.log('   - GET  /api/test-connection');
      console.log('   - GET  /api/products');
      console.log('   - GET  /api/users');
      console.log('   - GET  /api/orders');
      console.log('   - GET  /api/carousel');
      console.log('   - GET  /api/vouchers');
      console.log('   - GET  /api/promo-cards');
      console.log('   - GET  /api/payments');
      console.log('   - GET  /api/refunds');
      console.log('   - GET  /api/notifications');
      console.log('   - GET  /api/reviews');
      console.log('   - GET  /api/conversations');
      console.log('   - GET  /api/settings');
      console.log('   - GET  /api/wishlist\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('\n⚠️ Shutting down gracefully...');
  if (client) {
    await client.close();
    console.log('✅ MongoDB connection closed');
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\n⚠️ Shutting down gracefully...');
  if (client) {
    await client.close();
    console.log('✅ MongoDB connection closed');
  }
  process.exit(0);
});

// Start the server
startServer();
