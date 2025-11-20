import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

// Construct Supabase URL from project ID
const supabaseUrl = projectId ? `https://${projectId}.supabase.co` : '';

// Create and export Supabase client only if we have valid credentials
export const supabase = projectId && publicAnonKey 
  ? createClient(supabaseUrl, publicAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      db: {
        schema: 'public'
      },
      global: {
        headers: {
          'x-application-name': 'auraz-ecommerce'
        }
      }
    })
  : null;

// Type definitions for database tables
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          password: string;
          profile_photo: string | null;
          date_of_birth: string | null;
          gender: string | null;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
          used_vouchers: string[];
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['users']['Row']>;
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          phone: string;
          street: string;
          city: string;
          postal_code: string;
          landmark: string | null;
        };
        Insert: Omit<Database['public']['Tables']['addresses']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['addresses']['Row']>;
      };
      payment_methods: {
        Row: {
          id: string;
          user_id: string;
          type: 'card' | 'bkash' | 'nagad';
          name: string;
          details: string;
          is_default: boolean;
        };
        Insert: Omit<Database['public']['Tables']['payment_methods']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['payment_methods']['Row']>;
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          image: string;
          images: string[];
          category: string;
          stock: number;
          trending: boolean;
          new_arrival: boolean;
          rating: number;
          reviews_count: number;
          variants: any;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['products']['Row']>;
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          items: any;
          total: number;
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          shipping_address: any;
          payment_method: string;
          created_at: string;
          delivery_charge: number;
          voucher_discount: number | null;
          voucher_code: string | null;
        };
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['orders']['Row']>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string | null;
          target: 'user' | 'admin' | 'all';
          title: string;
          message: string;
          type: 'order' | 'payment' | 'promotion' | 'system';
          is_read: boolean;
          created_at: string;
          link: string | null;
        };
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at' | 'is_read'>;
        Update: Partial<Database['public']['Tables']['notifications']['Row']>;
      };
      vouchers: {
        Row: {
          id: string;
          code: string;
          type: 'percentage' | 'fixed';
          value: number;
          description: string;
          min_order_amount: number;
          max_discount: number | null;
          valid_from: string;
          valid_until: string;
          usage_limit: number;
          used_count: number;
          is_active: boolean;
          applicable_categories: string[] | null;
        };
        Insert: Omit<Database['public']['Tables']['vouchers']['Row'], 'id' | 'used_count'>;
        Update: Partial<Database['public']['Tables']['vouchers']['Row']>;
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          user_name: string;
          order_id: string;
          rating: number;
          comment: string;
          created_at: string;
          is_verified_purchase: boolean;
        };
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['reviews']['Row']>;
      };
      refund_requests: {
        Row: {
          id: string;
          order_id: string;
          user_id: string;
          reason: string;
          amount: number;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
          processed_at: string | null;
          admin_notes: string | null;
        };
        Insert: Omit<Database['public']['Tables']['refund_requests']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['refund_requests']['Row']>;
      };
      carousel_slides: {
        Row: {
          id: string;
          image: string;
          title: string;
          description: string;
          button_text: string;
          button_link: string;
        };
        Insert: Omit<Database['public']['Tables']['carousel_slides']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['carousel_slides']['Row']>;
      };
      promo_cards: {
        Row: {
          id: string;
          title: string;
          description: string;
          image: string;
          button_text: string;
          link: string;
          gradient: string;
          is_active: boolean;
          order: number;
        };
        Insert: Omit<Database['public']['Tables']['promo_cards']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['promo_cards']['Row']>;
      };
      conversations: {
        Row: {
          id: string;
          user_id: string | null;
          visitor_name: string | null;
          visitor_email: string | null;
          messages: any;
          status: 'active' | 'transferred' | 'closed';
          transferred_to_admin: boolean;
          created_at: string;
          last_message_at: string;
          admin_replied: boolean;
        };
        Insert: Omit<Database['public']['Tables']['conversations']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['conversations']['Row']>;
      };
    };
  };
};

// Helper function to check connection
export const checkSupabaseConnection = async (): Promise<{ connected: boolean; error?: string }> => {
  try {
    if (!supabase) {
      return { 
        connected: false, 
        error: 'Supabase client not initialized. Please configure SUPABASE_URL and SUPABASE_ANON_KEY environment variables.' 
      };
    }

    // Test connection by trying to query a table
    const { error } = await supabase
      .from('kv_store_3adf4243')
      .select('count')
      .limit(1);
    
    if (error) {
      return { connected: false, error: error.message };
    }
    
    return { connected: true };
  } catch (err: any) {
    return { connected: false, error: err.message };
  }
};

// Export a function to test the connection
export const testConnection = async () => {
  console.log('🔍 Testing Supabase connection...');
  console.log('📍 URL:', supabaseUrl);
  console.log('🔑 Key:', publicAnonKey ? publicAnonKey.substring(0, 20) + '...' : 'NOT SET');
  
  if (!projectId || !publicAnonKey) {
    console.error('❌ Supabase credentials not configured!');
    console.log('💡 Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables');
    return { connected: false, error: 'Missing credentials' };
  }
  
  const result = await checkSupabaseConnection();
  
  if (result.connected) {
    console.log('✅ Supabase connection successful!');
  } else {
    console.error('❌ Supabase connection failed:', result.error);
  }
  
  return result;
};

// Export configuration status
export const isConfigured = () => {
  return !!(projectId && publicAnonKey && supabase);
};
