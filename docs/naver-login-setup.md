# 네이버 로그인 설정 가이드

## 1. 네이버 개발자센터 설정

### 1.1 애플리케이션 등록
1. [네이버 개발자센터](https://developers.naver.com) 접속
2. 애플리케이션 등록 → 애플리케이션 이름 입력
3. 사용 API: **네이버 로그인** 선택
4. 제공 정보 선택:
   - 필수: 회원이름, 이메일주소
   - 선택: 프로필사진, 휴대전화번호

### 1.2 서비스 URL 설정
- **서비스 URL**:
  - 개발: `http://localhost:3000`
  - 프로덕션: `https://naraddon.com`

- **Callback URL** (중요):
  - 개발: `http://localhost:3000/api/auth/callback/naver`
  - 프로덕션: `https://naraddon.com/api/auth/callback/naver`

## 2. 환경변수 설정

### 2.1 .env.local 파일 설정
```env
# 네이버 로그인 (네이버 개발자센터에서 발급)
NAVER_CLIENT_ID=애플리케이션_클라이언트_ID
NAVER_CLIENT_SECRET=애플리케이션_클라이언트_시크릿

# NextAuth 설정
NEXTAUTH_URL=http://localhost:3000  # 프로덕션: https://naraddon.com
NEXTAUTH_SECRET=your_nextauth_secret_key
```

### 2.2 Vercel 환경변수 설정
1. Vercel 대시보드 → Settings → Environment Variables
2. 다음 변수 추가:
   - `NAVER_CLIENT_ID`
   - `NAVER_CLIENT_SECRET`
   - `NEXTAUTH_URL` (프로덕션: https://naraddon.com)
   - `NEXTAUTH_SECRET`

## 3. 네이버 로그인 오류 해결

### 오류: "서비스 설정에 오류가 있어 네이버 아이디로 로그인할 수 없습니다"

**원인 및 해결방법:**

1. **Client ID/Secret 불일치**
   - 네이버 개발자센터의 값과 환경변수 값이 정확히 일치하는지 확인
   - 공백이나 줄바꿈 문자가 포함되지 않았는지 확인

2. **Callback URL 불일치**
   - 네이버 개발자센터에 등록된 Callback URL과 실제 사용 URL이 일치해야 함
   - 프로토콜(http/https), 포트번호까지 정확히 일치 필요
   - 여러 환경 사용 시 모든 URL 등록 필요

3. **서비스 상태**
   - 네이버 개발자센터 → 애플리케이션 → 서비스 상태가 "사용"으로 설정되어 있는지 확인

4. **로컬 개발 환경**
   - `NEXTAUTH_URL`이 실제 서비스 URL과 일치하는지 확인
   - 포트번호 확인 (기본: 3000, 변경 시: 3001, 3004 등)

## 4. 테스트 및 배포

### 4.1 로컬 테스트
```bash
# 환경변수 확인
echo $NAVER_CLIENT_ID
echo $NAVER_CLIENT_SECRET

# 개발 서버 실행
npm run dev

# http://localhost:3000/auth/login 접속
```

### 4.2 프로덕션 배포
1. Vercel에 환경변수 설정 완료 확인
2. 네이버 개발자센터에 프로덕션 URL 등록
3. 배포 후 테스트:
   ```bash
   git push origin main
   # Vercel 자동 배포 대기
   # https://naraddon.com/auth/login 테스트
   ```

## 5. 보안 주의사항

### 절대 하지 말아야 할 것:
- ❌ Client ID/Secret을 코드에 하드코딩
- ❌ .env.local 파일을 Git에 커밋
- ❌ 공개 저장소에 인증 정보 노출

### 반드시 해야 할 것:
- ✅ 모든 인증 정보는 환경변수로 관리
- ✅ .env.local은 .gitignore에 포함
- ✅ .env.example 파일로 필요한 환경변수 문서화
- ✅ Vercel 등 배포 플랫폼의 환경변수 기능 사용

## 6. 트러블슈팅 체크리스트

- [ ] 네이버 개발자센터에서 Client ID/Secret 확인
- [ ] .env.local에 NAVER_CLIENT_ID, NAVER_CLIENT_SECRET 설정
- [ ] NEXTAUTH_URL이 현재 서비스 URL과 일치
- [ ] 네이버 개발자센터 Callback URL이 `/api/auth/callback/naver`로 끝남
- [ ] 서비스 상태가 "사용"으로 설정됨
- [ ] 환경변수에 공백이나 따옴표가 포함되지 않음
- [ ] 개발/프로덕션 환경에 맞는 URL 사용

## 7. 참고 자료
- [네이버 로그인 API 명세](https://developers.naver.com/docs/login/api/)
- [NextAuth.js 문서](https://next-auth.js.org/)
- [Vercel 환경변수 가이드](https://vercel.com/docs/environment-variables)