// 똔톡 샘플 데이터 생성 스크립트 - 맥락 있는 댓글 버전
// 2025년 9월 기준 팩트체크된 정책/세무 내용 포함

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

// DDonTalk 스키마 정의
const commentSchema = new mongoose.Schema({
  author: String,
  content: String,
  createdAt: { type: Date, default: Date.now }
});

const ddontalkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  company: { type: String, default: '' },
  category: {
    type: String,
    enum: ['funding', 'tax', 'hr', 'marketing', 'strategy', 'tech', 'legal', 'etc'],
    default: 'etc'
  },
  viewCount: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  comments: [commentSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const DDonTalk = mongoose.model('DDonTalk', ddontalkSchema);

// 게시글별 맥락 있는 댓글 데이터
const postsWithContextualComments = [
  {
    title: '소상공인 전기료 지원 받으셨나요?',
    category: 'funding',
    content: '2025년 소상공인 전기료 지원사업 신청하셨나요? 연매출 3억원 이하면 월 최대 20만원까지 지원받을 수 있어요. 소상공인시장진흥공단 홈페이지에서 신청 가능합니다.',
    author: '블루베리머핀',
    company: '블루베리 카페',
    viewCount: 3456,
    likes: 234,
    comments: [
      {
        author: '김태수 (기업심사관)',
        content: '전기료 지원사업은 신청 기간이 한정되어 있으니 서둘러 신청하세요. 작년 대비 지원 금액이 20% 증액되었습니다.',
        isExaminer: true
      },
      {
        author: '커피한잔',
        content: '저희 카페도 신청했는데 서류 준비가 생각보다 간단했어요. 전기료 고지서 6개월치만 있으면 돼요!'
      },
      {
        author: '양미진 (전문가)',
        content: '추가로 에너지효율 개선 설비를 설치하면 별도 지원금도 받을 수 있습니다. 중복 수혜 가능해요.',
        isExpert: true
      },
      {
        author: '빵굽는사람',
        content: '베이커리는 전기 사용량이 많아서 이런 지원 정말 도움 되네요. 정보 감사합니다!'
      },
      {
        author: '꽃집사장',
        content: '신청 완료했습니다! 홈페이지에서 10분도 안 걸렸어요.'
      }
    ]
  },
  {
    title: '청년창업 지원금 1000만원 받았어요!',
    category: 'funding',
    content: '만39세 이하 창업 3년 이내면 중소벤처기업부 청년창업사관학교 지원 가능해요. 사업계획서만 잘 쓰면 최대 1억원까지! 저는 1000만원 받았어요.',
    author: '행복가득',
    company: '행복 스튜디오',
    viewCount: 5678,
    likes: 456,
    comments: [
      {
        author: '스타트업꿈나무',
        content: '축하드려요! 저도 내년에 신청해보려는데 사업계획서 팁 좀 공유해주실 수 있나요?'
      },
      {
        author: '박성훈 (기업심사관)',
        content: '청년창업사관학교는 사업성 40%, 기술성 30%, 대표자 역량 30%로 평가합니다. 시장분석을 구체적으로 작성하세요.',
        isExaminer: true
      },
      {
        author: '행복가득',
        content: '@스타트업꿈나무 시장조사 자료를 정말 꼼꼼히 준비했어요. 경쟁사 분석이랑 차별화 전략이 중요한 것 같아요!'
      },
      {
        author: '청년사업가',
        content: '저도 작년에 받았는데 정말 큰 도움이 됐어요. 멘토링도 같이 받을 수 있어서 좋더라구요.'
      },
      {
        author: '전예진 (전문가)',
        content: '사업계획서 작성 시 재무계획은 보수적으로, 시장 전망은 현실적으로 작성하는 게 중요합니다.',
        isExpert: true
      },
      {
        author: '도전하는청년',
        content: '다음 달이 마감이네요. 서둘러 준비해야겠어요!'
      },
      {
        author: '카페창업준비',
        content: '프랜차이즈도 지원 가능한가요?'
      },
      {
        author: '행복가득',
        content: '@카페창업준비 독립창업만 가능해요. 프랜차이즈는 대상에서 제외됩니다.'
      }
    ]
  },
  {
    title: '최저임금 인상 대비 어떻게 하시나요?',
    category: 'hr',
    content: '2025년 최저임금 9,860원... 인건비 부담이 커지네요. 키오스크 도입을 고민 중인데 초기 비용이 걱정입니다. 여러분은 어떻게 대비하시나요?',
    author: '여름바다',
    company: '바다횟집',
    viewCount: 4321,
    likes: 178,
    comments: [
      {
        author: '치킨집사장',
        content: '저희는 영업시간을 조정했어요. 한가한 시간대는 아예 문을 닫고 피크타임에만 집중하니 인건비가 30% 줄었네요.'
      },
      {
        author: '이정민 (기업심사관)',
        content: '일자리안정자금을 신청하시면 인건비 부담을 줄일 수 있습니다. 30인 미만 사업장은 월 최대 7만원 지원됩니다.',
        isExaminer: true
      },
      {
        author: '편의점운영',
        content: '키오스크 도입했는데 초기비용은 부담되지만 장기적으로 보면 이득이에요. 정부 지원금도 있더라구요.'
      },
      {
        author: '최서연 (전문가)',
        content: '스마트상점 기술보급사업으로 키오스크 도입비의 최대 50%까지 지원받을 수 있습니다. 소상공인진흥공단에 문의하세요.',
        isExpert: true
      },
      {
        author: '여름바다',
        content: '좋은 정보들 감사합니다! 일자리안정자금부터 알아봐야겠네요.'
      },
      {
        author: '카페알바생',
        content: '사장님들도 힘드시겠지만 알바생들도 힘들어요ㅠㅠ 서로 상생하는 방법을 찾았으면 좋겠어요.'
      }
    ]
  },
  {
    title: '카페 창업 3개월차 후기',
    category: 'etc',
    content: '드디어 손익분기점 넘었어요! 하루 100잔 목표였는데 이제 평균 120잔 나가네요. 인스타 마케팅이 효과가 좋았어요.',
    author: '커피향기',
    company: '향기로운 카페',
    viewCount: 6789,
    likes: 567,
    comments: [
      {
        author: '예비창업자',
        content: '축하드려요! 3개월만에 손익분기점이라니 대단하세요. 초기 투자비용은 얼마나 드셨나요?'
      },
      {
        author: '커피향기',
        content: '@예비창업자 감사합니다! 임대료 보증금 포함해서 약 8천만원 정도 들었어요.'
      },
      {
        author: '디저트카페',
        content: '인스타 마케팅 구체적으로 어떻게 하셨는지 궁금해요! 릴스 위주인가요?'
      },
      {
        author: '커피향기',
        content: '@디저트카페 네! 릴스로 라떼아트 영상 올렸더니 조회수가 10만 넘어가면서 손님이 확 늘었어요.'
      },
      {
        author: '양미진 (전문가)',
        content: '초기 3개월이 가장 중요합니다. 단골 확보에 집중하시고, 메뉴 최적화를 지속적으로 하세요.',
        isExpert: true
      },
      {
        author: '베이커리카페',
        content: '저희도 인스타 시작해야겠네요. 아직 오프라인 홍보만 하고 있었는데...'
      },
      {
        author: '커피매니아',
        content: '위치가 어디신가요? 한번 방문해보고 싶네요!'
      },
      {
        author: '커피향기',
        content: '@커피매니아 강남역 5번 출구 근처예요. 놀러오세요!'
      },
      {
        author: '프랜차이즈관계자',
        content: '독립창업 멋지십니다. 앞으로도 번창하세요!'
      }
    ]
  },
  {
    title: '부가세 신고 꿀팁 있나요?',
    category: 'tax',
    content: '이번달 부가세 신고 기간이네요. 매입세액공제 빠뜨리기 쉬운 항목들 체크하세요! 특히 신용카드 매입세액공제 놓치지 마세요.',
    author: '초록물결',
    company: '물결 디자인',
    viewCount: 3456,
    likes: 234,
    comments: [
      {
        author: '세무초보',
        content: '신용카드 매입세액공제가 뭔가요? 처음 들어보네요.'
      },
      {
        author: '초록물결',
        content: '@세무초보 사업용 신용카드로 결제한 금액의 일부를 부가세에서 공제받는 거예요. 연 500만원 한도입니다.'
      },
      {
        author: '전예진 (전문가)',
        content: '간이과세자는 신용카드 매입세액공제율이 1.3%이고, 일반과세자는 1%입니다. 꼭 챙기세요.',
        isExpert: true
      },
      {
        author: '식당사장',
        content: '휴대폰 요금이랑 차량 유지비도 공제 가능한가요?'
      },
      {
        author: '김태수 (기업심사관)',
        content: '사업용으로 사용하는 비율만큼 안분해서 공제 가능합니다. 증빙자료를 잘 보관하세요.',
        isExaminer: true
      },
      {
        author: '온라인쇼핑몰',
        content: '홈택스에서 조회하니까 놓친 게 많네요. 알려주셔서 감사합니다!'
      }
    ]
  }
];

// 일반 게시글 (댓글 적은 버전)
const additionalPosts = [
  {
    title: '오늘 비 와서 손님이 없네요',
    category: 'etc',
    content: '비 오는 날은 정말 손님이 뚝 떨어지네요. 그래도 단골손님 몇 분 오셔서 감사했어요. 다들 비 오는 날 매출 어떻게 관리하시나요?',
    author: '라떼한모금',
    company: '모금 카페',
    viewCount: 1234,
    likes: 89,
    comments: [
      {
        author: '우산장수',
        content: '비오는 날 배달 할인 이벤트 해보세요. 저희는 20% 할인하니까 오히려 매출이 올랐어요.'
      },
      {
        author: '라떼한모금',
        content: '@우산장수 오 좋은 아이디어네요! 배달앱에 등록해야겠어요.'
      }
    ]
  },
  {
    title: '상가임대차보호법 알고 계신가요?',
    category: 'legal',
    content: '상가임대차 계약갱신청구권은 10년, 임대료 인상률은 연 5% 제한이예요. 만약 부당한 요구를 받으시면 조정신청 할 수 있어요!',
    author: '바다소리',
    company: '소리 북카페',
    viewCount: 2345,
    likes: 156,
    comments: [
      {
        author: '최서연 (전문가)',
        content: '2020년 이후 신규 계약은 10년 보장이지만, 그 이전 계약은 5년입니다. 계약일을 확인하세요.',
        isExpert: true
      },
      {
        author: '임대인의고민',
        content: '임대인 입장에서도 힘든 부분이 있어요. 세금이랑 관리비가 계속 오르는데...'
      },
      {
        author: '바다소리',
        content: '@임대인의고민 맞아요. 서로 상생하는 방법을 찾는 게 중요한 것 같아요.'
      }
    ]
  },
  {
    title: '오늘 첫 매출 100만원 돌파!',
    category: 'etc',
    content: '개업 2주차인데 드디어 일매출 100만원 넘었어요! 작은 성취지만 너무 기뻐서 공유합니다.',
    author: '봄날햇살',
    company: '햇살 꽃집',
    viewCount: 4567,
    likes: 789,
    comments: [
      {
        author: '응원합니다',
        content: '축하드려요! 첫 목표 달성의 기쁨 저도 기억나네요. 앞으로 쭉 대박나세요!'
      },
      {
        author: '화이팅',
        content: '2주차에 100만원이면 정말 잘하고 계신거예요! 화이팅!'
      },
      {
        author: '봄날햇살',
        content: '다들 감사합니다! 더 열심히 해야겠어요!'
      },
      {
        author: '꽃좋아',
        content: '꽃집 위치가 어디인가요? 축하 화환 주문하고 싶어요!'
      },
      {
        author: '봄날햇살',
        content: '@꽃좋아 서초동이에요! 감사합니다^^'
      }
    ]
  },
  {
    title: 'SNS 마케팅 효과 있나요?',
    category: 'marketing',
    content: '인스타그램 릴스 시작한지 한달됐는데 팔로워 3천명 늘었어요. 실제 매출로 이어지는 것 같아요!',
    author: '별빛산책',
    company: '별빛 악세사리',
    viewCount: 2345,
    likes: 234,
    comments: [
      {
        author: '마케팅고민',
        content: '릴스 편집은 어떤 앱 쓰시나요? 저는 영상 편집이 너무 어려워요.'
      },
      {
        author: '별빛산책',
        content: '@마케팅고민 캡컷이라는 무료 앱 써요! 초보자도 쉽게 할 수 있어요.'
      },
      {
        author: 'SNS전문가',
        content: '꾸준함이 가장 중요해요. 매일 업로드하면 알고리즘이 밀어줍니다.'
      }
    ]
  },
  {
    title: '4대보험료 지원 받으시나요?',
    category: 'tax',
    content: '두루누리 사회보험료 지원사업 아시나요? 10인 미만 사업장은 최대 80% 지원받을 수 있어요!',
    author: '도시농부',
    company: '농부 마켓',
    viewCount: 1567,
    likes: 123,
    comments: [
      {
        author: '박성훈 (기업심사관)',
        content: '근로자 월급여 270만원 미만인 경우만 해당됩니다. 신규가입자는 80%, 기존가입자는 50% 지원이에요.',
        isExaminer: true
      },
      {
        author: '도시농부',
        content: '자세한 설명 감사합니다! 바로 신청해봐야겠네요.'
      }
    ]
  }
];

async function seedData() {
  try {
    console.log('🔄 MongoDB 연결 중...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB 연결 성공');

    // 기존 데이터 확인
    const existingCount = await DDonTalk.countDocuments();
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
      await DDonTalk.deleteMany({});
      console.log('✅ 기존 데이터 삭제 완료');
    }

    // 날짜 생성 헬퍼 함수
    const getRandomDate = (daysAgo) => {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
      date.setHours(Math.floor(Math.random() * 24));
      date.setMinutes(Math.floor(Math.random() * 60));
      return date;
    };

    // 베스트 게시글 생성 (맥락 있는 댓글 포함)
    console.log('🔄 베스트 게시글 생성 중...');
    for (const postData of postsWithContextualComments) {
      const baseDate = getRandomDate(30);

      // 댓글 처리 - isExaminer/isExpert 플래그 제거하고 author만 유지
      const processedComments = postData.comments.map((comment, index) => ({
        author: comment.author,
        content: comment.content,
        createdAt: new Date(baseDate.getTime() + (index + 1) * 3600000) // 1시간씩 차이
      }));

      const post = await DDonTalk.create({
        ...postData,
        comments: processedComments,
        createdAt: baseDate,
        updatedAt: baseDate
      });

      console.log(`✅ 베스트 게시글 생성: ${post.title} (댓글 ${processedComments.length}개)`);
    }

    // 일반 게시글 생성
    console.log('🔄 일반 게시글 생성 중...');
    for (const postData of additionalPosts) {
      const baseDate = getRandomDate(60);

      const processedComments = postData.comments.map((comment, index) => ({
        author: comment.author,
        content: comment.content,
        createdAt: new Date(baseDate.getTime() + (index + 1) * 7200000) // 2시간씩 차이
      }));

      const post = await DDonTalk.create({
        ...postData,
        comments: processedComments,
        createdAt: baseDate,
        updatedAt: baseDate
      });

      console.log(`✅ 일반 게시글 생성: ${post.title} (댓글 ${processedComments.length}개)`);
    }

    // 결과 확인
    const totalPosts = await DDonTalk.countDocuments();
    const postsWithComments = await DDonTalk.find({ 'comments.0': { $exists: true } });
    const totalComments = postsWithComments.reduce((sum, post) => sum + post.comments.length, 0);

    console.log('\n📊 데이터 생성 완료:');
    console.log(`  - 총 게시글: ${totalPosts}개`);
    console.log(`  - 총 댓글: ${totalComments}개`);
    console.log(`  - 베스트 게시글: ${postsWithContextualComments.length}개`);
    console.log(`  - 일반 게시글: ${additionalPosts.length}개`);

    // 카테고리별 통계
    const categoryStats = await DDonTalk.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📈 카테고리별 분포:');
    const categoryLabels = {
      funding: '자금',
      tax: '세무',
      hr: '노무',
      marketing: '마케팅',
      strategy: '전략',
      tech: '기술',
      legal: '법무',
      etc: '기타'
    };

    categoryStats.forEach((stat) => {
      console.log(`  - ${categoryLabels[stat._id] || stat._id}: ${stat.count}개`);
    });

    // 댓글 작성자 통계
    const examinerComments = postsWithComments.reduce((sum, post) =>
      sum + post.comments.filter(c => c.author.includes('기업심사관')).length, 0
    );
    const expertComments = postsWithComments.reduce((sum, post) =>
      sum + post.comments.filter(c => c.author.includes('전문가')).length, 0
    );
    const generalComments = totalComments - examinerComments - expertComments;

    console.log('\n💬 댓글 작성자 분포:');
    console.log(`  - 기업심사관: ${examinerComments}개`);
    console.log(`  - 전문가: ${expertComments}개`);
    console.log(`  - 일반 사용자: ${generalComments}개`);

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