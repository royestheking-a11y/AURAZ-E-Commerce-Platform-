import { getDatabase } from './mongodb';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const db = await getDatabase();
    const collection = db.collection('orders');
    switch (req.method) {
      case 'GET':
        if (req.query.id) {
          const order = await collection.findOne({ id: req.query.id });
          return res.json({ success: true, data: order });
        }
        if (req.query.userId) {
          const orders = await collection.find({ userId: req.query.userId }).toArray();
          return res.json({ success: true, data: orders });
        }
        const orders = await collection.find({}).toArray();
        return res.json({ success: true, data: orders });

      case 'POST':
        const newOrder = req.body;
        newOrder.id = newOrder.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        newOrder.createdAt = newOrder.createdAt || new Date().toISOString();
        await collection.insertOne(newOrder);
        return res.json({ success: true, data: newOrder });

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
    console.error('❌ Orders API Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

