const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// MongoDB 연결
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MongoDB URI가 설정되지 않았습니다.');
  process.exit(1);
}

// Expert 스키마 정의
const ExpertSchema = new mongoose.Schema({
  name: String,
  position: String,
  companyName: String,
  specialties: [String],
  imageKey: String,
  order: Number,
  isActive: Boolean,
}, {
  timestamps: true,
});

const Expert = mongoose.models.Expert || mongoose.model('Expert', ExpertSchema);

// 초기 전문가 데이터
const initialExperts = [
  {
    name: '백경우',
    position: '변리사',
    companyName: '백경특허법률사무소',
    specialties: ['특허', '상표', '디자인', '벤처인증', '기업인증'],
    imageKey: 'baek-kyung-woo',
    order: 1,
    isActive: true,
  },
  {
    name: '성민석',
    position: '세무사',
    companyName: '세무법인 우진',
    specialties: ['세무조사', '절세전략', '기업자문', '재무제표', '법인세'],
    imageKey: 'sung-min-seok',
    order: 2,
    isActive: true,
  },
  {
    name: '전기홍',
    position: '행정사',
    companyName: '창성',
    specialties: ['근로계약', '노무관리', '인사제도', '4대보험', '외국인근로자'],
    imageKey: 'jeon-ki-hong',
    order: 3,
    isActive: true,
  },
  {
    name: '최일현',
    position: '회계사',
    companyName: '우일회계법인',
    specialties: ['사업계획', '투자유치', '경영진단', '성과관리', 'M&A'],
    imageKey: 'choi-il-hyun',
    order: 4,
    isActive: true,
  },
];

async function seedExperts() {
  try {
    // MongoDB 연결
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB에 연결되었습니다.');

    // 기존 데이터 확인
    const existingCount = await Expert.countDocuments();

    if (existingCount > 0) {
      console.log(`이미 ${existingCount}명의 전문가가 등록되어 있습니다.`);
      const answer = await new Promise((resolve) => {
        const readline = require('readline').createInterface({
          input: process.stdin,
          output: process.stdout
        });
        readline.question('기존 데이터를 삭제하고 새로 등록하시겠습니까? (y/n): ', (answer) => {
          readline.close();
          resolve(answer);
        });
      });

      if (answer.toLowerCase() !== 'y') {
        console.log('작업을 취소했습니다.');
        process.exit(0);
      }

      // 기존 데이터 삭제
      await Expert.deleteMany({});
      console.log('기존 데이터를 삭제했습니다.');
    }

    // 새 데이터 삽입
    const result = await Expert.insertMany(initialExperts);
    console.log(`${result.length}명의 전문가를 성공적으로 등록했습니다:`);

    result.forEach(expert => {
      console.log(`- ${expert.name} ${expert.position} (${expert.companyName})`);
    });

  } catch (error) {
    console.error('오류가 발생했습니다:', error);
  } finally {
    // 연결 종료
    await mongoose.disconnect();
    console.log('MongoDB 연결을 종료했습니다.');
  }
}

// 스크립트 실행
seedExperts();