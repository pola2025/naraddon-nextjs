require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// MongoDB 연결
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB 연결 성공');
  } catch (error) {
    console.error('MongoDB 연결 실패:', error);
    process.exit(1);
  }
};

// DDonTalk 스키마 정의 (JavaScript용)
const DDonTalkCommentSchema = new mongoose.Schema({
  author: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const DDonTalkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  company: { type: String, required: true },
  category: { type: String, required: true },
  viewCount: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  comments: [DDonTalkCommentSchema]
}, {
  timestamps: true
});

const DDonTalk = mongoose.model('DDonTalk', DDonTalkSchema);

// 날짜 생성 헬퍼 함수 (7월~9월 사이 랜덤)
const getRandomDate = () => {
  const start = new Date('2025-07-01');
  const end = new Date('2025-09-30');
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// 댓글 날짜 생성 (게시글 이후)
const getCommentDate = (postDate) => {
  const now = new Date();
  const diff = now.getTime() - postDate.getTime();
  return new Date(postDate.getTime() + Math.random() * diff);
};

// 시드 데이터
const seedData = async () => {
  try {
    // 기존 데이터 삭제
    await DDonTalk.deleteMany({});
    console.log('기존 DDonTalk 데이터 삭제 완료');

    const posts = [
      {
        title: '소상공인 전기료 지원 팁',
        content: '2025년 소상공인 전기료 지원사업 알고 계신가요? 연매출 3억원 이하 소상공인이라면 월 최대 20만원까지 전기료를 지원받을 수 있습니다! 소상공인시장진흥공단 홈페이지에서 온라인으로 간편하게 신청 가능하며, 사업자등록증과 전기요금 고지서만 준비하시면 됩니다. 저는 작년부터 지원받아서 매달 15만원씩 절약하고 있어요. 아직 신청 안 하신 분들은 서둘러 신청하세요!',
        author: '블루베리머핀',
        company: '카페 블루베리',
        category: 'funding',
        viewCount: 1234,
        likes: 45,
        createdAt: getRandomDate()
      },
      {
        title: '청년창업 지원금 1000만원 받았어요!',
        content: '만39세 이하 창업 3년 이내면 중소벤처기업부 청년창업사관학교 지원 가능해요. 사업계획서 작성이 처음엔 막막했지만 창업진흥원 홈페이지에 있는 가이드라인 따라서 차근차근 작성했더니 1차 서류 통과했고, 2차 면접에서도 좋은 평가 받았습니다. 특히 시장분석과 경쟁력 부분을 구체적으로 작성하는게 중요한 것 같아요. 지원금 외에도 멘토링과 네트워킹 기회가 정말 도움이 많이 됩니다.',
        author: '행복가득',
        company: '디자인 스튜디오',
        category: 'funding',
        viewCount: 2456,
        likes: 156,
        createdAt: getRandomDate()
      },
      {
        title: '두루누리 4대보험료 지원 정보',
        content: '10인 미만 사업장 대상 두루누리 사회보험료 지원받고 계신가요? 신규가입자는 80%, 기존가입자는 50%까지 지원받을 수 있어요. 월급 220만원 미만 근로자가 대상이고, 근로복지공단 홈페이지에서 온라인으로 간편하게 신청 가능합니다. 저희 가게는 직원 3명인데 매달 60만원씩 절약하고 있어요. 두루누리 지원받지 않으면 정말 손해입니다!',
        author: '도시농부',
        company: '유기농 마트',
        category: 'tax',
        viewCount: 890,
        likes: 34,
        createdAt: getRandomDate()
      },
      {
        title: '첫 직원 채용 시 알아야 할 노무 팁',
        content: '처음으로 직원을 채용하려는데 근로계약서 작성부터 4대보험 가입까지 너무 복잡하더라고요. 고용노동부 홈페이지에서 표준근로계약서 양식 다운받아서 작성했고, 4대보험 정보연계센터에서 한번에 처리했어요. 최저시급 확인하고, 주휴수당도 꼭 계산해야 합니다. 처음엔 어려웠지만 한 번 해보니 그 다음부터는 쉽더라고요.',
        author: '바다소리',
        company: '해산물 전문점',
        category: 'hr',
        viewCount: 1567,
        likes: 67,
        createdAt: getRandomDate()
      },
      {
        title: '네이버 스마트스토어 수수료 절약 팁',
        content: '네이버 스마트스토어 운영하시는 분들 수수료 부담 크시죠? 쿠폰 지원센터 활용하면 판매수수료 일부 환급받을 수 있어요. 또 네이버페이 적립금 활용하면 구매전환율도 높아지고 단골 고객도 늘어납니다. 상품 등록할 때 SEO 최적화도 중요한데, 키워드는 3-4개 정도가 적당한 것 같아요.',
        author: '달빛고양이',
        company: '펫용품 스토어',
        category: 'marketing',
        viewCount: 1890,
        likes: 89,
        createdAt: getRandomDate()
      },
      {
        title: '소규모 카페 매출 2배 늘린 방법',
        content: '동네 작은 카페 운영 중인데 SNS 마케팅으로 매출이 2배 늘었어요. 인스타그램에 매일 신메뉴 사진 올리고, 해시태그는 지역명+카페 조합으로 15개 정도 사용합니다. 단골 고객 대상 스탬프 이벤트도 효과적이었고, 배달앱보다는 직접 픽업 할인이 수익률이 더 좋더라고요. 무엇보다 꾸준함이 제일 중요한 것 같아요.',
        author: '봄날햇살',
        company: '햇살 카페',
        category: 'marketing',
        viewCount: 3200,
        likes: 234,
        createdAt: getRandomDate()
      },
      {
        title: '부가세 신고 실수하지 않는 법',
        content: '첫 부가세 신고할 때 실수했던 경험 공유합니다. 매입세액공제 받으려면 세금계산서 꼭 발급받아야 하고, 신용카드 매출은 자동으로 국세청에 신고되니 빠뜨리지 마세요. 홈택스에서 예정신고, 확정신고 기간 확인하고 미리 준비하면 벌금 안 내요. 세무사 비용이 부담되면 국세청 무료 상담 전화도 활용해보세요.',
        author: '가을하늘',
        company: '의류 쇼핑몰',
        category: 'tax',
        viewCount: 2100,
        likes: 112,
        createdAt: getRandomDate()
      },
      {
        title: '임대차 계약 시 주의사항',
        content: '상가 임대차 계약할 때 권리금 보호받으려면 임대차보호법 꼭 확인하세요. 계약서에 권리금 명시하고, 확정일자 받는 것도 중요해요. 보증금은 최대한 적게, 월세는 협상 가능합니다. 주변 상권 분석도 필수고, 유동인구 확인은 평일/주말 다르게 체크해야 해요. 급하게 계약하지 말고 충분히 검토하세요.',
        author: '초록물결',
        company: '플라워샵',
        category: 'legal',
        viewCount: 1450,
        likes: 78,
        createdAt: getRandomDate()
      }
    ];

    // 각 게시글에 댓글 추가
    const savedPosts = [];
    for (const post of posts) {
      // 5-6개 사이의 랜덤 댓글 생성
      const commentCount = 5 + Math.floor(Math.random() * 2);
      const comments = [];

      // 일반 사용자 닉네임 목록
      const nicknames = [
        '햇살가득', '별빛산책', '구름나그네', '바람소리', '가을단풍',
        '여름바다', '겨울눈', '봄꽃향기', '달빛고양이', '무지개다리',
        '푸른하늘', '따뜻한차', '시원한바람', '노을빛', '새벽이슬'
      ];

      // 댓글 템플릿
      const generalComments = [
        '좋은 정보 감사합니다!',
        '저도 비슷한 경험이 있어요. 도움이 많이 됐습니다.',
        '자세한 설명 감사합니다. 바로 적용해보겠습니다.',
        '이런 정보 정말 필요했는데 감사해요!',
        '꿀팁 감사합니다. 저장해두고 참고하겠습니다.',
        '실무에 바로 적용 가능한 내용이네요.',
        '상세한 설명 덕분에 이해가 쉬웠어요.',
        '공유해주셔서 감사합니다. 많은 도움이 되었어요.',
        '정말 유용한 정보네요!',
        '덕분에 문제를 해결했습니다. 감사해요!'
      ];

      for (let i = 0; i < commentCount; i++) {
        // 첫 번째 댓글은 기업심사관 또는 전문가
        if (i === 0 && Math.random() > 0.5) {
          // 기업심사관
          const examiners = [
            { name: '김태수', company: '비즈레스큐' },
            { name: '박성훈', company: '비즈스카이' },
            { name: '이정민', company: '컨설팅그룹' }
          ];
          const examiner = examiners[Math.floor(Math.random() * examiners.length)];
          comments.push({
            author: `${examiner.name} ${examiner.company}`,
            content: '좋은 정보 감사합니다. 추가로 문의사항 있으시면 연락주세요.',
            createdAt: getCommentDate(post.createdAt)
          });
        } else if (i === 1 && Math.random() > 0.5) {
          // 전문가
          const experts = [
            { name: '양미진', company: 'SJ컨설팅' },
            { name: '전예진', company: '비젠솔루션' },
            { name: '최서연', company: '전략연구소' }
          ];
          const expert = experts[Math.floor(Math.random() * experts.length)];
          comments.push({
            author: `${expert.name} ${expert.company}`,
            content: '전문가 입장에서 조언드리면, 이 부분도 함께 확인해보시면 좋을 것 같습니다.',
            createdAt: getCommentDate(post.createdAt)
          });
        } else {
          // 일반 사용자
          const nickname = nicknames[Math.floor(Math.random() * nicknames.length)];
          const comment = generalComments[Math.floor(Math.random() * generalComments.length)];
          comments.push({
            author: nickname,
            content: comment,
            createdAt: getCommentDate(post.createdAt)
          });
        }
      }

      const newPost = new DDonTalk({
        ...post,
        comments: comments.sort((a, b) => a.createdAt - b.createdAt)
      });

      savedPosts.push(await newPost.save());
    }

    console.log(`✅ ${savedPosts.length}개의 DDonTalk 게시글 생성 완료`);

    // 생성된 데이터 요약
    for (const post of savedPosts) {
      console.log(`- "${post.title}" [${post.category}]: ${post.comments.length}개 댓글, 조회수: ${post.viewCount}`);
    }

  } catch (error) {
    console.error('시드 데이터 생성 실패:', error);
    process.exit(1);
  }
};

// 실행
const run = async () => {
  await connectDB();
  await seedData();
  await mongoose.disconnect();
  console.log('✅ 시드 작업 완료 및 연결 종료');
  process.exit(0);
};

run();