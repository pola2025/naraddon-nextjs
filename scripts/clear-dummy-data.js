const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://mkt9834:vhffkvhffkvhffk@naraddon-cluster.cicap0i.mongodb.net/naraddon?retryWrites=true&w=majority&appName=naraddon-cluster';

async function clearDummyData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;

    // Clear dummy data from collections
    const collections = [
      'ttontokposts',
      'ttontokreplies',
      'policynewsposts',
      'businessvoiceinterviewvideos',
      'naraddontubeentries',
      'ddontalks'
    ];

    for (const collectionName of collections) {
      const result = await db.collection(collectionName).deleteMany({});
      console.log(`Cleared ${result.deletedCount} documents from ${collectionName}`);
    }

    console.log('✅ All dummy data cleared successfully');
    await mongoose.connection.close();

  } catch (error) {
    console.error('Error clearing dummy data:', error.message);
    process.exit(1);
  }
}

clearDummyData();