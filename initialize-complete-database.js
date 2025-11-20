// COMPREHENSIVE DATABASE INITIALIZATION
// Creates ALL collections including user-specific data structures

const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://royesblog_db_user:BrSl41Di2Oxxh71H@auraz-ecommerce.wann5gb.mongodb.net/auraz_ecommerce?retryWrites=true&w=majority&appName=auraz-ecommerce';
const DB_NAME = 'auraz_ecommerce';

// Admin User
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
  profilePhoto: null,
  dateOfBirth: null,
  gender: null,
};

// Sample Users with complete profiles
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
      {
        id: 'addr2',
        name: 'John Doe',
        phone: '+880 1712-345678',
        street: '456 Park Avenue',
        city: 'Chittagong',
        postalCode: '4100',
        landmark: 'Opposite Shopping Mall',
        isDefault: false,
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
      {
        id: 'pm2',
        type: 'bkash',
        name: 'bKash',
        details: '+880 1712-345678',
        isDefault: false,
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
    paymentMethods: [
      {
        id: 'pm3',
        type: 'nagad',
        name: 'Nagad',
        details: '+880 1823-456789',
        isDefault: true,
      },
    ],
    usedVouchers: ['v2'],
  },
];

// Sample Products
const sampleProducts = [
  {
    id: 'f1',
    name: 'Premium Cotton T-Shirt',
    price: 799,
    originalPrice: 1299,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
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
];

// Sample Orders (for user u1)
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
    ],
    total: 4097,
    status: 'processing',
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
        product: sampleProducts[1],
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
    userId: 'u1',
    user: sampleUsers[1],
    items: [
      {
        productId: 'f1',
        product: sampleProducts[0],
        quantity: 1,
      },
    ],
    total: 1599,
    status: 'cancelled',
    shippingAddress: sampleUsers[1].addresses[0],
    paymentMethod: 'bKash',
    createdAt: '2025-10-15T11:00:00Z',
    deliveryCharge: 60,
  },
  {
    id: 'ORD-712',
    userId: 'u1',
    user: sampleUsers[1],
    items: [
      {
        productId: 'e1',
        product: sampleProducts[1],
        quantity: 1,
      },
    ],
    total: 25059,
    status: 'pending',
    shippingAddress: sampleUsers[1].addresses[1],
    paymentMethod: 'Card',
    createdAt: '2025-11-01T10:00:00Z',
    deliveryCharge: 110,
  },
];

// Payment Verifications
const paymentVerifications = [
  {
    id: 'pv-1234567890',
    userId: 'u1',
    user: sampleUsers[1],
    orderId: 'ORD-712',
    amount: 25059,
    userPhone: '+880 1712-345678',
    transactionId: 'BKASH123456789',
    status: 'pending',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 180000).toISOString(),
    orderData: sampleOrders[3],
  },
];

// Refund Requests
const refundRequests = [
  {
    id: 'refund-1234567890',
    orderId: 'ORD-734',
    userId: 'u1',
    user: sampleUsers[1],
    order: sampleOrders[2],
    reason: 'Product damaged during delivery',
    amount: 1599,
    status: 'pending',
    createdAt: '2025-10-16T10:00:00Z',
    processedAt: null,
    adminNotes: null,
  },
];

// Notifications
const notifications = [
  {
    id: 'notif-1',
    userId: 'u1',
    target: 'user',
    title: 'Order Placed Successfully',
    message: 'Your order #ORD-712 has been placed successfully',
    type: 'order',
    link: '/order/ORD-712',
    isRead: false,
    createdAt: '2025-11-01T10:05:00Z',
  },
  {
    id: 'notif-2',
    userId: 'u1',
    target: 'user',
    title: 'Order Delivered',
    message: 'Your order #ORD-756 has been delivered',
    type: 'order',
    link: '/order/ORD-756',
    isRead: false,
    createdAt: '2025-10-22T14:00:00Z',
  },
  {
    id: 'notif-3',
    target: 'admin',
    title: 'New Order Received',
    message: 'New order #ORD-712 from John Doe - ৳25,059',
    type: 'order',
    link: '/admin/orders',
    isRead: false,
    createdAt: '2025-11-01T10:00:00Z',
  },
];

// Conversations
const conversations = [
  {
    id: 'conv-1234567890',
    userId: 'u1',
    visitorName: 'John Doe',
    visitorEmail: 'john.doe@example.com',
    messages: [
      {
        id: 'msg-1',
        conversationId: 'conv-1234567890',
        sender: 'user',
        message: 'Hello, I have a question about my order',
        createdAt: '2025-11-01T09:00:00Z',
      },
      {
        id: 'msg-2',
        conversationId: 'conv-1234567890',
        sender: 'ai',
        message: 'Hello! I\'d be happy to help you with your order. Can you please provide your order number?',
        createdAt: '2025-11-01T09:00:05Z',
      },
    ],
    status: 'active',
    transferredToAdmin: false,
    createdAt: '2025-11-01T09:00:00Z',
    lastMessageAt: '2025-11-01T09:00:05Z',
    adminReplied: false,
  },
];

// User Wishlists (stored per user)
const userWishlists = [
  {
    userId: 'u1',
    products: [
      {
        productId: 'e1',
        product: sampleProducts[1],
        addedAt: '2025-10-25T10:00:00Z',
      },
    ],
    updatedAt: '2025-10-25T10:00:00Z',
  },
];

// Carousel, Vouchers, Promo Cards, Reviews, Settings
const carouselSlides = [
  {
    id: 'slide-1',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
    title: 'Welcome to AURAZ',
    description: 'Premium E-Commerce Experience',
    buttonText: 'Shop Now',
    buttonLink: '/',
  },
];

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
];

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
];

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
];

const deliverySettings = {
  id: 'default',
  dhakaCharge: 60,
  outsideDhakaCharge: 110,
  freeShippingThreshold: 5000,
};

async function initializeCompleteDatabase() {
  let client;
  try {
    console.log('🔄 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB!');
    
    const db = client.db(DB_NAME);
    
    console.log('\n📦 Initializing ALL collections with complete data...\n');
    
    // 1. USERS
    console.log('👥 Initializing Users collection...');
    await db.collection('users').deleteMany({});
    await db.collection('users').insertMany(sampleUsers);
    console.log(`✅ Users: ${sampleUsers.length} documents`);
    
    // 2. PRODUCTS
    console.log('📦 Initializing Products collection...');
    await db.collection('products').deleteMany({});
    await db.collection('products').insertMany(sampleProducts);
    console.log(`✅ Products: ${sampleProducts.length} documents`);
    
    // 3. ORDERS
    console.log('🛒 Initializing Orders collection...');
    await db.collection('orders').deleteMany({});
    await db.collection('orders').insertMany(sampleOrders);
    console.log(`✅ Orders: ${sampleOrders.length} documents`);
    
    // 4. PAYMENT VERIFICATIONS
    console.log('💳 Initializing Payment Verifications collection...');
    await db.collection('payment_verifications').deleteMany({});
    await db.collection('payment_verifications').insertMany(paymentVerifications);
    console.log(`✅ Payment Verifications: ${paymentVerifications.length} documents`);
    
    // 5. REFUND REQUESTS
    console.log('🔄 Initializing Refund Requests collection...');
    await db.collection('refund_requests').deleteMany({});
    await db.collection('refund_requests').insertMany(refundRequests);
    console.log(`✅ Refund Requests: ${refundRequests.length} documents`);
    
    // 6. NOTIFICATIONS
    console.log('🔔 Initializing Notifications collection...');
    await db.collection('notifications').deleteMany({});
    await db.collection('notifications').insertMany(notifications);
    console.log(`✅ Notifications: ${notifications.length} documents`);
    
    // 7. CONVERSATIONS
    console.log('💬 Initializing Conversations collection...');
    await db.collection('conversations').deleteMany({});
    await db.collection('conversations').insertMany(conversations);
    console.log(`✅ Conversations: ${conversations.length} documents`);
    
    // 8. USER WISHLISTS
    console.log('❤️ Initializing User Wishlists collection...');
    await db.collection('user_wishlists').deleteMany({});
    await db.collection('user_wishlists').insertMany(userWishlists);
    console.log(`✅ User Wishlists: ${userWishlists.length} documents`);
    
    // 9. CAROUSEL SLIDES
    console.log('🎠 Initializing Carousel Slides collection...');
    await db.collection('carousel_slides').deleteMany({});
    await db.collection('carousel_slides').insertMany(carouselSlides);
    console.log(`✅ Carousel Slides: ${carouselSlides.length} documents`);
    
    // 10. VOUCHERS
    console.log('🎫 Initializing Vouchers collection...');
    await db.collection('vouchers').deleteMany({});
    await db.collection('vouchers').insertMany(vouchers);
    console.log(`✅ Vouchers: ${vouchers.length} documents`);
    
    // 11. PROMO CARDS
    console.log('✨ Initializing Promo Cards collection...');
    await db.collection('promo_cards').deleteMany({});
    await db.collection('promo_cards').insertMany(promoCards);
    console.log(`✅ Promo Cards: ${promoCards.length} documents`);
    
    // 12. REVIEWS
    console.log('⭐ Initializing Reviews collection...');
    await db.collection('reviews').deleteMany({});
    await db.collection('reviews').insertMany(reviews);
    console.log(`✅ Reviews: ${reviews.length} documents`);
    
    // 13. DELIVERY SETTINGS
    console.log('🚚 Initializing Delivery Settings collection...');
    await db.collection('delivery_settings').deleteMany({});
    await db.collection('delivery_settings').insertOne(deliverySettings);
    console.log(`✅ Delivery Settings: 1 document`);
    
    console.log('\n✅ ALL COLLECTIONS INITIALIZED SUCCESSFULLY!\n');
    
    // Summary
    console.log('📊 Database Summary:');
    const collections = await db.listCollections().toArray();
    for (const col of collections) {
      if (!col.name.startsWith('test_')) {
        const count = await db.collection(col.name).countDocuments();
        console.log(`  - ${col.name}: ${count} documents`);
      }
    }
    
    console.log('\n🎉 Complete database ready!');
    console.log('\n📝 Login Credentials:');
    console.log('   Admin: auraz@admin.com / auraz878');
    console.log('   User: john.doe@example.com / user123');
    console.log('\n✅ User Profile Sections Ready:');
    console.log('   - Profile & Personal Info');
    console.log('   - Addresses');
    console.log('   - Payment Methods');
    console.log('   - Orders (All, Active, Completed, Cancelled)');
    console.log('   - Wishlist');
    console.log('   - Notifications');
    console.log('   - Refunds');
    console.log('   - Security');
    
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

initializeCompleteDatabase();

