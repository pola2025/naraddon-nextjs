# 정책분석 페이지 모바일 최적화 기획안

## 📋 현재 상태 분석

### 구조
- **컴포넌트**: `PolicyAnalysis.js` (React 컴포넌트)
- **스타일**: `PolicyAnalysis.css`
- **레이아웃**: 2단 그리드 구조 (데스크톱), 1단 구조 (모바일)

### 주요 섹션
1. **Hero 섹션**: 페이지 상단 소개 영역
2. **정책소식 섹션**: PolicyNewsSection 컴포넌트 활용
3. **검색 섹션**: 중앙 정렬된 검색 박스
4. **메인 콘텐츠**:
   - 왼쪽: TOP 5 베스트 정책분석 (롤링 슬라이드)
   - 오른쪽: 최신 정책분석 목록

## 🔍 모바일 문제점 식별

### 1. 롤링 슬라이드 영역
- **현재 상태**:
  - 모바일에서 높이 380px 고정
  - 좌우 컨트롤 버튼 숨김 처리됨
  - 스와이프 기능 미구현 (안내 텍스트만 표시)
- **문제점**:
  - 실제 터치 스와이프 기능 없음
  - 콘텐츠 높이가 고정되어 다양한 화면 크기 대응 부족
  - 이미지/텍스트 비율 최적화 필요

### 2. 카테고리 필터
- **문제점**:
  - 모바일에서 가로 스크롤 처리 미흡
  - 터치 영역이 작음
  - 선택된 카테고리 표시가 불명확

### 3. 게시글 카드
- **현재 상태**:
  - 모바일에서 1열로 표시
  - 이미지 크기 조정됨
- **문제점**:
  - 카드 간격이 좁음
  - 메타 정보(작성자, 날짜 등) 가독성 저하
  - 터치 영역 최적화 필요

### 4. 검색 박스
- **문제점**:
  - 모바일 키보드 활성화 시 레이아웃 깨짐
  - 검색 아이콘 위치 조정 필요

### 5. 색상 대비 및 가독성 ⚠️
- **심각한 문제**:
  - `.list-item` 배경색 `#f8f9fa` (연한 회색)
  - `.grid-item` 배경색 `#f8f9fa` (연한 회색)
  - `.item-excerpt` 글자색 `#666` (진한 회색)
  - 메타 정보 글자색 `#999` (회색)
- **문제점**:
  - 회색 배경에 회색 글자로 대비율이 매우 낮음
  - WCAG 2.1 AA 기준 미달 (최소 대비율 4.5:1 필요)
  - 특히 모바일 환경에서 햇빛 아래 가독성 심각하게 저하
  - 시력이 약한 사용자 접근성 문제

## 💡 개선 방안

### 1. 터치 스와이프 구현
```javascript
// 터치 이벤트 핸들러 추가
const handleTouchStart = (e) => {
  touchStartX = e.touches[0].clientX;
};

const handleTouchEnd = (e) => {
  const touchEndX = e.changedTouches[0].clientX;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) > 50) {
    if (diff > 0) nextSlide();
    else prevSlide();
  }
};
```

### 2. 반응형 높이 설정
```css
@media (max-width: 768px) {
  .analysis-main-rolling {
    height: min(60vh, 400px);
    max-height: 400px;
  }
}
```

### 3. 카테고리 필터 개선
```css
.category-filter {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding: 4px 0 12px;
}

.category-filter::-webkit-scrollbar {
  display: none;
}

.category-btn {
  flex-shrink: 0;
  padding: 10px 20px;
  min-height: 44px; /* 터치 영역 최소 크기 */
}
```

### 4. 게시글 카드 최적화
```css
@media (max-width: 768px) {
  .post-card {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    margin-bottom: 16px;
    min-height: auto;
  }

  .post-card-image {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }

  .post-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    font-size: 0.875rem;
  }
}
```

### 5. 검색 박스 개선
```css
@media (max-width: 768px) {
  .search-box {
    position: relative;
    z-index: 10;
  }

  .search-box input {
    font-size: 16px; /* iOS 자동 줌 방지 */
    padding: 16px 20px 16px 48px;
  }
}
```

### 6. 색상 대비 개선 (가독성 향상)
```css
/* 배경색 개선 - 회색 배경을 흰색 또는 더 밝은 색으로 */
.list-item {
  background: #ffffff; /* 흰색 배경 */
  border: 1px solid #e5e7eb; /* 경계선으로 구분 */
}

.grid-item {
  background: #ffffff;
  border: 1px solid #e5e7eb;
}

/* 텍스트 색상 개선 - 더 진한 색상으로 대비 향상 */
.item-excerpt {
  color: #374151; /* 진한 회색 (기존 #666 → #374151) */
  font-weight: 400;
}

.item-meta,
.grid-meta {
  color: #6b7280; /* 중간 회색 (기존 #999 → #6b7280) */
}

/* 호버 상태 개선 */
.list-item:hover {
  background: #f9fafb; /* 매우 연한 회색 */
  border-color: #4ade80; /* 초록색 테두리 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 모바일 최적화 - 폰트 크기 증가 */
@media (max-width: 768px) {
  .item-excerpt {
    font-size: 14px; /* 13px → 14px */
    line-height: 1.5;
    color: #1f2937; /* 더 진한 색상 */
  }

  .item-meta {
    font-size: 12px; /* 11px → 12px */
    color: #4b5563;
  }

  /* 터치 영역 최적화 */
  .list-item {
    min-height: 110px;
    padding: 14px;
  }
}
```

## 📱 구현 우선순위

### Phase 1 (즉시 적용) 🚨
1. **색상 대비 개선** (최우선)
   - 회색 배경을 흰색으로 변경
   - 텍스트 색상을 더 진하게 조정
   - WCAG 2.1 AA 기준 충족 (4.5:1 이상)
2. ✅ CSS 미디어 쿼리 개선
3. ✅ 터치 영역 최소 크기 보장 (44px)
4. ✅ 폰트 크기 및 간격 조정

### Phase 2 (단기)
1. 터치 스와이프 기능 구현
2. 카테고리 필터 가로 스크롤 개선
3. 로딩 상태 및 스켈레톤 UI 추가

### Phase 3 (중기)
1. 무한 스크롤 구현
2. 필터링 애니메이션 추가
3. 오프라인 지원 (PWA)

## 🎯 성능 목표

- **LCP (Largest Contentful Paint)**: < 2.5초
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **터치 반응 시간**: < 100ms

## 📊 테스트 체크리스트

### 디바이스별 테스트
- [ ] iPhone SE (375px)
- [ ] iPhone 12/13 (390px)
- [ ] Samsung Galaxy S21 (360px)
- [ ] iPad Mini (768px)

### 기능 테스트
- [ ] 터치 스와이프 동작
- [ ] 카테고리 필터 스크롤
- [ ] 검색 기능
- [ ] 무한 스크롤
- [ ] 이미지 로딩
- [ ] 네트워크 오프라인 처리

### 접근성 테스트
- [ ] 스크린 리더 호환성
- [ ] 키보드 네비게이션
- [ ] 색상 대비
- [ ] 터치 타겟 크기

## 🚀 구현 일정

- **Week 1**: CSS 개선 및 기본 모바일 최적화
- **Week 2**: 터치 인터랙션 구현
- **Week 3**: 성능 최적화 및 테스트
- **Week 4**: 배포 및 모니터링

## 📝 참고사항

- 모든 변경사항은 점진적으로 적용
- A/B 테스트를 통한 사용자 반응 측정
- 성능 메트릭 지속적 모니터링
- 사용자 피드백 수집 및 반영