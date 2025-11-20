import { getDatabase } from './mongodb';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const db = await getDatabase();
  const collection = db.collection('delivery_settings');

  try {
    switch (req.method) {
      case 'GET':
        // Delivery settings is a single document
        const settings = await collection.findOne({ id: 'default' });
        if (!settings) {
          // Initialize with defaults
          const defaultSettings = {
            id: 'default',
            dhakaCharge: 60,
            outsideDhakaCharge: 110,
            freeShippingThreshold: 5000
          };
          await collection.insertOne(defaultSettings);
          return res.json({ success: true, data: defaultSettings });
        }
        return res.json({ success: true, data: settings });

      case 'PUT':
        const updates = req.body;
        await collection.updateOne(
          { id: 'default' },
          { $set: updates },
          { upsert: true }
        );
        return res.json({ success: true });

      default:
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

