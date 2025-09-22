// 정책소식 데이터를 미리 가져오는 유틸리티 함수
export const prefetchPolicyNews = async () => {
  try {
    // Next.js 캐시를 활용하여 미리 데이터 가져오기
    const response = await fetch('/api/policy-news?limit=4', {
      cache: 'force-cache',
      next: { revalidate: 300 } // 5분마다 재검증
    });

    if (response.ok) {
      const data = await response.json();
      // 브라우저 캐시에 저장
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('policyNewsCache', JSON.stringify({
          data,
          timestamp: Date.now()
        }));
      }
      return data;
    }
  } catch (error) {
    console.log('Prefetch policy news failed:', error);
  }
  return null;
};

// 캐시된 데이터 가져오기
export const getCachedPolicyNews = () => {
  if (typeof window === 'undefined') return null;

  const cached = sessionStorage.getItem('policyNewsCache');
  if (!cached) return null;

  try {
    const { data, timestamp } = JSON.parse(cached);
    // 5분 이내의 캐시만 사용
    if (Date.now() - timestamp < 5 * 60 * 1000) {
      return data;
    }
  } catch (error) {
    console.log('Failed to parse cached data:', error);
  }

  return null;
};