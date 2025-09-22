# Vercel 배포 문제 해결 가이드

## 📋 현재 상황
- **날짜**: 2025-09-22
- **문제**: 정책분석 모바일 최적화 및 정책소식 게시글 기능이 개발 서버에는 적용되었으나 프로덕션 배포가 제대로 반영되지 않음
- **시도한 조치**:
  - 강제 빌드 트리거 (빈 커밋)
  - 커밋 해시: `5ede8ee`

## 🔍 진단 결과

### 1. 로컬 빌드 테스트
- **상태**: ✅ 성공
- **빌드 시간**: 정상
- **에러**: 없음 (Tailwind CSS 경고만 존재)
- **정적 페이지 생성**: 55/55 완료

### 2. Git 상태
- **현재 브랜치**: `main`
- **원격 저장소**: `naraddon/main` (프로덕션)
- **최신 커밋**: 정상 푸시됨

### 3. 파일 변경 사항
- `PolicyAnalysis.css`: 색상 대비 개선 적용
- `TtontokListBoard.tsx`: 링크 수정 적용
- `IntroVideo.css`: 모바일 버튼 위치 조정

## 🚨 잠재적 문제점

### 1. Vercel 빌드 캐시
- **증상**: 코드는 푸시되었으나 빌드 캐시로 인해 이전 버전 배포
- **해결책**: Vercel 대시보드에서 캐시 수동 삭제

### 2. 환경 변수 불일치
- **증상**: 개발 환경과 프로덕션 환경의 환경 변수 차이
- **확인 필요**:
  - `MONGODB_URI`
  - `CLOUDFLARE_R2_*` 관련 변수
  - `NOTION_API_KEY`

### 3. 빌드 타임아웃
- **증상**: 대용량 파일 처리나 외부 API 호출 시 타임아웃
- **해결책**: 빌드 타임아웃 설정 증가

## 💡 대응책

### Phase 1: 즉시 조치
1. **Vercel 대시보드 확인**
   ```bash
   # Vercel CLI로 상태 확인
   vercel ls
   vercel inspect [deployment-url]
   ```

2. **캐시 삭제 및 재배포**
   ```bash
   # 캐시 무시하고 재배포
   vercel --force
   ```

3. **환경 변수 동기화**
   - Vercel 대시보드 > Settings > Environment Variables
   - 모든 필수 변수 확인

### Phase 2: 중간 조치
1. **빌드 로그 상세 분석**
   - Vercel 대시보드 > Deployments > 실패한 배포 클릭
   - Build Logs 확인

2. **롤백 옵션**
   ```bash
   # 이전 성공한 배포로 롤백
   vercel rollback
   ```

3. **브랜치 전략 변경**
   - `develop` 브랜치 생성
   - PR을 통한 배포 프로세스 구축

### Phase 3: 장기 개선
1. **CI/CD 파이프라인 구축**
   - GitHub Actions 설정
   - 자동 테스트 추가
   - 스테이징 환경 구성

2. **모니터링 강화**
   - Vercel Analytics 활성화
   - Error tracking (Sentry) 도입
   - 배포 알림 설정

## 🛠️ 체크리스트

### 배포 전 확인사항
- [ ] 로컬 빌드 성공 확인
- [ ] 환경 변수 설정 확인
- [ ] MongoDB 연결 테스트
- [ ] Cloudflare R2 권한 확인
- [ ] API 엔드포인트 응답 확인

### 배포 후 확인사항
- [ ] 메인 페이지 로드 확인
- [ ] 정책분석 페이지 모바일 뷰 확인
- [ ] 정책소식 게시글 목록 확인
- [ ] 똔톡 게시판 링크 작동 확인
- [ ] 콘솔 에러 확인

## 📞 긴급 대응 연락처
- Vercel Support: https://vercel.com/support
- MongoDB Atlas Support: https://www.mongodb.com/support
- Cloudflare Support: https://support.cloudflare.com

## 🔄 복구 절차

### 빠른 복구
```bash
# 1. 최근 작동 버전 확인
git log --oneline -10

# 2. 작동하는 버전으로 롤백
git reset --hard [commit-hash]

# 3. 강제 푸시
git push naraddon main --force

# 4. Vercel 재배포 트리거
vercel --prod
```

### 안전한 복구
```bash
# 1. 백업 브랜치 생성
git checkout -b backup-current-state

# 2. 안정 버전 체크아웃
git checkout [stable-commit]

# 3. 새 브랜치에서 배포
git checkout -b hotfix-deployment
git push naraddon hotfix-deployment:main
```

## 📝 추가 참고사항

### Next.js 14.1.0 특이사항
- App Router 사용 중
- 정적 생성과 서버 사이드 렌더링 혼용
- Middleware 설정 확인 필요

### MongoDB Atlas 연결
- IP 화이트리스트 확인 필요
- Vercel 함수 리전과 Atlas 클러스터 리전 일치 확인

### Cloudflare R2
- CORS 정책 설정 확인
- 버킷 권한 설정 확인
- 엔드포인트 URL 유효성 확인

---
*최종 업데이트: 2025-09-22*