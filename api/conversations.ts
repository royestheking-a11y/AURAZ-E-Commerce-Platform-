import { getDatabase } from './mongodb';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  runtime: 'nodejs18.x',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const db = await getDatabase();
  const collection = db.collection('conversations');

  try {
    switch (req.method) {
      case 'GET':
        if (req.query.id) {
          const conversation = await collection.findOne({ id: req.query.id });
          return res.json({ success: true, data: conversation });
        }
        if (req.query.userId) {
          const conversations = await collection.find({ userId: req.query.userId }).sort({ lastMessageAt: -1 }).toArray();
          return res.json({ success: true, data: conversations });
        }
        if (req.query.active === 'true') {
          const conversations = await collection.find({ 
            transferredToAdmin: true,
            status: { $ne: 'closed' }
          }).sort({ lastMessageAt: -1 }).toArray();
          return res.json({ success: true, data: conversations });
        }
        const conversations = await collection.find({}).sort({ lastMessageAt: -1 }).toArray();
        return res.json({ success: true, data: conversations });

      case 'POST':
        const newConversation = req.body;
        newConversation.id = newConversation.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        newConversation.createdAt = newConversation.createdAt || new Date().toISOString();
        newConversation.lastMessageAt = newConversation.lastMessageAt || newConversation.createdAt;
        newConversation.messages = newConversation.messages || [];
        newConversation.status = newConversation.status || 'active';
        newConversation.transferredToAdmin = newConversation.transferredToAdmin || false;
        newConversation.adminReplied = newConversation.adminReplied || false;
        await collection.insertOne(newConversation);
        return res.json({ success: true, data: newConversation });

      case 'PUT':
        const { id, ...updates } = req.body;
        // If updating messages, use $push, otherwise $set
        if (updates.messages && Array.isArray(updates.messages)) {
          // Replace entire messages array
          await collection.updateOne({ id }, { $set: { messages: updates.messages, lastMessageAt: new Date().toISOString() } });
        } else {
          await collection.updateOne({ id }, { $set: updates });
        }
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

