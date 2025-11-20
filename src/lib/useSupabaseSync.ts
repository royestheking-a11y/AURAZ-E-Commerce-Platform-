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
  dataInitApi,
} from './supabaseApi';
import { products as mockProducts, heroSlides } from './mockData';
import { vouchers, promoCards, sampleReviews } from './comprehensiveData';
import { sampleUsers, sampleOrders } from './initializeData';
import { projectId, publicAnonKey } from '../utils/supabase/info';

/**
 * Custom hook to sync data between localStorage and Supabase
 * This hook handles:
 * 1. Loading data from Supabase on mount
 * 2. Migrating data from localStorage to Supabase if needed
 * 3. Keeping data in sync
 */
export function useSupabaseSync() {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const initRef = useRef(false);

  useEffect(() => {
    // Prevent double initialization in strict mode
    if (initRef.current) return;
    initRef.current = true;

    const initializeData = async () => {
      try {
        console.log('🔄 Initializing Supabase sync...');
        
        // First, test if the Edge Function is accessible
        try {
          const healthCheckUrl = `https://${projectId}.supabase.co/functions/v1/make-server-3adf4243/health`;
          console.log(`🏥 Checking Edge Function health: ${healthCheckUrl}`);
          const healthCheck = await fetch(healthCheckUrl, {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`
            }
          });
          if (!healthCheck.ok) {
            console.warn('⚠️ Edge Function health check failed. Using localStorage fallback mode.');
            console.warn('');
            console.warn('📊 Status:', healthCheck.status, healthCheck.statusText);
            console.warn('🔗 URL:', healthCheckUrl);
            console.warn('');
            console.warn('💡 This usually means:');
            console.warn('  1. Edge Function is not deployed yet');
            console.warn('  2. Environment variables are missing');
            console.warn('  3. Database table is not created');
            console.warn('');
            console.warn('📖 See ✅_SIMPLE_CHECKLIST.md for step-by-step fix');
            console.warn('');
            setIsInitialized(true);
            setIsLoading(false);
            return;
          } else {
            console.log('✅ Edge Function is accessible and responding');
            console.log('📊 Status:', healthCheck.status);
          }
        } catch (healthError) {
          console.warn('⚠️ Edge Function not accessible. Using localStorage fallback mode.');
          console.warn('');
          console.warn('🚀 QUICK FIX (5 minutes):');
          console.warn('');
          console.warn('📋 STEP 1: Setup Database');
          console.warn('  → Open: https://supabase.com/dashboard/project/' + projectId + '/sql');
          console.warn('  → Run the SQL from: setup-database.sql');
          console.warn('');
          console.warn('📋 STEP 2: Deploy Edge Function');
          console.warn('  → Run: supabase login && supabase link --project-ref ' + projectId);
          console.warn('  → Run: supabase functions deploy server');
          console.warn('  → OR use: ./quick-deploy.sh (Mac/Linux) or quick-deploy.bat (Windows)');
          console.warn('');
          console.warn('📖 Visit /setup-status for complete step-by-step instructions');
          console.warn('🔗 Health Check URL:', `https://${projectId}.supabase.co/functions/v1/make-server-3adf4243/health`);
          console.warn('');
          setIsInitialized(true);
          setIsLoading(false);
          return;
        }
        
        // Check if we have data in localStorage
        const hasLocalData = localStorage.getItem('auraz_products') !== null;
        
        if (hasLocalData) {
          console.log('📦 Found localStorage data, migrating to Supabase...');
          
          // Migrate data from localStorage to Supabase
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
          
          await dataInitApi.initializeFromLocalStorage(localData);
          console.log('✅ Data migrated successfully!');
        } else {
          console.log('🌐 No localStorage data found, checking Supabase...');
          
          // Check if Supabase has data
          const checkResult = await productsApi.getAll().catch(() => ({ success: true, data: [] }));
          
          if (!checkResult.data || checkResult.data.length === 0) {
            console.log('📦 Initializing with default data...');
            
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
                dhakaCharge: 60,
                outsideDhakaCharge: 110,
                freeShippingThreshold: 5000
              },
            };
            
            await dataInitApi.initializeFromLocalStorage(defaultData);
            console.log('✅ Default data initialized!');
          }
          console.log('🌐 Loading data from Supabase...');
          
          // Load initial data from Supabase (will use defaults in server if empty)
          try {
            const [
              productsRes,
              usersRes,
              ordersRes,
              carouselRes,
              vouchersRes,
              promoCardsRes,
              paymentVerificationsRes,
              refundsRes,
              notificationsRes,
              reviewsRes,
              conversationsRes,
              deliverySettingsRes,
            ] = await Promise.all([
              productsApi.getAll().catch(() => ({ success: true, data: [] })),
              usersApi.getAll().catch(() => ({ success: true, data: [] })),
              ordersApi.getAll().catch(() => ({ success: true, data: [] })),
              carouselApi.getAll().catch(() => ({ success: true, data: [] })),
              vouchersApi.getAll().catch(() => ({ success: true, data: [] })),
              promoCardsApi.getAll().catch(() => ({ success: true, data: [] })),
              paymentVerificationsApi.getAll().catch(() => ({ success: true, data: [] })),
              refundsApi.getAll().catch(() => ({ success: true, data: [] })),
              notificationsApi.getAll().catch(() => ({ success: true, data: [] })),
              reviewsApi.getAll().catch(() => ({ success: true, data: [] })),
              conversationsApi.getAll().catch(() => ({ success: true, data: [] })),
              deliverySettingsApi.get().catch(() => ({ success: true, data: { dhakaCharge: 60, outsideDhakaCharge: 110, freeShippingThreshold: 5000 } })),
            ]);
            
            // Store in localStorage as cache
            if (productsRes.success && productsRes.data) {
              localStorage.setItem('auraz_products', JSON.stringify(productsRes.data));
            }
            if (usersRes.success && usersRes.data) {
              localStorage.setItem('auraz_users', JSON.stringify(usersRes.data));
            }
            if (ordersRes.success && ordersRes.data) {
              localStorage.setItem('auraz_orders', JSON.stringify(ordersRes.data));
            }
            if (carouselRes.success && carouselRes.data) {
              localStorage.setItem('auraz_carouselSlides', JSON.stringify(carouselRes.data));
            }
            if (vouchersRes.success && vouchersRes.data) {
              localStorage.setItem('auraz_vouchers', JSON.stringify(vouchersRes.data));
            }
            if (promoCardsRes.success && promoCardsRes.data) {
              localStorage.setItem('auraz_promoCards', JSON.stringify(promoCardsRes.data));
            }
            if (paymentVerificationsRes.success && paymentVerificationsRes.data) {
              localStorage.setItem('auraz_paymentVerifications', JSON.stringify(paymentVerificationsRes.data));
            }
            if (refundsRes.success && refundsRes.data) {
              localStorage.setItem('auraz_refunds', JSON.stringify(refundsRes.data));
            }
            if (notificationsRes.success && notificationsRes.data) {
              localStorage.setItem('auraz_notifications', JSON.stringify(notificationsRes.data));
            }
            if (reviewsRes.success && reviewsRes.data) {
              localStorage.setItem('auraz_reviews', JSON.stringify(reviewsRes.data));
            }
            if (conversationsRes.success && conversationsRes.data) {
              localStorage.setItem('auraz_conversations', JSON.stringify(conversationsRes.data));
            }
            if (deliverySettingsRes.success && deliverySettingsRes.data) {
              localStorage.setItem('auraz_deliverySettings', JSON.stringify(deliverySettingsRes.data));
            }
            
            console.log('✅ Data loaded from Supabase!');
          } catch (error) {
            console.error('❌ Error loading from Supabase:', error);
          }
        }
        
        setIsInitialized(true);
        setIsLoading(false);
        console.log('✅ Supabase sync initialized!');
      } catch (error) {
        console.error('❌ Error initializing Supabase sync:', error);
        setIsLoading(false);
        setIsInitialized(true); // Still set initialized so app can work with localStorage
      }
    };

    initializeData();
  }, []);

  return { isLoading, isInitialized };
}
