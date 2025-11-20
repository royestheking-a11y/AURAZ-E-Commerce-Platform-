// COMPREHENSIVE INITIALIZATION WITH ALL PRODUCTS AND TEST DATA
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
};

// Sample Users
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

// Comprehensive Products List (50+ products)
const sampleProducts = [
  // Fashion Products
  {
    id: 'f1',
    name: 'Premium Cotton T-Shirt',
    price: 799,
    originalPrice: 1299,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
    rating: 4.2,
    reviewCount: 156,
    category: 'Fashion',
    brand: 'StyleHub',
    description: 'Comfortable 100% cotton t-shirt perfect for everyday wear.',
    stock: 120,
    seller: { id: 's2', name: 'Fashion Junction' },
    isDeal: true,
    isTrending: true,
    isNewArrival: false,
    isHidden: false,
  },
  {
    id: 'f2',
    name: 'Slim Fit Denim Jeans',
    price: 2499,
    originalPrice: 3999,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
    rating: 4.5,
    reviewCount: 234,
    category: 'Fashion',
    brand: 'DenimCo',
    description: 'Classic slim fit jeans with stretch comfort.',
    stock: 85,
    seller: { id: 's2', name: 'Fashion Junction' },
    isDeal: true,
    isTrending: false,
    isNewArrival: false,
    isHidden: false,
  },
  {
    id: 'f3',
    name: 'Formal Shirt White',
    price: 1599,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500',
    rating: 4.3,
    reviewCount: 98,
    category: 'Fashion',
    brand: 'FormalWear',
    description: 'Crisp white formal shirt for office and events.',
    stock: 67,
    seller: { id: 's2', name: 'Fashion Junction' },
    isDeal: false,
    isTrending: false,
    isNewArrival: true,
    isHidden: false,
  },
  {
    id: 'f4',
    name: 'Summer Floral Dress',
    price: 2199,
    originalPrice: 3499,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500',
    rating: 4.6,
    reviewCount: 187,
    category: 'Fashion',
    brand: 'StyleHub',
    description: 'Beautiful floral print dress perfect for summer.',
    stock: 43,
    seller: { id: 's2', name: 'Fashion Junction' },
    isDeal: true,
    isTrending: true,
    isNewArrival: true,
    isHidden: false,
  },
  {
    id: 'f5',
    name: 'Leather Jacket',
    price: 5999,
    originalPrice: 8999,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
    rating: 4.7,
    reviewCount: 156,
    category: 'Fashion',
    brand: 'LeatherLux',
    description: 'Premium leather jacket with modern styling.',
    stock: 28,
    seller: { id: 's6', name: 'Premium Fashion' },
    isDeal: true,
    isTrending: true,
    isNewArrival: false,
    isHidden: false,
  },
  {
    id: 'f6',
    name: 'Casual Hoodie',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
    rating: 4.4,
    reviewCount: 276,
    category: 'Fashion',
    brand: 'StreetStyle',
    description: 'Comfortable hoodie for casual wear.',
    stock: 145,
    seller: { id: 's2', name: 'Fashion Junction' },
    isDeal: false,
    isTrending: false,
    isNewArrival: true,
    isHidden: false,
  },
  {
    id: 'f7',
    name: 'Sports Track Pants',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500',
    rating: 4.3,
    reviewCount: 134,
    category: 'Fashion',
    brand: 'SportMax',
    description: 'Comfortable track pants for workout and casual wear.',
    stock: 98,
    seller: { id: 's3', name: 'Sports Galaxy' },
    isDeal: false,
    isTrending: false,
    isNewArrival: false,
    isHidden: false,
  },
  {
    id: 'f8',
    name: 'Winter Coat',
    price: 4599,
    originalPrice: 6999,
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500',
    rating: 4.8,
    reviewCount: 89,
    category: 'Fashion',
    brand: 'WinterWear',
    description: 'Warm and stylish winter coat.',
    stock: 34,
    seller: { id: 's6', name: 'Premium Fashion' },
    isDeal: true,
    isTrending: false,
    isNewArrival: false,
    isHidden: false,
  },
  // Electronics Products
  {
    id: 'e1',
    name: 'Premium Wireless Headphones',
    price: 4999,
    originalPrice: 6999,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
    rating: 4.5,
    reviewCount: 328,
    category: 'Electronics',
    brand: 'AudioMax',
    description: 'Experience premium sound quality with active noise cancellation.',
    stock: 45,
    seller: { id: 's1', name: 'Tech Store BD' },
    isDeal: true,
    isTrending: true,
    isNewArrival: false,
    isHidden: false,
  },
  {
    id: 'e2',
    name: 'Gaming Mouse RGB',
    price: 1499,
    originalPrice: 1999,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    rating: 4.5,
    reviewCount: 298,
    category: 'Electronics',
    brand: 'GamePro',
    description: 'High-precision gaming mouse with customizable RGB lighting.',
    stock: 78,
    seller: { id: 's1', name: 'Tech Store BD' },
    isDeal: true,
    isTrending: false,
    isNewArrival: false,
    isHidden: false,
  },
  {
    id: 'e3',
    name: 'Mechanical Keyboard',
    price: 3999,
    originalPrice: 5499,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
    rating: 4.7,
    reviewCount: 412,
    category: 'Electronics',
    brand: 'GamePro',
    description: 'RGB mechanical gaming keyboard with blue switches.',
    stock: 56,
    seller: { id: 's1', name: 'Tech Store BD' },
    isDeal: false,
    isTrending: true,
    isNewArrival: false,
    isHidden: false,
  },
  {
    id: 'e4',
    name: '4K Webcam',
    price: 2799,
    image: 'https://images.unsplash.com/photo-1593642532400-2682810df593?w=500',
    rating: 4.4,
    reviewCount: 167,
    category: 'Electronics',
    brand: 'TechView',
    description: '4K resolution webcam for streaming and video calls.',
    stock: 89,
    seller: { id: 's1', name: 'Tech Store BD' },
    isDeal: false,
    isTrending: false,
    isNewArrival: true,
    isHidden: false,
  },
  {
    id: 'e5',
    name: 'Portable Bluetooth Speaker',
    price: 2199,
    originalPrice: 3499,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
    rating: 4.6,
    reviewCount: 523,
    category: 'Electronics',
    brand: 'AudioMax',
    description: 'Waterproof portable speaker with 20-hour battery life.',
    stock: 134,
    seller: { id: 's1', name: 'Tech Store BD' },
    isDeal: true,
    isTrending: true,
    isNewArrival: false,
    isHidden: false,
  },
  {
    id: 'e6',
    name: 'Wireless Mouse',
    price: 899,
    image: 'https://images.unsplash.com/photo-1586920740099-e6f0df06dab7?w=500',
    rating: 4.2,
    reviewCount: 245,
    category: 'Electronics',
    brand: 'TechGear',
    description: 'Ergonomic wireless mouse with silent clicks.',
    stock: 167,
    seller: { id: 's1', name: 'Tech Store BD' },
    isDeal: false,
    isTrending: false,
    isNewArrival: false,
    isHidden: false,
  },
  {
    id: 'e7',
    name: 'USB-C Hub 7-in-1',
    price: 1799,
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500',
    rating: 4.5,
    reviewCount: 189,
    category: 'Electronics',
    brand: 'TechGear',
    description: 'Multi-port USB-C hub with HDMI, USB 3.0, and card reader.',
    stock: 92,
    seller: { id: 's1', name: 'Tech Store BD' },
    isDeal: false,
    isTrending: false,
    isNewArrival: true,
    isHidden: false,
  },
  {
    id: 'e8',
    name: 'Power Bank 20000mAh',
    price: 1599,
    originalPrice: 2299,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500',
    rating: 4.4,
    reviewCount: 678,
    category: 'Electronics',
    brand: 'PowerTech',
    description: 'High capacity power bank with fast charging.',
    stock: 203,
    seller: { id: 's1', name: 'Tech Store BD' },
    isDeal: true,
    isTrending: false,
    isNewArrival: false,
    isHidden: false,
  },
  // Beauty Products
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
    id: 'b3',
    name: 'Makeup Brush Set',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500',
    rating: 4.5,
    reviewCount: 234,
    category: 'Beauty',
    brand: 'BeautyPro',
    description: 'Professional makeup brush set with 12 brushes.',
    stock: 89,
    seller: { id: 's3', name: 'Beauty World' },
    isDeal: false,
    isTrending: false,
    isNewArrival: false,
    isHidden: false,
  },
  {
    id: 'b4',
    name: 'Face Serum Vitamin C',
    price: 1899,
    originalPrice: 2499,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500',
    rating: 4.7,
    reviewCount: 156,
    category: 'Beauty',
    brand: 'GlowUp',
    description: 'Brightening face serum with Vitamin C.',
    stock: 67,
    seller: { id: 's3', name: 'Beauty World' },
    isDeal: true,
    isTrending: true,
    isNewArrival: false,
    isHidden: false,
  },
  // Grocery Products
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
    id: 'g2',
    name: 'Fresh Vegetables Pack',
    price: 299,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
    rating: 4.3,
    reviewCount: 567,
    category: 'Grocery',
    brand: 'FarmFresh',
    description: 'Fresh seasonal vegetables pack.',
    stock: 150,
    seller: { id: 's4', name: 'Grocery Mart' },
    isDeal: false,
    isTrending: false,
    isNewArrival: false,
    isHidden: false,
  },
  // Home Products
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
  {
    id: 'h2',
    name: 'Decorative Wall Clock',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=500',
    rating: 4.4,
    reviewCount: 98,
    category: 'Home',
    brand: 'HomeStyle',
    description: 'Elegant decorative wall clock.',
    stock: 56,
    seller: { id: 's5', name: 'Home Decor' },
    isDeal: false,
    isTrending: false,
    isNewArrival: false,
    isHidden: false,
  },
];

// Sample Orders
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
        product: sampleProducts[8],
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
        product: sampleProducts[8],
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
    userId: 'u1',
    target: 'user',
    title: 'Payment Verification Required',
    message: 'Please verify your payment for order #ORD-712',
    type: 'payment',
    link: '/order/ORD-712',
    isRead: false,
    createdAt: '2025-11-01T10:10:00Z',
  },
  {
    id: 'notif-4',
    target: 'admin',
    title: 'New Order Received',
    message: 'New order #ORD-712 from John Doe - ৳25,059',
    type: 'order',
    link: '/admin/orders',
    isRead: false,
    createdAt: '2025-11-01T10:00:00Z',
  },
  {
    id: 'notif-5',
    target: 'admin',
    title: 'New Refund Request',
    message: 'John Doe requested a refund for order #ORD-734',
    type: 'refund',
    link: '/admin/refunds',
    isRead: false,
    createdAt: '2025-10-16T10:05:00Z',
  },
];

// Conversations with Messages
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
      {
        id: 'msg-3',
        conversationId: 'conv-1234567890',
        sender: 'user',
        message: 'It\'s ORD-712. When will it be delivered?',
        createdAt: '2025-11-01T09:01:00Z',
      },
      {
        id: 'msg-4',
        conversationId: 'conv-1234567890',
        sender: 'ai',
        message: 'Your order is currently being processed. It should be shipped within 1-2 business days.',
        createdAt: '2025-11-01T09:01:10Z',
      },
      {
        id: 'msg-5',
        conversationId: 'conv-1234567890',
        sender: 'user',
        message: 'Can I change the delivery address?',
        createdAt: '2025-11-01T09:02:00Z',
      },
    ],
    status: 'active',
    transferredToAdmin: false,
    createdAt: '2025-11-01T09:00:00Z',
    lastMessageAt: '2025-11-01T09:02:00Z',
    adminReplied: false,
  },
  {
    id: 'conv-0987654321',
    userId: 'u1',
    visitorName: 'John Doe',
    visitorEmail: 'john.doe@example.com',
    messages: [
      {
        id: 'msg-6',
        conversationId: 'conv-0987654321',
        sender: 'user',
        message: 'I received a damaged product. What should I do?',
        createdAt: '2025-10-16T11:00:00Z',
      },
      {
        id: 'msg-7',
        conversationId: 'conv-0987654321',
        sender: 'ai',
        message: 'I\'m sorry to hear that. Let me transfer you to our support team for immediate assistance.',
        createdAt: '2025-10-16T11:00:10Z',
      },
      {
        id: 'msg-8',
        conversationId: 'conv-0987654321',
        sender: 'admin',
        message: 'Hello John, we apologize for the inconvenience. We have processed your refund request. You will receive the refund within 3-5 business days.',
        createdAt: '2025-10-16T11:30:00Z',
      },
    ],
    status: 'transferred',
    transferredToAdmin: true,
    createdAt: '2025-10-16T11:00:00Z',
    lastMessageAt: '2025-10-16T11:30:00Z',
    adminReplied: true,
  },
];

// User Wishlists
const userWishlists = [
  {
    userId: 'u1',
    products: [
      {
        productId: 'e1',
        product: sampleProducts[8],
        addedAt: '2025-10-25T10:00:00Z',
      },
      {
        productId: 'f5',
        product: sampleProducts[4],
        addedAt: '2025-10-20T14:00:00Z',
      },
    ],
    updatedAt: '2025-10-25T10:00:00Z',
  },
];

// Carousel Slides
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
  {
    id: 'slide-3',
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200',
    title: 'New Arrivals',
    description: 'Discover the latest fashion trends',
    buttonText: 'Shop Now',
    buttonLink: '/new-arrivals',
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

// Promo Cards
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
  {
    id: 'pc3',
    title: 'Fashion Trends 2025',
    description: 'Discover the latest fashion collection',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
    buttonText: 'Shop Fashion',
    link: '/category/Fashion',
    gradient: 'from-pink-500 to-pink-700',
    isActive: true,
    order: 3,
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
    comment: 'Great quality t-shirt! Very comfortable and fits perfectly.',
    createdAt: '2025-10-25T10:00:00Z',
  },
  {
    id: 'rev-2',
    productId: 'e1',
    userId: 'u2',
    userName: 'Sarah Johnson',
    rating: 4,
    comment: 'Good headphones, battery life could be better but sound quality is excellent.',
    createdAt: '2025-10-20T14:00:00Z',
  },
  {
    id: 'rev-3',
    productId: 'f2',
    userId: 'u1',
    userName: 'John Doe',
    rating: 5,
    comment: 'Perfect fit! Great quality jeans, highly recommended.',
    createdAt: '2025-10-18T09:00:00Z',
  },
];

// Delivery Settings
const deliverySettings = {
  id: 'default',
  dhakaCharge: 60,
  outsideDhakaCharge: 110,
  freeShippingThreshold: 5000,
};

async function initializeWithAllProducts() {
  let client;
  try {
    console.log('🔄 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB!');
    
    const db = client.db(DB_NAME);
    
    console.log('\n📦 Initializing ALL collections with comprehensive data...\n');
    
    // 1. USERS
    console.log('👥 Initializing Users collection...');
    await db.collection('users').deleteMany({});
    await db.collection('users').insertMany(sampleUsers);
    console.log(`✅ Users: ${sampleUsers.length} documents`);
    
    // 2. PRODUCTS (20+ products)
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
    
    console.log('\n🎉 Complete database ready with all products and test data!');
    console.log('\n📝 Login Credentials:');
    console.log('   Admin: auraz@admin.com / auraz878');
    console.log('   User: john.doe@example.com / user123');
    console.log('\n✅ Test User Has:');
    console.log('   - 20+ Products available');
    console.log('   - 4 Orders (pending, processing, delivered, cancelled)');
    console.log('   - 2 Items in wishlist');
    console.log('   - 3 Notifications');
    console.log('   - 2 Conversations with messages');
    console.log('   - 1 Payment verification (pending)');
    console.log('   - 1 Refund request (pending)');
    console.log('   - 2 Addresses');
    console.log('   - 2 Payment methods');
    
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

initializeWithAllProducts();

