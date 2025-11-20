import { getDatabase } from './mongodb';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const db = await getDatabase();
  const collection = db.collection('payment_verifications');

  try {
    switch (req.method) {
      case 'GET':
        if (req.query.id) {
          const payment = await collection.findOne({ id: req.query.id });
          return res.json({ success: true, data: payment });
        }
        if (req.query.userId) {
          const payments = await collection.find({ userId: req.query.userId }).toArray();
          return res.json({ success: true, data: payments });
        }
        if (req.query.status) {
          const payments = await collection.find({ status: req.query.status }).toArray();
          return res.json({ success: true, data: payments });
        }
        const payments = await collection.find({}).toArray();
        return res.json({ success: true, data: payments });

      case 'POST':
        const newPayment = req.body;
        newPayment.id = newPayment.id || `pv-${Date.now()}`;
        newPayment.createdAt = newPayment.createdAt || new Date().toISOString();
        await collection.insertOne(newPayment);
        return res.json({ success: true, data: newPayment });

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

