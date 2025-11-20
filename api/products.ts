import { getDatabase } from './mongodb';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const db = await getDatabase();
    const collection = db.collection('products');
    switch (req.method) {
      case 'GET':
        if (req.query.id) {
          const product = await collection.findOne({ id: req.query.id });
          return res.json({ success: true, data: product });
        }
        if (req.query.category) {
          const products = await collection.find({ category: req.query.category }).toArray();
          return res.json({ success: true, data: products });
        }
        const products = await collection.find({}).toArray();
        return res.json({ success: true, data: products });

      case 'POST':
        const newProduct = req.body;
        newProduct.id = newProduct.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        await collection.insertOne(newProduct);
        return res.json({ success: true, data: newProduct });

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
    console.error('❌ Products API Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

