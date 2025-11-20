import { getDatabase } from './mongodb';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const path = req.url?.split('?')[0] || '';

  // Handle /api/notifications
  if (path === '/api/notifications' || path.endsWith('/notifications')) {
    try {
      const db = await getDatabase();
      const collection = db.collection('notifications');
      
      if (req.method === 'GET') {
        if (req.query.id) {
          const notification = await collection.findOne({ id: req.query.id });
          return res.json({ success: true, data: notification });
        }
        if (req.query.userId) {
          const notifications = await collection.find({
            $or: [
              { userId: req.query.userId },
              { userId: null, target: { $in: ['user', 'all'] } }
            ]
          }).sort({ createdAt: -1 }).toArray();
          return res.json({ success: true, data: notifications });
        }
        
        const notifications = await collection.find({}).sort({ createdAt: -1 }).toArray();
        return res.json({ success: true, data: notifications });
      }

      if (req.method === 'POST') {
        const newNotification = req.body;
        newNotification.id = newNotification.id || `notification-${Date.now()}`;
        newNotification.createdAt = newNotification.createdAt || new Date().toISOString();
        await collection.insertOne(newNotification);
        return res.json({ success: true, data: newNotification });
      }

      if (req.method === 'PUT') {
        const { id, ...updates } = req.body;
        await collection.updateOne({ id }, { $set: updates });
        return res.json({ success: true });
      }

      if (req.method === 'DELETE') {
        await collection.deleteOne({ id: req.query.id });
        return res.json({ success: true });
      }

      return res.status(405).json({ success: false, error: 'Method not allowed' });
    } catch (error: any) {
      console.error('Error in /api/notifications:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // Handle /api/reviews
  if (path === '/api/reviews' || path.endsWith('/reviews')) {
    try {
      const db = await getDatabase();
      const collection = db.collection('reviews');
      
      if (req.method === 'GET') {
        if (req.query.id) {
          const review = await collection.findOne({ id: req.query.id });
          return res.json({ success: true, data: review });
        }
        if (req.query.productId) {
          const reviews = await collection.find({ productId: req.query.productId }).sort({ createdAt: -1 }).toArray();
          return res.json({ success: true, data: reviews });
        }
        
        const reviews = await collection.find({}).sort({ createdAt: -1 }).toArray();
        return res.json({ success: true, data: reviews });
      }

      if (req.method === 'POST') {
        const newReview = req.body;
        newReview.id = newReview.id || `review-${Date.now()}`;
        newReview.createdAt = newReview.createdAt || new Date().toISOString();
        await collection.insertOne(newReview);
        return res.json({ success: true, data: newReview });
      }

      if (req.method === 'PUT') {
        const { id, ...updates } = req.body;
        await collection.updateOne({ id }, { $set: updates });
        return res.json({ success: true });
      }

      if (req.method === 'DELETE') {
        await collection.deleteOne({ id: req.query.id });
        return res.json({ success: true });
      }

      return res.status(405).json({ success: false, error: 'Method not allowed' });
    } catch (error: any) {
      console.error('Error in /api/reviews:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res.status(404).json({ success: false, error: 'Not found' });
}

