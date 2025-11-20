import { getDatabase } from './mongodb';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const path = req.url?.split('?')[0] || '';

  // Handle /api/ping
  if (path === '/api/ping' || path.endsWith('/ping')) {
    if (req.method !== 'GET') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    return res.json({ 
      success: true, 
      message: 'pong', 
      timestamp: new Date().toISOString() 
    });
  }

  // Handle /api/test-connection
  if (path === '/api/test-connection' || path.endsWith('/test-connection')) {
    if (req.method !== 'GET') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
      console.log('🔍 Testing MongoDB connection...');
      const db = await getDatabase();
      
      // List all collections
      const collections = await db.listCollections().toArray();
      const collectionNames = collections.map(c => c.name);
      
      // Get counts for each collection
      const counts: Record<string, number> = {};
      for (const name of collectionNames) {
        counts[name] = await db.collection(name).countDocuments();
      }
      
      return res.json({
        success: true,
        connected: true,
        database: db.databaseName,
        collections: collectionNames,
        counts,
        message: 'MongoDB connection successful!'
      });
    } catch (error: any) {
      console.error('❌ MongoDB connection test failed:', error);
      return res.status(500).json({
        success: false,
        connected: false,
        error: error.message,
        message: 'MongoDB connection failed. Please check your connection string.'
      });
    }
  }

  return res.status(404).json({ success: false, error: 'Not found' });
}

