import { getDatabase } from './mongodb';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  runtime: 'nodejs18.x',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const db = await getDatabase();
  const collection = db.collection('reviews');

  try {
    switch (req.method) {
      case 'GET':
        if (req.query.id) {
          const review = await collection.findOne({ id: req.query.id });
          return res.json({ success: true, data: review });
        }
        if (req.query.productId) {
          const reviews = await collection.find({ productId: req.query.productId }).sort({ createdAt: -1 }).toArray();
          return res.json({ success: true, data: reviews });
        }
        if (req.query.userId) {
          const reviews = await collection.find({ userId: req.query.userId }).toArray();
          return res.json({ success: true, data: reviews });
        }
        const reviews = await collection.find({}).sort({ createdAt: -1 }).toArray();
        return res.json({ success: true, data: reviews });

      case 'POST':
        const newReview = req.body;
        newReview.id = newReview.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        newReview.createdAt = newReview.createdAt || new Date().toISOString();
        await collection.insertOne(newReview);
        return res.json({ success: true, data: newReview });

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

