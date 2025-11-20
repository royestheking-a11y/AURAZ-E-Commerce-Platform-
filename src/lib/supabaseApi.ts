import { projectId, publicAnonKey } from '../utils/supabase/info';

const getApiBase = () => {
  if (!projectId) {
    console.error('❌ Project ID not configured');
    return '';
  }
  return `https://${projectId}.supabase.co/functions/v1/make-server-3adf4243/api`;
};

const getHeaders = () => {
  if (!publicAnonKey) {
    console.error('❌ Anon key not configured');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`
  };
};

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  try {
    const API_BASE = getApiBase();
    const headers = getHeaders();
    
    if (!API_BASE) {
      throw new Error('Supabase API not configured. Please set VITE_SUPABASE_URL environment variable.');
    }
    
    const url = `${API_BASE}${endpoint}`;
    console.log(`🔄 API Call: ${options.method || 'GET'} ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers: { ...headers, ...options.headers },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'API request failed';
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      console.error(`❌ API Error (${endpoint}): ${response.status} ${response.statusText}`, errorMessage);
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.error(`❌ Network Error (${endpoint}): Cannot reach Edge Function at ${API_BASE}${endpoint}`);
      console.error('💡 The Supabase Edge Function may not be deployed or the deployment path is incorrect.');
      throw new Error('Edge Function not accessible. Please ensure it is deployed to Supabase.');
    }
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  
  register: async (userData: any) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};

// Users API
export const usersApi = {
  getAll: async () => {
    return apiCall('/users');
  },
  
  update: async (id: string, updates: any) => {
    return apiCall(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
  
  delete: async (id: string) => {
    return apiCall(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};

// Products API
export const productsApi = {
  getAll: async () => {
    return apiCall('/products');
  },
  
  add: async (productData: any) => {
    return apiCall('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },
  
  update: async (id: string, updates: any) => {
    return apiCall(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
  
  delete: async (id: string) => {
    return apiCall(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// Orders API
export const ordersApi = {
  getAll: async () => {
    return apiCall('/orders');
  },
  
  place: async (orderData: any) => {
    return apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },
  
  update: async (id: string, updates: any) => {
    return apiCall(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
  
  delete: async (id: string) => {
    return apiCall(`/orders/${id}`, {
      method: 'DELETE',
    });
  },
};

// Carousel API
export const carouselApi = {
  getAll: async () => {
    return apiCall('/carousel');
  },
  
  add: async (slideData: any) => {
    return apiCall('/carousel', {
      method: 'POST',
      body: JSON.stringify(slideData),
    });
  },
  
  update: async (id: string, updates: any) => {
    return apiCall(`/carousel/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
  
  delete: async (id: string) => {
    return apiCall(`/carousel/${id}`, {
      method: 'DELETE',
    });
  },
};

// Vouchers API
export const vouchersApi = {
  getAll: async () => {
    return apiCall('/vouchers');
  },
  
  add: async (voucherData: any) => {
    return apiCall('/vouchers', {
      method: 'POST',
      body: JSON.stringify(voucherData),
    });
  },
  
  update: async (id: string, updates: any) => {
    return apiCall(`/vouchers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
  
  delete: async (id: string) => {
    return apiCall(`/vouchers/${id}`, {
      method: 'DELETE',
    });
  },
};

// Promo Cards API
export const promoCardsApi = {
  getAll: async () => {
    return apiCall('/promo-cards');
  },
  
  add: async (cardData: any) => {
    return apiCall('/promo-cards', {
      method: 'POST',
      body: JSON.stringify(cardData),
    });
  },
  
  update: async (id: string, updates: any) => {
    return apiCall(`/promo-cards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
  
  delete: async (id: string) => {
    return apiCall(`/promo-cards/${id}`, {
      method: 'DELETE',
    });
  },
};

// Payment Verifications API
export const paymentVerificationsApi = {
  getAll: async () => {
    return apiCall('/payment-verifications');
  },
  
  request: async (orderData: any, amount: number) => {
    return apiCall('/payment-verifications', {
      method: 'POST',
      body: JSON.stringify({ orderData, amount }),
    });
  },
  
  update: async (id: string, updates: any) => {
    return apiCall(`/payment-verifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
};

// Refunds API
export const refundsApi = {
  getAll: async () => {
    return apiCall('/refunds');
  },
  
  create: async (refundData: any) => {
    return apiCall('/refunds', {
      method: 'POST',
      body: JSON.stringify(refundData),
    });
  },
  
  update: async (id: string, updates: any) => {
    return apiCall(`/refunds/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
};

// Notifications API
export const notificationsApi = {
  getAll: async () => {
    return apiCall('/notifications');
  },
  
  add: async (notificationData: any) => {
    return apiCall('/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  },
  
  markAsRead: async (id: string) => {
    return apiCall(`/notifications/${id}`, {
      method: 'PUT',
    });
  },
};

// Reviews API
export const reviewsApi = {
  getAll: async () => {
    return apiCall('/reviews');
  },
  
  add: async (reviewData: any) => {
    return apiCall('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },
  
  delete: async (id: string) => {
    return apiCall(`/reviews/${id}`, {
      method: 'DELETE',
    });
  },
};

// Conversations API
export const conversationsApi = {
  getAll: async () => {
    return apiCall('/conversations');
  },
  
  create: async (visitorName?: string, visitorEmail?: string, userId?: string) => {
    return apiCall('/conversations', {
      method: 'POST',
      body: JSON.stringify({ visitorName, visitorEmail, userId }),
    });
  },
  
  addMessage: async (conversationId: string, sender: string, message: string) => {
    return apiCall(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ sender, message }),
    });
  },
  
  update: async (id: string, updates: any) => {
    return apiCall(`/conversations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
  
  delete: async (id: string) => {
    return apiCall(`/conversations/${id}`, {
      method: 'DELETE',
    });
  },
};

// Delivery Settings API
export const deliverySettingsApi = {
  get: async () => {
    return apiCall('/delivery-settings');
  },
  
  update: async (settings: any) => {
    return apiCall('/delivery-settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },
};

// Data Initialization API
export const dataInitApi = {
  initializeFromLocalStorage: async (data: any) => {
    return apiCall('/init-data', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Health Check API
export const healthApi = {
  check: async () => {
    const API_BASE = getApiBase();
    if (!API_BASE) {
      return { status: 'error', error: 'API not configured' };
    }
    
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3adf4243/health`);
      if (!response.ok) {
        return { status: 'error', error: `HTTP ${response.status}` };
      }
      return await response.json();
    } catch (err: any) {
      return { status: 'error', error: err.message };
    }
  },
};
