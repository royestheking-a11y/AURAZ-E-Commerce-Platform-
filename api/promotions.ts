import { getDatabase } from './mongodb';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const path = req.url?.split('?')[0] || '';

  // Handle /api/vouchers
  if (path === '/api/vouchers' || path.endsWith('/vouchers')) {
    try {
      const db = await getDatabase();
      const collection = db.collection('vouchers');
      
      if (req.method === 'GET') {
        if (req.query.id) {
          const voucher = await collection.findOne({ id: req.query.id });
          return res.json({ success: true, data: voucher });
        }
        
        const vouchers = await collection.find({}).toArray();
        return res.json({ success: true, data: vouchers });
      }

      if (req.method === 'POST') {
        const newVoucher = req.body;
        newVoucher.id = newVoucher.id || `voucher-${Date.now()}`;
        await collection.insertOne(newVoucher);
        return res.json({ success: true, data: newVoucher });
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
      console.error('Error in /api/vouchers:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // Handle /api/promo-cards
  if (path === '/api/promo-cards' || path.endsWith('/promo-cards')) {
    try {
      const db = await getDatabase();
      const collection = db.collection('promo_cards');
      
      if (req.method === 'GET') {
        if (req.query.id) {
          const card = await collection.findOne({ id: req.query.id });
          return res.json({ success: true, data: card });
        }
        
        const cards = await collection.find({}).toArray();
        return res.json({ success: true, data: cards });
      }

      if (req.method === 'POST') {
        const newCard = req.body;
        newCard.id = newCard.id || `promo-${Date.now()}`;
        await collection.insertOne(newCard);
        return res.json({ success: true, data: newCard });
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
      console.error('Error in /api/promo-cards:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res.status(404).json({ success: false, error: 'Not found' });
}

