# 사업자 목소리 똔톡 관리자 기능 구현 가이드

## 📋 현재 진행 상황

### ✅ 완료된 작업
1. **관리자 페이지 UI 구성** (`/src/app/business-voice/admin/page.tsx`)
   - 게시물 목록 표시
   - 게시물 편집/삭제 기능
   - 댓글 관리 UI

2. **스타일 추가** (`/src/app/business-voice/admin/page.css`)
   - 댓글 순서 조정 컨트롤 스타일 (`.replies-order-controls`)
   - 순서 조정 버튼 스타일 (`.order-btn`)
   - 저장 버튼 스타일 (`.save-order-btn`)

3. **API 엔드포인트 생성**
   - `/api/business-voice/replies/reorder/route.ts` - 댓글 순서 저장 API

### ✅ 완료된 작업 (추가)
4. **댓글 순서 조정 기능 구현**
   - `/api/business-voice/replies/reorder/route.ts` - 순서 저장 API
   - `TtontokReply` 모델에 `order` 필드 추가
   - 클라이언트 로직 수정 (`saveReplyOrder` 함수 API 연동)

### ⏳ 남은 작업
1. **클라이언트 로직 완성**
   - `handleMoveReply` 함수 구현
   - `handleSaveReplyOrder` 함수 구현
   - 상태 업데이트 로직

2. **기능 테스트**
   - 댓글 위/아래 이동 테스트
   - 순서 저장 테스트
   - MongoDB 데이터 확인

3. **추가 기능 (선택사항)**
   - 드래그 앤 드롭으로 순서 변경
   - 댓글 일괄 삭제
   - 댓글 필터링/검색

## 🛠️ 구현 세부사항

### 댓글 순서 조정 로직
```typescript
// handleMoveReply 함수 구현 예시
const handleMoveReply = (postId: string, replyIndex: number, direction: 'up' | 'down') => {
  setPosts(prevPosts => {
    return prevPosts.map(post => {
      if (post._id === postId && post.replies) {
        const newReplies = [...post.replies];
        const newIndex = direction === 'up' ? replyIndex - 1 : replyIndex + 1;

        if (newIndex >= 0 && newIndex < newReplies.length) {
          [newReplies[replyIndex], newReplies[newIndex]] =
          [newReplies[newIndex], newReplies[replyIndex]];
        }

        return { ...post, replies: newReplies };
      }
      return post;
    });
  });

  setModifiedReplies(prev => ({ ...prev, [postId]: true }));
};

// handleSaveReplyOrder 함수 구현 예시
const handleSaveReplyOrder = async (postId: string) => {
  const post = posts.find(p => p._id === postId);
  if (!post || !post.replies) return;

  const repliesOrder = post.replies.map(reply => reply._id);

  try {
    const response = await fetch('/api/business-voice/replies/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, repliesOrder })
    });

    if (response.ok) {
      setModifiedReplies(prev => ({ ...prev, [postId]: false }));
      alert('댓글 순서가 저장되었습니다.');
    }
  } catch (error) {
    console.error('댓글 순서 저장 실패:', error);
    alert('댓글 순서 저장에 실패했습니다.');
  }
};
```

## 📁 파일 구조
```
/src/app/business-voice/
├── admin/
│   ├── page.tsx       # 관리자 페이지 컴포넌트
│   └── page.css       # 관리자 페이지 스타일
└── api/
    └── business-voice/
        └── replies/
            └── reorder/
                └── route.ts  # 댓글 순서 저장 API

/models/
└── BusinessVoicePost.ts  # 데이터 모델 (필요시 생성)
```

## 🔐 보안 고려사항
- 관리자 권한 확인 로직 추가 필요
- CSRF 토큰 검증
- 입력값 검증 강화

## 🐛 알려진 이슈
- 중복 댓글 ID 처리 필요
- 대용량 댓글 처리 시 성능 최적화 필요

## 📝 참고사항
- MongoDB 컬렉션: `naraddon.business-voice-posts`
- 댓글은 게시물 document 내 `replies` 배열로 저장됨
- 각 댓글은 `_id`, `content`, `author`, `createdAt` 등의 필드 포함

## 🚀 다음 단계
1. 클라이언트 로직 완성
2. 테스트 수행
3. 관리자 인증 추가
4. 프로덕션 배포

---
*최종 업데이트: 2025-09-22*
*작업 중단 시 이 문서를 참조하여 진행 상황 파악 가능*