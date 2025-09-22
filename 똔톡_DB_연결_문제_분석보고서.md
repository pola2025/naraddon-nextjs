# 똔톡 게시글 DB 연결 문제 분석 보고서

## 1. 문제 상황
사업자 목소리 똔톡 게시글이 사용자 화면에서 게시글 목록 클릭 시 DB와 연결되지 않는 문제 발생

## 2. 원인 분석

### 2.1 API 엔드포인트 불일치
현재 코드베이스에 **3개의 서로 다른 API 경로**가 혼재하고 있음:

1. **`/api/business-voice/ttontok`** - business-voice 서브디렉토리 (MongoDB 스키마: TtontokPost)
2. **`/api/ttontok/posts`** - ttontok 직접 경로 (MongoDB 스키마: TtontokPost - 다른 필드 구조)
3. **`/api/ttontok/posts/[id]`** - 개별 게시글 조회용

### 2.2 프론트엔드 컴포넌트 충돌

#### A. `src/app/ttontok/page.tsx` (메인 게시판)
- API 호출: `/api/ttontok/posts`
- 필드 구조: `_id`, `category`, `title`, `content`, `nickname`, `isAnonymous`, `businessType`, `region`, `yearsInBusiness`, `likes`, `comments`, `views`

#### B. `src/components/business-voice/TtontokListBoard.tsx` (컴팩트 뷰)
- API 호출: `/api/ttontok/posts`
- 필드 구조: `_id`, `title`, `content`, `category`, `nickname`, `viewCount`, `likeCount`, `replyCount`
- 링크 경로 오류: `/ddontalk/${post._id}` (오타)

### 2.3 데이터 모델 불일치

**TtontokPost 모델 (business-voice)**:
```typescript
{
  title, category, content, nickname,
  viewCount, likeCount, replyCount,
  tags, isPinned, isArchived, memberId
}
```

**실제 사용 중인 필드 (ttontok/posts)**:
```typescript
{
  title, category, content, nickname,
  isAnonymous, businessType, region,
  yearsInBusiness, likes, comments, views
}
```

### 2.4 응답 데이터 구조 불일치
- `TtontokListBoard.tsx`는 `data.success` 체크하지만, 실제 API는 `{ posts: [...] }` 반환
- 데이터가 없을 때 목업 데이터 표시되지만, 실제 DB 연결은 실패

## 3. 해결 방안

### 3.1 단기 해결책 (즉시 적용 가능)

1. **TtontokListBoard.tsx 수정**:
   - API 응답 처리 로직 수정: `data.success` → `data.posts`
   - 링크 경로 수정: `/ddontalk/${post._id}` → `/ttontok/${post._id}`
   - 필드명 매핑 수정

2. **API 응답 표준화**:
   - `/api/business-voice/ttontok/route.ts` 응답 형식을 `/api/ttontok/posts`와 일치시킴

### 3.2 중장기 해결책 (권장)

1. **API 통합**:
   - business-voice와 ttontok API를 하나로 통합
   - 중복 제거 및 단일 엔드포인트 사용

2. **데이터 모델 정리**:
   - TtontokPost 스키마 확장하여 모든 필드 포함
   - 기존 데이터 마이그레이션

3. **컴포넌트 리팩토링**:
   - 공통 타입 정의 파일 생성
   - API 클라이언트 함수 별도 분리

## 4. 즉시 적용 가능한 코드 수정

### 4.1 TtontokListBoard.tsx 수정 필요 사항:
```typescript
// 50번 줄 수정
const response = await fetch('/api/business-voice/ttontok');

// 52번 줄 수정
if (data.items) {  // success → items 변경

// 115번 줄 수정
setPosts(data.items?.length > 0 ? data.items : mockPosts);

// 182번 줄 수정
<Link href={`/ttontok/${post._id || post.id}`} className="ttontok-title-link">
```

### 4.2 필드명 매핑:
- `viewCount` ↔ `views`
- `likeCount` ↔ `likes`
- `replyCount` ↔ `comments`

## 5. 테스트 체크리스트

- [ ] 게시글 목록 조회 동작 확인
- [ ] 개별 게시글 클릭 시 상세페이지 이동
- [ ] 조회수 증가 기능
- [ ] 댓글 표시 기능
- [ ] 카테고리 필터링
- [ ] 정렬 기능

## 6. 결론

현재 문제는 **API 엔드포인트 혼재**와 **데이터 구조 불일치**로 인한 것으로, 즉시 수정 가능한 부분을 먼저 처리하고 점진적으로 통합 작업을 진행하는 것을 권장합니다.

---
*작성일: 2025-09-22*
*작성자: Claude*