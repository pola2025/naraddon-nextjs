# 🚀 나라똔 홈페이지 개발 규칙 및 환경 가이드

## 📋 목차

1. [프로젝트 구조](#프로젝트-구조)
2. [개발 규칙](#개발-규칙)
3. [백업 전략](#백업-전략)
4. [컴포넌트 관리](#컴포넌트-관리)
5. [작업 프로세스](#작업-프로세스)

---

## 🏗️ 프로젝트 구조

```
H:\Naraddon\homepage\
├── src/
│   ├── app/                    # Next.js 앱 라우터
│   ├── components/              # 재사용 가능한 컴포넌트
│   │   ├── fix/                # ⚠️ 확정된 컴포넌트 (수정 금지)
│   │   └── working/             # 작업 중인 컴포넌트
│   └── styles/                  # 전역 스타일
├── public/                      # 정적 파일
├── backups/                     # 백업 디렉터리
│   ├── daily/                   # 일일 백업
│   │   └── YYYYMMDD/           # 날짜별 백업
│   ├── component/               # 컴포넌트별 백업
│   │   └── ComponentName_YYYYMMDD_HHMM/
│   └── milestone/               # 마일스톤 백업
│       └── v1.0_description/
├── fix/                         # 확정 컴포넌트 원본
│   ├── components/              # 확정된 컴포넌트 백업
│   ├── pages/                   # 확정된 페이지 백업
│   └── FIXED_LIST.md           # 확정 목록 및 날짜
└── docs/                        # 문서
    ├── DEVELOPMENT_RULES.md     # 개발 규칙 (이 문서)
    ├── BACKUP_STRATEGY.md       # 백업 전략
    └── COMPONENT_STATUS.md      # 컴포넌트 상태

```

---

## 🔒 개발 규칙

### 1. 절대 규칙 (MUST)

- ❌ **fix/ 폴더 내 파일 수정 금지**
  - 사용자가 명시적으로 수정 요청하기 전까지 절대 수정 불가
- ✅ **작업 전 백업 필수**
  - 모든 데이터 변경 작업 전 백업 실행
- ✅ **컴포넌트 수정 시 버전 관리**
  - 원본 유지 + 날짜별 백업 생성

### 2. 권장 규칙 (SHOULD)

- 📝 작업 로그 작성
- 🏷️ 의미 있는 커밋 메시지
- 🔄 정기적인 의존성 업데이트
- 📊 성능 모니터링

### 3. 금지 사항 (MUST NOT)

- ❌ 백업 없이 대규모 변경
- ❌ fix/ 폴더 직접 수정
- ❌ 확정된 컴포넌트의 구조 변경
- ❌ 프로덕션 환경 변수 노출

---

## 💾 백업 전략

### 1. 자동 백업 시점

```bash
# 백업이 자동으로 실행되는 시점
- 컴포넌트 수정 전
- 페이지 구조 변경 전
- 패키지 업데이트 전
- 빌드 설정 변경 전
- 배포 전
```

### 2. 백업 명명 규칙

```
# 일일 백업
backups/daily/20250118/

# 컴포넌트 백업
backups/component/Header_20250118_1430/
backups/component/Footer_20250118_1530/

# 마일스톤 백업
backups/milestone/v1.0_homepage_complete/
backups/milestone/v1.1_responsive_update/
```

### 3. 백업 스크립트

```json
// package.json에 추가
"scripts": {
  "backup": "node scripts/backup.js",
  "backup:component": "node scripts/backup.js --component",
  "backup:milestone": "node scripts/backup.js --milestone",
  "restore": "node scripts/restore.js"
}
```

---

## 🧩 컴포넌트 관리

### 1. 컴포넌트 상태

| 상태        | 설명    | 위치                      | 수정 가능 |
| ----------- | ------- | ------------------------- | --------- |
| 🔴 Fixed    | 확정됨  | `fix/`                    | ❌ 불가   |
| 🟡 Working  | 작업 중 | `src/components/working/` | ✅ 가능   |
| 🟢 Review   | 검토 중 | `src/components/`         | ⚠️ 조건부 |
| 🔵 Archived | 보관    | `backups/component/`      | ❌ 불가   |

### 2. 확정 프로세스

```mermaid
Working → Review → Testing → User Approval → Fixed
```

### 3. 확정 컴포넌트 등록

```markdown
# fix/FIXED_LIST.md 예시

## 확정 컴포넌트 목록

- [x] Header - 2025.01.18 - 사용자 확정
- [x] Footer - 2025.01.17 - 사용자 확정
- [x] Navigation - 2025.01.16 - 사용자 확정
```

---

## 🔄 작업 프로세스

### 1. 작업 시작 전

```bash
# 1. 현재 상태 백업
npm run backup

# 2. 브랜치 생성 (선택)
git checkout -b feature/component-name

# 3. 작업 디렉터리 확인
ls src/components/working/
```

### 2. 작업 중

```bash
# 컴포넌트 수정 시
1. 원본을 working/ 폴더에 복사
2. working/ 폴더에서 작업
3. 주기적으로 백업 (30분마다)
```

### 3. 작업 완료 후

```bash
# 1. 테스트 실행
npm run test

# 2. 빌드 확인
npm run build

# 3. 백업 생성
npm run backup:component ComponentName

# 4. 사용자 검토 요청
```

### 4. 확정 시

```bash
# 사용자가 확정 요청 시에만
1. fix/ 폴더에 복사
2. FIXED_LIST.md 업데이트
3. 마일스톤 백업 생성
```

---

## 🚨 긴급 복원 절차

### 1. 컴포넌트 복원

```bash
# 특정 날짜의 컴포넌트로 복원
npm run restore -- --component Header --date 20250118
```

### 2. 전체 복원

```bash
# 특정 시점으로 전체 복원
npm run restore -- --milestone v1.0_homepage_complete
```

### 3. 수동 복원

```bash
# 백업 폴더에서 직접 복사
cp -r backups/daily/20250118/* .
```

---

## 📝 체크리스트

### 작업 시작 전

- [ ] 백업 실행했는가?
- [ ] fix/ 폴더 확인했는가?
- [ ] working/ 폴더 준비했는가?

### 작업 중

- [ ] 30분마다 백업했는가?
- [ ] 컴포넌트 상태 확인했는가?
- [ ] 테스트 작성했는가?

### 작업 완료 후

- [ ] 빌드 성공했는가?
- [ ] 백업 생성했는가?
- [ ] 문서 업데이트했는가?

---

## 🔧 유용한 명령어

```bash
# 개발 서버 실행
npm run dev:3001

# 프로덕션 빌드
npm run build

# 백업 명령어
npm run backup                    # 전체 백업
npm run backup:component Header    # 컴포넌트 백업
npm run backup:milestone v1.0      # 마일스톤 백업

# 복원 명령어
npm run restore                    # 대화형 복원
npm run restore -- --latest        # 최신 백업으로 복원

# 상태 확인
npm run status                     # 프로젝트 상태
npm run status:fixed              # 확정 컴포넌트 목록
```

---

## 📌 중요 연락처

- 개발 문의: [개발자 이메일]
- 긴급 복원: [백업 관리자]
- 사용자 확정: [프로젝트 관리자]

---

_최종 업데이트: 2025년 1월 18일_
_버전: 1.0.0_
