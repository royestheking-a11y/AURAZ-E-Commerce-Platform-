// MongoDB API Client - Replaces localStorage and Supabase calls

// Use proxy in dev mode (via Vite), or direct API in production
const API_BASE = import.meta.env.VITE_API_BASE || (import.meta.env.DEV ? '/api' : '/api');

async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(errorData.error || `API call failed: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error: any) {
    console.error(`❌ API call failed for ${endpoint}:`, error);
    throw error;
  }
}

// Users API
export const usersApi = {
  getAll: async () => apiCall('/users'),
  getById: async (id: string) => apiCall(`/users?id=${id}`),
  getByEmail: async (email: string) => apiCall(`/users?email=${encodeURIComponent(email)}`),
  create: async (user: any) => apiCall('/users', { method: 'POST', body: JSON.stringify(user) }),
  update: async (id: string, updates: any) => apiCall('/users', { method: 'PUT', body: JSON.stringify({ id, ...updates }) }),
  delete: async (id: string) => apiCall(`/users?id=${id}`, { method: 'DELETE' }),
};

// Products API
export const productsApi = {
  getAll: async () => apiCall('/products'),
  getById: async (id: string) => apiCall(`/products?id=${id}`),
  getByCategory: async (category: string) => apiCall(`/products?category=${encodeURIComponent(category)}`),
  create: async (product: any) => apiCall('/products', { method: 'POST', body: JSON.stringify(product) }),
  update: async (id: string, updates: any) => apiCall('/products', { method: 'PUT', body: JSON.stringify({ id, ...updates }) }),
  delete: async (id: string) => apiCall(`/products?id=${id}`, { method: 'DELETE' }),
};

// Orders API
export const ordersApi = {
  getAll: async () => apiCall('/orders'),
  getById: async (id: string) => apiCall(`/orders?id=${id}`),
  getByUserId: async (userId: string) => apiCall(`/orders?userId=${userId}`),
  create: async (order: any) => apiCall('/orders', { method: 'POST', body: JSON.stringify(order) }),
  update: async (id: string, updates: any) => apiCall('/orders', { method: 'PUT', body: JSON.stringify({ id, ...updates }) }),
  delete: async (id: string) => apiCall(`/orders?id=${id}`, { method: 'DELETE' }),
};

// Carousel API
export const carouselApi = {
  getAll: async () => apiCall('/carousel'),
  getById: async (id: string) => apiCall(`/carousel?id=${id}`),
  create: async (slide: any) => apiCall('/carousel', { method: 'POST', body: JSON.stringify(slide) }),
  update: async (id: string, updates: any) => apiCall('/carousel', { method: 'PUT', body: JSON.stringify({ id, ...updates }) }),
  delete: async (id: string) => apiCall(`/carousel?id=${id}`, { method: 'DELETE' }),
};

// Vouchers API
export const vouchersApi = {
  getAll: async () => apiCall('/vouchers'),
  getById: async (id: string) => apiCall(`/vouchers?id=${id}`),
  getByCode: async (code: string) => apiCall(`/vouchers?code=${encodeURIComponent(code)}`),
  create: async (voucher: any) => apiCall('/vouchers', { method: 'POST', body: JSON.stringify(voucher) }),
  update: async (id: string, updates: any) => apiCall('/vouchers', { method: 'PUT', body: JSON.stringify({ id, ...updates }) }),
  delete: async (id: string) => apiCall(`/vouchers?id=${id}`, { method: 'DELETE' }),
};

// Promo Cards API
export const promoCardsApi = {
  getAll: async () => apiCall('/promo-cards'),
  getById: async (id: string) => apiCall(`/promo-cards?id=${id}`),
  create: async (card: any) => apiCall('/promo-cards', { method: 'POST', body: JSON.stringify(card) }),
  update: async (id: string, updates: any) => apiCall('/promo-cards', { method: 'PUT', body: JSON.stringify({ id, ...updates }) }),
  delete: async (id: string) => apiCall(`/promo-cards?id=${id}`, { method: 'DELETE' }),
};

// Payment Verifications API
export const paymentVerificationsApi = {
  getAll: async () => apiCall('/payments'),
  getById: async (id: string) => apiCall(`/payments?id=${id}`),
  getByUserId: async (userId: string) => apiCall(`/payments?userId=${userId}`),
  getByStatus: async (status: string) => apiCall(`/payments?status=${status}`),
  create: async (payment: any) => apiCall('/payments', { method: 'POST', body: JSON.stringify(payment) }),
  update: async (id: string, updates: any) => apiCall('/payments', { method: 'PUT', body: JSON.stringify({ id, ...updates }) }),
  delete: async (id: string) => apiCall(`/payments?id=${id}`, { method: 'DELETE' }),
};

// Refunds API
export const refundsApi = {
  getAll: async () => apiCall('/refunds'),
  getById: async (id: string) => apiCall(`/refunds?id=${id}`),
  getByUserId: async (userId: string) => apiCall(`/refunds?userId=${userId}`),
  getByStatus: async (status: string) => apiCall(`/refunds?status=${status}`),
  create: async (refund: any) => apiCall('/refunds', { method: 'POST', body: JSON.stringify(refund) }),
  update: async (id: string, updates: any) => apiCall('/refunds', { method: 'PUT', body: JSON.stringify({ id, ...updates }) }),
  delete: async (id: string) => apiCall(`/refunds?id=${id}`, { method: 'DELETE' }),
};

// Notifications API
export const notificationsApi = {
  getAll: async () => apiCall('/notifications'),
  getById: async (id: string) => apiCall(`/notifications?id=${id}`),
  getByUserId: async (userId: string) => apiCall(`/notifications?userId=${userId}`),
  getAdminNotifications: async () => apiCall('/notifications?target=admin'),
  create: async (notification: any) => apiCall('/notifications', { method: 'POST', body: JSON.stringify(notification) }),
  update: async (id: string, updates: any) => apiCall('/notifications', { method: 'PUT', body: JSON.stringify({ id, ...updates }) }),
  delete: async (id: string) => apiCall(`/notifications?id=${id}`, { method: 'DELETE' }),
};

// Reviews API
export const reviewsApi = {
  getAll: async () => apiCall('/reviews'),
  getById: async (id: string) => apiCall(`/reviews?id=${id}`),
  getByProductId: async (productId: string) => apiCall(`/reviews?productId=${productId}`),
  getByUserId: async (userId: string) => apiCall(`/reviews?userId=${userId}`),
  create: async (review: any) => apiCall('/reviews', { method: 'POST', body: JSON.stringify(review) }),
  update: async (id: string, updates: any) => apiCall('/reviews', { method: 'PUT', body: JSON.stringify({ id, ...updates }) }),
  delete: async (id: string) => apiCall(`/reviews?id=${id}`, { method: 'DELETE' }),
};

// Conversations API
export const conversationsApi = {
  getAll: async () => apiCall('/conversations'),
  getById: async (id: string) => apiCall(`/conversations?id=${id}`),
  getByUserId: async (userId: string) => apiCall(`/conversations?userId=${userId}`),
  getActive: async () => apiCall('/conversations?active=true'),
  create: async (conversation: any) => apiCall('/conversations', { method: 'POST', body: JSON.stringify(conversation) }),
  update: async (id: string, updates: any) => apiCall('/conversations', { method: 'PUT', body: JSON.stringify({ id, ...updates }) }),
  delete: async (id: string) => apiCall(`/conversations?id=${id}`, { method: 'DELETE' }),
};

// Delivery Settings API
export const deliverySettingsApi = {
  get: async () => apiCall('/settings'),
  update: async (settings: any) => apiCall('/settings', { method: 'PUT', body: JSON.stringify(settings) }),
};

// Wishlist API
export const wishlistApi = {
  get: async (userId: string) => apiCall(`/wishlist?userId=${userId}`),
  getByUserId: async (userId: string) => apiCall(`/wishlist?userId=${userId}`),
  create: async (wishlist: any) => apiCall('/wishlist', { method: 'POST', body: JSON.stringify(wishlist) }),
  update: async (userId: string, updates: any) => apiCall('/wishlist', { method: 'PUT', body: JSON.stringify({ userId, ...updates }) }),
  add: async (userId: string, product: any) => apiCall('/wishlist', { method: 'POST', body: JSON.stringify({ userId, product }) }),
  remove: async (userId: string, productId: string) => apiCall(`/wishlist?userId=${userId}&productId=${productId}`, { method: 'DELETE' }),
  delete: async (userId: string) => apiCall(`/wishlist?userId=${userId}`, { method: 'DELETE' }),
};

