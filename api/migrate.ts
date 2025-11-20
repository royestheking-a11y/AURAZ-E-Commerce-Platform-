import { getDatabase } from './mongodb';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  runtime: 'nodejs18.x',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const db = await getDatabase();
    const data = req.body;

    console.log('🔄 Starting data migration to MongoDB...');

    // Migrate users
    if (data.users && Array.isArray(data.users) && data.users.length > 0) {
      const usersCollection = db.collection('users');
      for (const user of data.users) {
        await usersCollection.updateOne(
          { id: user.id },
          { $set: user },
          { upsert: true }
        );
      }
      console.log(`✅ Migrated ${data.users.length} users`);
    }

    // Migrate products
    if (data.products && Array.isArray(data.products) && data.products.length > 0) {
      const productsCollection = db.collection('products');
      for (const product of data.products) {
        await productsCollection.updateOne(
          { id: product.id },
          { $set: product },
          { upsert: true }
        );
      }
      console.log(`✅ Migrated ${data.products.length} products`);
    }

    // Migrate orders
    if (data.orders && Array.isArray(data.orders) && data.orders.length > 0) {
      const ordersCollection = db.collection('orders');
      for (const order of data.orders) {
        await ordersCollection.updateOne(
          { id: order.id },
          { $set: order },
          { upsert: true }
        );
      }
      console.log(`✅ Migrated ${data.orders.length} orders`);
    }

    // Migrate carousel slides
    if (data.carousel && Array.isArray(data.carousel) && data.carousel.length > 0) {
      const carouselCollection = db.collection('carousel_slides');
      for (const slide of data.carousel) {
        await carouselCollection.updateOne(
          { id: slide.id },
          { $set: slide },
          { upsert: true }
        );
      }
      console.log(`✅ Migrated ${data.carousel.length} carousel slides`);
    }

    // Migrate vouchers
    if (data.vouchers && Array.isArray(data.vouchers) && data.vouchers.length > 0) {
      const vouchersCollection = db.collection('vouchers');
      for (const voucher of data.vouchers) {
        await vouchersCollection.updateOne(
          { id: voucher.id },
          { $set: voucher },
          { upsert: true }
        );
      }
      console.log(`✅ Migrated ${data.vouchers.length} vouchers`);
    }

    // Migrate promo cards
    if (data.promoCards && Array.isArray(data.promoCards) && data.promoCards.length > 0) {
      const promoCardsCollection = db.collection('promo_cards');
      for (const card of data.promoCards) {
        await promoCardsCollection.updateOne(
          { id: card.id },
          { $set: card },
          { upsert: true }
        );
      }
      console.log(`✅ Migrated ${data.promoCards.length} promo cards`);
    }

    // Migrate payment verifications
    if (data.paymentVerifications && Array.isArray(data.paymentVerifications) && data.paymentVerifications.length > 0) {
      const paymentsCollection = db.collection('payment_verifications');
      for (const payment of data.paymentVerifications) {
        await paymentsCollection.updateOne(
          { id: payment.id },
          { $set: payment },
          { upsert: true }
        );
      }
      console.log(`✅ Migrated ${data.paymentVerifications.length} payment verifications`);
    }

    // Migrate refunds
    if (data.refunds && Array.isArray(data.refunds) && data.refunds.length > 0) {
      const refundsCollection = db.collection('refund_requests');
      for (const refund of data.refunds) {
        await refundsCollection.updateOne(
          { id: refund.id },
          { $set: refund },
          { upsert: true }
        );
      }
      console.log(`✅ Migrated ${data.refunds.length} refunds`);
    }

    // Migrate notifications
    if (data.notifications && Array.isArray(data.notifications) && data.notifications.length > 0) {
      const notificationsCollection = db.collection('notifications');
      for (const notification of data.notifications) {
        await notificationsCollection.updateOne(
          { id: notification.id },
          { $set: notification },
          { upsert: true }
        );
      }
      console.log(`✅ Migrated ${data.notifications.length} notifications`);
    }

    // Migrate reviews
    if (data.reviews && Array.isArray(data.reviews) && data.reviews.length > 0) {
      const reviewsCollection = db.collection('reviews');
      for (const review of data.reviews) {
        await reviewsCollection.updateOne(
          { id: review.id },
          { $set: review },
          { upsert: true }
        );
      }
      console.log(`✅ Migrated ${data.reviews.length} reviews`);
    }

    // Migrate conversations
    if (data.conversations && Array.isArray(data.conversations) && data.conversations.length > 0) {
      const conversationsCollection = db.collection('conversations');
      for (const conversation of data.conversations) {
        await conversationsCollection.updateOne(
          { id: conversation.id },
          { $set: conversation },
          { upsert: true }
        );
      }
      console.log(`✅ Migrated ${data.conversations.length} conversations`);
    }

    // Migrate delivery settings
    if (data.deliverySettings) {
      const settingsCollection = db.collection('delivery_settings');
      await settingsCollection.updateOne(
        { id: 'default' },
        { $set: { id: 'default', ...data.deliverySettings } },
        { upsert: true }
      );
      console.log('✅ Migrated delivery settings');
    }

    console.log('✅ Migration completed successfully!');
    return res.json({ success: true, message: 'Data migrated successfully' });
  } catch (error: any) {
    console.error('❌ Migration error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

