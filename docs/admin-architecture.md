# 나라똔 관리자 시스템 아키텍처

## 1. 전체 구조

```
/admin
├── 대시보드 (메인)
├── 콘텐츠 관리
│   ├── 나라똔튜브
│   ├── 정책소식
│   ├── 정책분석
│   ├── 비즈니스보이스
│   └── 똔톡
├── 전문가 서비스
│   ├── 전문가 관리
│   └── 상담 관리
├── 사용자 관리
├── 통계/분석
└── 시스템 설정
```

## 2. 컴포넌트 계층 구조

### 2.1 공통 컴포넌트 (/components/admin/common)

```typescript
// 테이블 컴포넌트
DataTable.tsx
├── 정렬 기능
├── 필터링
├── 페이지네이션
├── 일괄 선택
└── 액션 버튼

// 폼 컴포넌트
FormModal.tsx
├── 동적 폼 필드
├── 유효성 검사
├── 파일 업로드
└── 미리보기

// 카드 컴포넌트
StatsCard.tsx
├── 아이콘
├── 수치 표시
├── 변화율
└── 차트 연동

// 검색 컴포넌트
SearchBar.tsx
├── 실시간 검색
├── 필터 옵션
├── 검색 기록
└── 자동완성

// 액션 버튼
ActionButtons.tsx
├── 보기
├── 수정
├── 삭제
└── 복사

// 파일 업로더
FileUploader.tsx
├── 드래그앤드롭
├── 다중 파일
├── 미리보기
└── 진행률 표시
```

### 2.2 레이아웃 컴포넌트 (/components/admin/layout)

```typescript
AdminSidebar.tsx    // 사이드바 네비게이션
AdminHeader.tsx     // 상단 헤더
AdminBreadcrumb.tsx // 빵가루 네비게이션
AdminFooter.tsx     // 푸터
```

### 2.3 위젯 컴포넌트 (/components/admin/widgets)

```typescript
RecentActivity.tsx   // 최근 활동 위젯
QuickActions.tsx     // 빠른 작업 위젯
ChartWidget.tsx      // 차트 위젯
NotificationPanel.tsx // 알림 패널
```

## 3. 페이지별 구조

### 3.1 나라똔튜브 관리
```
/admin/naraddon-tube
├── page.tsx (목록)
├── new/page.tsx (새 영상 등록)
├── [id]/page.tsx (상세보기)
├── [id]/edit/page.tsx (수정)
└── analytics/page.tsx (통계)

컴포넌트:
├── VideoList.tsx
├── VideoForm.tsx
├── VideoPreview.tsx
└── VideoStats.tsx
```

### 3.2 정책소식 관리
```
/admin/policy-news
├── page.tsx (목록)
├── new/page.tsx (작성)
├── [id]/page.tsx (상세)
├── [id]/edit/page.tsx (수정)
└── categories/page.tsx (카테고리 관리)

컴포넌트:
├── NewsTable.tsx
├── NewsEditor.tsx
├── CategoryManager.tsx
└── NewsFilters.tsx
```

### 3.3 비즈니스보이스 관리
```
/admin/business-voice
├── page.tsx (목록)
├── interviews/page.tsx (인터뷰 관리)
├── ttontok/page.tsx (똔톡 관리)
└── analytics/page.tsx (통계)

컴포넌트:
├── InterviewList.tsx
├── TtontokList.tsx
├── VoiceRecorder.tsx
└── TranscriptEditor.tsx
```

### 3.4 전문가 서비스 관리
```
/admin/expert-services
├── page.tsx (대시보드)
├── experts/page.tsx (전문가 목록)
├── consultations/page.tsx (상담 목록)
├── applications/page.tsx (신청 관리)
└── reviews/page.tsx (리뷰 관리)

컴포넌트:
├── ExpertProfile.tsx
├── ConsultationManager.tsx
├── ApplicationReview.tsx
└── ReviewModeration.tsx
```

### 3.5 사용자 관리
```
/admin/users
├── page.tsx (사용자 목록)
├── [id]/page.tsx (사용자 상세)
├── roles/page.tsx (권한 관리)
└── activity/page.tsx (활동 로그)

컴포넌트:
├── UserTable.tsx
├── UserProfile.tsx
├── RoleManager.tsx
└── ActivityLog.tsx
```

### 3.6 통계/분석
```
/admin/analytics
├── page.tsx (통계 대시보드)
├── traffic/page.tsx (트래픽 분석)
├── content/page.tsx (콘텐츠 분석)
└── reports/page.tsx (보고서)

컴포넌트:
├── TrafficChart.tsx
├── ContentMetrics.tsx
├── ReportGenerator.tsx
└── ExportData.tsx
```

### 3.7 시스템 설정
```
/admin/settings
├── page.tsx (설정 메인)
├── general/page.tsx (일반 설정)
├── backup/page.tsx (백업)
├── logs/page.tsx (시스템 로그)
└── api/page.tsx (API 설정)

컴포넌트:
├── SettingsForm.tsx
├── BackupManager.tsx
├── LogViewer.tsx
└── ApiKeyManager.tsx
```

## 4. API 구조

### 4.1 API 라우트 구조
```
/api/admin
├── /auth
│   ├── login
│   ├── logout
│   └── check-session
├── /naraddon-tube
│   ├── GET /videos
│   ├── POST /videos
│   ├── PUT /videos/[id]
│   └── DELETE /videos/[id]
├── /policy-news
│   ├── GET /articles
│   ├── POST /articles
│   ├── PUT /articles/[id]
│   └── DELETE /articles/[id]
├── /users
│   ├── GET /users
│   ├── PUT /users/[id]
│   └── DELETE /users/[id]
├── /stats
│   ├── GET /overview
│   ├── GET /content
│   └── GET /traffic
└── /settings
    ├── GET /config
    └── PUT /config
```

### 4.2 API 클라이언트 (/lib/api/admin)
```typescript
adminApi.ts         // API 기본 클라이언트
videoApi.ts         // 영상 관련 API
newsApi.ts          // 뉴스 관련 API
userApi.ts          // 사용자 관련 API
statsApi.ts         // 통계 API
uploadApi.ts        // 파일 업로드 API
```

## 5. 타입 정의 (/types/admin)

```typescript
// admin.types.ts
export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
  permissions: Permission[];
}

export interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  views: number;
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  status: ContentStatus;
  publishedAt: Date;
}

export interface Expert {
  id: string;
  name: string;
  specialty: string[];
  rating: number;
  consultations: number;
  status: ExpertStatus;
}

export interface Consultation {
  id: string;
  expertId: string;
  userId: string;
  type: ConsultationType;
  status: ConsultationStatus;
  scheduledAt: Date;
}

export enum ContentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer'
}
```

## 6. 상태 관리 (/store/admin)

```typescript
// Zustand 스토어 구조
adminStore.ts
├── user (현재 관리자 정보)
├── notifications (알림)
├── filters (필터 상태)
└── ui (UI 상태)

// 커스텀 훅
useAdminAuth.ts     // 인증 관련
useAdminData.ts     // 데이터 페칭
useAdminFilters.ts  // 필터링
useAdminPagination.ts // 페이지네이션
```

## 7. 유틸리티 (/utils/admin)

```typescript
validation.ts       // 폼 유효성 검사
formatting.ts       // 데이터 포맷팅
permissions.ts      // 권한 체크
export.ts          // 데이터 내보내기
import.ts          // 데이터 가져오기
```

## 8. 스타일 구조

```
/styles/admin
├── variables.css   // CSS 변수
├── components.css  // 컴포넌트 스타일
├── layout.css     // 레이아웃 스타일
└── utilities.css  // 유틸리티 클래스
```

## 9. 테스트 구조

```
/__tests__/admin
├── auth.test.ts
├── api.test.ts
├── components.test.tsx
└── pages.test.tsx
```

## 10. 보안 및 권한

### 권한 레벨
1. **Super Admin**: 모든 권한
2. **Admin**: 콘텐츠 관리, 사용자 관리
3. **Editor**: 콘텐츠 생성/수정
4. **Viewer**: 읽기 전용

### 보안 미들웨어
- 세션 검증
- CSRF 보호
- Rate Limiting
- 입력 검증
- XSS 방지