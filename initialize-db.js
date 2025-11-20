// Script to initialize MongoDB with default data
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = 'mongodb+srv://royesblog_db_user:BrSl41Di2Oxxh71H@auraz-ecommerce.wann5gb.mongodb.net/auraz_ecommerce?retryWrites=true&w=majority&appName=auraz-ecommerce';
const DB_NAME = 'auraz_ecommerce';

// Default data
const defaultData = {
  users: [
    {
      id: 'admin-1',
      name: 'AURAZ Admin',
      email: 'auraz@admin.com',
      phone: '+8801234567890',
      password: 'auraz878',
      status: 'approved',
      createdAt: new Date().toISOString(),
      addresses: [],
      paymentMethods: [],
      usedVouchers: [],
    },
    {
      id: 'user-1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+8801234567891',
      password: 'user123',
      status: 'approved',
      createdAt: new Date().toISOString(),
      addresses: [],
      paymentMethods: [],
      usedVouchers: [],
    },
  ],
  products: [
    {
      id: 'prod-1',
      name: 'Premium Cotton T-Shirt',
      description: 'Comfortable and stylish cotton t-shirt',
      price: 899,
      originalPrice: 1299,
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
      category: 'Fashion',
      stock: 50,
      rating: 4.5,
      reviewsCount: 12,
      tags: ['casual', 'cotton', 'comfortable'],
      isNew: false,
      isFeatured: true,
      isOnSale: true,
    },
    {
      id: 'prod-2',
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 2999,
      originalPrice: 3999,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
      category: 'Electronics',
      stock: 30,
      rating: 4.8,
      reviewsCount: 25,
      tags: ['wireless', 'audio', 'electronics'],
      isNew: true,
      isFeatured: true,
      isOnSale: true,
    },
    {
      id: 'prod-3',
      name: 'Leather Jacket',
      description: 'Genuine leather jacket for all seasons',
      price: 4999,
      originalPrice: 6999,
      images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500'],
      category: 'Fashion',
      stock: 20,
      rating: 4.7,
      reviewsCount: 18,
      tags: ['leather', 'jacket', 'premium'],
      isNew: false,
      isFeatured: true,
      isOnSale: true,
    },
  ],
  carousel_slides: [
    {
      id: 'slide-1',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
      title: 'Welcome to AURAZ',
      description: 'Premium E-Commerce Experience',
      buttonText: 'Shop Now',
      buttonLink: '/',
    },
  ],
  vouchers: [
    {
      id: 'v1',
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      description: 'Get 10% off on your first order',
      minOrderAmount: 1000,
      maxDiscount: 500,
      validFrom: '2025-01-01',
      validUntil: '2025-12-31',
      usageLimit: 100,
      usedCount: 0,
      isActive: true,
    },
  ],
  promo_cards: [
    {
      id: 'pc1',
      title: 'Festive Season Sale',
      description: 'Celebrate with amazing discounts',
      image: 'https://images.unsplash.com/photo-1607344645866-009c7b3a1b57?w=800',
      buttonText: 'Shop Now',
      link: '/festive-sale',
      gradient: 'from-purple-500 to-purple-700',
      isActive: true,
      order: 1,
    },
  ],
  delivery_settings: {
    id: 'default',
    dhakaCharge: 60,
    outsideDhakaCharge: 110,
    freeShippingThreshold: 5000,
  },
};

async function initializeDatabase() {
  let client;
  try {
    console.log('🔄 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB!');
    
    const db = client.db(DB_NAME);
    
    console.log('\n📦 Initializing collections...');
    
    // Initialize Users
    if (defaultData.users.length > 0) {
      await db.collection('users').deleteMany({});
      await db.collection('users').insertMany(defaultData.users);
      console.log(`✅ Initialized ${defaultData.users.length} users`);
    }
    
    // Initialize Products
    if (defaultData.products.length > 0) {
      await db.collection('products').deleteMany({});
      await db.collection('products').insertMany(defaultData.products);
      console.log(`✅ Initialized ${defaultData.products.length} products`);
    }
    
    // Initialize Carousel
    if (defaultData.carousel_slides.length > 0) {
      await db.collection('carousel_slides').deleteMany({});
      await db.collection('carousel_slides').insertMany(defaultData.carousel_slides);
      console.log(`✅ Initialized ${defaultData.carousel_slides.length} carousel slides`);
    }
    
    // Initialize Vouchers
    if (defaultData.vouchers.length > 0) {
      await db.collection('vouchers').deleteMany({});
      await db.collection('vouchers').insertMany(defaultData.vouchers);
      console.log(`✅ Initialized ${defaultData.vouchers.length} vouchers`);
    }
    
    // Initialize Promo Cards
    if (defaultData.promo_cards.length > 0) {
      await db.collection('promo_cards').deleteMany({});
      await db.collection('promo_cards').insertMany(defaultData.promo_cards);
      console.log(`✅ Initialized ${defaultData.promo_cards.length} promo cards`);
    }
    
    // Initialize Delivery Settings
    await db.collection('delivery_settings').deleteMany({});
    await db.collection('delivery_settings').insertOne(defaultData.delivery_settings);
    console.log('✅ Initialized delivery settings');
    
    // Initialize empty collections
    const emptyCollections = [
      'orders',
      'payment_verifications',
      'refund_requests',
      'notifications',
      'reviews',
      'conversations',
    ];
    
    for (const collectionName of emptyCollections) {
      const count = await db.collection(collectionName).countDocuments();
      if (count === 0) {
        console.log(`✅ Collection '${collectionName}' is ready (empty)`);
      } else {
        console.log(`ℹ️  Collection '${collectionName}' already has ${count} documents`);
      }
    }
    
    console.log('\n✅ Database initialization completed!');
    console.log('\n📊 Summary:');
    const collections = await db.listCollections().toArray();
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`  - ${col.name}: ${count} documents`);
    }
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Connection closed.');
    }
  }
}

initializeDatabase();

