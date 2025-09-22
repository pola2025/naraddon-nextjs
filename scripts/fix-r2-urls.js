const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

// PolicyNews Schema
const PolicyNewsSchema = new mongoose.Schema({
  title: String,
  category: String,
  content: String,
  excerpt: String,
  thumbnail: String,
  tags: [String],
  isMain: Boolean,
  isPinned: Boolean,
  badge: String,
  views: Number,
  likes: Number,
  comments: Number,
  createdAt: Date,
  updatedAt: Date
});

const PolicyNews = mongoose.models.PolicyNewsPost || mongoose.model('PolicyNewsPost', PolicyNewsSchema, 'policynewsposts');

async function fixR2URLs() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const oldDomain = 'pub-b520cb8ed3989e8182bdb020ade36495.r2.dev';
    const newDomain = 'pub-9f184323b8f24eb28c63d1a1410dd26a.r2.dev';

    // Find all documents with the old domain
    const posts = await PolicyNews.find({
      thumbnail: { $regex: oldDomain }
    });

    console.log(`Found ${posts.length} posts with old R2 domain`);

    for (const post of posts) {
      const oldUrl = post.thumbnail;
      const newUrl = oldUrl.replace(oldDomain, newDomain);

      post.thumbnail = newUrl;
      await post.save();

      console.log(`Updated: ${post.title}`);
      console.log(`  Old: ${oldUrl}`);
      console.log(`  New: ${newUrl}`);
    }

    console.log(`Successfully updated ${posts.length} posts`);

  } catch (error) {
    console.error('Error fixing R2 URLs:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

fixR2URLs();