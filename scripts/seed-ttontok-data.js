// 똔톡 샘플 데이터 생성 스크립트
// 2025년 9월 기준 팩트체크된 정책/세무 내용 포함
// 300자 이하 80%, 200자 이하 10%, 100자 이하 10%

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 환경변수 로드
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// MongoDB 연결
const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI가 설정되지 않았습니다.');
  process.exit(1);
}

// 모델 import
import TtontokPost from '../src/models/TtontokPost.js';
import TtontokReply from '../src/models/TtontokReply.js';

// 샘플 데이터
const samplePosts = [
  // 정책/지원 관련 (팩트체크된 내용)
  {
    title: '소상공인 전기료 지원 받으셨나요?',
    category: 'funding',
    content: '2025년 소상공인 전기료 지원사업 신청하셨나요? 연매출 3억원 이하면 월 최대 20만원까지 지원받을 수 있어요. 소상공인시장진흥공단 홈페이지에서 신청 가능합니다.',
    nickname: '블루베리머핀',
    tags: ['지원금', '전기료', '소상공인'],
    viewCount: 1234,
    likeCount: 45,
    replyCount: 3,
  },
  {
    title: '청년창업 지원금 1000만원 받았어요!',
    category: 'funding',
    content: '만39세 이하 창업 3년 이내면 중소벤처기업부 청년창업사관학교 지원 가능해요. 사업계획서만 잘 쓰면 최대 1억원까지! 저는 1000만원 받았어요.',
    nickname: '행복가득',
    tags: ['청년창업', '지원금'],
    viewCount: 2456,
    likeCount: 156,
    replyCount: 7,
  },
  {
    title: '4대보험료 지원 받으시나요?',
    category: 'tax',
    content: '두루누리 사회보험료 지원사업 아시나요? 10인 미만 사업장은 최대 80% 지원받을 수 있어요!', // 100자 이하
    nickname: '도시농부',
    tags: ['4대보험', '두루누리'],
    viewCount: 890,
    likeCount: 34,
    replyCount: 2,
  },

  // 고충/일상 관련
  {
    title: '오늘 비 와서 손님이 없네요',
    category: 'etc',
    content: '비 오는 날은 정말 손님이 뚝 떨어지네요. 그래도 단골손님 몇 분 오셔서 감사했어요. 다들 비 오는 날 매출 어떻게 관리하시나요?',
    nickname: '라떼한모금',
    tags: ['일상', '매출'],
    viewCount: 567,
    likeCount: 23,
    replyCount: 5,
  },
  {
    title: '상가임대차보호법 알고 계신가요?',
    category: 'legal',
    content: '상가임대차 계약갱신청구권은 10년, 임대료 인상률은 연 5% 제한이예요. 만약 부당한 요구를 받으시면 조정신청 할 수 있어요!',
    nickname: '바다소리',
    tags: ['임대차', '법률'],
    viewCount: 1890,
    likeCount: 89,
    replyCount: 12,
  },
  {
    title: '최저임금 인상 대비 어떻게 하시나요?',
    category: 'hr',
    content: '2025년 최저임금 9,860원... 인건비 부담이 커지네요. 키오스크 도입을 고민 중인데 초기 비용이 걱정입니다. 여러분은 어떻게 대비하시나요?',
    nickname: '여름바다',
    tags: ['최저임금', '인건비'],
    viewCount: 1234,
    likeCount: 45,
    replyCount: 8,
  },
  {
    title: '카페 창업 3개월차 후기',
    category: 'etc',
    content: '드디어 손익분기점 넘었어요! 하루 100잔 목표였는데 이제 평균 120잔 나가네요. 인스타 마케팅이 효과가 좋았어요.',
    nickname: '커피향기',
    tags: ['창업후기', '카페'],
    viewCount: 2100,
    likeCount: 167,
    replyCount: 15,
  },
  {
    title: '오늘 첫 매출 100만원 돌파!',
    category: 'etc',
    content: '개업 2주차인데 드디어 일매출 100만원 넘었어요! 작은 성취지만 너무 기뻐서 공유합니다.', // 100자 이하
    nickname: '봄날햇살',
    tags: ['성공', '매출'],
    viewCount: 890,
    likeCount: 234,
    replyCount: 23,
  },

  // 세무/마케팅 관련
  {
    title: '부가세 신고 꿀팁 있나요?',
    category: 'tax',
    content: '이번달 부가세 신고 기간이네요. 매입세액공제 빠뜨리기 쉬운 항목들 체크하세요! 특히 신용카드 매입세액공제 놓치지 마세요.',
    nickname: '초록물결',
    tags: ['부가세', '세무'],
    viewCount: 1567,
    likeCount: 78,
    replyCount: 9,
  },
  {
    title: 'SNS 마케팅 효과 있나요?',
    category: 'marketing',
    content: '인스타그램 릴스 시작한지 한달됐는데 팔로워 3천명 늘었어요. 실제 매출로 이어지는 것 같아요!', // 100자 이하
    nickname: '별빛산책',
    tags: ['마케팅', 'SNS'],
    viewCount: 1200,
    likeCount: 56,
    replyCount: 11,
  },
];

// 카테고리별 전문가 답변 매핑
const expertReplies = {
  // 정책자금(funding) - 기업심사관 답변
  funding: [
    {
      content: '해당 지원사업은 소상공인시장진흥공단에서 운영합니다. 신청 시 사업자등록증과 매출증빙서류가 필요해요.',
      nickname: '김철수',
      role: 'certified_examiner',
      certifiedInfo: { name: '김철수', company: '한경인증' },
    },
    {
      content: '청년창업 지원금은 만 39세 이하 창업 3년 미만 기업이 대상입니다. 평가 기준은 사업성 40%, 기술성 30%, 대표자 역량 30%입니다.',
      nickname: '박영희',
      role: 'certified_examiner',
      certifiedInfo: { name: '박영희', company: '중기평가원' },
    },
    {
      content: '두루누리 지원은 근로자 월급여 270만원 미만인 경우 신규가입자 80%, 기존가입자 50% 지원됩니다.',
      nickname: '이민수',
      role: 'certified_examiner',
      certifiedInfo: { name: '이민수', company: '고용산재보험연구원' },
    },
  ],
  // 세무(tax) - 전문가 답변
  tax: [
    {
      content: '부가세 신고 시 세금계산서 미수취분도 매입세액공제 가능합니다. 단, 신고 후 30일 이내 받아야 해요.',
      nickname: '정회계사',
      role: 'expert',
      certifiedInfo: { name: '정회계사', company: '세무법인 한빛' },
    },
    {
      content: '4대보험료는 매월 다음달 10일까지 납부해야 합니다. 연체 시 연 3%의 가산금이 부과됩니다.',
      nickname: '최세무사',
      role: 'expert',
      certifiedInfo: { name: '최세무사', company: '세무사무소 믿음' },
    },
  ],
  // 노무(hr) - 전문가 답변
  hr: [
    {
      content: '2025년 최저임금은 시급 9,860원입니다. 주휴수당 포함 시 월 209시간 기준 2,060,740원입니다.',
      nickname: '강노무사',
      role: 'expert',
      certifiedInfo: { name: '강노무사', company: '노무법인 정의' },
    },
    {
      content: '근로계약서는 반드시 서면으로 작성해야 합니다. 미작성 시 500만원 이하 벌금이 부과될 수 있어요.',
      nickname: '윤노무사',
      role: 'expert',
      certifiedInfo: { name: '윤노무사', company: '노무사사무소 평등' },
    },
  ],
  // 법무(legal) - 전문가 답변
  legal: [
    {
      content: '상가임대차보호법상 5년간 계약갱신청구권이 보장되며, 2020년 이후 계약은 10년까지 보장됩니다.',
      nickname: '조변호사',
      role: 'expert',
      certifiedInfo: { name: '조변호사', company: '법무법인 정진' },
    },
  ],
  // 일반 답변 (etc, marketing 등)
  general: [
    {
      content: '저도 비오는 날은 매출이 절반으로 떨어져요. 대신 테이크아웃 할인 이벤트를 해봤는데 효과 있더라구요.',
      nickname: '하늘바람',
      role: 'general',
    },
    {
      content: '축하드려요! 첫 목표 달성은 정말 기쁘죠. 앞으로도 잘 되실 거예요!',
      nickname: '노을빛',
      role: 'general',
    },
    {
      content: '인스타 릴스가 효과 좋아요! 저도 시작한지 2달인데 매출이 20% 늘었어요.',
      nickname: '가을단풍',
      role: 'general',
    },
  ],
};

async function seedData() {
  try {
    console.log('🔄 MongoDB 연결 중...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB 연결 성공');

    // 기존 데이터 확인
    const existingCount = await TtontokPost.countDocuments();
    if (existingCount > 0) {
      console.log(`📊 기존 데이터 ${existingCount}개 존재`);
      const answer = await new Promise((resolve) => {
        process.stdout.write('기존 데이터를 삭제하고 새로 생성하시겠습니까? (y/n): ');
        process.stdin.once('data', (data) => {
          resolve(data.toString().trim().toLowerCase());
        });
      });

      if (answer !== 'y') {
        console.log('❌ 작업 취소됨');
        process.exit(0);
      }

      // 기존 데이터 삭제
      await TtontokPost.deleteMany({});
      await TtontokReply.deleteMany({});
      console.log('✅ 기존 데이터 삭제 완료');
    }

    // 새 데이터 생성
    console.log('🔄 샘플 데이터 생성 중...');

    for (const postData of samplePosts) {
      // 게시글 생성
      const post = await TtontokPost.create(postData);
      console.log(`✅ 게시글 생성: ${post.title}`);

      // 답변이 있는 게시글에만 답변 추가
      if (postData.replyCount > 0) {
        const replyCount = Math.min(postData.replyCount, 3); // 최대 3개의 샘플 답변
        for (let i = 0; i < replyCount; i++) {
          const replyData = sampleReplies[i % sampleReplies.length];
          await TtontokReply.create({
            postId: post._id,
            ...replyData,
          });
        }
        console.log(`  → ${replyCount}개 답변 추가`);
      }
    }

    // 결과 확인
    const totalPosts = await TtontokPost.countDocuments();
    const totalReplies = await TtontokReply.countDocuments();

    console.log('\n📊 데이터 생성 완료:');
    console.log(`  - 게시글: ${totalPosts}개`);
    console.log(`  - 답변: ${totalReplies}개`);

    // 카테고리별 통계
    const categoryStats = await TtontokPost.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    console.log('\n📈 카테고리별 분포:');
    categoryStats.forEach((stat) => {
      console.log(`  - ${stat._id}: ${stat.count}개`);
    });

    // 글자수 분포 확인
    const posts = await TtontokPost.find({}, 'content');
    const lengthDistribution = posts.reduce(
      (acc, post) => {
        const length = post.content.length;
        if (length <= 100) acc.under100++;
        else if (length <= 200) acc.under200++;
        else acc.under300++;
        return acc;
      },
      { under100: 0, under200: 0, under300: 0 }
    );

    const total = posts.length;
    console.log('\n📝 글자수 분포:');
    console.log(`  - 100자 이하: ${lengthDistribution.under100}개 (${Math.round((lengthDistribution.under100 / total) * 100)}%)`);
    console.log(`  - 200자 이하: ${lengthDistribution.under200}개 (${Math.round((lengthDistribution.under200 / total) * 100)}%)`);
    console.log(`  - 300자 이하: ${lengthDistribution.under300}개 (${Math.round((lengthDistribution.under300 / total) * 100)}%)`);

  } catch (error) {
    console.error('❌ 에러 발생:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ MongoDB 연결 종료');
    process.exit(0);
  }
}

// 스크립트 실행
seedData();