# HTML 렌더링 문제 설명

## 문제 상황
정책소식 게시판에 HTML 콘텐츠를 작성했을 때 HTML 태그가 그대로 텍스트로 표시되는 문제

## 원인 분석

### 1. React의 기본 보안 정책 (XSS 방지)
- React는 기본적으로 모든 문자열을 텍스트로 처리
- HTML 태그를 포함한 문자열도 자동으로 이스케이프(escape) 처리
- 예: `<h1>제목</h1>` → `&lt;h1&gt;제목&lt;/h1&gt;`로 변환되어 화면에 표시

### 2. dangerouslySetInnerHTML 사용 필요
```javascript
// 잘못된 방법 - HTML이 텍스트로 표시됨
<div>{post.content}</div>

// 올바른 방법 - HTML이 렌더링됨
<div dangerouslySetInnerHTML={{ __html: post.content }} />
```

## 해결 방법

### PolicyNewsDetail.js에서 이미 적용됨
```javascript
<div
  className="article-body enhanced-content"
  dangerouslySetInnerHTML={{ __html: post.content }}
  onClick={(e) => {
    if (e.target.tagName === 'IMG') {
      handleImageClick(e.target.src);
    }
  }}
/>
```

## 데이터 저장 및 전송 과정

### 1. 클라이언트 → 서버 (POST 요청)
```javascript
// PolicyNewsWrite에서 HTML 에디터 사용
const content = editorContent; // HTML 문자열
await fetch('/api/policy-news', {
  method: 'POST',
  body: JSON.stringify({ content })
});
```

### 2. 서버에서 MongoDB 저장
```javascript
// route.ts
const post = await PolicyNewsPost.create({
  content, // HTML 문자열 그대로 저장
  // ...
});
```

### 3. MongoDB에서 읽어와서 표시
```javascript
// PolicyNewsDetail에서 불러오기
const response = await fetch(`/api/policy-news/${id}`);
const data = await response.json();
// data.post.content에 HTML 문자열이 포함됨
```

## 주의사항

### XSS(Cross-Site Scripting) 보안
- `dangerouslySetInnerHTML`은 이름 그대로 "위험한" 기능
- 신뢰할 수 없는 사용자 입력을 그대로 렌더링하면 XSS 공격 위험
- 현재는 관리자만 작성 가능하도록 비밀번호로 보호

### 추가 보안 강화 방법 (필요시)
1. **DOMPurify 라이브러리 사용**
```javascript
import DOMPurify from 'dompurify';

<div
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(post.content)
  }}
/>
```

2. **서버에서 HTML 검증**
- 허용된 태그만 사용 가능하도록 제한
- 위험한 스크립트 태그 제거

## 현재 구현 상태
✅ **정상 작동 중**
- PolicyNewsDetail.js에서 `dangerouslySetInnerHTML` 사용
- HTML 콘텐츠가 정상적으로 렌더링됨
- CSS 스타일도 모든 HTML 요소에 대해 정의됨

## 테스트 결과
- 제목(h1, h2, h3), 목록(ul, ol), 표(table), 링크(a), 이미지(img) 등 모든 HTML 요소 정상 렌더링
- 인라인 스타일도 정상 작동
- 코드 블록(pre, code)도 스타일링과 함께 정상 표시