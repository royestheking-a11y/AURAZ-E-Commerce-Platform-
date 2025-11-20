import { useEffect, useRef, useState } from 'react';
import {
  productsApi,
  usersApi,
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
} from './mongodbApi';
import { products as mockProducts, heroSlides } from './mockData';
import { vouchers, promoCards, sampleReviews } from './comprehensiveData';
import { sampleUsers, sampleOrders } from './initializeData';

/**
 * Custom hook to sync data with MongoDB
 * This hook handles:
 * 1. Loading data from MongoDB on mount
 * 2. Initializing with default data if database is empty
 * 3. Keeping data in sync
 */
export function useMongoSync() {
  const [isLoading, setIsLoading] = useState(false); // Start as false to not block UI
  const [isInitialized, setIsInitialized] = useState(false);
  const initRef = useRef(false);

  useEffect(() => {
    // Prevent double initialization in strict mode
    if (initRef.current) return;
    initRef.current = true;

    const initializeData = async () => {
      try {
        // Don't set loading to true - let UI render immediately
        console.log('🔄 Initializing MongoDB sync in background...');
        
        // First, check if we have localStorage data to migrate
        const hasLocalData = typeof window !== 'undefined' && localStorage.getItem('auraz_products') !== null;
        
        if (hasLocalData) {
          console.log('📦 Found localStorage data, migrating to MongoDB...');
          
          try {
            // Collect all localStorage data
            const localData = {
              users: JSON.parse(localStorage.getItem('auraz_users') || '[]'),
              products: JSON.parse(localStorage.getItem('auraz_products') || '[]'),
              orders: JSON.parse(localStorage.getItem('auraz_orders') || '[]'),
              carousel: JSON.parse(localStorage.getItem('auraz_carouselSlides') || '[]'),
              vouchers: JSON.parse(localStorage.getItem('auraz_vouchers') || '[]'),
              promoCards: JSON.parse(localStorage.getItem('auraz_promoCards') || '[]'),
              paymentVerifications: JSON.parse(localStorage.getItem('auraz_paymentVerifications') || '[]'),
              refunds: JSON.parse(localStorage.getItem('auraz_refunds') || '[]'),
              notifications: JSON.parse(localStorage.getItem('auraz_notifications') || '[]'),
              reviews: JSON.parse(localStorage.getItem('auraz_reviews') || '[]'),
              conversations: JSON.parse(localStorage.getItem('auraz_conversations') || '[]'),
              deliverySettings: JSON.parse(localStorage.getItem('auraz_deliverySettings') || '{"dhakaCharge":60,"outsideDhakaCharge":110,"freeShippingThreshold":5000}'),
            };
            
            // Migrate to MongoDB
            const migrateRes = await fetch('/api/migrate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(localData),
            });
            
            if (migrateRes.ok) {
              console.log('✅ Data migrated from localStorage to MongoDB!');
            } else {
              console.warn('⚠️ Migration failed, will try to initialize with defaults');
            }
          } catch (migrateError) {
            console.error('❌ Error migrating data:', migrateError);
          }
        }
        
        // Check if we have data in MongoDB
        try {
          const productsRes = await productsApi.getAll();
          
          if (!productsRes.success || !productsRes.data || productsRes.data.length === 0) {
            console.log('📦 Database is empty, initializing with default data...');
            
            // Convert heroSlides to CarouselSlides format
            const defaultCarouselSlides = heroSlides.map((slide) => ({
              id: slide.id.toString(),
              image: slide.image,
              title: slide.title,
              description: slide.subtitle,
              buttonText: slide.cta,
              buttonLink: slide.link,
            }));
            
            // Initialize with default data
            const defaultData = {
              users: sampleUsers,
              products: mockProducts,
              orders: sampleOrders,
              carousel: defaultCarouselSlides,
              vouchers: vouchers,
              promoCards: promoCards,
              paymentVerifications: [],
              refunds: [],
              notifications: [],
              reviews: sampleReviews,
              conversations: [],
              deliverySettings: {
                id: 'default',
                dhakaCharge: 60,
                outsideDhakaCharge: 110,
                freeShippingThreshold: 5000
              },
            };
            
            // Initialize default data using init-data endpoint
            try {
              console.log('📤 Sending default data to MongoDB...');
              const initRes = await fetch('/api/init-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(defaultData),
              });
              
              const initResult = await initRes.json();
              if (initRes.ok && initResult.success) {
                console.log('✅ Default data initialized in MongoDB!', initResult.results);
              } else {
                console.warn('⚠️ Failed to initialize default data:', initResult.error);
                // Try migrate endpoint as fallback
                try {
                  const migrateRes = await fetch('/api/migrate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(defaultData),
                  });
                  if (migrateRes.ok) {
                    console.log('✅ Data migrated using fallback method');
                  }
                } catch (migrateError) {
                  console.error('❌ Fallback migration also failed:', migrateError);
                }
              }
            } catch (error) {
              console.error('❌ Error initializing default data:', error);
            }
          } else {
            console.log('✅ Data loaded from MongoDB!');
          }
        } catch (error) {
          console.error('❌ Error connecting to MongoDB:', error);
          console.warn('⚠️ Please check your MongoDB connection.');
        }
        
        setIsInitialized(true);
        setIsLoading(false);
        console.log('✅ MongoDB sync initialized!');
      } catch (error) {
        console.error('❌ Error initializing MongoDB sync:', error);
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeData();
  }, []);

  return { isLoading, isInitialized };
}

