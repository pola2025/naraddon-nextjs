# 소셜 로그인 구현 가이드

## 1. 필요한 패키지 설치

```bash
npm install next-auth
npm install @next-auth/mongodb-adapter mongodb
```

## 2. 각 플랫폼별 설정

### 2.1 Google OAuth 설정

#### 1) Google Cloud Console 설정
1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. APIs & Services > Credentials 이동
4. "Create Credentials" > "OAuth client ID" 선택
5. Application type: "Web application"
6. Authorized redirect URIs 추가:
   - 개발: `http://localhost:3000/api/auth/callback/google`
   - 프로덕션: `https://yourdomain.com/api/auth/callback/google`

#### 2) 환경 변수 설정
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 2.2 Naver OAuth 설정

#### 1) Naver Developers 설정
1. [Naver Developers](https://developers.naver.com) 접속
2. Application > 애플리케이션 등록
3. 사용 API: "네이버 로그인" 선택
4. 서비스 환경: PC웹, 모바일웹 체크
5. 서비스 URL:
   - 개발: `http://localhost:3000`
   - 프로덕션: `https://yourdomain.com`
6. Callback URL:
   - 개발: `http://localhost:3000/api/auth/callback/naver`
   - 프로덕션: `https://yourdomain.com/api/auth/callback/naver`

#### 2) 환경 변수 설정
```env
NAVER_CLIENT_ID=your-naver-client-id
NAVER_CLIENT_SECRET=your-naver-client-secret
```

### 2.3 Kakao OAuth 설정

#### 1) Kakao Developers 설정
1. [Kakao Developers](https://developers.kakao.com) 접속
2. 내 애플리케이션 > 애플리케이션 추가
3. 앱 키 > REST API 키 복사
4. 플랫폼 > Web 플랫폼 등록:
   - 사이트 도메인:
     - `http://localhost:3000`
     - `https://yourdomain.com`
5. 카카오 로그인 > 활성화 설정 ON
6. Redirect URI 등록:
   - 개발: `http://localhost:3000/api/auth/callback/kakao`
   - 프로덕션: `https://yourdomain.com/api/auth/callback/kakao`
7. 동의 항목 설정:
   - 닉네임: 필수 동의
   - 카카오계정(이메일): 필수 동의

#### 2) 환경 변수 설정
```env
KAKAO_CLIENT_ID=your-kakao-rest-api-key
KAKAO_CLIENT_SECRET=your-kakao-client-secret
```

## 3. NextAuth 설정

### 3.1 NextAuth 환경 변수
```env
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# 프로덕션에서는
# NEXTAUTH_URL=https://yourdomain.com
```

### 3.2 MongoDB 연결
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
```

## 4. 구현 파일 구조

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts       # NextAuth API 라우트
│   ├── auth/
│   │   ├── signin/
│   │   │   └── page.tsx          # 로그인 페이지
│   │   └── error/
│   │       └── page.tsx          # 에러 페이지
│   └── ...
├── lib/
│   └── auth/
│       ├── authOptions.ts        # NextAuth 설정
│       └── providers.ts          # OAuth 프로바이더 설정
└── components/
    └── auth/
        ├── LoginButton.tsx        # 로그인 버튼
        └── SocialLoginButtons.tsx # 소셜 로그인 버튼들
```

## 5. NextAuth Provider 설정 예시

```typescript
// src/lib/auth/authOptions.ts
import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
  ],
  // ... 기타 설정
};
```

## 6. 체크리스트

### Google OAuth
- [ ] Google Cloud Console 프로젝트 생성
- [ ] OAuth 2.0 클라이언트 ID 생성
- [ ] 리디렉션 URI 설정
- [ ] 환경 변수 설정

### Naver OAuth
- [ ] Naver Developers 애플리케이션 등록
- [ ] 네이버 로그인 API 사용 설정
- [ ] Callback URL 등록
- [ ] 환경 변수 설정

### Kakao OAuth
- [ ] Kakao Developers 앱 생성
- [ ] 카카오 로그인 활성화
- [ ] Redirect URI 등록
- [ ] 동의 항목 설정
- [ ] 환경 변수 설정

### NextAuth 구현
- [ ] NextAuth 패키지 설치
- [ ] MongoDB Adapter 설정
- [ ] API 라우트 생성
- [ ] 로그인 페이지 구현
- [ ] 세션 관리 설정

## 7. 보안 주의사항

1. **환경 변수 관리**
   - 절대 클라이언트 시크릿을 프론트엔드에 노출하지 않기
   - `.env.local` 파일은 절대 커밋하지 않기

2. **Redirect URI 검증**
   - 등록된 URI만 허용
   - 와일드카드 사용 자제

3. **세션 보안**
   - HTTPS 환경에서만 쿠키 전송
   - 세션 토큰 암호화

4. **사용자 정보 보호**
   - 필요한 정보만 요청
   - 개인정보 암호화 저장

## 8. 테스트 계정

각 플랫폼별로 테스트 계정을 만들어 로그인 플로우를 테스트하세요:
- Google: 일반 Google 계정 사용 가능
- Naver: 개발자 계정 또는 테스트 계정
- Kakao: 개발자 계정 또는 테스트 계정

## 9. 트러블슈팅

### 일반적인 오류들

#### "Redirect URI mismatch"
- 플랫폼에 등록한 URI와 실제 콜백 URI가 정확히 일치하는지 확인
- 프로토콜(http/https), 포트번호, 경로 모두 확인

#### "Invalid client"
- Client ID와 Secret이 올바른지 확인
- 환경 변수가 제대로 로드되는지 확인

#### "Access denied"
- 앱이 활성화 상태인지 확인
- 필요한 권한/스코프가 설정되어 있는지 확인

## 10. 참고 문서

- [NextAuth.js 공식 문서](https://next-auth.js.org/)
- [Google Identity Platform](https://developers.google.com/identity)
- [Naver Login API](https://developers.naver.com/docs/login/overview/)
- [Kakao Login API](https://developers.kakao.com/docs/latest/ko/kakaologin/common)