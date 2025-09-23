# 나라똔 프로젝트 아키텍처 비교 분석

## 1. 현재 아키텍처 (AS-IS)

```mermaid
graph TB
    subgraph "현재 구조 - 모놀리식 혼재"
        Client[클라이언트 브라우저]

        subgraph "Next.js App - 혼재된 구조"
            Pages[Pages<br/>- 클라이언트 컴포넌트 중심<br/>- 비즈니스 로직 혼재]
            API[API Routes<br/>- 중복 로직<br/>- 일관성 없는 응답]
            Components[Components<br/>- 거대한 클라이언트 컴포넌트<br/>- 상태 관리 분산]
            BackupCode[Backup 코드<br/>- src/src<br/>- *_backup 파일들]
        end

        subgraph "데이터 계층 - 중복/비일관"
            Models[Mongoose Models<br/>- 중복 스키마<br/>- 타입 불일치]
            MongoDB[(MongoDB Atlas<br/>- 스키마 버전 혼재)]
            R2[(Cloudflare R2<br/>- 파일 저장)]
        end

        subgraph "혼재된 기능"
            AdminLogic[관리자 로직<br/>- 퍼블릭 UI에 혼재]
            PublicLogic[공개 기능<br/>- 인증 체크 분산]
        end

        Client --> Pages
        Pages --> API
        Pages --> Components
        API --> Models
        Models --> MongoDB
        API --> R2
        Pages --> AdminLogic
        Pages --> PublicLogic
    end

    style BackupCode fill:#ff6b6b,stroke:#c92a2a
    style AdminLogic fill:#ffd43b,stroke:#fab005
```

## 2. 개선된 아키텍처 (TO-BE)

```mermaid
graph TB
    subgraph "개선된 구조 - 도메인 기반 모듈화"
        Client[클라이언트 브라우저]

        subgraph "Monorepo 구조"
            subgraph "apps/web - Next.js"
                ServerComp[서버 컴포넌트<br/>- 데이터 페칭<br/>- SEO 최적화]
                ClientWrapper[Client Wrapper<br/>- 최소한의 상태<br/>- UI 인터랙션]
                APILayer[API Routes<br/>- Thin Controller<br/>- 표준화된 응답]
            end

            subgraph "apps/admin - 관리자"
                AdminDashboard[관리자 대시보드<br/>- 독립된 앱<br/>- RBAC 권한]
            end

            subgraph "packages/core - 도메인 서비스"
                BusinessVoice[Business Voice<br/>Service]
                Community[Community<br/>Service]
                Expert[Expert<br/>Service]
                Policy[Policy<br/>Service]
            end

            subgraph "packages/shared"
                Types[공유 타입<br/>- Zod 스키마<br/>- DTO]
                Utils[공통 유틸<br/>- 캐싱<br/>- 검증]
                UIKit[UI 컴포넌트<br/>- 디자인 시스템]
            end
        end

        subgraph "데이터 계층 - 표준화"
            ServiceLayer[도메인 서비스 계층<br/>- 비즈니스 로직<br/>- 트랜잭션]
            Prisma[Prisma ORM<br/>- 타입 세이프<br/>- 마이그레이션]
            MongoDB[(MongoDB Atlas<br/>- 정규화된 스키마)]
            R2[(Cloudflare R2)]
            Redis[(Redis Cache<br/>- 캐싱 전략)]
        end

        subgraph "관측성 & 품질"
            Monitoring[모니터링<br/>- OpenTelemetry<br/>- Grafana]
            Testing[테스트<br/>- Playwright E2E<br/>- Vitest Unit]
        end

        Client --> ServerComp
        ServerComp --> ClientWrapper
        ServerComp --> APILayer
        APILayer --> ServiceLayer
        ServiceLayer --> BusinessVoice
        ServiceLayer --> Community
        ServiceLayer --> Expert
        ServiceLayer --> Policy
        BusinessVoice --> Prisma
        Community --> Prisma
        Expert --> Prisma
        Policy --> Prisma
        Prisma --> MongoDB
        ServiceLayer --> Redis
        APILayer --> R2
        AdminDashboard --> ServiceLayer
        APILayer --> Monitoring
        ServiceLayer --> Testing
    end

    style ServiceLayer fill:#51cf66,stroke:#37b24d
    style Prisma fill:#339af0,stroke:#1971c2
    style Monitoring fill:#9775fa,stroke:#7950f2
```

## 3. 도메인 경계 재설계

```mermaid
graph LR
    subgraph "현재 - 기능별 분리"
        P1[pages/businessvoice]
        P2[pages/community]
        P3[pages/expert]
        P4[pages/policy]

        C1[components/BusinessVoice]
        C2[components/Community]
        C3[components/Expert]

        A1[api/businessvoice]
        A2[api/community]
        A3[api/expert]

        P1 --> C1
        P2 --> C2
        P3 --> C3
        C1 --> A1
        C2 --> A2
        C3 --> A3
    end

    subgraph "개선 - 도메인별 모듈"
        subgraph "Domain: Business Voice"
            BV_Service[Service Layer]
            BV_Model[Domain Model]
            BV_API[API Contract]
            BV_UI[UI Components]

            BV_Service --> BV_Model
            BV_API --> BV_Service
            BV_UI --> BV_API
        end

        subgraph "Domain: Community"
            CM_Service[Service Layer]
            CM_Model[Domain Model]
            CM_API[API Contract]
            CM_UI[UI Components]

            CM_Service --> CM_Model
            CM_API --> CM_Service
            CM_UI --> CM_API
        end

        subgraph "Domain: Expert"
            EX_Service[Service Layer]
            EX_Model[Domain Model]
            EX_API[API Contract]
            EX_UI[UI Components]

            EX_Service --> EX_Model
            EX_API --> EX_Service
            EX_UI --> EX_API
        end
    end
```

## 4. 데이터 플로우 개선

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant ServerComponent
    participant ServiceLayer
    participant Cache
    participant Database

    Note over User,Database: 현재 플로우 - 직접 호출, 캐싱 없음
    User->>Browser: 페이지 요청
    Browser->>ServerComponent: GET /page
    ServerComponent->>Database: 직접 쿼리
    Database-->>ServerComponent: 원시 데이터
    ServerComponent-->>Browser: HTML + Data

    Note over User,Database: 개선된 플로우 - 계층화, 캐싱
    User->>Browser: 페이지 요청
    Browser->>ServerComponent: GET /page
    ServerComponent->>ServiceLayer: getDomainData()
    ServiceLayer->>Cache: 캐시 확인
    alt 캐시 히트
        Cache-->>ServiceLayer: 캐시된 데이터
    else 캐시 미스
        ServiceLayer->>Database: Prisma 쿼리
        Database-->>ServiceLayer: 데이터
        ServiceLayer->>Cache: 캐시 저장
    end
    ServiceLayer-->>ServerComponent: DTO 변환된 데이터
    ServerComponent-->>Browser: 최적화된 HTML
```

## 5. 배포 파이프라인 개선

```mermaid
graph LR
    subgraph "현재 배포"
        Push[Git Push] --> Vercel[Vercel 자동 배포]
        Vercel --> Prod[프로덕션]
    end

    subgraph "개선된 CI/CD"
        PR[Pull Request] --> Checks{자동 검증}
        Checks --> Lint[ESLint]
        Checks --> Type[TypeScript]
        Checks --> Test[테스트 실행]
        Checks --> Build[빌드 검증]

        Test --> Unit[Unit Tests]
        Test --> Integration[Integration]
        Test --> E2E[E2E Tests]

        Checks -->|통과| Preview[Preview 배포]
        Preview -->|승인| Staging[Staging 환경]
        Staging -->|검증| Production[프로덕션]

        Production --> Monitor[모니터링]
        Monitor --> Rollback[자동 롤백]
    end

    style Rollback fill:#ff6b6b,stroke:#c92a2a
    style Monitor fill:#51cf66,stroke:#37b24d
```

## 6. 모니터링 체계 구축

```mermaid
graph TB
    subgraph "Application Layer"
        Next[Next.js App]
        API[API Routes]
        Services[Domain Services]
    end

    subgraph "Observability Stack"
        OTel[OpenTelemetry SDK]

        subgraph "수집"
            Traces[Traces<br/>- API 호출<br/>- DB 쿼리<br/>- 외부 서비스]
            Metrics[Metrics<br/>- 응답 시간<br/>- 에러율<br/>- 처리량]
            Logs[Logs<br/>- 애플리케이션<br/>- 시스템<br/>- 보안]
        end

        subgraph "저장 & 분석"
            Prometheus[Prometheus<br/>메트릭 저장]
            Loki[Loki<br/>로그 집계]
            Tempo[Tempo<br/>분산 추적]
        end

        subgraph "시각화 & 알림"
            Grafana[Grafana<br/>대시보드]
            Alerts[알림<br/>- Slack<br/>- PagerDuty]
        end
    end

    Next --> OTel
    API --> OTel
    Services --> OTel

    OTel --> Traces
    OTel --> Metrics
    OTel --> Logs

    Traces --> Tempo
    Metrics --> Prometheus
    Logs --> Loki

    Tempo --> Grafana
    Prometheus --> Grafana
    Loki --> Grafana

    Grafana --> Alerts
```

## 7. 리팩토링 로드맵

```mermaid
gantt
    title 나라똔 프로젝트 리팩토링 로드맵
    dateFormat YYYY-MM-DD
    section Phase 1 - 기반 구축
    관측성 설정           :a1, 2025-01-01, 7d
    모노레포 전환         :a2, after a1, 14d
    CI/CD 파이프라인      :a3, after a1, 10d

    section Phase 2 - 도메인 분리
    Business Voice 모듈화  :b1, after a2, 14d
    Community 모듈화       :b2, after a2, 14d
    Expert 모듈화          :b3, after b1, 14d
    Policy 모듈화          :b4, after b2, 14d

    section Phase 3 - 데이터 계층
    Prisma 마이그레이션   :c1, after b3, 21d
    서비스 계층 구현      :c2, after b4, 21d
    캐싱 전략 구현        :c3, after c1, 14d

    section Phase 4 - 품질 개선
    테스트 커버리지 70%   :d1, after c2, 21d
    성능 최적화           :d2, after c3, 14d
    문서화 완성           :d3, after d1, 7d
```

## 구현 우선순위

1. **즉시 시작 가능** (Week 1-2)
   - OpenTelemetry 설정 및 기본 모니터링
   - 백업 폴더/레거시 코드 정리
   - ADR 템플릿 작성 시작

2. **단기 목표** (Week 3-6)
   - Turborepo 모노레포 구조 전환
   - 도메인별 서비스 계층 분리 시작
   - Playwright E2E 테스트 기본 설정

3. **중기 목표** (Week 7-12)
   - Prisma 마이그레이션
   - 관리자 앱 분리
   - 캐싱 전략 구현

4. **장기 목표** (3개월+)
   - 전체 테스트 커버리지 70% 달성
   - 완전한 타입 세이프티
   - 성능 최적화 (LCP < 2.5s)