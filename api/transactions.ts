import { getDatabase } from '../lib/mongodb';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const path = req.url?.split('?')[0] || '';

  // Handle /api/payments
  if (path === '/api/payments' || path.endsWith('/payments')) {
    try {
      const db = await getDatabase();
      const collection = db.collection('payment_verifications');
      
      if (req.method === 'GET') {
        if (req.query.id) {
          const payment = await collection.findOne({ id: req.query.id });
          return res.json({ success: true, data: payment });
        }
        if (req.query.userId) {
          const payments = await collection.find({ userId: req.query.userId }).sort({ createdAt: -1 }).toArray();
          return res.json({ success: true, data: payments });
        }
        
        const payments = await collection.find({}).sort({ createdAt: -1 }).toArray();
        return res.json({ success: true, data: payments });
      }

      if (req.method === 'POST') {
        const newPayment = req.body;
        newPayment.id = newPayment.id || `pv-${Date.now()}`;
        newPayment.createdAt = newPayment.createdAt || new Date().toISOString();
        await collection.insertOne(newPayment);
        return res.json({ success: true, data: newPayment });
      }

      if (req.method === 'PUT') {
        const { id, ...updates } = req.body;
        if (!id) {
          return res.status(400).json({ success: false, error: 'Payment ID is required' });
        }
        updates.updatedAt = new Date().toISOString();
        const result = await collection.updateOne({ id }, { $set: updates });
        if (result.modifiedCount === 0) {
          return res.status(404).json({ success: false, error: 'Payment not found or no changes' });
        }
        const updated = await collection.findOne({ id });
        return res.json({ success: true, data: updated });
      }

      if (req.method === 'DELETE') {
        await collection.deleteOne({ id: req.query.id });
        return res.json({ success: true });
      }

      return res.status(405).json({ success: false, error: 'Method not allowed' });
    } catch (error: any) {
      console.error('Error in /api/payments:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // Handle /api/refunds
  if (path === '/api/refunds' || path.endsWith('/refunds')) {
    try {
      const db = await getDatabase();
      const collection = db.collection('refund_requests');
      
      if (req.method === 'GET') {
        if (req.query.id) {
          const refund = await collection.findOne({ id: req.query.id });
          return res.json({ success: true, data: refund });
        }
        if (req.query.userId) {
          const refunds = await collection.find({ userId: req.query.userId }).toArray();
          return res.json({ success: true, data: refunds });
        }
        
        const refunds = await collection.find({}).toArray();
        return res.json({ success: true, data: refunds });
      }

      if (req.method === 'POST') {
        const newRefund = req.body;
        newRefund.id = newRefund.id || `refund-${Date.now()}`;
        newRefund.createdAt = newRefund.createdAt || new Date().toISOString();
        await collection.insertOne(newRefund);
        return res.json({ success: true, data: newRefund });
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
      console.error('Error in /api/refunds:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res.status(404).json({ success: false, error: 'Not found' });
}

