import { Metadata } from 'next';
import ExaminersServerWrapper from './ExaminersServerWrapper';

export const metadata: Metadata = {
  title: '인증 기업심사관 | 나라똔',
  description: '나라똔에서 100% 보증하는 인증 정책전문가 인증기업심사관이 대표님들의 맞춤 솔루션을 완성합니다.',
  openGraph: {
    title: '인증 기업심사관 | 나라똔',
    description: '정책자금·인증·수출·제조혁신 분야별 전문가와 함께하는 맞춤형 정책자금 전략',
    type: 'website',
  },
};

// 정적 페이지로 생성
export const dynamic = 'force-static';
export const revalidate = 600; // 10분마다 재생성

export default function CertifiedExaminersPage() {
  return <ExaminersServerWrapper />;
}