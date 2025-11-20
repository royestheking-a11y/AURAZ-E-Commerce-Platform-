import { getDatabase } from './mongodb';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const db = await getDatabase();
  const collection = db.collection('refund_requests');

  try {
    switch (req.method) {
      case 'GET':
        if (req.query.id) {
          const refund = await collection.findOne({ id: req.query.id });
          return res.json({ success: true, data: refund });
        }
        if (req.query.userId) {
          const refunds = await collection.find({ userId: req.query.userId }).toArray();
          return res.json({ success: true, data: refunds });
        }
        if (req.query.status) {
          const refunds = await collection.find({ status: req.query.status }).toArray();
          return res.json({ success: true, data: refunds });
        }
        const refunds = await collection.find({}).toArray();
        return res.json({ success: true, data: refunds });

      case 'POST':
        const newRefund = req.body;
        newRefund.id = newRefund.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        newRefund.createdAt = newRefund.createdAt || new Date().toISOString();
        await collection.insertOne(newRefund);
        return res.json({ success: true, data: newRefund });

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

