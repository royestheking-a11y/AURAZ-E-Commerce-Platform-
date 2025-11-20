import { getDatabase } from './mongodb';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  runtime: 'nodejs18.x',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const db = await getDatabase();
    const collection = db.collection('user_wishlists');

    switch (req.method) {
      case 'GET':
        if (!req.query.userId) {
          return res.status(400).json({ success: false, error: 'userId is required' });
        }

        let wishlist = await collection.findOne({ userId: req.query.userId });

        if (!wishlist) {
          wishlist = {
            userId: req.query.userId,
            products: [],
            updatedAt: new Date().toISOString()
          };
          await collection.insertOne(wishlist);
        }

        return res.json({ success: true, data: wishlist });

      case 'POST':
        const { userId, productId } = req.body;

        if (!userId || !productId) {
          return res.status(400).json({ success: false, error: 'userId and productId are required' });
        }

        await collection.updateOne(
          { userId },
          { $addToSet: { products: productId }, $set: { updatedAt: new Date().toISOString() } },
          { upsert: true }
        );

        const updatedWishlist = await collection.findOne({ userId });
        return res.json({ success: true, data: updatedWishlist });

      case 'DELETE':
        const deleteUserId = req.query.userId;
        const deleteProductId = req.query.productId;

        if (!deleteUserId || !deleteProductId) {
          return res.status(400).json({ success: false, error: 'userId and productId are required' });
        }

        await collection.updateOne(
          { userId: deleteUserId },
          { $pull: { products: deleteProductId }, $set: { updatedAt: new Date().toISOString() } }
        );

        const wishlistAfterDelete = await collection.findOne({ userId: deleteUserId });
        return res.json({ success: true, data: wishlistAfterDelete });

      default:
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('❌ Wishlist API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

