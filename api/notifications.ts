import { getDatabase } from './mongodb';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  runtime: 'nodejs18.x',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const db = await getDatabase();
  const collection = db.collection('notifications');

  try {
    switch (req.method) {
      case 'GET':
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
        if (req.query.target === 'admin') {
          const notifications = await collection.find({ 
            $or: [
              { target: 'admin' },
              { target: 'all' }
            ]
          }).sort({ createdAt: -1 }).toArray();
          return res.json({ success: true, data: notifications });
        }
        const notifications = await collection.find({}).sort({ createdAt: -1 }).toArray();
        return res.json({ success: true, data: notifications });

      case 'POST':
        const newNotification = req.body;
        newNotification.id = newNotification.id || `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        newNotification.createdAt = newNotification.createdAt || new Date().toISOString();
        newNotification.isRead = newNotification.isRead || false;
        await collection.insertOne(newNotification);
        return res.json({ success: true, data: newNotification });

      case 'PUT':
        const { id, ...updates } = req.body;
        await collection.updateOne({ id }, { $set: updates });
        return res.json({ success: true });

      case 'DELETE':
        await collection.deleteOne({ id: req.query.id });
        return res.json({ success: true });

      default:
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

