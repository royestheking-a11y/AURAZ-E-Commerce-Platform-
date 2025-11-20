import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  Product,
  CartItem,
  products as mockProducts,
  heroSlides,
} from "./mockData";
import { toast } from "sonner";
import {
  usersApi,
  productsApi,
  ordersApi,
  carouselApi,
  vouchersApi,
  promoCardsApi,
  paymentVerificationsApi,
  refundsApi,
  notificationsApi,
  reviewsApi,
  conversationsApi,
  deliverySettingsApi,
  wishlistApi,
} from "./mongodbApi";

export interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  landmark?: string;
}

export interface PaymentMethod {
  id: string;
  type: "card" | "bkash" | "nagad";
  name: string;
  details: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  profilePhoto?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other" | "prefer-not-to-say";
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  usedVouchers: string[]; // Track which vouchers user has already used
}

export interface Order {
  id: string;
  userId: string;
  user: User;
  items: CartItem[];
  total: number;
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: string;
  deliveryCharge: number;
  voucherDiscount?: number;
  voucherCode?: string;
}

export interface CarouselSlide {
  id: string;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export interface PaymentVerification {
  id: string;
  userId: string;
  user: User;
  orderId: string;
  amount: number;
  userPhone: string;
  transactionId?: string; // bKash transaction ID
  status: "pending" | "approved" | "rejected" | "expired";
  createdAt: string;
  expiresAt: string;
  orderData: Omit<Order, "id" | "createdAt">;
}

// Voucher System
export interface Voucher {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number; // Percentage (0-100) or fixed amount
  description: string;
  minOrderAmount: number;
  maxDiscount?: number; // For percentage vouchers
  validFrom: string;
  validUntil: string;
  usageLimit: number; // Total times voucher can be used
  usedCount: number; // Times voucher has been used
  isActive: boolean;
  applicableCategories?: string[]; // Empty = all categories
}

// Homepage Promotional Cards
export interface PromoCard {
  id: string;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  link: string; // Can be /festive-sale or /electronics-sale
  gradient: string;
  isActive: boolean;
  order: number;
}

// Refund Requests
export interface RefundRequest {
  id: string;
  orderId: string;
  userId: string;
  user: User;
  order: Order;
  reason: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  processedAt?: string;
  adminNotes?: string;
}

// Notifications
export interface Notification {
  id: string;
  userId?: string; // If null, sent to all users/admins based on target
  target: "user" | "admin" | "all"; // Who should see this notification
  title: string;
  message: string;
  type: "order" | "payment" | "promotion" | "system";
  isRead: boolean;
  createdAt: string;
  link?: string;
}

// Delivery Settings
export interface DeliverySettings {
  dhakaCharge: number;
  outsideDhakaCharge: number;
  freeShippingThreshold: number;
}

// Product Reviews
export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  orderId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  isVerifiedPurchase: boolean;
}

// AI Assistant Messages
export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: "user" | "ai" | "admin";
  message: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  userId?: string; // If visitor, this is null
  visitorName?: string;
  visitorEmail?: string;
  messages: ChatMessage[];
  status: "active" | "transferred" | "closed";
  transferredToAdmin: boolean;
  createdAt: string;
  lastMessageAt: string;
  adminReplied: boolean;
}

interface AppContextType {
  // User State
  currentUser: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (
    user: Omit<
      User,
      | "id"
      | "status"
      | "createdAt"
      | "addresses"
      | "paymentMethods"
      | "usedVouchers"
    >,
  ) => void;
  updateUserProfile: (
    userId: string,
    updates: Partial<User>,
  ) => void;

  // User Addresses
  addAddress: (
    userId: string,
    address: Omit<Address, "id">,
  ) => void;
  updateAddress: (
    userId: string,
    addressId: string,
    updates: Partial<Address>,
  ) => void;
  deleteAddress: (userId: string, addressId: string) => void;

  // User Payment Methods
  addPaymentMethod: (
    userId: string,
    method: Omit<PaymentMethod, "id">,
  ) => void;
  updatePaymentMethod: (
    userId: string,
    methodId: string,
    updates: Partial<PaymentMethod>,
  ) => void;
  deletePaymentMethod: (
    userId: string,
    methodId: string,
  ) => void;

  // Cart & Wishlist
  cart: CartItem[];
  wishlist: Product[];
  addToCart: (
    product: Product,
    quantity: number,
    variant?: Record<string, string>,
  ) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (
    productId: string,
    quantity: number,
  ) => void;
  clearCart: () => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Admin - Users
  users: User[];
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  deleteUser: (userId: string) => void;

  // Admin - Products
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (
    productId: string,
    updates: Partial<Product>,
  ) => void;
  deleteProduct: (productId: string) => void;

  // Admin - Orders
  orders: Order[];
  updateOrderStatus: (
    orderId: string,
    status: Order["status"],
  ) => void;
  placeOrder: (order: Omit<Order, "id" | "createdAt">) => void;
  cancelOrder: (orderId: string) => void;
  deleteOrder: (orderId: string) => void;

  // Admin - Carousel
  carouselSlides: CarouselSlide[];
  addCarouselSlide: (slide: Omit<CarouselSlide, "id">) => void;
  updateCarouselSlide: (
    slideId: string,
    updates: Partial<CarouselSlide>,
  ) => void;
  deleteCarouselSlide: (slideId: string) => void;

  // Payment Verification
  paymentVerifications: PaymentVerification[];
  requestPaymentVerification: (
    orderData: Omit<Order, "id" | "createdAt">,
    amount: number,
    transactionId?: string,
  ) => string;
  approvePaymentVerification: (verificationId: string) => void;
  rejectPaymentVerification: (verificationId: string) => void;
  getPaymentVerification: (
    verificationId: string,
  ) => PaymentVerification | undefined;
  deletePaymentVerification: (verificationId: string) => void;

  // Vouchers
  vouchers: Voucher[];
  addVoucher: (
    voucher: Omit<Voucher, "id" | "usedCount">,
  ) => void;
  updateVoucher: (
    voucherId: string,
    updates: Partial<Voucher>,
  ) => void;
  deleteVoucher: (voucherId: string) => void;
  validateVoucher: (
    code: string,
    orderTotal: number,
    userId?: string,
  ) => { valid: boolean; message: string; voucher?: Voucher };
  applyVoucher: (code: string, userId: string) => void;

  // Promo Cards
  promoCards: PromoCard[];
  addPromoCard: (card: Omit<PromoCard, "id">) => void;
  updatePromoCard: (
    cardId: string,
    updates: Partial<PromoCard>,
  ) => void;
  deletePromoCard: (cardId: string) => void;

  // Refunds
  refundRequests: RefundRequest[];
  createRefundRequest: (
    orderId: string,
    reason: string,
  ) => void;
  approveRefund: (refundId: string, notes?: string) => void;
  rejectRefund: (refundId: string, notes?: string) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (
    notification: Omit<
      Notification,
      "id" | "createdAt" | "isRead"
    >,
  ) => void;
  markNotificationRead: (notificationId: string) => void;
  getUserNotifications: (userId: string) => Notification[];
  getAdminNotifications: () => Notification[];

  // Delivery Settings
  deliverySettings: DeliverySettings;
  updateDeliverySettings: (
    settings: Partial<DeliverySettings>,
  ) => void;
  calculateDeliveryCharge: (
    city: string,
    orderTotal: number,
  ) => number;

  // Product Reviews
  reviews: ProductReview[];
  addReview: (
    review: Omit<ProductReview, "id" | "createdAt">,
  ) => void;
  deleteReview: (reviewId: string) => void;
  getProductReviews: (productId: string) => ProductReview[];
  canUserReview: (userId: string, productId: string) => boolean;

  // AI Assistant & Messaging
  conversations: Conversation[];
  createConversation: (
    visitorName?: string,
    visitorEmail?: string,
  ) => string;
  addMessageToConversation: (
    conversationId: string,
    sender: "user" | "ai" | "admin",
    message: string,
  ) => void;
  transferConversationToAdmin: (conversationId: string) => void;
  closeConversation: (conversationId: string) => void;
  deleteConversation: (conversationId: string) => void;
  getConversation: (
    conversationId: string,
  ) => Conversation | undefined;
  getActiveConversations: () => Conversation[];
  getAdminNotificationCount: () => number;
  getUserUnreadNotificationCount: (userId: string) => number;

  // Data Management
  resetAllData: () => Promise<void>;
  clearLocalStorage: () => void;
}

const AppContext = createContext<AppContextType | undefined>(
  undefined,
);

// Admin credentials
const ADMIN_EMAIL = "auraz@admin.com";
const ADMIN_PASSWORD = "auraz878";

// Helper functions for localStorage (only for cart and wishlist - user-specific temporary data)
const getFromLocalStorage = <T,>(
  key: string,
  defaultValue: T,
): T => {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(
      `Error reading from localStorage key "${key}":`,
      error,
    );
    return defaultValue;
  }
};

const saveToLocalStorage = <T,>(
  key: string,
  value: T,
): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(
      `Error writing to localStorage key "${key}":`,
      error,
    );
  }
};

export function AppProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Initialize state with default values
  const [currentUser, setCurrentUser] = useState<User | null>(
    null,
  );
  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]); // Start empty - will load from MongoDB
  const [orders, setOrders] = useState<Order[]>([]);
  const [paymentVerifications, setPaymentVerifications] =
    useState<PaymentVerification[]>([]);
  const [carouselSlides, setCarouselSlides] = useState<CarouselSlide[]>([]); // Start empty - will load from MongoDB

  // New state for vouchers - start empty, load from MongoDB
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  // New state for promo cards - start empty, load from MongoDB
  const [promoCards, setPromoCards] = useState<PromoCard[]>([]);

  // New state for refunds
  const [refundRequests, setRefundRequests] = useState<
    RefundRequest[]
  >([]);

  // New state for notifications
  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);

  // New state for reviews
  const [reviews, setReviews] = useState<ProductReview[]>([]);

  // New state for AI assistant conversations
  const [conversations, setConversations] = useState<
    Conversation[]
  >([]);

  // Delivery settings
  const [deliverySettings, setDeliverySettings] =
    useState<DeliverySettings>({
      dhakaCharge: 60,
      outsideDhakaCharge: 110,
      freeShippingThreshold: 5000,
    });

  // Track if initial load from MongoDB is complete
  const [isInitialized, setIsInitialized] = useState(false);

  // Load initial data from MongoDB ONCE on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load user session from localStorage (temporary)
        const loadedUser = getFromLocalStorage<User | null>(
          "auraz_currentUser",
          null,
        );
        const loadedIsAdmin = getFromLocalStorage<boolean>(
          "auraz_isAdmin",
          false,
        );
        const loadedCart = getFromLocalStorage<CartItem[]>(
          "auraz_cart",
          [],
        );
        const loadedWishlist = getFromLocalStorage<Product[]>(
          "auraz_wishlist",
          [],
        );

        if (loadedUser) setCurrentUser(loadedUser);
        if (loadedIsAdmin) setIsAdmin(loadedIsAdmin);
        if (loadedCart.length > 0) setCart(loadedCart);
        if (loadedWishlist.length > 0) setWishlist(loadedWishlist);

        // Load data from MongoDB
        console.log('🔄 Loading data from MongoDB...');
        const [usersRes, productsRes, ordersRes, carouselRes, vouchersRes, promoCardsRes, 
               paymentsRes, refundsRes, notificationsRes, reviewsRes, conversationsRes, settingsRes] = await Promise.all([
          usersApi.getAll().catch((err) => { console.error('❌ Error loading users:', err); return { success: false, data: [] }; }),
          productsApi.getAll().catch((err) => { console.error('❌ Error loading products:', err); return { success: false, data: [] }; }),
          ordersApi.getAll().catch((err) => { console.error('❌ Error loading orders:', err); return { success: false, data: [] }; }),
          carouselApi.getAll().catch((err) => { console.error('❌ Error loading carousel:', err); return { success: false, data: [] }; }),
          vouchersApi.getAll().catch((err) => { console.error('❌ Error loading vouchers:', err); return { success: false, data: [] }; }),
          promoCardsApi.getAll().catch((err) => { console.error('❌ Error loading promo cards:', err); return { success: false, data: [] }; }),
          paymentVerificationsApi.getAll().catch((err) => { console.error('❌ Error loading payments:', err); return { success: false, data: [] }; }),
          refundsApi.getAll().catch((err) => { console.error('❌ Error loading refunds:', err); return { success: false, data: [] }; }),
          notificationsApi.getAll().catch((err) => { console.error('❌ Error loading notifications:', err); return { success: false, data: [] }; }),
          reviewsApi.getAll().catch((err) => { console.error('❌ Error loading reviews:', err); return { success: false, data: [] }; }),
          conversationsApi.getAll().catch((err) => { console.error('❌ Error loading conversations:', err); return { success: false, data: [] }; }),
          deliverySettingsApi.get().catch((err) => { console.error('❌ Error loading settings:', err); return { success: false, data: { dhakaCharge: 60, outsideDhakaCharge: 110, freeShippingThreshold: 5000 } }; }),
        ]);

        // Log loaded data counts
        console.log('📊 Data loaded:', {
          users: usersRes.success ? usersRes.data?.length : 0,
          products: productsRes.success ? productsRes.data?.length : 0,
          orders: ordersRes.success ? ordersRes.data?.length : 0,
          carousel: carouselRes.success ? carouselRes.data?.length : 0,
          vouchers: vouchersRes.success ? vouchersRes.data?.length : 0,
          promoCards: promoCardsRes.success ? promoCardsRes.data?.length : 0,
          payments: paymentsRes.success ? paymentsRes.data?.length : 0,
          refunds: refundsRes.success ? refundsRes.data?.length : 0,
          notifications: notificationsRes.success ? notificationsRes.data?.length : 0,
          reviews: reviewsRes.success ? reviewsRes.data?.length : 0,
          conversations: conversationsRes.success ? conversationsRes.data?.length : 0,
        });

        // Load wishlist from MongoDB if user is logged in
        if (loadedUser) {
          try {
            const wishlistRes = await wishlistApi.get(loadedUser.id);
            if (wishlistRes.success && wishlistRes.data && wishlistRes.data.products) {
              const wishlistProducts = wishlistRes.data.products.map((item: any) => item.product || item);
              setWishlist(wishlistProducts);
            }
          } catch (error) {
            console.error('Error loading wishlist:', error);
          }
        }

        if (usersRes.success && usersRes.data) {
          setUsers(usersRes.data);
          console.log(`✅ Loaded ${usersRes.data.length} users`);
          // Update current user if it exists in MongoDB
          if (loadedUser) {
            const updatedUser = usersRes.data.find((u: User) => u.id === loadedUser.id);
            if (updatedUser) {
              setCurrentUser(updatedUser);
            }
          }
        } else {
          console.warn('⚠️ Failed to load users');
        }
        if (productsRes.success && productsRes.data && Array.isArray(productsRes.data)) {
          setProducts(productsRes.data);
          console.log(`✅ Loaded ${productsRes.data.length} products from MongoDB`);
        } else {
          console.warn('⚠️ Failed to load products from MongoDB:', productsRes.error || 'Unknown error');
          setProducts([]); // Ensure it's empty, not mock data
        }
        if (ordersRes.success && ordersRes.data) {
          setOrders(ordersRes.data);
          console.log(`✅ Loaded ${ordersRes.data.length} orders`);
        } else {
          console.warn('⚠️ Failed to load orders');
        }
        if (carouselRes.success && carouselRes.data && Array.isArray(carouselRes.data)) {
          setCarouselSlides(carouselRes.data);
          console.log(`✅ Loaded ${carouselRes.data.length} carousel slides from MongoDB`);
        } else {
          console.warn('⚠️ Failed to load carousel slides from MongoDB:', carouselRes.error || 'Unknown error');
          setCarouselSlides([]); // Ensure it's empty, not mock data
        }
        if (vouchersRes.success && vouchersRes.data && Array.isArray(vouchersRes.data)) {
          setVouchers(vouchersRes.data);
          console.log(`✅ Loaded ${vouchersRes.data.length} vouchers from MongoDB`);
        } else {
          console.warn('⚠️ Failed to load vouchers from MongoDB:', vouchersRes.error || 'Unknown error');
          setVouchers([]); // Ensure it's empty
        }
        if (promoCardsRes.success && promoCardsRes.data && Array.isArray(promoCardsRes.data)) {
          setPromoCards(promoCardsRes.data);
          console.log(`✅ Loaded ${promoCardsRes.data.length} promo cards from MongoDB`);
        } else {
          console.warn('⚠️ Failed to load promo cards from MongoDB:', promoCardsRes.error || 'Unknown error');
          setPromoCards([]); // Ensure it's empty
        }
        if (paymentsRes.success && paymentsRes.data) {
          setPaymentVerifications(paymentsRes.data);
          console.log(`✅ Loaded ${paymentsRes.data.length} payment verifications`);
        } else {
          console.warn('⚠️ Failed to load payment verifications');
        }
        if (refundsRes.success && refundsRes.data) {
          setRefundRequests(refundsRes.data);
          console.log(`✅ Loaded ${refundsRes.data.length} refund requests`);
        } else {
          console.warn('⚠️ Failed to load refund requests');
        }
        if (notificationsRes.success && notificationsRes.data) {
          setNotifications(notificationsRes.data);
          console.log(`✅ Loaded ${notificationsRes.data.length} notifications`);
        } else {
          console.warn('⚠️ Failed to load notifications');
        }
        if (reviewsRes.success && reviewsRes.data) {
          setReviews(reviewsRes.data);
          console.log(`✅ Loaded ${reviewsRes.data.length} reviews`);
        } else {
          console.warn('⚠️ Failed to load reviews');
        }
        if (conversationsRes.success && conversationsRes.data) {
          setConversations(conversationsRes.data);
          console.log(`✅ Loaded ${conversationsRes.data.length} conversations`);
        } else {
          console.warn('⚠️ Failed to load conversations');
        }
        if (settingsRes.success && settingsRes.data) {
          const { id, ...settings } = settingsRes.data;
          setDeliverySettings(settings);
          console.log('✅ Loaded delivery settings');
        } else {
          console.warn('⚠️ Failed to load delivery settings');
        }


        setIsInitialized(true);
      } catch (error) {
        console.error('Error loading data from MongoDB:', error);
        setIsInitialized(true); // Still initialize to allow app to work
      }
    };

    loadData();
  }, []); // Run only once on mount

  // Sync user session to localStorage (temporary data)
  useEffect(() => {
    if (!isInitialized) return;
    saveToLocalStorage("auraz_currentUser", currentUser);
  }, [currentUser, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToLocalStorage("auraz_isAdmin", isAdmin);
  }, [isAdmin, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToLocalStorage("auraz_cart", cart);
  }, [cart, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToLocalStorage("auraz_wishlist", wishlist);
  }, [wishlist, isInitialized]);

  // Listen for storage changes from OTHER tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key) return;

      try {
        if (
          e.key === "auraz_paymentVerifications" &&
          e.newValue
        ) {
          setPaymentVerifications(JSON.parse(e.newValue));
        } else if (e.key === "auraz_orders" && e.newValue) {
          setOrders(JSON.parse(e.newValue));
        } else if (e.key === "auraz_users" && e.newValue) {
          setUsers(JSON.parse(e.newValue));
        } else if (e.key === "auraz_products" && e.newValue) {
          setProducts(JSON.parse(e.newValue));
        } else if (
          e.key === "auraz_carouselSlides" &&
          e.newValue
        ) {
          setCarouselSlides(JSON.parse(e.newValue));
        } else if (e.key === "auraz_vouchers" && e.newValue) {
          setVouchers(JSON.parse(e.newValue));
        } else if (e.key === "auraz_promoCards" && e.newValue) {
          setPromoCards(JSON.parse(e.newValue));
        } else if (
          e.key === "auraz_notifications" &&
          e.newValue
        ) {
          setNotifications(JSON.parse(e.newValue));
        } else if (
          e.key === "auraz_conversations" &&
          e.newValue
        ) {
          setConversations(JSON.parse(e.newValue));
        }
      } catch (error) {
        console.error("Error parsing storage event:", error);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () =>
      window.removeEventListener(
        "storage",
        handleStorageChange,
      );
  }, []);

  // Auth Functions
  const login = async (
    email: string,
    password: string,
  ): Promise<boolean> => {
    // Admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setCurrentUser({
        id: "admin",
        name: "Admin",
        email: ADMIN_EMAIL,
        phone: "",
        password: ADMIN_PASSWORD,
        status: "approved",
        createdAt: "2025-01-01",
        addresses: [],
        paymentMethods: [],
        usedVouchers: [],
      });
      toast.success("Welcome Admin!");
      return true;
    }

    // User login
    const user = users.find((u) => u.email === email);
    if (user) {
      if (user.password !== password) {
        toast.error("Invalid password");
        return false;
      }
      if (user.status === "pending") {
        toast.error("Your account is pending approval");
        return false;
      }
      if (user.status === "rejected") {
        toast.error("Your account has been rejected");
        return false;
      }
      setCurrentUser(user);
      setIsAdmin(false);
      toast.success(`Welcome back, ${user.name}!`);
      return true;
    }

    toast.error("Invalid email or password");
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    toast.success("Logged out successfully");
  };

  const register = async (
    userData: Omit<
      User,
      | "id"
      | "status"
      | "createdAt"
      | "addresses"
      | "paymentMethods"
      | "usedVouchers"
    >,
  ) => {
    const existingUser = users.find(
      (u) => u.email === userData.email,
    );
    if (existingUser) {
      toast.error("Email already registered");
      return;
    }

    const newUser: User = {
      ...userData,
      id:
        Date.now().toString() +
        "-" +
        Math.random().toString(36).substr(2, 9),
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
      addresses: [],
      paymentMethods: [],
      usedVouchers: [],
    };
    
    try {
      await usersApi.create(newUser);
      setUsers((prev) => [...prev, newUser]);
      toast.success(
        "Registration submitted! Please wait for admin approval.",
      );
    } catch (error) {
      console.error('Error registering user:', error);
      toast.error("Registration failed. Please try again.");
    }
  };

  const updateUserProfile = async (
    userId: string,
    updates: Partial<User>,
  ) => {
    try {
      await usersApi.update(userId, updates);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, ...updates } : user,
        ),
      );
      if (currentUser && currentUser.id === userId) {
        setCurrentUser((prev) =>
          prev ? { ...prev, ...updates } : null,
        );
      }
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error('Error updating user profile:', error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  // Address Management
  const addAddress = async (
    userId: string,
    addressData: Omit<Address, "id">,
  ) => {
    const newAddress: Address = {
      ...addressData,
      id:
        Date.now().toString() +
        "-" +
        Math.random().toString(36).substr(2, 9),
    };
    try {
      const user = users.find(u => u.id === userId);
      if (user) {
        const updatedUser = {
          ...user,
          addresses: [...user.addresses, newAddress],
        };
        await usersApi.update(userId, { addresses: updatedUser.addresses });
        setUsers((prev) =>
          prev.map((u) => u.id === userId ? updatedUser : u),
        );
        if (currentUser && currentUser.id === userId) {
          setCurrentUser(updatedUser);
        }
        toast.success("Address added successfully");
      }
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error("Failed to add address. Please try again.");
    }
  };

  const updateAddress = async (
    userId: string,
    addressId: string,
    updates: Partial<Address>,
  ) => {
    try {
      const user = users.find(u => u.id === userId);
      if (user) {
        const updatedAddresses = user.addresses.map((addr) =>
          addr.id === addressId ? { ...addr, ...updates } : addr,
        );
        const updatedUser = {
          ...user,
          addresses: updatedAddresses,
        };
        await usersApi.update(userId, { addresses: updatedAddresses });
        setUsers((prev) =>
          prev.map((u) => u.id === userId ? updatedUser : u),
        );
        if (currentUser && currentUser.id === userId) {
          setCurrentUser(updatedUser);
        }
        toast.success("Address updated successfully");
      }
    } catch (error) {
      console.error('Error updating address:', error);
      toast.error("Failed to update address. Please try again.");
    }
  };

  const deleteAddress = async (userId: string, addressId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (user) {
        const updatedAddresses = user.addresses.filter(
          (addr) => addr.id !== addressId,
        );
        const updatedUser = {
          ...user,
          addresses: updatedAddresses,
        };
        await usersApi.update(userId, { addresses: updatedAddresses });
        setUsers((prev) =>
          prev.map((u) => u.id === userId ? updatedUser : u),
        );
        if (currentUser && currentUser.id === userId) {
          setCurrentUser(updatedUser);
        }
        toast.success("Address deleted successfully");
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error("Failed to delete address. Please try again.");
    }
  };

  // Payment Method Management
  const addPaymentMethod = async (
    userId: string,
    methodData: Omit<PaymentMethod, "id">,
  ) => {
    const newMethod: PaymentMethod = {
      ...methodData,
      id:
        Date.now().toString() +
        "-" +
        Math.random().toString(36).substr(2, 9),
    };
    try {
      const user = users.find(u => u.id === userId);
      if (user) {
        const updatedPaymentMethods = [...user.paymentMethods, newMethod];
        const updatedUser = {
          ...user,
          paymentMethods: updatedPaymentMethods,
        };
        await usersApi.update(userId, { paymentMethods: updatedPaymentMethods });
        setUsers((prev) =>
          prev.map((u) => u.id === userId ? updatedUser : u),
        );
        if (currentUser && currentUser.id === userId) {
          setCurrentUser(updatedUser);
        }
        toast.success("Payment method added successfully");
      }
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast.error("Failed to add payment method. Please try again.");
    }
  };

  const updatePaymentMethod = async (
    userId: string,
    methodId: string,
    updates: Partial<PaymentMethod>,
  ) => {
    try {
      const user = users.find(u => u.id === userId);
      if (user) {
        const updatedPaymentMethods = user.paymentMethods.map(
          (method) =>
            method.id === methodId ? { ...method, ...updates } : method,
        );
        const updatedUser = {
          ...user,
          paymentMethods: updatedPaymentMethods,
        };
        await usersApi.update(userId, { paymentMethods: updatedPaymentMethods });
        setUsers((prev) =>
          prev.map((u) => u.id === userId ? updatedUser : u),
        );
        if (currentUser && currentUser.id === userId) {
          setCurrentUser(updatedUser);
        }
        toast.success("Payment method updated successfully");
      }
    } catch (error) {
      console.error('Error updating payment method:', error);
      toast.error("Failed to update payment method. Please try again.");
    }
  };

  const deletePaymentMethod = async (
    userId: string,
    methodId: string,
  ) => {
    try {
      const user = users.find(u => u.id === userId);
      if (user) {
        const updatedPaymentMethods = user.paymentMethods.filter(
          (method) => method.id !== methodId,
        );
        const updatedUser = {
          ...user,
          paymentMethods: updatedPaymentMethods,
        };
        await usersApi.update(userId, { paymentMethods: updatedPaymentMethods });
        setUsers((prev) =>
          prev.map((u) => u.id === userId ? updatedUser : u),
        );
        if (currentUser && currentUser.id === userId) {
          setCurrentUser(updatedUser);
        }
        toast.success("Payment method deleted successfully");
      }
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast.error("Failed to delete payment method. Please try again.");
    }
  };

  // Cart Functions
  const addToCart = (
    product: Product,
    quantity: number,
    variant?: Record<string, string>,
  ) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.productId === product.id &&
          JSON.stringify(item.variant) ===
            JSON.stringify(variant),
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        toast.success("Cart updated");
        return newCart;
      } else {
        toast.success("Added to cart");
        return [
          ...prevCart,
          {
            productId: product.id,
            product,
            quantity,
            variant,
          },
        ];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.productId !== productId),
    );
    toast.success("Removed from cart");
  };

  const updateCartQuantity = (
    productId: string,
    quantity: number,
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId
          ? { ...item, quantity }
          : item,
      ),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Functions
  const addToWishlist = async (product: Product) => {
    if (!currentUser) {
      toast.error("Please login to add to wishlist");
      return;
    }
    
    if (wishlist.find((p) => p.id === product.id)) {
      toast.info("Already in wishlist");
      return;
    }
    
    try {
      await wishlistApi.add(currentUser.id, { productId: product.id, product });
      setWishlist((prevWishlist) => [...prevWishlist, product]);
      toast.success("Added to wishlist");
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error("Failed to add to wishlist. Please try again.");
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!currentUser) {
      toast.error("Please login to remove from wishlist");
      return;
    }
    
    try {
      await wishlistApi.remove(currentUser.id, productId);
      setWishlist((prevWishlist) =>
        prevWishlist.filter((p) => p.id !== productId),
      );
      toast.success("Removed from wishlist");
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error("Failed to remove from wishlist. Please try again.");
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  // Admin - User Management
  const approveUser = async (userId: string) => {
    try {
      await usersApi.update(userId, { status: "approved" });
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, status: "approved" as const }
            : user,
        ),
      );
      toast.success("User approved");
    } catch (error) {
      console.error('Error approving user:', error);
      toast.error("Failed to approve user. Please try again.");
    }
  };

  const rejectUser = async (userId: string) => {
    try {
      await usersApi.update(userId, { status: "rejected" });
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, status: "rejected" as const }
            : user,
        ),
      );
      toast.success("User rejected");
    } catch (error) {
      console.error('Error rejecting user:', error);
      toast.error("Failed to reject user. Please try again.");
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await usersApi.delete(userId);
      setUsers((prev) =>
        prev.filter((user) => user.id !== userId),
      );
      toast.success("User deleted");
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error("Failed to delete user. Please try again.");
    }
  };

  // Admin - Product Management
  const addProduct = async (productData: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...productData,
      id:
        Date.now().toString() +
        "-" +
        Math.random().toString(36).substr(2, 9),
    };
    try {
      await productsApi.create(newProduct);
      setProducts((prev) => [...prev, newProduct]);
      toast.success("Product added");
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error("Failed to add product. Please try again.");
    }
  };

  const updateProduct = async (
    productId: string,
    updates: Partial<Product>,
  ) => {
    try {
      await productsApi.update(productId, updates);
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId
            ? { ...product, ...updates }
            : product,
        ),
      );
      toast.success("Product updated");
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error("Failed to update product. Please try again.");
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await productsApi.delete(productId);
      setProducts((prev) =>
        prev.filter((product) => product.id !== productId),
      );
      toast.success("Product deleted");
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error("Failed to delete product. Please try again.");
    }
  };

  // Admin - Order Management
  const placeOrder = async (
    orderData: Omit<Order, "id" | "createdAt">,
  ) => {
    const newOrder: Order = {
      ...orderData,
      id:
        Date.now().toString() +
        "-" +
        Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    try {
      await ordersApi.create(newOrder);
      setOrders((prev) => [...prev, newOrder]);
      clearCart();

      // Send notification to user
      addNotification({
        userId: orderData.userId,
        target: "user",
        title: "Order Placed Successfully",
        message: `Your order #${newOrder.id} has been placed successfully`,
        type: "order",
        link: `/order/${newOrder.id}`,
      });

      // Send notification to admin
      addNotification({
        target: "admin",
        title: "New Order Received",
        message: `New order #${newOrder.id} from ${orderData.user.name} - ৳${orderData.total}`,
        type: "order",
        link: "/admin/orders",
      });

      toast.success("Order placed successfully!");
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  const updateOrderStatus = async (
    orderId: string,
    status: Order["status"],
  ) => {
    try {
      await ordersApi.update(orderId, { status });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status } : order,
        ),
      );

      // Send notification to user
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        addNotification({
          userId: order.userId,
          target: "user",
          title: "Order Status Updated",
          message: `Your order #${orderId} is now ${status}`,
          type: "order",
          link: `/order/${orderId}`,
        });
      }

      toast.success("Order status updated");
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error("Failed to update order status. Please try again.");
    }
  };

  const cancelOrder = async (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) {
      toast.error("Order not found");
      return;
    }

    if (order.paymentMethod === "Cash on Delivery") {
      toast.error(
        "Cash on Delivery orders cannot be cancelled. Please contact support at aurazsupport@gmail.com",
      );
      return;
    }

    if (!["pending", "processing"].includes(order.status)) {
      toast.error(
        "This order cannot be cancelled at this stage",
      );
      return;
    }

    try {
      await ordersApi.update(orderId, { status: "cancelled" });
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, status: "cancelled" as const }
            : o,
        ),
      );
      toast.success("Order cancelled successfully");
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error("Failed to cancel order. Please try again.");
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      await ordersApi.delete(orderId);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      toast.success("Order deleted successfully");
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error("Failed to delete order. Please try again.");
    }
  };

  // Admin - Carousel Management
  const addCarouselSlide = async (
    slideData: Omit<CarouselSlide, "id">,
  ) => {
    const newSlide: CarouselSlide = {
      ...slideData,
      id:
        Date.now().toString() +
        "-" +
        Math.random().toString(36).substr(2, 9),
    };
    try {
      await carouselApi.create(newSlide);
      setCarouselSlides((prev) => [...prev, newSlide]);
      toast.success("Carousel slide added");
    } catch (error) {
      console.error('Error adding carousel slide:', error);
      toast.error("Failed to add carousel slide. Please try again.");
    }
  };

  const updateCarouselSlide = async (
    slideId: string,
    updates: Partial<CarouselSlide>,
  ) => {
    try {
      await carouselApi.update(slideId, updates);
      setCarouselSlides((prev) =>
        prev.map((slide) =>
          slide.id === slideId ? { ...slide, ...updates } : slide,
        ),
      );
      toast.success("Carousel slide updated");
    } catch (error) {
      console.error('Error updating carousel slide:', error);
      toast.error("Failed to update carousel slide. Please try again.");
    }
  };

  const deleteCarouselSlide = async (slideId: string) => {
    try {
      await carouselApi.delete(slideId);
      setCarouselSlides((prev) =>
        prev.filter((slide) => slide.id !== slideId),
      );
      toast.success("Carousel slide deleted");
    } catch (error) {
      console.error('Error deleting carousel slide:', error);
      toast.error("Failed to delete carousel slide. Please try again.");
    }
  };

  // Payment Verification Functions
  const requestPaymentVerification = async (
    orderData: Omit<Order, "id" | "createdAt">,
    amount: number,
    transactionId?: string,
  ): Promise<string> => {
    if (!currentUser) {
      toast.error("Please login to continue");
      return "";
    }

    const verificationId = `pv-${Date.now()}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 180000); // 3 minutes

    const verification: PaymentVerification = {
      id: verificationId,
      userId: currentUser.id,
      user: currentUser,
      orderId: `order-${Date.now()}`,
      amount,
      userPhone: currentUser.phone,
      transactionId,
      status: "pending",
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      orderData,
    };

    try {
      await paymentVerificationsApi.create(verification);
      setPaymentVerifications((prev) => [...prev, verification]);

      // Send notification to admin
      addNotification({
        target: "admin",
        title: "New Payment Verification",
        message: `${currentUser.name} requested payment verification for ৳${amount}`,
        type: "payment",
        link: "/admin/payments",
      });

      toast.info(
        "Payment verification requested. Please wait for admin approval.",
      );

      // Auto-expire after 3 minutes
      setTimeout(async () => {
        try {
          await paymentVerificationsApi.update(verificationId, { status: "expired" });
          setPaymentVerifications((prev) =>
            prev.map((v) =>
              v.id === verificationId && v.status === "pending"
                ? { ...v, status: "expired" as const }
                : v,
            ),
          );
        } catch (error) {
          console.error('Error expiring payment verification:', error);
        }
      }, 180000);

      return verificationId;
    } catch (error) {
      console.error('Error creating payment verification:', error);
      toast.error("Failed to request payment verification. Please try again.");
      return "";
    }
  };

  const approvePaymentVerification = async (
    verificationId: string,
  ) => {
    const verification = paymentVerifications.find(
      (v) => v.id === verificationId,
    );
    if (!verification) return;

    try {
      // Update verification status
      await paymentVerificationsApi.update(verificationId, { status: "approved" });
      setPaymentVerifications((prev) =>
        prev.map((v) =>
          v.id === verificationId
            ? { ...v, status: "approved" as const }
            : v,
        ),
      );

      // Create the order with processing status instead of pending
      const newOrder: Order = {
        ...verification.orderData,
        id: verification.orderId,
        status: "processing", // FIXED: Set to processing instead of pending
        createdAt: new Date().toISOString(),
      };
      await ordersApi.create(newOrder);
      setOrders((prev) => [...prev, newOrder]);

      // Send notification to user
      addNotification({
        userId: verification.userId,
        target: "user",
        title: "Payment Approved",
        message:
          "Your payment has been verified and order is being processed",
        type: "payment",
        link: `/order/${newOrder.id}`,
      });

      toast.success("Payment verified and order placed!");
    } catch (error) {
      console.error('Error approving payment verification:', error);
      toast.error("Failed to approve payment. Please try again.");
    }
  };

  const rejectPaymentVerification = async (
    verificationId: string,
  ) => {
    try {
      await paymentVerificationsApi.update(verificationId, { status: "rejected" });
      setPaymentVerifications((prev) =>
        prev.map((v) =>
          v.id === verificationId
            ? { ...v, status: "rejected" as const }
            : v,
        ),
      );

      const verification = paymentVerifications.find(
        (v) => v.id === verificationId,
      );
      if (verification) {
        addNotification({
          userId: verification.userId,
          target: "user",
          title: "Payment Verification Failed",
          message:
            "Your payment verification was rejected. Please try again or contact support.",
          type: "payment",
        });
      }

      toast.error("Payment verification rejected");
    } catch (error) {
      console.error('Error rejecting payment verification:', error);
      toast.error("Failed to reject payment. Please try again.");
    }
  };

  const getPaymentVerification = (verificationId: string) => {
    return paymentVerifications.find(
      (v) => v.id === verificationId,
    );
  };

  const deletePaymentVerification = (verificationId: string) => {
    setPaymentVerifications((prev) =>
      prev.filter((v) => v.id !== verificationId),
    );
    toast.success("Payment verification deleted");
  };

  // Voucher Management
  const addVoucher = async (
    voucherData: Omit<Voucher, "id" | "usedCount">,
  ) => {
    const newVoucher: Voucher = {
      ...voucherData,
      id:
        Date.now().toString() +
        "-" +
        Math.random().toString(36).substr(2, 9),
      usedCount: 0,
    };
    try {
      await vouchersApi.create(newVoucher);
      setVouchers((prev) => [...prev, newVoucher]);
      toast.success("Voucher created successfully");
    } catch (error) {
      console.error('Error adding voucher:', error);
      toast.error("Failed to create voucher. Please try again.");
    }
  };

  const updateVoucher = async (
    voucherId: string,
    updates: Partial<Voucher>,
  ) => {
    try {
      await vouchersApi.update(voucherId, updates);
      setVouchers((prev) =>
        prev.map((v) =>
          v.id === voucherId ? { ...v, ...updates } : v,
        ),
      );
      toast.success("Voucher updated successfully");
    } catch (error) {
      console.error('Error updating voucher:', error);
      toast.error("Failed to update voucher. Please try again.");
    }
  };

  const deleteVoucher = async (voucherId: string) => {
    try {
      await vouchersApi.delete(voucherId);
      setVouchers((prev) =>
        prev.filter((v) => v.id !== voucherId),
      );
      toast.success("Voucher deleted successfully");
    } catch (error) {
      console.error('Error deleting voucher:', error);
      toast.error("Failed to delete voucher. Please try again.");
    }
  };

  const validateVoucher = (
    code: string,
    orderTotal: number,
    userId?: string,
  ): { valid: boolean; message: string; voucher?: Voucher } => {
    const voucher = vouchers.find(
      (v) => v.code.toUpperCase() === code.toUpperCase(),
    );

    if (!voucher) {
      return { valid: false, message: "Invalid voucher code" };
    }

    if (!voucher.isActive) {
      return {
        valid: false,
        message: "This voucher is no longer active",
      };
    }

    const now = new Date();
    const validFrom = new Date(voucher.validFrom);
    const validUntil = new Date(voucher.validUntil);

    if (now < validFrom) {
      return {
        valid: false,
        message: "This voucher is not yet valid",
      };
    }

    if (now > validUntil) {
      return {
        valid: false,
        message: "This voucher has expired",
      };
    }

    if (voucher.usedCount >= voucher.usageLimit) {
      return {
        valid: false,
        message: "This voucher has reached its usage limit",
      };
    }

    if (orderTotal < voucher.minOrderAmount) {
      return {
        valid: false,
        message: `Minimum order amount is ৳${voucher.minOrderAmount}`,
      };
    }

    // Check if user already used this voucher
    if (userId) {
      const user = users.find((u) => u.id === userId);
      if (user && user.usedVouchers.includes(voucher.id)) {
        return {
          valid: false,
          message: "You have already used this voucher",
        };
      }
    }

    return {
      valid: true,
      message: "Voucher is valid",
      voucher,
    };
  };

  const applyVoucher = (code: string, userId: string) => {
    const voucher = vouchers.find(
      (v) => v.code.toUpperCase() === code.toUpperCase(),
    );
    if (!voucher) return;

    // Increment used count
    setVouchers((prev) =>
      prev.map((v) =>
        v.id === voucher.id
          ? { ...v, usedCount: v.usedCount + 1 }
          : v,
      ),
    );

    // Add to user's used vouchers
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              usedVouchers: [...u.usedVouchers, voucher.id],
            }
          : u,
      ),
    );

    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              usedVouchers: [...prev.usedVouchers, voucher.id],
            }
          : null,
      );
    }
  };

  // Promo Card Management
  const addPromoCard = async (cardData: Omit<PromoCard, "id">) => {
    const newCard: PromoCard = {
      ...cardData,
      id:
        Date.now().toString() +
        "-" +
        Math.random().toString(36).substr(2, 9),
    };
    try {
      await promoCardsApi.create(newCard);
      setPromoCards((prev) => [...prev, newCard]);
      toast.success("Promo card added successfully");
    } catch (error) {
      console.error('Error adding promo card:', error);
      toast.error("Failed to add promo card. Please try again.");
    }
  };

  const updatePromoCard = async (
    cardId: string,
    updates: Partial<PromoCard>,
  ) => {
    try {
      await promoCardsApi.update(cardId, updates);
      setPromoCards((prev) =>
        prev.map((c) =>
          c.id === cardId ? { ...c, ...updates } : c,
        ),
      );
      toast.success("Promo card updated successfully");
    } catch (error) {
      console.error('Error updating promo card:', error);
      toast.error("Failed to update promo card. Please try again.");
    }
  };

  const deletePromoCard = async (cardId: string) => {
    try {
      await promoCardsApi.delete(cardId);
      setPromoCards((prev) =>
        prev.filter((c) => c.id !== cardId),
      );
      toast.success("Promo card deleted successfully");
    } catch (error) {
      console.error('Error deleting promo card:', error);
      toast.error("Failed to delete promo card. Please try again.");
    }
  };

  // Refund Management
  const createRefundRequest = async (
    orderId: string,
    reason: string,
  ) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || !currentUser) return;

    const newRefund: RefundRequest = {
      id:
        Date.now().toString() +
        "-" +
        Math.random().toString(36).substr(2, 9),
      orderId,
      userId: currentUser.id,
      user: currentUser,
      order,
      reason,
      amount: order.total,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    try {
      const result = await refundsApi.create(newRefund);
      if (result.success && result.data) {
        // Reload refunds from MongoDB to ensure sync
        const refundsRes = await refundsApi.getAll();
        if (refundsRes.success && refundsRes.data) {
          setRefundRequests(refundsRes.data);
        } else {
          // Fallback to local update if API fails
          setRefundRequests((prev) => [...prev, result.data || newRefund]);
        }
      } else {
        setRefundRequests((prev) => [...prev, newRefund]);
      }

      // Notify admin
      addNotification({
        target: "admin",
        title: "New Refund Request",
        message: `${currentUser.name} requested a refund for order #${orderId}`,
        type: "order",
        link: "/admin/refunds",
      });

      toast.success("Refund request submitted successfully");
    } catch (error) {
      console.error('Error creating refund request:', error);
      toast.error("Failed to submit refund request. Please try again.");
    }
  };

  const approveRefund = async (refundId: string, notes?: string) => {
    try {
      await refundsApi.update(refundId, {
        status: "approved",
        processedAt: new Date().toISOString(),
        adminNotes: notes,
      });
      
      // Reload refunds from MongoDB to ensure sync
      const refundsRes = await refundsApi.getAll();
      if (refundsRes.success && refundsRes.data) {
        setRefundRequests(refundsRes.data);
      } else {
        // Fallback to local update if API fails
        setRefundRequests((prev) =>
          prev.map((r) =>
            r.id === refundId
              ? {
                  ...r,
                  status: "approved" as const,
                  processedAt: new Date().toISOString(),
                  adminNotes: notes,
                }
              : r,
          ),
        );
      }

      const refund = refundRequests.find(
        (r) => r.id === refundId,
      );
      if (refund) {
        addNotification({
          userId: refund.userId,
          target: "user",
          title: "Refund Approved",
          message: `Your refund request for order #${refund.orderId} has been approved`,
          type: "order",
        });
      }

      toast.success("Refund approved successfully");
    } catch (error) {
      console.error('Error approving refund:', error);
      toast.error("Failed to approve refund. Please try again.");
    }
  };

  const rejectRefund = async (refundId: string, notes?: string) => {
    try {
      await refundsApi.update(refundId, {
        status: "rejected",
        processedAt: new Date().toISOString(),
        adminNotes: notes,
      });
      
      // Reload refunds from MongoDB to ensure sync
      const refundsRes = await refundsApi.getAll();
      if (refundsRes.success && refundsRes.data) {
        setRefundRequests(refundsRes.data);
      } else {
        // Fallback to local update if API fails
        setRefundRequests((prev) =>
          prev.map((r) =>
            r.id === refundId
              ? {
                  ...r,
                  status: "rejected" as const,
                  processedAt: new Date().toISOString(),
                  adminNotes: notes,
                }
              : r,
          ),
        );
      }

      const refund = refundRequests.find(
        (r) => r.id === refundId,
      );
      if (refund) {
        addNotification({
          userId: refund.userId,
          target: "user",
          title: "Refund Request Rejected",
          message: `Your refund request for order #${refund.orderId} has been rejected. ${notes || ""}`,
          type: "order",
        });
      }

      toast.info("Refund rejected");
    } catch (error) {
      console.error('Error rejecting refund:', error);
      toast.error("Failed to reject refund. Please try again.");
    }
  };

  // Notification Management
  const addNotification = (
    notificationData: Omit<
      Notification,
      "id" | "createdAt" | "isRead"
    >,
  ) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, isRead: true } : n,
      ),
    );
  };

  const getUserNotifications = (userId: string) => {
    // User gets: their specific notifications OR notifications targeted to users/all
    return notifications.filter(
      (n) =>
        n.userId === userId ||
        (!n.userId &&
          (n.target === "user" || n.target === "all")),
    );
  };

  const getAdminNotifications = () => {
    // Admin gets: admin-targeted notifications OR all-targeted notifications
    return notifications.filter(
      (n) => n.target === "admin" || n.target === "all",
    );
  };

  // Delivery Settings
  const updateDeliverySettings = async (
    settings: Partial<DeliverySettings>,
  ) => {
    try {
      await deliverySettingsApi.update(settings);
      setDeliverySettings((prev) => ({ ...prev, ...settings }));
      toast.success("Delivery settings updated");
    } catch (error) {
      console.error('Error updating delivery settings:', error);
      toast.error("Failed to update delivery settings. Please try again.");
    }
  };

  const calculateDeliveryCharge = (
    city: string,
    orderTotal: number,
  ): number => {
    // Always charge delivery fees - no free shipping
    const isDhaka = (city || "")
      .toLowerCase()
      .includes("dhaka");
    return isDhaka
      ? deliverySettings.dhakaCharge
      : deliverySettings.outsideDhakaCharge;
  };

  // Review Management
  const addReview = async (
    reviewData: Omit<ProductReview, "id" | "createdAt">,
  ) => {
    const newReview: ProductReview = {
      ...reviewData,
      id:
        Date.now().toString() +
        "-" +
        Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    try {
      await reviewsApi.create(newReview);
      setReviews((prev) => [newReview, ...prev]);
      toast.success("Review added successfully!");
    } catch (error) {
      console.error('Error adding review:', error);
      toast.error("Failed to add review. Please try again.");
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      await reviewsApi.delete(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      toast.success("Review deleted successfully");
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error("Failed to delete review. Please try again.");
    }
  };

  const getProductReviews = (
    productId: string,
  ): ProductReview[] => {
    return reviews.filter((r) => r.productId === productId);
  };

  const canUserReview = (
    userId: string,
    productId: string,
  ): boolean => {
    // Check if user has already reviewed this product
    const hasReviewed = reviews.some(
      (r) => r.userId === userId && r.productId === productId,
    );
    if (hasReviewed) return false;

    // Check if user has a delivered order containing this product
    const hasDeliveredOrder = orders.some(
      (order) =>
        order.userId === userId &&
        order.status === "delivered" &&
        order.items.some(
          (item) => item.product.id === productId,
        ),
    );

    return hasDeliveredOrder;
  };

  // AI Assistant & Messaging
  const createConversation = (
    visitorName?: string,
    visitorEmail?: string,
  ): string => {
    const newConversation: Conversation = {
      id:
        Date.now().toString() +
        "-" +
        Math.random().toString(36).substr(2, 9),
      userId: currentUser?.id,
      visitorName,
      visitorEmail,
      messages: [],
      status: "active",
      transferredToAdmin: false,
      createdAt: new Date().toISOString(),
      lastMessageAt: new Date().toISOString(),
      adminReplied: false,
    };
    setConversations((prev) => [newConversation, ...prev]);
    return newConversation.id;
  };

  const addMessageToConversation = async (
    conversationId: string,
    sender: "user" | "ai" | "admin",
    message: string,
  ) => {
    const newMessage: ChatMessage = {
      id:
        Date.now().toString() +
        "-" +
        Math.random().toString(36).substr(2, 9),
      conversationId,
      sender,
      message,
      createdAt: new Date().toISOString(),
    };

    try {
      const conversation = conversations.find(c => c.id === conversationId);
      if (conversation) {
        const updatedMessages = [...conversation.messages, newMessage];
        await conversationsApi.update(conversationId, {
          messages: updatedMessages,
          lastMessageAt: new Date().toISOString(),
          adminReplied: sender === "admin" ? true : conversation.adminReplied,
        });
      }

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessageAt: new Date().toISOString(),
              adminReplied:
                sender === "admin" ? true : conv.adminReplied,
            };
          }
          return conv;
        }),
      );
    } catch (error) {
      console.error('Error adding message to conversation:', error);
      // Still update state even if API fails
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessageAt: new Date().toISOString(),
              adminReplied:
                sender === "admin" ? true : conv.adminReplied,
            };
          }
          return conv;
        }),
      );
    }

    // If user transfers to admin, send notification to admin
    if (
      sender === "user" &&
      conversations.find((c) => c.id === conversationId)
        ?.transferredToAdmin
    ) {
      addNotification({
        target: "admin",
        title: "New Message from Customer",
        message:
          message.substring(0, 50) +
          (message.length > 50 ? "..." : ""),
        type: "system",
        link: "/admin/messages",
      });
    }
  };

  const transferConversationToAdmin = async (
    conversationId: string,
  ) => {
    try {
      await conversationsApi.update(conversationId, {
        transferredToAdmin: true,
        status: "transferred",
      });
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                transferredToAdmin: true,
                status: "transferred" as const,
              }
            : conv,
        ),
      );

      // Send notification to admin
      addNotification({
        target: "admin",
        title: "New Customer Service Request",
        message: "A customer wants to speak with support",
        type: "system",
        link: "/admin/messages",
      });
    } catch (error) {
      console.error('Error transferring conversation to admin:', error);
      toast.error("Failed to transfer conversation. Please try again.");
    }
  };

  const closeConversation = async (conversationId: string) => {
    try {
      await conversationsApi.update(conversationId, { status: "closed" });
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? { ...conv, status: "closed" as const }
            : conv,
        ),
      );
    } catch (error) {
      console.error('Error closing conversation:', error);
      // Still update state even if API fails
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? { ...conv, status: "closed" as const }
            : conv,
        ),
      );
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      await conversationsApi.delete(conversationId);
      setConversations((prev) =>
        prev.filter((conv) => conv.id !== conversationId),
      );
      toast.success("Conversation deleted successfully");
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast.error("Failed to delete conversation. Please try again.");
    }
  };

  const getConversation = (
    conversationId: string,
  ): Conversation | undefined => {
    return conversations.find((c) => c.id === conversationId);
  };

  const getActiveConversations = (): Conversation[] => {
    return conversations.filter(
      (c) => c.transferredToAdmin && c.status !== "closed",
    );
  };

  const getAdminNotificationCount = (): number => {
    // Admin counts: unread system notifications + pending conversations
    const unreadNotifications = notifications.filter(
      (n) => !n.isRead && !n.userId,
    ).length;
    const pendingConversations = conversations.filter(
      (c) => c.transferredToAdmin && !c.adminReplied,
    ).length;
    return unreadNotifications + pendingConversations;
  };

  const getUserUnreadNotificationCount = (
    userId: string,
  ): number => {
    // User counts: unread notifications for them specifically OR broadcast to all
    return notifications.filter(
      (n) => !n.isRead && (n.userId === userId || !n.userId),
    ).length;
  };

  // Data Management Functions
  const resetAllData = async () => {
    // Reset to empty and reload from MongoDB
    setProducts([]);
    setCarouselSlides([]);
    setVouchers([]);
    setPromoCards([]);
    setUsers([]);
    setOrders([]);
    setPaymentVerifications([]);
    setRefundRequests([]);
    setNotifications([]);
    setReviews([]);
    setConversations([]);
    setDeliverySettings({
      dhakaCharge: 60,
      outsideDhakaCharge: 110,
      freeShippingThreshold: 5000,
    });

    // Reload all data from MongoDB
    try {
      console.log('🔄 Reloading all data from MongoDB...');
      const [usersRes, productsRes, ordersRes, carouselRes, vouchersRes, promoCardsRes, 
             paymentsRes, refundsRes, notificationsRes, reviewsRes, conversationsRes, settingsRes] = await Promise.all([
        usersApi.getAll().catch(() => ({ success: false, data: [] })),
        productsApi.getAll().catch(() => ({ success: false, data: [] })),
        ordersApi.getAll().catch(() => ({ success: false, data: [] })),
        carouselApi.getAll().catch(() => ({ success: false, data: [] })),
        vouchersApi.getAll().catch(() => ({ success: false, data: [] })),
        promoCardsApi.getAll().catch(() => ({ success: false, data: [] })),
        paymentVerificationsApi.getAll().catch(() => ({ success: false, data: [] })),
        refundsApi.getAll().catch(() => ({ success: false, data: [] })),
        notificationsApi.getAll().catch(() => ({ success: false, data: [] })),
        reviewsApi.getAll().catch(() => ({ success: false, data: [] })),
        conversationsApi.getAll().catch(() => ({ success: false, data: [] })),
        deliverySettingsApi.get().catch(() => ({ success: false, data: { dhakaCharge: 60, outsideDhakaCharge: 110, freeShippingThreshold: 5000 } })),
      ]);

      if (usersRes.success && usersRes.data) setUsers(usersRes.data);
      if (productsRes.success && productsRes.data) setProducts(productsRes.data);
      if (ordersRes.success && ordersRes.data) setOrders(ordersRes.data);
      if (carouselRes.success && carouselRes.data) setCarouselSlides(carouselRes.data);
      if (vouchersRes.success && vouchersRes.data) setVouchers(vouchersRes.data);
      if (promoCardsRes.success && promoCardsRes.data) setPromoCards(promoCardsRes.data);
      if (paymentsRes.success && paymentsRes.data) setPaymentVerifications(paymentsRes.data);
      if (refundsRes.success && refundsRes.data) setRefundRequests(refundsRes.data);
      if (notificationsRes.success && notificationsRes.data) setNotifications(notificationsRes.data);
      if (reviewsRes.success && reviewsRes.data) setReviews(reviewsRes.data);
      if (conversationsRes.success && conversationsRes.data) setConversations(conversationsRes.data);
      if (settingsRes.success && settingsRes.data) {
        const { id, ...settings } = settingsRes.data;
        setDeliverySettings(settings);
      }
      console.log('✅ All data reloaded from MongoDB');
    } catch (error) {
      console.error('❌ Error reloading data:', error);
    }

    // All data now loads from MongoDB - no mock data
  };

  const clearLocalStorage = () => {
    if (typeof window === "undefined") return;

    // Only clear cart and wishlist from localStorage
    // Keep user session data (currentUser, isAdmin)
    const keys = [
      "auraz_cart",
      "auraz_wishlist",
    ];

    keys.forEach((key) => {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.error(`Error removing localStorage key "${key}":`, error);
      }
    });

    setCart([]);
    setWishlist([]);

    toast.success("Cart and wishlist cleared!");
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAdmin,
        login,
        logout,
        register,
        updateUserProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        addPaymentMethod,
        updatePaymentMethod,
        deletePaymentMethod,
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        users,
        approveUser,
        rejectUser,
        deleteUser,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        orders,
        updateOrderStatus,
        placeOrder,
        cancelOrder,
        deleteOrder,
        carouselSlides,
        addCarouselSlide,
        updateCarouselSlide,
        deleteCarouselSlide,
        paymentVerifications,
        requestPaymentVerification,
        approvePaymentVerification,
        rejectPaymentVerification,
        getPaymentVerification,
        deletePaymentVerification,
        vouchers,
        addVoucher,
        updateVoucher,
        deleteVoucher,
        validateVoucher,
        applyVoucher,
        promoCards,
        addPromoCard,
        updatePromoCard,
        deletePromoCard,
        refundRequests,
        createRefundRequest,
        approveRefund,
        rejectRefund,
        notifications,
        addNotification,
        markNotificationRead,
        getUserNotifications,
        getAdminNotifications,
        deliverySettings,
        updateDeliverySettings,
        calculateDeliveryCharge,
        reviews,
        addReview,
        deleteReview,
        getProductReviews,
        canUserReview,
        conversations,
        createConversation,
        addMessageToConversation,
        transferConversationToAdmin,
        closeConversation,
        deleteConversation,
        getConversation,
        getActiveConversations,
        getAdminNotificationCount,
        getUserUnreadNotificationCount,
        resetAllData,
        clearLocalStorage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error(
      "useApp must be used within an AppProvider",
    );
  }
  return context;
}