const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function checkData() {
  const uri = process.env.MONGODB_URI;
  console.log('Connecting to MongoDB...');
  console.log('Database:', uri.match(/mongodb.*?\/(.*?)\?/)?.[1]);

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db();

    // Check all collections
    const collections = await db.listCollections().toArray();
    console.log('Collections in database:', collections.map(c => c.name).join(', '));
    console.log('\n');

    // Check specific collections
    const collectionsToCheck = [
      'naraddontubeentries',
      'policynews',
      'policynewsposts',
      'policyanalysisposts',
      'ttontokposts',
      'businessvoicequestions'
    ];

    for (const collName of collectionsToCheck) {
      const coll = db.collection(collName);
      const count = await coll.countDocuments();
      console.log(`📊 ${collName}: ${count} documents`);

      if (count > 0) {
        const sample = await coll.findOne();
        console.log(`   Sample:`, {
          _id: sample._id,
          title: sample.title || sample.name || sample.question || 'N/A',
          createdAt: sample.createdAt || sample.date || 'N/A'
        });
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
    console.log('\n✅ Connection closed');
  }
}

checkData();