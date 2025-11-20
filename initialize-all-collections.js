// Comprehensive script to initialize ALL MongoDB collections with complete data
const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://royesblog_db_user:BrSl41Di2Oxxh71H@auraz-ecommerce.wann5gb.mongodb.net/auraz_ecommerce?retryWrites=true&w=majority&appName=auraz-ecommerce';
const DB_NAME = 'auraz_ecommerce';

// Import data from the actual source files (we'll need to read them)
// For now, we'll include comprehensive sample data

const adminUser = {
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
};

const sampleUsers = [
  adminUser,
  {
    id: 'u1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+880 1712-345678',
    password: 'user123',
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    dateOfBirth: '1990-05-15',
    gender: 'male',
    status: 'approved',
    createdAt: '2025-01-15T10:00:00Z',
    addresses: [
      {
        id: 'addr1',
        name: 'John Doe',
        phone: '+880 1712-345678',
        street: '123 Main Street, Apartment 4B',
        city: 'Dhaka',
        postalCode: '1205',
        landmark: 'Near City Hospital',
        isDefault: true,
      },
    ],
    paymentMethods: [
      {
        id: 'pm1',
        type: 'card',
        name: 'Visa ending in 4242',
        details: '**** **** **** 4242',
        isDefault: true,
      },
    ],
    usedVouchers: ['v1'],
  },
  {
    id: 'u2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+880 1823-456789',
    password: 'user123',
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    dateOfBirth: '1992-08-22',
    gender: 'female',
    status: 'approved',
    createdAt: '2025-02-10T14:30:00Z',
    addresses: [
      {
        id: 'addr3',
        name: 'Sarah Johnson',
        phone: '+880 1823-456789',
        street: '789 Lake Road',
        city: 'Dhaka',
        postalCode: '1212',
        isDefault: true,
      },
    ],
    paymentMethods: [],
    usedVouchers: [],
  },
  {
    id: 'u3',
    name: 'Mike Chen',
    email: 'mike.chen@example.com',
    phone: '+880 1934-567890',
    password: 'user123',
    status: 'approved',
    createdAt: '2025-03-05T09:15:00Z',
    addresses: [],
    paymentMethods: [],
    usedVouchers: [],
  },
  {
    id: 'u4',
    name: 'Alex Kumar',
    email: 'alex.kumar@example.com',
    phone: '+880 1745-678901',
    password: 'user123',
    status: 'pending',
    createdAt: '2025-10-30T11:00:00Z',
    addresses: [],
    paymentMethods: [],
    usedVouchers: [],
  },
];

// Sample products (comprehensive list)
const sampleProducts = [
  {
    id: 'f1',
    name: 'Premium Cotton T-Shirt',
    price: 799,
    originalPrice: 1299,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
    ],
    rating: 4.2,
    reviewCount: 156,
    category: 'Fashion',
    brand: 'StyleHub',
    description: 'Comfortable 100% cotton t-shirt perfect for everyday wear.',
    stock: 120,
    seller: { id: 's2', name: 'Fashion Junction' },
    isDeal: true,
    isTrending: false,
    isNewArrival: false,
    isHidden: false,
  },
  {
    id: 'f2',
    name: 'Classic Blue Jeans',
    price: 1999,
    originalPrice: 2999,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
    rating: 4.5,
    reviewCount: 89,
    category: 'Fashion',
    brand: 'DenimCo',
    description: 'Classic fit blue jeans made from premium denim.',
    stock: 75,
    seller: { id: 's2', name: 'Fashion Junction' },
    isDeal: true,
    isTrending: true,
    isNewArrival: false,
    isHidden: false,
  },
  {
    id: 'e1',
    name: 'Wireless Bluetooth Headphones',
    price: 2499,
    originalPrice: 3999,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    rating: 4.8,
    reviewCount: 234,
    category: 'Electronics',
    brand: 'SoundMax',
    description: 'High-quality wireless headphones with noise cancellation.',
    stock: 50,
    seller: { id: 's1', name: 'TechStore' },
    isDeal: true,
    isTrending: true,
    isNewArrival: true,
    isHidden: false,
  },
  {
    id: 'e2',
    name: 'Smartphone 128GB',
    price: 54999,
    originalPrice: 69999,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
    rating: 4.7,
    reviewCount: 567,
    category: 'Electronics',
    brand: 'TechPhone',
    description: 'Latest smartphone with advanced features.',
    stock: 30,
    seller: { id: 's1', name: 'TechStore' },
    isDeal: true,
    isTrending: true,
    isNewArrival: false,
    isHidden: false,
  },
  {
    id: 'b1',
    name: 'Premium Skincare Set',
    price: 2999,
    originalPrice: 3999,
    image: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=500',
    rating: 4.6,
    reviewCount: 123,
    category: 'Beauty',
    brand: 'GlowUp',
    description: 'Complete skincare routine set for healthy skin.',
    stock: 60,
    seller: { id: 's3', name: 'Beauty World' },
    isDeal: true,
    isTrending: false,
    isNewArrival: true,
    isHidden: false,
  },
  {
    id: 'b2',
    name: 'Luxury Perfume 50ml',
    price: 3599,
    originalPrice: 4999,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500',
    rating: 4.9,
    reviewCount: 78,
    category: 'Beauty',
    brand: 'Fragrance',
    description: 'Elegant and long-lasting fragrance.',
    stock: 45,
    seller: { id: 's3', name: 'Beauty World' },
    isDeal: true,
    isTrending: true,
    isNewArrival: false,
    isHidden: false,
  },
  {
    id: 'g1',
    name: 'Organic Rice 5kg',
    price: 599,
    originalPrice: 799,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500',
    rating: 4.4,
    reviewCount: 345,
    category: 'Grocery',
    brand: 'FarmFresh',
    description: 'Premium quality organic rice.',
    stock: 200,
    seller: { id: 's4', name: 'Grocery Mart' },
    isDeal: true,
    isTrending: false,
    isNewArrival: false,
    isHidden: false,
  },
  {
    id: 'h1',
    name: 'Modern Coffee Table',
    price: 8999,
    originalPrice: 12999,
    image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=500',
    rating: 4.5,
    reviewCount: 67,
    category: 'Home',
    brand: 'HomeStyle',
    description: 'Stylish modern coffee table for your living room.',
    stock: 25,
    seller: { id: 's5', name: 'Home Decor' },
    isDeal: true,
    isTrending: false,
    isNewArrival: true,
    isHidden: false,
  },
];

// Sample orders
const sampleOrders = [
  {
    id: 'ORD-789',
    userId: 'u1',
    user: sampleUsers[1],
    items: [
      {
        productId: 'f1',
        product: sampleProducts[0],
        quantity: 2,
      },
      {
        productId: 'f2',
        product: sampleProducts[1],
        quantity: 1,
      },
    ],
    total: 4097,
    status: 'shipped',
    shippingAddress: sampleUsers[1].addresses[0],
    paymentMethod: 'bKash',
    createdAt: '2025-10-28T09:15:00Z',
    deliveryCharge: 60,
    voucherDiscount: 350,
    voucherCode: 'WELCOME10',
  },
  {
    id: 'ORD-756',
    userId: 'u1',
    user: sampleUsers[1],
    items: [
      {
        productId: 'e1',
        product: sampleProducts[2],
        quantity: 1,
      },
    ],
    total: 25059,
    status: 'delivered',
    shippingAddress: sampleUsers[1].addresses[0],
    paymentMethod: 'Card',
    createdAt: '2025-10-20T14:30:00Z',
    deliveryCharge: 60,
  },
  {
    id: 'ORD-734',
    userId: 'u2',
    user: sampleUsers[2],
    items: [
      {
        productId: 'b1',
        product: sampleProducts[4],
        quantity: 2,
      },
    ],
    total: 6558,
    status: 'delivered',
    shippingAddress: sampleUsers[2].addresses[0],
    paymentMethod: 'Nagad',
    createdAt: '2025-10-15T11:00:00Z',
    deliveryCharge: 60,
    voucherDiscount: 1000,
    voucherCode: 'BEAUTY25',
  },
];

// Carousel slides
const carouselSlides = [
  {
    id: 'slide-1',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
    title: 'Welcome to AURAZ',
    description: 'Premium E-Commerce Experience',
    buttonText: 'Shop Now',
    buttonLink: '/',
  },
  {
    id: 'slide-2',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200',
    title: 'Mega Sale',
    description: 'Up to 50% off on selected items',
    buttonText: 'Explore Deals',
    buttonLink: '/deals',
  },
];

// Vouchers
const vouchers = [
  {
    id: 'v1',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    description: 'Welcome bonus: 10% off on your first order',
    minOrderAmount: 500,
    maxDiscount: 500,
    validFrom: '2025-01-01T00:00:00Z',
    validUntil: '2025-12-31T23:59:59Z',
    usageLimit: 1000,
    usedCount: 234,
    isActive: true,
    applicableCategories: [],
  },
  {
    id: 'v2',
    code: 'FASHION20',
    type: 'percentage',
    value: 20,
    description: 'Exclusive: 20% off on all fashion items',
    minOrderAmount: 1000,
    maxDiscount: 1000,
    validFrom: '2025-01-01T00:00:00Z',
    validUntil: '2025-12-31T23:59:59Z',
    usageLimit: 500,
    usedCount: 187,
    isActive: true,
    applicableCategories: ['Fashion'],
  },
  {
    id: 'v3',
    code: 'ELECTRONICS15',
    type: 'percentage',
    value: 15,
    description: 'Tech deals: 15% off on electronics',
    minOrderAmount: 2000,
    maxDiscount: 2000,
    validFrom: '2025-01-01T00:00:00Z',
    validUntil: '2025-12-31T23:59:59Z',
    usageLimit: 300,
    usedCount: 145,
    isActive: true,
    applicableCategories: ['Electronics'],
  },
  {
    id: 'v4',
    code: 'FLAT500',
    type: 'fixed',
    value: 500,
    description: 'Get ৳500 off on orders above ৳3000',
    minOrderAmount: 3000,
    validFrom: '2025-01-01T00:00:00Z',
    validUntil: '2025-12-31T23:59:59Z',
    usageLimit: 200,
    usedCount: 89,
    isActive: true,
    applicableCategories: [],
  },
  {
    id: 'v5',
    code: 'BEAUTY25',
    type: 'percentage',
    value: 25,
    description: 'Beauty special: 25% off on all beauty products',
    minOrderAmount: 800,
    maxDiscount: 800,
    validFrom: '2025-01-01T00:00:00Z',
    validUntil: '2025-12-31T23:59:59Z',
    usageLimit: 400,
    usedCount: 276,
    isActive: true,
    applicableCategories: ['Beauty'],
  },
];

// Promo cards
const promoCards = [
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
  {
    id: 'pc2',
    title: 'Electronics Mega Sale',
    description: 'Latest gadgets at unbeatable prices',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800',
    buttonText: 'Explore',
    link: '/electronics-sale',
    gradient: 'from-blue-500 to-blue-700',
    isActive: true,
    order: 2,
  },
];

// Reviews
const reviews = [
  {
    id: 'rev-1',
    productId: 'f1',
    userId: 'u1',
    userName: 'John Doe',
    rating: 5,
    comment: 'Great quality t-shirt! Very comfortable.',
    createdAt: '2025-10-25T10:00:00Z',
  },
  {
    id: 'rev-2',
    productId: 'e1',
    userId: 'u2',
    userName: 'Sarah Johnson',
    rating: 4,
    comment: 'Good headphones, battery life could be better.',
    createdAt: '2025-10-20T14:00:00Z',
  },
];

// Delivery settings
const deliverySettings = {
  id: 'default',
  dhakaCharge: 60,
  outsideDhakaCharge: 110,
  freeShippingThreshold: 5000,
};

async function initializeAllCollections() {
  let client;
  try {
    console.log('🔄 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB!');
    
    const db = client.db(DB_NAME);
    
    console.log('\n📦 Initializing ALL collections...\n');
    
    // 1. USERS Collection
    console.log('👥 Initializing Users collection...');
    await db.collection('users').deleteMany({});
    await db.collection('users').insertMany(sampleUsers);
    console.log(`✅ Users: ${sampleUsers.length} documents`);
    
    // 2. PRODUCTS Collection
    console.log('📦 Initializing Products collection...');
    await db.collection('products').deleteMany({});
    await db.collection('products').insertMany(sampleProducts);
    console.log(`✅ Products: ${sampleProducts.length} documents`);
    
    // 3. ORDERS Collection
    console.log('🛒 Initializing Orders collection...');
    await db.collection('orders').deleteMany({});
    await db.collection('orders').insertMany(sampleOrders);
    console.log(`✅ Orders: ${sampleOrders.length} documents`);
    
    // 4. CAROUSEL_SLIDES Collection
    console.log('🎠 Initializing Carousel Slides collection...');
    await db.collection('carousel_slides').deleteMany({});
    await db.collection('carousel_slides').insertMany(carouselSlides);
    console.log(`✅ Carousel Slides: ${carouselSlides.length} documents`);
    
    // 5. VOUCHERS Collection
    console.log('🎫 Initializing Vouchers collection...');
    await db.collection('vouchers').deleteMany({});
    await db.collection('vouchers').insertMany(vouchers);
    console.log(`✅ Vouchers: ${vouchers.length} documents`);
    
    // 6. PROMO_CARDS Collection
    console.log('✨ Initializing Promo Cards collection...');
    await db.collection('promo_cards').deleteMany({});
    await db.collection('promo_cards').insertMany(promoCards);
    console.log(`✅ Promo Cards: ${promoCards.length} documents`);
    
    // 7. REVIEWS Collection
    console.log('⭐ Initializing Reviews collection...');
    await db.collection('reviews').deleteMany({});
    await db.collection('reviews').insertMany(reviews);
    console.log(`✅ Reviews: ${reviews.length} documents`);
    
    // 8. DELIVERY_SETTINGS Collection
    console.log('🚚 Initializing Delivery Settings collection...');
    await db.collection('delivery_settings').deleteMany({});
    await db.collection('delivery_settings').insertOne(deliverySettings);
    console.log(`✅ Delivery Settings: 1 document`);
    
    // 9. PAYMENT_VERIFICATIONS Collection (empty but ready)
    console.log('💳 Initializing Payment Verifications collection...');
    await db.collection('payment_verifications').deleteMany({});
    console.log(`✅ Payment Verifications: 0 documents (ready)`);
    
    // 10. REFUND_REQUESTS Collection (empty but ready)
    console.log('🔄 Initializing Refund Requests collection...');
    await db.collection('refund_requests').deleteMany({});
    console.log(`✅ Refund Requests: 0 documents (ready)`);
    
    // 11. NOTIFICATIONS Collection (empty but ready)
    console.log('🔔 Initializing Notifications collection...');
    await db.collection('notifications').deleteMany({});
    console.log(`✅ Notifications: 0 documents (ready)`);
    
    // 12. CONVERSATIONS Collection (empty but ready)
    console.log('💬 Initializing Conversations collection...');
    await db.collection('conversations').deleteMany({});
    console.log(`✅ Conversations: 0 documents (ready)`);
    
    console.log('\n✅ ALL COLLECTIONS INITIALIZED SUCCESSFULLY!\n');
    
    // Summary
    console.log('📊 Database Summary:');
    const collections = await db.listCollections().toArray();
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`  - ${col.name}: ${count} documents`);
    }
    
    console.log('\n🎉 Your MongoDB database is ready for the admin panel!');
    console.log('\n📝 Admin Login:');
    console.log('   Email: auraz@admin.com');
    console.log('   Password: auraz878');
    
  } catch (error) {
    console.error('❌ Error initializing collections:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Connection closed.');
    }
  }
}

initializeAllCollections();

