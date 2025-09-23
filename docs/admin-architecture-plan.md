# Admin 페이지 및 아키텍처 개선 계획

## 📋 프로젝트 개요
관리자 전용 기능 구현 및 전체 아키텍처 구조 개선

## 🎯 Phase 1: Admin 페이지 구성

### 1.1 관리자 페이지 레이아웃 설계
- **URL 구조**: `/admin/*` 경로로 통합
- **대시보드**: `/admin` - 전체 현황 요약
- **섹션별 관리**:
  - `/admin/naraddon-tube` - 영상 콘텐츠 관리
  - `/admin/community` - 커뮤니티 게시글 관리
  - `/admin/policy` - 정책 분석 콘텐츠 관리
  - `/admin/business-voice` - 비즈니스 보이스 관리

### 1.2 관리자 전용 기능 정의
```typescript
interface AdminFeatures {
  contentManagement: {
    create: boolean;
    update: boolean;
    delete: boolean;
    publish: boolean;
  };
  userManagement: {
    viewUsers: boolean;
    moderateContent: boolean;
  };
  analytics: {
    viewStats: boolean;
    exportData: boolean;
  };
}
```

### 1.3 권한 기반 접근 제어
- NextAuth.js 활용한 세션 기반 인증
- Role-based access control (RBAC) 구현
- 관리자 전용 레이아웃 래퍼 컴포넌트

## 🔐 Phase 2: API 인증 통합

### 2.1 인증 플로우 설계
```typescript
// 단일 로그인 → 전체 권한 부여
interface AuthFlow {
  login: '/admin/login';
  callback: '/api/auth/callback';
  session: {
    user: User;
    role: 'admin' | 'user';
    permissions: string[];
  };
}
```

### 2.2 세션/토큰 관리
- **NextAuth.js** 세션 관리
- JWT 토큰 (secure, httpOnly cookies)
- 세션 만료: 24시간
- Refresh token: 7일

### 2.3 권한 검증 미들웨어
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('next-auth.session-token');

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token || !isAdmin(token)) {
      return NextResponse.redirect('/login');
    }
  }
}
```

## 👥 Phase 3: 퍼블릭 환경 권한 분리

### 3.1 사용자 역할 구분
```typescript
enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}
```

### 3.2 기능별 권한 매핑
| 기능 | Guest | User | Admin |
|------|-------|------|--------|
| 콘텐츠 조회 | ✅ | ✅ | ✅ |
| 댓글 작성 | ❌ | ✅ | ✅ |
| 게시글 작성 | ❌ | ❌ | ✅ |
| 콘텐츠 수정/삭제 | ❌ | ❌ | ✅ |

### 3.3 조건부 UI 렌더링
```tsx
// 권한 기반 컴포넌트 렌더링
<ProtectedComponent requiredRole="admin">
  <AdminButton />
</ProtectedComponent>
```

## 🏗️ Phase 4: 아키텍처 구조 개선

### 4.1 디렉토리 구조 재구성
```
src/
├── app/
│   ├── (public)/          # 일반 사용자 페이지
│   │   ├── page.tsx
│   │   ├── community/
│   │   └── policy/
│   ├── admin/             # 관리자 페이지
│   │   ├── layout.tsx     # Admin 전용 레이아웃
│   │   ├── page.tsx       # Dashboard
│   │   └── [section]/
│   └── api/
├── components/
│   ├── common/           # 공통 컴포넌트
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── HeroSection.tsx
│   ├── admin/            # Admin 전용
│   └── features/         # 기능별 컴포넌트
│       ├── naraddon-tube/
│       ├── community/
│       └── policy/
└── lib/
    ├── auth/            # 인증 관련
    ├── db/              # DB 연결
    └── utils/           # 유틸리티
```

### 4.2 공통 레이아웃 통합
```tsx
// app/(public)/layout.tsx
export default function PublicLayout({ children }) {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4">
        {children}
      </main>
      <Footer />
    </>
  );
}
```

### 4.3 표준화 작업
- **가로폭**: `max-w-7xl` (1280px) 통일
- **패딩**: `px-4 sm:px-6 lg:px-8`
- **섹션 간격**: `py-12 sm:py-16 lg:py-20`

### 4.4 코드 정리
- 중복 컴포넌트 통합
- 미사용 패키지 제거
- CSS 모듈 → Tailwind 통합
- 타입 정의 중앙화

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Auth**: NextAuth.js v5
- **Styling**: Tailwind CSS
- **State**: Zustand (필요시)

### Backend
- **API**: Next.js API Routes
- **Database**: MongoDB Atlas
- **Storage**: Cloudflare R2
- **Session**: NextAuth + MongoDB

## 📅 구현 로드맵

### Week 1-2: 기초 설정
- [ ] NextAuth.js 설정
- [ ] Admin 라우트 구조 생성
- [ ] 권한 미들웨어 구현

### Week 3-4: Admin 페이지
- [ ] Admin 대시보드 구현
- [ ] 각 섹션 관리 페이지
- [ ] CRUD 기능 구현

### Week 5-6: 권한 시스템
- [ ] 역할 기반 접근 제어
- [ ] 조건부 렌더링 구현
- [ ] API 보안 강화

### Week 7-8: 아키텍처 개선
- [ ] 컴포넌트 재구성
- [ ] 공통 레이아웃 통합
- [ ] 코드 최적화 및 정리

## ⚠️ 주의사항

### 보존 필수 요소
- ✅ 현재 디자인 시스템 완전 보존
- ✅ 모든 UI/UX 요소 유지
- ✅ 기존 스타일링 훼손 금지
- ✅ 사용자 경험 연속성 보장

### 보안 고려사항
- 환경변수 철저한 관리
- API 엔드포인트 보호
- XSS/CSRF 방어
- Rate limiting 적용

## 📊 예상 결과

### 개선 효과
- **관리 효율성**: 통합 Admin으로 80% 향상
- **코드 재사용성**: 40% 중복 제거
- **유지보수성**: 구조화로 60% 개선
- **보안성**: 체계적 권한 관리

### 성공 지표
- Admin 페이지 로딩 < 2초
- 권한 검증 시간 < 100ms
- 코드 커버리지 > 70%
- 번들 사이즈 20% 감소

---

## 📝 구현 체크리스트

### Phase 1 체크리스트
- [ ] Admin 라우트 구조 설계 완료
- [ ] 관리자 기능 명세서 작성
- [ ] 권한 모델 정의
- [ ] UI 목업 작성

### Phase 2 체크리스트
- [ ] NextAuth.js 설치 및 설정
- [ ] MongoDB 세션 저장소 구성
- [ ] JWT 토큰 전략 구현
- [ ] 미들웨어 작성 및 테스트

### Phase 3 체크리스트
- [ ] User 모델 스키마 정의
- [ ] 역할별 권한 매트릭스 작성
- [ ] ProtectedComponent 구현
- [ ] 조건부 렌더링 테스트

### Phase 4 체크리스트
- [ ] 디렉토리 구조 마이그레이션
- [ ] 공통 컴포넌트 추출
- [ ] 레이아웃 통합
- [ ] 스타일 표준화
- [ ] 성능 최적화

## 🔗 참고 자료

### 문서
- [Next.js 14 App Router](https://nextjs.org/docs/app)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [MongoDB Atlas](https://www.mongodb.com/docs/atlas/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### 관련 파일
- `/docs/architecture-comparison.md` - 현재/개선 아키텍처 비교
- `/docs/architecture.md` - 시스템 구조도
- `/CLAUDE.md` - 프로젝트 작업 가이드

---

*최종 업데이트: 2025-09-23*
*작성자: Claude Assistant*