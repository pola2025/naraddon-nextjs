import { unstable_cache } from 'next/cache';
import CertifiedExaminersClient from './CertifiedExaminersClient';
import type { ExaminerProfile } from '@/components/examiners/examinerTypes';

// 캐시된 데이터 페칭 함수
const getCachedExaminers = unstable_cache(
  async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/expert-services/examiners`, {
        next: { revalidate: 600 }, // 10분 캐싱
      });

      if (!response.ok) {
        console.error('[ExaminersServer] Failed to fetch:', response.status);
        return [];
      }

      const data = await response.json();
      return Array.isArray(data?.examiners) ? data.examiners : [];
    } catch (error) {
      console.error('[ExaminersServer] Error:', error);
      return [];
    }
  },
  ['certified-examiners'], // 캐시 키
  {
    revalidate: 600, // 10분
    tags: ['examiners'],
  }
);

export default async function ExaminersServerWrapper() {
  // 서버에서 데이터 미리 페칭
  const initialExaminers = await getCachedExaminers();

  return <CertifiedExaminersClient initialExaminers={initialExaminers} />;
}