/**
 * R2 이미지 URL을 안전하게 처리하는 유틸리티
 * Next.js Image 컴포넌트의 querySelector 에러 방지
 */

export function sanitizeImageUrl(url) {
  if (!url) return '';

  // 문자열이 아닌 경우 빈 문자열 반환
  if (typeof url !== 'string') return '';

  // 이스케이프 문자 제거 (백슬래시를 포함한 특수문자만 제거)
  let cleanUrl = url
    .replace(/\\"/g, '"') // \" -> " 변환
    .replace(/\\n/g, '') // \n 제거
    .replace(/\\r/g, '') // \r 제거
    .replace(/\\t/g, '') // \t 제거
    .trim();

  // URL 유효성 검사
  try {
    new URL(cleanUrl);
    return cleanUrl;
  } catch {
    // 절대 경로가 아닌 경우 그대로 반환
    return cleanUrl;
  }
}

export function isValidImageUrl(url) {
  if (!url || typeof url !== 'string') return false;

  // R2 도메인 체크
  const validDomains = [
    'pub-9f184323b8f24eb28c63d1a1410dd26a.r2.dev',
    'pub-b520cb8ed3989e8182bdb020ade36495.r2.dev',
    'images.unsplash.com',
    'localhost'
  ];

  try {
    const urlObj = new URL(url);
    return validDomains.some(domain => urlObj.hostname.includes(domain));
  } catch {
    return false;
  }
}

// Next.js Image 컴포넌트를 위한 안전한 이미지 props 생성
export function getSafeImageProps(src, alt = '') {
  const cleanSrc = sanitizeImageUrl(src);

  if (!cleanSrc) {
    return {
      src: '/images/placeholder.jpg', // 기본 이미지
      alt: alt || 'Image',
    };
  }

  return {
    src: cleanSrc,
    alt: alt || 'Image',
  };
}