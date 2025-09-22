import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// DDonTalk 스키마 정의 (모델 파일이 TypeScript이므로 여기서 정의)
const DDonTalkCommentSchema = new mongoose.Schema({
  author: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const DDonTalkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true, maxlength: 200 },
  author: { type: String, required: true },
  company: { type: String, required: true },
  likes: { type: Number, default: 0 },
  comments: [DDonTalkCommentSchema]
}, {
  timestamps: true
});

const DDonTalk = mongoose.model('DDonTalk', DDonTalkSchema);

// 2024년 7월~9월 사이의 랜덤 날짜 생성 함수
function getRandomDate() {
  const start = new Date('2024-07-01');
  const end = new Date('2024-09-30');
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTime);
}

// 댓글 날짜 생성 (게시글 날짜 이후 ~ 9월 30일 사이)
function getCommentDate(postDate) {
  const end = new Date('2024-09-30');
  const randomTime = postDate.getTime() + Math.random() * (end.getTime() - postDate.getTime());
  return new Date(randomTime);
}

// 게시글 데이터 생성
const postsWithDates = [];
const postData = [
  {
    title: '나라똔 덕분에 R&D 과제 선정됐어요! 정말 감사합니다',
    content: '처음엔 R&D 과제 신청이 너무 막막했는데, 나라똔에서 단계별로 친절하게 안내해주셔서 무사히 선정될 수 있었습니다. 특히 사업계획서 작성 팁과 평가 기준 분석이 큰 도움이 되었어요. 앞으로도 계속 이용할 예정입니다!',
    author: '김○○ 대표',
    company: '테크스타트',
    likes: 24,
    baseComments: [
      { author: '박○○', content: '축하드려요! 저도 신청 준비중인데 팁 부탁드려요' },
      { author: '이○○', content: '우와 대단하시네요! 어떤 과제 선정되셨나요?' },
      { author: '최○○', content: '나라똔 정말 좋은 것 같아요. 저도 상담 받아봐야겠네요' }
    ]
  },
  {
    title: '세무 상담 받고 절세 효과 월 200만원! 완전 대만족',
    content: '제조업 하면서 세금이 항상 부담이었는데, 나라똔 전문가님이 우리 회사에 맞는 절세 방법을 찾아주셨어요. 중소기업 특별세액감면부터 연구인력개발비 세액공제까지, 놓치고 있던 부분이 많았네요. 덕분에 월 200만원 절세 효과 봤습니다!',
    author: '이○○ 사장',
    company: '제조업체',
    likes: 18,
    baseComments: [
      { author: '정○○', content: '와 월 200만원이면 연간 2400만원이네요!' },
      { author: '김○○', content: '어떤 전문가님께 상담받으셨나요? 저도 연결 부탁드려요' }
    ]
  },
  {
    title: '수출바우처 신청했는데 3주만에 승인났네요',
    content: '해외 진출 준비하면서 수출바우처 신청했는데 생각보다 빨리 승인이 났어요! 나라똔에서 알려준 대로 서류 준비하니까 한 번에 통과됐습니다. 마케팅이랑 전시회 참가 비용 지원받을 수 있어서 정말 다행이에요.',
    author: '박○○ 대표',
    company: '무역회사',
    likes: 15,
    baseComments: [
      { author: '윤○○', content: '수출바우처 얼마나 지원받으셨나요?' },
      { author: '장○○', content: '저도 신청하려는데 필요 서류가 많나요?' },
      { author: '신○○', content: '3주면 정말 빠른 편이네요! 축하드립니다' },
      { author: '조○○', content: '어느 지역에서 신청하셨나요?' }
    ]
  },
  {
    title: '벤처기업 인증 받고 세제혜택까지, 일석이조!',
    content: '벤처기업 인증 절차가 복잡할 줄 알았는데, 나라똔 가이드 따라하니 쉽게 진행됐어요. 인증 받고 나니 법인세 감면이랑 각종 정책자금 우대까지 받을 수 있더라구요. 특히 신용보증 한도 우대가 정말 도움됩니다.',
    author: '최○○ 사장',
    company: '소프트웨어',
    likes: 12,
    baseComments: [
      { author: '강○○', content: '벤처인증 준비 기간은 얼마나 걸리셨나요?' }
    ]
  },
  {
    title: '나라똔 전문가 상담 정말 꼼꼼하고 친절해요',
    content: '바이오 스타트업 운영하면서 정부지원사업 정보가 너무 부족했는데, 나라똔 전문가님이 우리 업종에 맞는 사업들 하나하나 설명해주셨어요. 심지어 신청 일정까지 캘린더로 정리해서 보내주시더라구요. 이런 서비스 처음이에요!',
    author: '정○○ 대표',
    company: '바이오업체',
    likes: 9,
    baseComments: [
      { author: '한○○', content: '바이오 쪽 지원사업 많나요?' },
      { author: '오○○', content: '전문가 상담 비용은 어느정도인가요?' }
    ]
  },
  {
    title: '정부지원금 신청 과정이 이렇게 쉬울 줄 몰랐어요',
    content: '스타트업 운영 3년차인데 이제야 정부지원금 신청해봤네요. 나라똔에서 제공하는 체크리스트랑 템플릿 덕분에 서류 준비가 정말 수월했어요. 특히 사업계획서 샘플이 큰 도움이 됐습니다. 다음 공고도 도전해볼 예정이에요!',
    author: '윤○○ 사장',
    company: '스타트업',
    likes: 16,
    baseComments: [
      { author: '서○○', content: '어떤 지원사업 신청하셨나요?' },
      { author: '권○○', content: '템플릿은 어디서 받을 수 있나요?' },
      { author: '나○○', content: '저도 3년차인데 이제 시작해야겠네요' }
    ]
  },
  {
    title: '청년창업지원 받을 수 있을지 몰랐는데 성공했어요',
    content: 'IT솔루션 개발하면서 자금이 부족했는데, 나라똔에서 청년창업사관학교 추천해주셔서 지원받게 됐어요. 사업화 자금 1억원에 사무공간, 멘토링까지! 나이 제한 때문에 포기했었는데 만 39세까지 가능하더라구요. 정말 감사합니다!',
    author: '장○○ 대표',
    company: 'IT솔루션',
    likes: 21,
    baseComments: [
      { author: '임○○', content: '청년창업사관학교 경쟁률 높지 않나요?' },
      { author: '백○○', content: '1억원 지원이면 정말 좋네요!' },
      { author: '도○○', content: '저도 39세인데 도전해봐야겠어요' },
      { author: '황○○', content: '멘토링 프로그램도 좋나요?' },
      { author: '문○○', content: '축하드려요! 어떤 아이템으로 선정되셨나요?' }
    ]
  },
  {
    title: '인증심사관님이 정말 세심하게 도와주셨어요',
    content: '유통업 ISO 인증 준비하면서 막막했는데, 나라똔 심사관님이 현장 방문해서 꼼꼼히 체크해주셨어요. 부족한 부분 개선방안까지 제시해주시고, 인증 통과할 때까지 계속 피드백 주셔서 무사히 인증 받았습니다. 프로페셔널하시면서도 정말 친절하세요!',
    author: '신○○ 사장',
    company: '유통업체',
    likes: 14,
    baseComments: [
      { author: '주○○', content: 'ISO 인증 준비 기간 얼마나 걸리셨어요?' },
      { author: '송○○', content: '비용은 많이 드나요?' },
      { author: '유○○', content: '유통업 ISO 인증 필수인가요?' }
    ]
  }
];

// 날짜를 추가하여 최종 데이터 생성
postData.forEach(post => {
  const postDate = getRandomDate();
  const comments = post.baseComments ? post.baseComments.map(comment => ({
    ...comment,
    createdAt: getCommentDate(postDate)
  })) : [];

  postsWithDates.push({
    ...post,
    comments,
    createdAt: postDate,
    updatedAt: postDate
  });
  delete postsWithDates[postsWithDates.length - 1].baseComments;
});

const ddonTalkData = postsWithDates;

async function initDDonTalk() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB 연결 성공');

    // 기존 데이터 삭제
    await DDonTalk.deleteMany({});
    console.log('기존 DDonTalk 데이터 삭제 완료');

    // 새 데이터 삽입
    const posts = await DDonTalk.insertMany(ddonTalkData);
    console.log(`${posts.length}개의 DDonTalk 게시글 생성 완료`);

    // 생성된 데이터 확인
    const count = await DDonTalk.countDocuments();
    console.log(`총 ${count}개의 게시글이 데이터베이스에 있습니다.`);

    await mongoose.connection.close();
    console.log('데이터베이스 연결 종료');
  } catch (error) {
    console.error('에러 발생:', error);
    process.exit(1);
  }
}

initDDonTalk();