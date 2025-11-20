import { getDatabase } from './mongodb';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  runtime: 'nodejs18.x',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const db = await getDatabase();
  const collection = db.collection('vouchers');

  try {
    switch (req.method) {
      case 'GET':
        if (req.query.id) {
          const voucher = await collection.findOne({ id: req.query.id });
          return res.json({ success: true, data: voucher });
        }
        if (req.query.code) {
          const voucher = await collection.findOne({ code: req.query.code });
          return res.json({ success: true, data: voucher });
        }
        const vouchers = await collection.find({}).toArray();
        return res.json({ success: true, data: vouchers });

      case 'POST':
        const newVoucher = req.body;
        newVoucher.id = newVoucher.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        newVoucher.usedCount = newVoucher.usedCount || 0;
        await collection.insertOne(newVoucher);
        return res.json({ success: true, data: newVoucher });

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

