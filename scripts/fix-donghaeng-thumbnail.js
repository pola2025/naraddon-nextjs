const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const PolicyNewsPostSchema = new mongoose.Schema({
  title: String,
  content: String,
  category: String,
  excerpt: String,
  thumbnail: String,
  tags: [String],
  isMain: Boolean,
  isPinned: Boolean,
  badge: String,
  views: Number,
  likes: Number,
  comments: Number,
}, {
  timestamps: true
});

const PolicyNewsPost = mongoose.models.PolicyNewsPost || mongoose.model('PolicyNewsPost', PolicyNewsPostSchema);

async function fixDonghaengThumbnail() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MONGODB_URI 환경변수가 설정되지 않았습니다.');
      process.exit(1);
    }

    console.log('MongoDB 연결 중...');
    await mongoose.connect(mongoUri);
    console.log('MongoDB 연결 성공');

    // 9월 동행축제 게시글 찾기
    const post = await PolicyNewsPost.findOne({ title: '9월 동행축제, 울산 전통시장·소상공인과 함께하다' });

    if (!post) {
      console.log('9월 동행축제 게시글을 찾을 수 없습니다.');
      await mongoose.connection.close();
      process.exit(1);
    }

    console.log('현재 썸네일 URL:', post.thumbnail);

    // 같은 버킷의 다른 이미지 URL 사용 (상생페이백 게시글의 이미지)
    const newThumbnailUrl = 'https://pub-9f184323b8f24eb28c63d1a1410dd26a.r2.dev/policy-news/1758473200173-0120250917.jpg';

    // 썸네일 URL 업데이트
    post.thumbnail = newThumbnailUrl;
    await post.save();

    console.log('썸네일 URL이 업데이트되었습니다:', newThumbnailUrl);

    // 확인
    const updatedPost = await PolicyNewsPost.findOne({ title: '9월 동행축제, 울산 전통시장·소상공인과 함께하다' });
    console.log('업데이트 확인:', updatedPost.thumbnail);

    await mongoose.connection.close();
    console.log('완료');
    process.exit(0);
  } catch (error) {
    console.error('오류 발생:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

fixDonghaengThumbnail();