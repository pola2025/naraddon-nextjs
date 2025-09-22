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

// PolicyAnalysis Schema
const PolicyAnalysisSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  thumbnail: { type: String },
  sections: [{
    id: String,
    title: String,
    content: String
  }],
  images: [{
    url: String,
    caption: String,
    name: String
  }],
  tags: [String],
  isStructured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  examiner: {
    name: String,
    companyName: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const PolicyAnalysis = mongoose.models.PolicyAnalysis || mongoose.model('PolicyAnalysis', PolicyAnalysisSchema);

const testPosts = [
  {
    title: '2025년 중소기업 정책자금 지원 확대 방안',
    category: 'government',
    excerpt: '정부가 2025년 중소기업 정책자금 지원 규모를 대폭 확대하기로 결정했습니다. 이번 지원 확대는 경제 활성화와 일자리 창출을 목표로 합니다.',
    content: `# 2025년 중소기업 정책자금 지원 확대 방안

## 주요 내용

정부는 2025년 중소기업 정책자금 지원 규모를 전년 대비 30% 확대하기로 결정했습니다. 이는 경제 활성화와 일자리 창출을 위한 핵심 정책입니다.

## 지원 대상

- 창업 7년 이내 중소기업
- 혁신성장 분야 중소기업
- 소상공인 및 자영업자

## 지원 규모

총 지원 규모는 15조원으로, 전년 대비 3조원이 증가했습니다.

### 분야별 지원 금액
- 창업자금: 5조원
- 시설자금: 4조원
- 운영자금: 6조원

## 신청 방법

온라인 신청 시스템을 통해 간편하게 신청할 수 있으며, 필요 서류도 대폭 간소화되었습니다.`,
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&q=80',
    tags: ['정책자금', '중소기업', '2025년', '정부지원'],
    isStructured: false,
    views: 1234,
    likes: 45,
    comments: 12,
    examiner: {
      name: '김정훈',
      companyName: '정책금융연구원'
    }
  },
  {
    title: 'R&D 지원금 신청 절차 및 준비사항 가이드',
    category: 'support',
    excerpt: 'R&D 지원금 신청을 준비하는 기업을 위한 상세 가이드입니다. 필요 서류부터 평가 기준까지 전 과정을 안내합니다.',
    content: `# R&D 지원금 신청 절차 및 준비사항 가이드

## 신청 자격

R&D 지원금은 기술 개발에 투자하는 중소기업을 대상으로 합니다.

## 준비 서류

1. 사업계획서
2. 기술개발계획서
3. 재무제표
4. 연구인력 현황

## 평가 기준

- 기술의 혁신성 (40%)
- 사업화 가능성 (30%)
- 기업 역량 (30%)

## 신청 일정

매년 상반기와 하반기에 각각 한 번씩 신청 기회가 있습니다.`,
    thumbnail: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=1200&q=80',
    tags: ['R&D', '지원금', '신청절차', '가이드'],
    isStructured: false,
    views: 856,
    likes: 32,
    comments: 8,
    examiner: {
      name: '이민수',
      companyName: '기술혁신지원센터'
    }
  },
  {
    title: '제조업 스마트공장 구축 지원사업 안내',
    category: 'manufacturing',
    excerpt: '제조업체의 디지털 전환을 위한 스마트공장 구축 지원사업이 시작됩니다. 최대 1억원까지 지원 가능합니다.',
    content: `# 제조업 스마트공장 구축 지원사업 안내

## 사업 개요

제조업의 경쟁력 강화를 위해 스마트공장 구축을 지원합니다.

## 지원 내용

- 스마트공장 솔루션 도입 비용
- 설비 자동화 비용
- 컨설팅 비용

## 지원 규모

기업당 최대 1억원 (자부담 30%)

## 신청 방법

스마트공장 사업관리시스템(www.smart-factory.kr)을 통해 온라인 신청`,
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80',
    tags: ['스마트공장', '제조업', '디지털전환', '지원사업'],
    isStructured: false,
    views: 623,
    likes: 28,
    comments: 5,
    examiner: {
      name: '박성준',
      companyName: '스마트제조혁신센터'
    }
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('Clearing existing policy analysis posts...');
    await PolicyAnalysis.deleteMany({});

    console.log('Inserting test posts...');
    const result = await PolicyAnalysis.insertMany(testPosts);
    console.log(`Successfully inserted ${result.length} posts`);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedDatabase();