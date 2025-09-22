const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mkt9834:vhffkvhffkvhffk@naraddon-cluster.cicap0i.mongodb.net/naraddon?retryWrites=true&w=majority&appName=naraddon-cluster';

async function testMongoDBConnection() {
  console.log('Testing MongoDB connection...');
  console.log('URI:', MONGODB_URI.replace(/:[^:]*@/, ':***@'));

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✅ Successfully connected to MongoDB');

    // Test basic operations
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`Found ${collections.length} collections`);

    // Try to access user data
    const users = await mongoose.connection.db.collection('users').findOne();
    console.log('User data access test:', users ? 'Found user' : 'No users');

    await mongoose.connection.close();
    console.log('Connection closed');

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('Error details:', error);
  }
}

testMongoDBConnection();