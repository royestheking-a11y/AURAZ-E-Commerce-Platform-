import { getDatabase } from './mongodb';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const db = await getDatabase();
  const collection = db.collection('promo_cards');

  try {
    switch (req.method) {
      case 'GET':
        if (req.query.id) {
          const card = await collection.findOne({ id: req.query.id });
          return res.json({ success: true, data: card });
        }
        const cards = await collection.find({}).sort({ order: 1 }).toArray();
        return res.json({ success: true, data: cards });

      case 'POST':
        const newCard = req.body;
        newCard.id = newCard.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        await collection.insertOne(newCard);
        return res.json({ success: true, data: newCard });

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

