import { getDatabase } from './mongodb';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const db = await getDatabase();
    const collection = db.collection('users');
    switch (req.method) {
      case 'GET':
        if (req.query.id) {
          const user = await collection.findOne({ id: req.query.id });
          return res.json({ success: true, data: user });
        }
        if (req.query.email) {
          const user = await collection.findOne({ email: req.query.email });
          return res.json({ success: true, data: user });
        }
        const users = await collection.find({}).toArray();
        return res.json({ success: true, data: users });

      case 'POST':
        const newUser = req.body;
        newUser.id = newUser.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        newUser.createdAt = newUser.createdAt || new Date().toISOString();
        await collection.insertOne(newUser);
        return res.json({ success: true, data: newUser });

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
    console.error('❌ API Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

