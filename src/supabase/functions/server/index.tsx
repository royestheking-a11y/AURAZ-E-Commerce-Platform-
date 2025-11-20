import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// ========================================
// SUPABASE CLIENT
// ========================================
const getSupabaseClient = () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  
  return createClient(supabaseUrl, serviceRoleKey);
};

// ========================================
// MIDDLEWARE
// ========================================
app.use('*', logger(console.log));

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

// ========================================
// HELPER FUNCTIONS
// ========================================
const generateId = () => {
  return Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
};

// ========================================
// HEALTH CHECK
// ========================================
app.get("/make-server-3adf4243/health", (c) => {
  return c.json({ 
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

// ========================================
// AUTH ENDPOINTS
// ========================================

// Login
app.post("/make-server-3adf4243/api/auth/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    // Check admin login
    if (email === "auraz@admin.com" && password === "auraz878") {
      return c.json({ 
        success: true, 
        isAdmin: true,
        user: {
          id: "admin",
          name: "Admin",
          email: "auraz@admin.com",
          phone: "",
          status: "approved",
          createdAt: "2025-01-01",
          addresses: [],
          paymentMethods: [],
          usedVouchers: []
        }
      });
    }
    
    // Check user login
    const users = await kv.get("users") || [];
    const user = users.find((u: any) => u.email === email);
    
    if (!user) {
      return c.json({ success: false, message: "Invalid email or password" }, 401);
    }
    
    if (user.password !== password) {
      return c.json({ success: false, message: "Invalid password" }, 401);
    }
    
    if (user.status === "pending") {
      return c.json({ success: false, message: "Your account is pending approval" }, 403);
    }
    
    if (user.status === "rejected") {
      return c.json({ success: false, message: "Your account has been rejected" }, 403);
    }
    
    return c.json({ success: true, isAdmin: false, user });
  } catch (err) {
    console.error('Login error:', err);
    return c.json({ success: false, message: 'Login failed' }, 500);
  }
});

// Register
app.post("/make-server-3adf4243/api/auth/register", async (c) => {
  try {
    const userData = await c.req.json();
    const users = await kv.get("users") || [];
    
    const existingUser = users.find((u: any) => u.email === userData.email);
    if (existingUser) {
      return c.json({ success: false, message: "Email already registered" }, 400);
    }
    
    const newUser = {
      ...userData,
      id: generateId(),
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
      addresses: [],
      paymentMethods: [],
      usedVouchers: []
    };
    
    users.push(newUser);
    await kv.set("users", users);
    
    return c.json({ success: true, message: "Registration submitted! Please wait for admin approval." });
  } catch (err) {
    console.error('Register error:', err);
    return c.json({ success: false, message: 'Registration failed' }, 500);
  }
});

// ========================================
// USER ENDPOINTS
// ========================================

// Get all users (admin only)
app.get("/make-server-3adf4243/api/users", async (c) => {
  try {
    const users = await kv.get("users") || [];
    return c.json({ success: true, data: users });
  } catch (err) {
    console.error('Get users error:', err);
    return c.json({ success: false, message: 'Failed to fetch users' }, 500);
  }
});

// Update user
app.put("/make-server-3adf4243/api/users/:id", async (c) => {
  try {
    const userId = c.req.param('id');
    const updates = await c.req.json();
    const users = await kv.get("users") || [];
    
    const index = users.findIndex((u: any) => u.id === userId);
    if (index === -1) {
      return c.json({ success: false, message: "User not found" }, 404);
    }
    
    users[index] = { ...users[index], ...updates };
    await kv.set("users", users);
    
    return c.json({ success: true, data: users[index] });
  } catch (err) {
    console.error('Update user error:', err);
    return c.json({ success: false, message: 'Failed to update user' }, 500);
  }
});

// Delete user
app.delete("/make-server-3adf4243/api/users/:id", async (c) => {
  try {
    const userId = c.req.param('id');
    const users = await kv.get("users") || [];
    
    const filtered = users.filter((u: any) => u.id !== userId);
    await kv.set("users", filtered);
    
    return c.json({ success: true });
  } catch (err) {
    console.error('Delete user error:', err);
    return c.json({ success: false, message: 'Failed to delete user' }, 500);
  }
});

// ========================================
// PRODUCT ENDPOINTS
// ========================================

// Get all products
app.get("/make-server-3adf4243/api/products", async (c) => {
  try {
    const products = await kv.get("products") || [];
    return c.json({ success: true, data: products });
  } catch (err) {
    console.error('Get products error:', err);
    return c.json({ success: false, message: 'Failed to fetch products' }, 500);
  }
});

// Add product
app.post("/make-server-3adf4243/api/products", async (c) => {
  try {
    const productData = await c.req.json();
    const products = await kv.get("products") || [];
    
    const newProduct = {
      ...productData,
      id: generateId()
    };
    
    products.push(newProduct);
    await kv.set("products", products);
    
    return c.json({ success: true, data: newProduct });
  } catch (err) {
    console.error('Add product error:', err);
    return c.json({ success: false, message: 'Failed to add product' }, 500);
  }
});

// Update product
app.put("/make-server-3adf4243/api/products/:id", async (c) => {
  try {
    const productId = c.req.param('id');
    const updates = await c.req.json();
    const products = await kv.get("products") || [];
    
    const index = products.findIndex((p: any) => p.id === productId);
    if (index === -1) {
      return c.json({ success: false, message: "Product not found" }, 404);
    }
    
    products[index] = { ...products[index], ...updates };
    await kv.set("products", products);
    
    return c.json({ success: true, data: products[index] });
  } catch (err) {
    console.error('Update product error:', err);
    return c.json({ success: false, message: 'Failed to update product' }, 500);
  }
});

// Delete product
app.delete("/make-server-3adf4243/api/products/:id", async (c) => {
  try {
    const productId = c.req.param('id');
    const products = await kv.get("products") || [];
    
    const filtered = products.filter((p: any) => p.id !== productId);
    await kv.set("products", filtered);
    
    return c.json({ success: true });
  } catch (err) {
    console.error('Delete product error:', err);
    return c.json({ success: false, message: 'Failed to delete product' }, 500);
  }
});

// ========================================
// ORDER ENDPOINTS
// ========================================

// Get all orders
app.get("/make-server-3adf4243/api/orders", async (c) => {
  try {
    const orders = await kv.get("orders") || [];
    const users = await kv.get("users") || [];
    
    // Populate user data for each order if not already present
    const ordersWithUsers = orders.map((order: any) => {
      if (!order.user && order.userId) {
        const user = users.find((u: any) => u.id === order.userId);
        return { ...order, user: user || null };
      }
      return order;
    });
    
    return c.json({ success: true, data: ordersWithUsers });
  } catch (err) {
    console.error('Get orders error:', err);
    return c.json({ success: false, message: 'Failed to fetch orders' }, 500);
  }
});

// Place order
app.post("/make-server-3adf4243/api/orders", async (c) => {
  try {
    const orderData = await c.req.json();
    const orders = await kv.get("orders") || [];
    
    const newOrder = {
      ...orderData,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    
    orders.push(newOrder);
    await kv.set("orders", orders);
    
    return c.json({ success: true, data: newOrder });
  } catch (err) {
    console.error('Place order error:', err);
    return c.json({ success: false, message: 'Failed to place order' }, 500);
  }
});

// Update order
app.put("/make-server-3adf4243/api/orders/:id", async (c) => {
  try {
    const orderId = c.req.param('id');
    const updates = await c.req.json();
    const orders = await kv.get("orders") || [];
    
    const index = orders.findIndex((o: any) => o.id === orderId);
    if (index === -1) {
      return c.json({ success: false, message: "Order not found" }, 404);
    }
    
    orders[index] = { ...orders[index], ...updates };
    await kv.set("orders", orders);
    
    return c.json({ success: true, data: orders[index] });
  } catch (err) {
    console.error('Update order error:', err);
    return c.json({ success: false, message: 'Failed to update order' }, 500);
  }
});

// Delete order
app.delete("/make-server-3adf4243/api/orders/:id", async (c) => {
  try {
    const orderId = c.req.param('id');
    const orders = await kv.get("orders") || [];
    
    const filtered = orders.filter((o: any) => o.id !== orderId);
    await kv.set("orders", filtered);
    
    return c.json({ success: true });
  } catch (err) {
    console.error('Delete order error:', err);
    return c.json({ success: false, message: 'Failed to delete order' }, 500);
  }
});

// ========================================
// CAROUSEL ENDPOINTS
// ========================================

// Get carousel slides
app.get("/make-server-3adf4243/api/carousel", async (c) => {
  try {
    const slides = await kv.get("carousel") || [];
    return c.json({ success: true, data: slides });
  } catch (err) {
    console.error('Get carousel error:', err);
    return c.json({ success: false, message: 'Failed to fetch carousel' }, 500);
  }
});

// Add carousel slide
app.post("/make-server-3adf4243/api/carousel", async (c) => {
  try {
    const slideData = await c.req.json();
    const slides = await kv.get("carousel") || [];
    
    const newSlide = {
      ...slideData,
      id: generateId()
    };
    
    slides.push(newSlide);
    await kv.set("carousel", slides);
    
    return c.json({ success: true, data: newSlide });
  } catch (err) {
    console.error('Add carousel error:', err);
    return c.json({ success: false, message: 'Failed to add slide' }, 500);
  }
});

// Update carousel slide
app.put("/make-server-3adf4243/api/carousel/:id", async (c) => {
  try {
    const slideId = c.req.param('id');
    const updates = await c.req.json();
    const slides = await kv.get("carousel") || [];
    
    const index = slides.findIndex((s: any) => s.id === slideId);
    if (index === -1) {
      return c.json({ success: false, message: "Slide not found" }, 404);
    }
    
    slides[index] = { ...slides[index], ...updates };
    await kv.set("carousel", slides);
    
    return c.json({ success: true, data: slides[index] });
  } catch (err) {
    console.error('Update carousel error:', err);
    return c.json({ success: false, message: 'Failed to update slide' }, 500);
  }
});

// Delete carousel slide
app.delete("/make-server-3adf4243/api/carousel/:id", async (c) => {
  try {
    const slideId = c.req.param('id');
    const slides = await kv.get("carousel") || [];
    
    const filtered = slides.filter((s: any) => s.id !== slideId);
    await kv.set("carousel", filtered);
    
    return c.json({ success: true });
  } catch (err) {
    console.error('Delete carousel error:', err);
    return c.json({ success: false, message: 'Failed to delete slide' }, 500);
  }
});

// ========================================
// VOUCHER ENDPOINTS
// ========================================

// Get all vouchers
app.get("/make-server-3adf4243/api/vouchers", async (c) => {
  try {
    const vouchers = await kv.get("vouchers") || [];
    return c.json({ success: true, data: vouchers });
  } catch (err) {
    console.error('Get vouchers error:', err);
    return c.json({ success: false, message: 'Failed to fetch vouchers' }, 500);
  }
});

// Add voucher
app.post("/make-server-3adf4243/api/vouchers", async (c) => {
  try {
    const voucherData = await c.req.json();
    const vouchers = await kv.get("vouchers") || [];
    
    const newVoucher = {
      ...voucherData,
      id: generateId(),
      usedCount: 0
    };
    
    vouchers.push(newVoucher);
    await kv.set("vouchers", vouchers);
    
    return c.json({ success: true, data: newVoucher });
  } catch (err) {
    console.error('Add voucher error:', err);
    return c.json({ success: false, message: 'Failed to add voucher' }, 500);
  }
});

// Update voucher
app.put("/make-server-3adf4243/api/vouchers/:id", async (c) => {
  try {
    const voucherId = c.req.param('id');
    const updates = await c.req.json();
    const vouchers = await kv.get("vouchers") || [];
    
    const index = vouchers.findIndex((v: any) => v.id === voucherId);
    if (index === -1) {
      return c.json({ success: false, message: "Voucher not found" }, 404);
    }
    
    vouchers[index] = { ...vouchers[index], ...updates };
    await kv.set("vouchers", vouchers);
    
    return c.json({ success: true, data: vouchers[index] });
  } catch (err) {
    console.error('Update voucher error:', err);
    return c.json({ success: false, message: 'Failed to update voucher' }, 500);
  }
});

// Delete voucher
app.delete("/make-server-3adf4243/api/vouchers/:id", async (c) => {
  try {
    const voucherId = c.req.param('id');
    const vouchers = await kv.get("vouchers") || [];
    
    const filtered = vouchers.filter((v: any) => v.id !== voucherId);
    await kv.set("vouchers", filtered);
    
    return c.json({ success: true });
  } catch (err) {
    console.error('Delete voucher error:', err);
    return c.json({ success: false, message: 'Failed to delete voucher' }, 500);
  }
});

// ========================================
// PROMO CARD ENDPOINTS
// ========================================

// Get all promo cards
app.get("/make-server-3adf4243/api/promo-cards", async (c) => {
  try {
    const promoCards = await kv.get("promoCards") || [];
    return c.json({ success: true, data: promoCards });
  } catch (err) {
    console.error('Get promo cards error:', err);
    return c.json({ success: false, message: 'Failed to fetch promo cards' }, 500);
  }
});

// Add promo card
app.post("/make-server-3adf4243/api/promo-cards", async (c) => {
  try {
    const cardData = await c.req.json();
    const promoCards = await kv.get("promoCards") || [];
    
    const newCard = {
      ...cardData,
      id: generateId()
    };
    
    promoCards.push(newCard);
    await kv.set("promoCards", promoCards);
    
    return c.json({ success: true, data: newCard });
  } catch (err) {
    console.error('Add promo card error:', err);
    return c.json({ success: false, message: 'Failed to add promo card' }, 500);
  }
});

// Update promo card
app.put("/make-server-3adf4243/api/promo-cards/:id", async (c) => {
  try {
    const cardId = c.req.param('id');
    const updates = await c.req.json();
    const promoCards = await kv.get("promoCards") || [];
    
    const index = promoCards.findIndex((pc: any) => pc.id === cardId);
    if (index === -1) {
      return c.json({ success: false, message: "Promo card not found" }, 404);
    }
    
    promoCards[index] = { ...promoCards[index], ...updates };
    await kv.set("promoCards", promoCards);
    
    return c.json({ success: true, data: promoCards[index] });
  } catch (err) {
    console.error('Update promo card error:', err);
    return c.json({ success: false, message: 'Failed to update promo card' }, 500);
  }
});

// Delete promo card
app.delete("/make-server-3adf4243/api/promo-cards/:id", async (c) => {
  try {
    const cardId = c.req.param('id');
    const promoCards = await kv.get("promoCards") || [];
    
    const filtered = promoCards.filter((pc: any) => pc.id !== cardId);
    await kv.set("promoCards", filtered);
    
    return c.json({ success: true });
  } catch (err) {
    console.error('Delete promo card error:', err);
    return c.json({ success: false, message: 'Failed to delete promo card' }, 500);
  }
});

// ========================================
// PAYMENT VERIFICATION ENDPOINTS
// ========================================

// Get all payment verifications
app.get("/make-server-3adf4243/api/payment-verifications", async (c) => {
  try {
    const verifications = await kv.get("paymentVerifications") || [];
    return c.json({ success: true, data: verifications });
  } catch (err) {
    console.error('Get payment verifications error:', err);
    return c.json({ success: false, message: 'Failed to fetch payment verifications' }, 500);
  }
});

// Request payment verification
app.post("/make-server-3adf4243/api/payment-verifications", async (c) => {
  try {
    const { orderData, amount } = await c.req.json();
    const verifications = await kv.get("paymentVerifications") || [];
    const users = await kv.get("users") || [];
    
    const user = users.find((u: any) => u.id === orderData.userId);
    
    const newVerification = {
      id: generateId(),
      userId: orderData.userId,
      user: user,
      orderId: generateId(),
      amount: amount,
      userPhone: user.phone,
      status: "pending",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      orderData: orderData
    };
    
    verifications.push(newVerification);
    await kv.set("paymentVerifications", verifications);
    
    return c.json({ success: true, data: newVerification });
  } catch (err) {
    console.error('Request payment verification error:', err);
    return c.json({ success: false, message: 'Failed to request payment verification' }, 500);
  }
});

// Update payment verification
app.put("/make-server-3adf4243/api/payment-verifications/:id", async (c) => {
  try {
    const verificationId = c.req.param('id');
    const updates = await c.req.json();
    const verifications = await kv.get("paymentVerifications") || [];
    
    const index = verifications.findIndex((v: any) => v.id === verificationId);
    if (index === -1) {
      return c.json({ success: false, message: "Verification not found" }, 404);
    }
    
    verifications[index] = { ...verifications[index], ...updates };
    await kv.set("paymentVerifications", verifications);
    
    return c.json({ success: true, data: verifications[index] });
  } catch (err) {
    console.error('Update payment verification error:', err);
    return c.json({ success: false, message: 'Failed to update verification' }, 500);
  }
});

// ========================================
// REFUND ENDPOINTS
// ========================================

// Get all refund requests
app.get("/make-server-3adf4243/api/refunds", async (c) => {
  try {
    const refunds = await kv.get("refunds") || [];
    const users = await kv.get("users") || [];
    const orders = await kv.get("orders") || [];
    
    // Populate user and order data for each refund if not already present
    const refundsWithData = refunds.map((refund: any) => {
      const populatedRefund = { ...refund };
      
      if (!populatedRefund.user && populatedRefund.userId) {
        const user = users.find((u: any) => u.id === populatedRefund.userId);
        populatedRefund.user = user || null;
      }
      
      if (!populatedRefund.order && populatedRefund.orderId) {
        const order = orders.find((o: any) => o.id === populatedRefund.orderId);
        populatedRefund.order = order || null;
      }
      
      return populatedRefund;
    });
    
    return c.json({ success: true, data: refundsWithData });
  } catch (err) {
    console.error('Get refunds error:', err);
    return c.json({ success: false, message: 'Failed to fetch refunds' }, 500);
  }
});

// Create refund request
app.post("/make-server-3adf4243/api/refunds", async (c) => {
  try {
    const refundData = await c.req.json();
    const refunds = await kv.get("refunds") || [];
    const orders = await kv.get("orders") || [];
    const users = await kv.get("users") || [];
    
    const order = orders.find((o: any) => o.id === refundData.orderId);
    const user = users.find((u: any) => u.id === refundData.userId);
    
    const newRefund = {
      ...refundData,
      id: generateId(),
      user: user,
      order: order,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    
    refunds.push(newRefund);
    await kv.set("refunds", refunds);
    
    return c.json({ success: true, data: newRefund });
  } catch (err) {
    console.error('Create refund error:', err);
    return c.json({ success: false, message: 'Failed to create refund' }, 500);
  }
});

// Update refund
app.put("/make-server-3adf4243/api/refunds/:id", async (c) => {
  try {
    const refundId = c.req.param('id');
    const updates = await c.req.json();
    const refunds = await kv.get("refunds") || [];
    
    const index = refunds.findIndex((r: any) => r.id === refundId);
    if (index === -1) {
      return c.json({ success: false, message: "Refund not found" }, 404);
    }
    
    refunds[index] = { ...refunds[index], ...updates, processedAt: new Date().toISOString() };
    await kv.set("refunds", refunds);
    
    return c.json({ success: true, data: refunds[index] });
  } catch (err) {
    console.error('Update refund error:', err);
    return c.json({ success: false, message: 'Failed to update refund' }, 500);
  }
});

// ========================================
// NOTIFICATION ENDPOINTS
// ========================================

// Get all notifications
app.get("/make-server-3adf4243/api/notifications", async (c) => {
  try {
    const notifications = await kv.get("notifications") || [];
    return c.json({ success: true, data: notifications });
  } catch (err) {
    console.error('Get notifications error:', err);
    return c.json({ success: false, message: 'Failed to fetch notifications' }, 500);
  }
});

// Add notification
app.post("/make-server-3adf4243/api/notifications", async (c) => {
  try {
    const notificationData = await c.req.json();
    const notifications = await kv.get("notifications") || [];
    
    const newNotification = {
      ...notificationData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      isRead: false
    };
    
    notifications.push(newNotification);
    await kv.set("notifications", notifications);
    
    return c.json({ success: true, data: newNotification });
  } catch (err) {
    console.error('Add notification error:', err);
    return c.json({ success: false, message: 'Failed to add notification' }, 500);
  }
});

// Mark notification as read
app.put("/make-server-3adf4243/api/notifications/:id", async (c) => {
  try {
    const notificationId = c.req.param('id');
    const notifications = await kv.get("notifications") || [];
    
    const index = notifications.findIndex((n: any) => n.id === notificationId);
    if (index === -1) {
      return c.json({ success: false, message: "Notification not found" }, 404);
    }
    
    notifications[index] = { ...notifications[index], isRead: true };
    await kv.set("notifications", notifications);
    
    return c.json({ success: true, data: notifications[index] });
  } catch (err) {
    console.error('Update notification error:', err);
    return c.json({ success: false, message: 'Failed to update notification' }, 500);
  }
});

// ========================================
// REVIEW ENDPOINTS
// ========================================

// Get all reviews
app.get("/make-server-3adf4243/api/reviews", async (c) => {
  try {
    const reviews = await kv.get("reviews") || [];
    return c.json({ success: true, data: reviews });
  } catch (err) {
    console.error('Get reviews error:', err);
    return c.json({ success: false, message: 'Failed to fetch reviews' }, 500);
  }
});

// Add review
app.post("/make-server-3adf4243/api/reviews", async (c) => {
  try {
    const reviewData = await c.req.json();
    const reviews = await kv.get("reviews") || [];
    
    const newReview = {
      ...reviewData,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    
    reviews.push(newReview);
    await kv.set("reviews", reviews);
    
    return c.json({ success: true, data: newReview });
  } catch (err) {
    console.error('Add review error:', err);
    return c.json({ success: false, message: 'Failed to add review' }, 500);
  }
});

// Delete review
app.delete("/make-server-3adf4243/api/reviews/:id", async (c) => {
  try {
    const reviewId = c.req.param('id');
    const reviews = await kv.get("reviews") || [];
    
    const filtered = reviews.filter((r: any) => r.id !== reviewId);
    await kv.set("reviews", filtered);
    
    return c.json({ success: true });
  } catch (err) {
    console.error('Delete review error:', err);
    return c.json({ success: false, message: 'Failed to delete review' }, 500);
  }
});

// ========================================
// CONVERSATION ENDPOINTS (AI ASSISTANT)
// ========================================

// Get all conversations
app.get("/make-server-3adf4243/api/conversations", async (c) => {
  try {
    const conversations = await kv.get("conversations") || [];
    return c.json({ success: true, data: conversations });
  } catch (err) {
    console.error('Get conversations error:', err);
    return c.json({ success: false, message: 'Failed to fetch conversations' }, 500);
  }
});

// Create conversation
app.post("/make-server-3adf4243/api/conversations", async (c) => {
  try {
    const { visitorName, visitorEmail, userId } = await c.req.json();
    const conversations = await kv.get("conversations") || [];
    
    const newConversation = {
      id: generateId(),
      userId: userId,
      visitorName: visitorName,
      visitorEmail: visitorEmail,
      messages: [],
      status: "active",
      transferredToAdmin: false,
      createdAt: new Date().toISOString(),
      lastMessageAt: new Date().toISOString(),
      adminReplied: false
    };
    
    conversations.push(newConversation);
    await kv.set("conversations", conversations);
    
    return c.json({ success: true, data: newConversation });
  } catch (err) {
    console.error('Create conversation error:', err);
    return c.json({ success: false, message: 'Failed to create conversation' }, 500);
  }
});

// Add message to conversation
app.post("/make-server-3adf4243/api/conversations/:id/messages", async (c) => {
  try {
    const conversationId = c.req.param('id');
    const { sender, message } = await c.req.json();
    const conversations = await kv.get("conversations") || [];
    
    const index = conversations.findIndex((conv: any) => conv.id === conversationId);
    if (index === -1) {
      return c.json({ success: false, message: "Conversation not found" }, 404);
    }
    
    const newMessage = {
      id: generateId(),
      conversationId: conversationId,
      sender: sender,
      message: message,
      createdAt: new Date().toISOString()
    };
    
    conversations[index].messages.push(newMessage);
    conversations[index].lastMessageAt = new Date().toISOString();
    
    if (sender === "admin") {
      conversations[index].adminReplied = true;
    }
    
    await kv.set("conversations", conversations);
    
    return c.json({ success: true, data: conversations[index] });
  } catch (err) {
    console.error('Add message error:', err);
    return c.json({ success: false, message: 'Failed to add message' }, 500);
  }
});

// Update conversation
app.put("/make-server-3adf4243/api/conversations/:id", async (c) => {
  try {
    const conversationId = c.req.param('id');
    const updates = await c.req.json();
    const conversations = await kv.get("conversations") || [];
    
    const index = conversations.findIndex((conv: any) => conv.id === conversationId);
    if (index === -1) {
      return c.json({ success: false, message: "Conversation not found" }, 404);
    }
    
    conversations[index] = { ...conversations[index], ...updates };
    await kv.set("conversations", conversations);
    
    return c.json({ success: true, data: conversations[index] });
  } catch (err) {
    console.error('Update conversation error:', err);
    return c.json({ success: false, message: 'Failed to update conversation' }, 500);
  }
});

// Delete conversation
app.delete("/make-server-3adf4243/api/conversations/:id", async (c) => {
  try {
    const conversationId = c.req.param('id');
    const conversations = await kv.get("conversations") || [];
    
    const filtered = conversations.filter((conv: any) => conv.id !== conversationId);
    await kv.set("conversations", filtered);
    
    return c.json({ success: true });
  } catch (err) {
    console.error('Delete conversation error:', err);
    return c.json({ success: false, message: 'Failed to delete conversation' }, 500);
  }
});

// ========================================
// DELIVERY SETTINGS ENDPOINTS
// ========================================

// Get delivery settings
app.get("/make-server-3adf4243/api/delivery-settings", async (c) => {
  try {
    const settings = await kv.get("deliverySettings") || {
      dhakaCharge: 60,
      outsideDhakaCharge: 110,
      freeShippingThreshold: 5000
    };
    return c.json({ success: true, data: settings });
  } catch (err) {
    console.error('Get delivery settings error:', err);
    return c.json({ success: false, message: 'Failed to fetch delivery settings' }, 500);
  }
});

// Update delivery settings
app.put("/make-server-3adf4243/api/delivery-settings", async (c) => {
  try {
    const updates = await c.req.json();
    const currentSettings = await kv.get("deliverySettings") || {
      dhakaCharge: 60,
      outsideDhakaCharge: 110,
      freeShippingThreshold: 5000
    };
    
    const newSettings = { ...currentSettings, ...updates };
    await kv.set("deliverySettings", newSettings);
    
    return c.json({ success: true, data: newSettings });
  } catch (err) {
    console.error('Update delivery settings error:', err);
    return c.json({ success: false, message: 'Failed to update delivery settings' }, 500);
  }
});

// ========================================
// DATA INITIALIZATION ENDPOINT
// ========================================

// Initialize data from localStorage
app.post("/make-server-3adf4243/api/init-data", async (c) => {
  try {
    const data = await c.req.json();
    
    // Save each data type
    if (data.users) await kv.set("users", data.users);
    if (data.products) await kv.set("products", data.products);
    if (data.orders) await kv.set("orders", data.orders);
    if (data.carousel) await kv.set("carousel", data.carousel);
    if (data.vouchers) await kv.set("vouchers", data.vouchers);
    if (data.promoCards) await kv.set("promoCards", data.promoCards);
    if (data.paymentVerifications) await kv.set("paymentVerifications", data.paymentVerifications);
    if (data.refunds) await kv.set("refunds", data.refunds);
    if (data.notifications) await kv.set("notifications", data.notifications);
    if (data.reviews) await kv.set("reviews", data.reviews);
    if (data.conversations) await kv.set("conversations", data.conversations);
    if (data.deliverySettings) await kv.set("deliverySettings", data.deliverySettings);
    
    return c.json({ success: true, message: "Data initialized successfully" });
  } catch (err) {
    console.error('Init data error:', err);
    return c.json({ success: false, message: 'Failed to initialize data' }, 500);
  }
});

// ========================================
// ERROR HANDLERS
// ========================================
app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json({ 
    error: 'Internal server error',
    message: err instanceof Error ? err.message : 'Unknown error'
  }, 500);
});

app.notFound((c) => {
  return c.json({ 
    error: 'Not found',
    path: c.req.path
  }, 404);
});

// ========================================
// START SERVER
// ========================================
Deno.serve(app.fetch);
