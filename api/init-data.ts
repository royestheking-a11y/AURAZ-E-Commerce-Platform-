import { getDatabase } from './mongodb';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  runtime: 'nodejs',
};

// Import default data (we'll need to pass it from the client)
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const db = await getDatabase();
    const data = req.body;

    console.log('🔄 Initializing MongoDB with default data...');

    const results: Record<string, number> = {};

    // Initialize Products
    if (data.products && Array.isArray(data.products) && data.products.length > 0) {
      const productsCollection = db.collection('products');
      // Clear existing and insert new
      await productsCollection.deleteMany({});
      await productsCollection.insertMany(data.products);
      results.products = data.products.length;
      console.log(`✅ Initialized ${data.products.length} products`);
    }

    // Initialize Users
    if (data.users && Array.isArray(data.users) && data.users.length > 0) {
      const usersCollection = db.collection('users');
      await usersCollection.deleteMany({});
      await usersCollection.insertMany(data.users);
      results.users = data.users.length;
      console.log(`✅ Initialized ${data.users.length} users`);
    }

    // Initialize Orders
    if (data.orders && Array.isArray(data.orders)) {
      const ordersCollection = db.collection('orders');
      await ordersCollection.deleteMany({});
      if (data.orders.length > 0) {
        await ordersCollection.insertMany(data.orders);
      }
      results.orders = data.orders.length;
      console.log(`✅ Initialized ${data.orders.length} orders`);
    }

    // Initialize Carousel Slides
    if (data.carousel && Array.isArray(data.carousel) && data.carousel.length > 0) {
      const carouselCollection = db.collection('carousel_slides');
      await carouselCollection.deleteMany({});
      await carouselCollection.insertMany(data.carousel);
      results.carousel = data.carousel.length;
      console.log(`✅ Initialized ${data.carousel.length} carousel slides`);
    }

    // Initialize Vouchers
    if (data.vouchers && Array.isArray(data.vouchers) && data.vouchers.length > 0) {
      const vouchersCollection = db.collection('vouchers');
      await vouchersCollection.deleteMany({});
      await vouchersCollection.insertMany(data.vouchers);
      results.vouchers = data.vouchers.length;
      console.log(`✅ Initialized ${data.vouchers.length} vouchers`);
    }

    // Initialize Promo Cards
    if (data.promoCards && Array.isArray(data.promoCards) && data.promoCards.length > 0) {
      const promoCardsCollection = db.collection('promo_cards');
      await promoCardsCollection.deleteMany({});
      await promoCardsCollection.insertMany(data.promoCards);
      results.promoCards = data.promoCards.length;
      console.log(`✅ Initialized ${data.promoCards.length} promo cards`);
    }

    // Initialize Reviews
    if (data.reviews && Array.isArray(data.reviews)) {
      const reviewsCollection = db.collection('reviews');
      await reviewsCollection.deleteMany({});
      if (data.reviews.length > 0) {
        await reviewsCollection.insertMany(data.reviews);
      }
      results.reviews = data.reviews.length;
      console.log(`✅ Initialized ${data.reviews.length} reviews`);
    }

    // Initialize Delivery Settings
    if (data.deliverySettings) {
      const settingsCollection = db.collection('delivery_settings');
      await settingsCollection.deleteMany({});
      await settingsCollection.insertOne({ id: 'default', ...data.deliverySettings });
      results.deliverySettings = 1;
      console.log('✅ Initialized delivery settings');
    }

    // Initialize empty collections
    const emptyCollections = [
      { name: 'payment_verifications', data: data.paymentVerifications || [] },
      { name: 'refund_requests', data: data.refunds || [] },
      { name: 'notifications', data: data.notifications || [] },
      { name: 'conversations', data: data.conversations || [] },
    ];

    for (const { name, data: collectionData } of emptyCollections) {
      const collection = db.collection(name);
      await collection.deleteMany({});
      if (Array.isArray(collectionData) && collectionData.length > 0) {
        await collection.insertMany(collectionData);
        results[name] = collectionData.length;
      } else {
        results[name] = 0;
      }
    }

    console.log('✅ MongoDB initialization completed!');
    return res.json({
      success: true,
      message: 'Database initialized successfully',
      results,
    });
  } catch (error: any) {
    console.error('❌ Initialization error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}

