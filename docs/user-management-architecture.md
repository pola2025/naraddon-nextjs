# 회원 관리 시스템 아키텍처

## 1. 시스템 개요

### 1.1 회원 등급 체계
```
┌──────────────────────────────────────────────┐
│                   관리자 (ADMIN)               │
│            - /admin URL 직접 접근              │
│            - 모든 권한 보유                     │
└──────────────────────────────────────────────┘
                        ↓ 관리
┌──────────────────────────────────────────────┐
│              일반 회원 (USER)                  │
│         - 소셜 로그인으로 가입                  │
│         - 기본 회원 (기업회원 포함)              │
└──────────────────────────────────────────────┘
                    ↓ 승격 가능
    ┌────────────────────┴────────────────────┐
    ↓                                          ↓
┌─────────────────────┐          ┌─────────────────────┐
│  기업심사관 (EXAMINER) │          │   전문가 (EXPERT)    │
│ - 관리자가 직접 승격   │          │ - 관리자가 직접 승격  │
│ - 심사 권한 보유       │          │ - 상담 권한 보유      │
└─────────────────────┘          └─────────────────────┘
```

### 1.2 인증 플로우
```
1. 소셜 로그인 (Google, Naver, Kakao)
   ↓
2. 자동으로 USER 권한으로 가입
   ↓
3. 관리자가 회원 목록 확인
   ↓
4. 필요시 EXAMINER 또는 EXPERT로 승격
```

## 2. 디렉토리 구조

```
src/
├── app/
│   ├── admin/
│   │   ├── users/                    # 회원 관리
│   │   │   ├── page.tsx             # 회원 목록
│   │   │   ├── [id]/page.tsx        # 회원 상세
│   │   │   └── upgrade/page.tsx     # 등급 관리
│   │   └── ...
│   ├── mypage/                      # 마이페이지
│   │   ├── page.tsx                 # 프로필
│   │   ├── edit/page.tsx            # 프로필 수정
│   │   └── settings/page.tsx        # 설정
│   └── auth/
│       ├── login/page.tsx           # 소셜 로그인
│       └── callback/page.tsx        # 인증 콜백
│
├── components/
│   ├── admin/
│   │   └── users/
│   │       ├── UserTable.tsx        # 회원 테이블
│   │       ├── UserProfile.tsx      # 회원 프로필 상세
│   │       ├── RoleUpgrade.tsx      # 등급 변경
│   │       └── UserFilters.tsx      # 필터링
│   ├── profile/
│   │   ├── ProfileCard.tsx          # 프로필 카드 (공용)
│   │   ├── ProfileEdit.tsx          # 프로필 편집
│   │   └── ProfileView.tsx          # 프로필 뷰
│   └── auth/
│       ├── SocialLogin.tsx          # 소셜 로그인 버튼
│       └── AuthGuard.tsx            # 인증 가드
│
├── lib/
│   ├── auth/
│   │   ├── social-auth.ts           # 소셜 인증
│   │   └── user-auth.ts             # 사용자 인증
│   └── api/
│       └── users/
│           ├── userApi.ts            # 회원 API
│           └── roleApi.ts            # 권한 API
│
└── types/
    └── user.types.ts                 # 회원 타입 정의
```

## 3. 컴포넌트 설계

### 3.1 ProfileCard 컴포넌트 (공용)
```typescript
interface ProfileCardProps {
  user: User;
  mode: 'admin' | 'mypage';      // 관리자/마이페이지 모드
  editable?: boolean;             // 편집 가능 여부
  onEdit?: () => void;
  onRoleChange?: (newRole: UserRole) => void;
}

// 사용 예시:
// 관리자 페이지에서
<ProfileCard user={user} mode="admin" onRoleChange={handleRoleChange} />

// 마이페이지에서
<ProfileCard user={currentUser} mode="mypage" editable onEdit={handleEdit} />
```

### 3.2 회원 관리 페이지 구조
```
/admin/users
├── 회원 목록 (DataTable 사용)
│   ├── 검색/필터
│   ├── 정렬
│   └── 페이지네이션
├── 일괄 작업
│   ├── 선택된 회원 상태 변경
│   └── 엑셀 다운로드
└── 빠른 작업
    ├── 등급 변경
    └── 상태 변경
```

## 4. API 엔드포인트

### 4.1 회원 관련 API
```
GET    /api/users                 # 회원 목록
GET    /api/users/:id             # 회원 상세
PUT    /api/users/:id             # 회원 정보 수정
DELETE /api/users/:id             # 회원 삭제

POST   /api/users/:id/upgrade     # 회원 등급 변경
GET    /api/users/:id/history     # 등급 변경 이력

GET    /api/users/stats           # 회원 통계
GET    /api/users/export          # 엑셀 다운로드
```

### 4.2 인증 관련 API
```
POST   /api/auth/social           # 소셜 로그인
POST   /api/auth/logout           # 로그아웃
GET    /api/auth/me               # 현재 사용자
POST   /api/auth/refresh          # 토큰 갱신
```

## 5. 데이터베이스 스키마

### 5.1 Users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  name: String,
  role: 'admin' | 'examiner' | 'expert' | 'user',
  status: 'active' | 'inactive' | 'suspended' | 'pending',

  provider: 'google' | 'naver' | 'kakao',
  providerId: String,

  profile: {
    avatar: String,
    phone: String,
    company: String,
    position: String,
    department: String,
    businessNumber: String,
    introduction: String,

    // 전문가/심사관 전용
    specialty: [String],
    certifications: [String],
    experience: Number,
    rating: Number,

    // 주소
    address: {
      zipCode: String,
      address1: String,
      address2: String
    }
  },

  permissions: [
    {
      resource: String,
      action: String
    }
  ],

  roleHistory: [
    {
      fromRole: String,
      toRole: String,
      changedBy: ObjectId,
      changedAt: Date,
      reason: String
    }
  ],

  createdAt: Date,
  updatedAt: Date,
  lastLoginAt: Date
}
```

## 6. 회원 승격 프로세스

### 6.1 승격 워크플로우
```
1. 관리자가 회원 목록에서 대상 선택
2. "등급 변경" 버튼 클릭
3. 변경 사유 입력 모달
4. 확인 후 등급 변경
5. 이력 자동 기록
6. 대상 회원에게 알림 (선택사항)
```

### 6.2 권한 매트릭스
```
┌─────────────┬────────┬──────────┬─────────┬────────┐
│   기능       │ ADMIN  │ EXAMINER │ EXPERT  │  USER  │
├─────────────┼────────┼──────────┼─────────┼────────┤
│ 회원 관리    │   ✓    │    -     │    -    │   -    │
│ 등급 변경    │   ✓    │    -     │    -    │   -    │
│ 심사 기능    │   ✓    │    ✓     │    -    │   -    │
│ 상담 기능    │   ✓    │    -     │    ✓    │   -    │
│ 프로필 수정  │   ✓    │    ✓     │    ✓    │   ✓    │
│ 콘텐츠 조회  │   ✓    │    ✓     │    ✓    │   ✓    │
└─────────────┴────────┴──────────┴─────────┴────────┘
```

## 7. UI/UX 가이드라인

### 7.1 프로필 카드 디자인
```
┌─────────────────────────────────┐
│  [아바타]  이름                   │
│           email@example.com      │
│  ────────────────────────────    │
│  회사: 나라똔 주식회사             │
│  직책: 대표이사                   │
│  등급: [USER] → [EXAMINER] 변경  │
│  가입일: 2024-01-01              │
│  ────────────────────────────    │
│  [프로필 보기] [등급 변경]         │
└─────────────────────────────────┘
```

### 7.2 회원 목록 필터
- 등급별 필터 (전체/관리자/심사관/전문가/일반)
- 상태별 필터 (활성/비활성/정지/대기)
- 가입 기간 필터
- 검색 (이름, 이메일, 회사)

## 8. 보안 고려사항

### 8.1 인증/인가
- JWT 토큰 사용
- Refresh Token 구현
- CSRF 보호
- Rate Limiting

### 8.2 데이터 보호
- 개인정보 암호화
- 민감 정보 마스킹
- 접근 로그 기록
- 정기적 보안 감사

## 9. 구현 우선순위

1단계: 기본 구조
- [x] 타입 정의
- [ ] API 라우트 생성
- [ ] 데이터베이스 스키마

2단계: 회원 관리
- [ ] 회원 목록 페이지
- [ ] 회원 상세 페이지
- [ ] 등급 변경 기능

3단계: 프로필 시스템
- [ ] ProfileCard 컴포넌트
- [ ] 마이페이지 통합
- [ ] 프로필 편집

4단계: 소셜 로그인
- [ ] OAuth 설정
- [ ] 로그인 페이지
- [ ] 콜백 처리

5단계: 고급 기능
- [ ] 권한 시스템
- [ ] 활동 로그
- [ ] 통계 대시보드