// Test MongoDB Connection for Server and API
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME || 'auraz_ecommerce';

async function testConnection() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env.local');
    console.error('💡 Please create .env.local with your MongoDB connection string');
    process.exit(1);
  }

  let client;
  try {
    console.log('🔄 Testing MongoDB Connection...\n');
    console.log('📍 Connection String:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    console.log('📦 Database Name:', DB_NAME);
    console.log('');

    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Successfully connected to MongoDB!');

    const db = client.db(DB_NAME);
    
    // Test ping
    await db.admin().ping();
    console.log('✅ Database ping successful');

    // List collections
    const collections = await db.listCollections().toArray();
    console.log(`\n📚 Collections found: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('\n📊 Collection Details:');
      for (const col of collections) {
        const count = await db.collection(col.name).countDocuments();
        console.log(`   - ${col.name}: ${count} documents`);
      }
    } else {
      console.log('⚠️  No collections found. Database is empty.');
      console.log('💡 The app will initialize with default data on first load.');
    }

    console.log('\n✅ MongoDB connection test PASSED!');
    console.log('✅ Server and API can connect to MongoDB successfully!');
    
  } catch (error) {
    console.error('\n❌ MongoDB connection test FAILED!');
    console.error('Error:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('1. Check your MongoDB connection string in .env.local');
    console.error('2. Verify MongoDB Atlas network access allows your IP (0.0.0.0/0)');
    console.error('3. Check database user credentials');
    console.error('4. Ensure MongoDB cluster is running');
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Connection closed.');
    }
  }
}

testConnection();

