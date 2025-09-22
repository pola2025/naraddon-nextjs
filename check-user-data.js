const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://mkt9834:vhffkvhffkvhffk@naraddon-cluster.cicap0i.mongodb.net/naraddon?retryWrites=true&w=majority&appName=naraddon-cluster';

async function checkUserData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;

    // Check users collection
    const usersCount = await db.collection('users').countDocuments();
    console.log(`Users collection has ${usersCount} documents`);

    // Get sample user data
    const sampleUser = await db.collection('users').findOne();
    if (sampleUser) {
      console.log('Sample user structure:', Object.keys(sampleUser));
    }

    // Check other collections
    const collections = await db.listCollections().toArray();
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`Collection '${col.name}': ${count} documents`);
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkUserData();