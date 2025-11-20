import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME || 'auraz_ecommerce';

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is required. Please set it in your Vercel project settings.');
}

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient>;

if (!MONGODB_URI) {
  throw new Error('Please add your Mongo URI to environment variables');
}

// Create a new MongoClient with connection options
const clientOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI, clientOptions);
    globalWithMongo._mongoClientPromise = client.connect().catch((err) => {
      console.error('❌ MongoDB connection error:', err);
      throw err;
    });
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(MONGODB_URI, clientOptions);
  clientPromise = client.connect().catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    throw err;
  });
}

export async function getDatabase(): Promise<Db> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    // Test connection by listing collections
    await db.listCollections().toArray();
    
    return db;
  } catch (error) {
    console.error('❌ Error getting database:', error);
    throw error;
  }
}

export default clientPromise;

