# 네이버 로그인 오픈 API 서비스 환경 설정 가이드

## 1. 네이버 개발자 센터 접속 및 애플리케이션 등록

### 1.1 네이버 개발자 센터 접속
1. [네이버 개발자 센터](https://developers.naver.com) 접속
2. 네이버 아이디로 로그인

### 1.2 애플리케이션 등록
1. 상단 메뉴에서 **Application → 애플리케이션 등록** 클릭
2. 애플리케이션 이름 입력: `나라똔 홈페이지` (예시)
3. 사용 API 선택: **네이버 로그인** 체크

## 2. 네이버 로그인 API 설정

### 2.1 서비스 환경 설정 - PC 웹 / 모바일 웹

#### STEP 1: PC 웹 설정
✅ **PC 웹** 체크박스 선택

**서비스 URL** 입력란에 다음과 같이 입력:

⚠️ **중요 - 서비스 URL 입력 규칙:**
- ✅ 올바른 예시: `https://naraddon.com` (도메인만 입력)
- ❌ 잘못된 예시: `https://www.naraddon.com` (www 포함 X)
- 프로토콜(http/https)과 도메인만 입력
- 경로(/path) 포함하지 않음

**운영환경 서비스 URL:**
```
https://naraddon.com
```

⚠️ **개발 환경 테스트 방법:**
네이버는 외부에서 접근 가능한 URL만 허용하므로, localhost는 직접 사용할 수 없습니다.

**개발 환경 해결 방법:**

**방법 1: 테스트 서버 사용 (권장)**
- Vercel, Netlify 등의 무료 호스팅 서비스에 개발 버전 배포
- 예: `https://naraddon-dev.vercel.app`

**방법 2: ngrok 사용**
```bash
# ngrok 설치 및 실행
npx ngrok http 3000

# 생성된 URL 예시: https://abc123.ngrok.io
# 이 URL을 네이버 개발자 센터에 등록
```

**방법 3: 개발용 도메인 사용**
- 서브도메인 생성: `dev.naraddon.com`
- 개발 서버를 해당 도메인으로 접근 가능하게 설정

💡 **참고**: 한 개의 애플리케이션에 여러 도메인을 등록하려면:
- 메인 도메인을 서비스 URL에 입력
- www 버전은 Callback URL에서 처리

#### STEP 2: 모바일 웹 설정
✅ **모바일 웹** 체크박스 선택

**서비스 URL** 입력란에 PC 웹과 동일하게 입력:
```
https://naraddon.com
```

#### 서비스 환경 설정 화면 예시:
```
┌──────────────────────────────────────────────────────┐
│  서비스 환경 설정                                      │
├──────────────────────────────────────────────────────┤
│  ✅ PC 웹                                            │
│     서비스 URL: https://naraddon.com                  │
│                                                       │
│  ✅ 모바일 웹                                         │
│     서비스 URL: https://naraddon.com                  │
│                                                       │
│  ☐ iOS                                               │
│  ☐ 안드로이드                                         │
└──────────────────────────────────────────────────────┘
```

⚠️ **서비스 URL 입력 시 주의사항:**
- 서비스 URL 값이 잘못 입력되면 네이버 로그인 사용이 일시적으로 제한됩니다
- 불법/음란성 사이트 등 이용약관에 위배되는 사이트는 이용이 제한됩니다
- 서비스하려는 사이트 URL과 동일한 URL로 입력해야 네이버 로그인 뱃지가 노출됩니다

### 2.2 네이버 로그인 Callback URL 설정 (최대 5개)

**네이버 로그인 Callback URL** 섹션에서 다음과 같이 설정:

#### Callback URL 입력 방법:
1. URL 입력 필드에 Callback URL 입력
2. 우측 **[+]** 버튼 클릭하여 추가
3. 최대 5개까지 등록 가능
4. 삭제 시 우측 **[-]** 버튼 클릭

**예시 형식:**
```
http://YOUR_DOMAIN/api/auth/callback/naver
```

#### 등록해야 할 Callback URL:

**운영 환경 (필수):**
```
https://naraddon.com/api/auth/callback/naver
https://www.naraddon.com/api/auth/callback/naver
```

**개발 환경 옵션:**

**옵션 1: Vercel 개발 환경 사용**
```
https://naraddon-dev.vercel.app/api/auth/callback/naver
```

**옵션 2: ngrok 임시 URL 사용**
```
https://abc123.ngrok.io/api/auth/callback/naver  (ngrok 실행 시 생성된 URL)
```

**옵션 3: 개발 서브도메인 사용**
```
https://dev.naraddon.com/api/auth/callback/naver
```

#### Callback URL 설정 화면:
```
┌──────────────────────────────────────────────────────┐
│  네이버 로그인                                         │
│  Callback URL (최대 5개)                              │
├──────────────────────────────────────────────────────┤
│  [http://localhost:3000/api/auth/callback/naver    ] [-]│
│  [https://naraddon.com/api/auth/callback/naver     ] [-]│
│  [https://www.naraddon.com/api/auth/callback/naver ] [-]│
│  [                                                 ] [+]│
│  [                                                 ] [+]│
└──────────────────────────────────────────────────────┘
```

⚠️ **Callback URL 설정 시 주의사항:**
- Callback URL은 네이버 로그인 후 이동할 페이지 URL입니다
- Callback URL 값이 잘못 입력되면 네이버 로그인 사용이 일시적으로 제한됩니다
- 입력한 주소와 다른 Callback URL로 리다이렉트될 경우, 이용이 제한됩니다
- 대소문자, 슬래시(/) 위치까지 정확하게 일치해야 합니다

### 2.3 로그인 오픈 API 서비스 환경 설정 완료 확인

모든 설정이 완료되면 다음과 같이 표시됩니다:

```
서비스 환경: PC 웹, 모바일 웹
서비스 URL: 5개 등록됨
Callback URL: 5개 등록됨
상태: 개발 중
```

⚠️ **주의사항:**
1. **프로토콜 일치**: http와 https는 다른 URL로 인식됨
2. **포트번호 포함**: localhost:3000과 localhost:3001은 별개로 등록
3. **www 유무**: naraddon.com과 www.naraddon.com 모두 등록
4. **대소문자 구분**: URL은 대소문자를 구분하므로 정확히 입력
5. **슬래시 위치**: 마지막 슬래시(/) 포함 여부도 정확히 일치해야 함

### 2.4 추가 설정 팁

#### 로컬 개발 환경에서 HTTPS 테스트가 필요한 경우:
```
https://localhost:3000
https://localhost:3001
```
* mkcert 등을 사용하여 로컬 SSL 인증서 설정 필요

#### 스테이징 환경이 있는 경우:
```
https://staging.naraddon.com
https://dev.naraddon.com
```

#### 모바일 앱 웹뷰에서 사용하는 경우:
```
app://naraddon  (커스텀 스킴)
```

## 3. 필수 정보 제공 동의 항목 설정

### 3.1 제공 정보 선택
네이버 로그인 API 설정 페이지에서 **제공 정보 선택** 섹션:

#### 필수 정보 설정 ✅
다음 항목들을 **필수** 로 설정:

1. **회원이름 (name)**
   - 체크박스: ✅ 사용
   - 필수/선택: **필수** 선택
   - 설명: 서비스 이용을 위해 실명이 필요합니다

2. **이메일주소 (email)**
   - 체크박스: ✅ 사용
   - 필수/선택: **필수** 선택
   - 설명: 중요 안내사항 전달을 위해 이메일이 필요합니다

3. **휴대전화번호 (mobile)**
   - 체크박스: ✅ 사용
   - 필수/선택: **필수** 선택
   - 설명: 본인 확인 및 중요 알림을 위해 휴대전화번호가 필요합니다

#### 선택 정보 설정 (필요시)
다음 항목들은 필요에 따라 설정:
- 프로필 사진: 선택
- 별명: 미사용
- 성별: 미사용
- 생일: 미사용
- 연령대: 미사용
- 출생연도: 미사용

### 3.2 동의 항목 설정 화면 예시
```
┌──────────────────────────────────────────────────────┐
│  제공 정보 선택                                        │
├──────────────────────────────────────────────────────┤
│  ✅ 회원이름        [필수▼]  실명 필요                 │
│  ✅ 이메일주소      [필수▼]  이메일 알림용             │
│  ✅ 휴대전화번호    [필수▼]  본인확인용                │
│  ☐ 프로필사진      [선택▼]                           │
│  ☐ 별명           [미사용▼]                          │
│  ☐ 성별           [미사용▼]                          │
└──────────────────────────────────────────────────────┘
```

## 4. 애플리케이션 정보 확인

### 4.1 Client ID & Client Secret 확인
1. **애플리케이션 정보** 탭 클릭
2. 다음 정보 확인 및 복사:
   - **Client ID**: `발급된_클라이언트_아이디`
   - **Client Secret**: `발급된_시크릿_키`

### 4.2 환경 변수 설정
프로젝트의 `.env.local` 파일에 추가:

```env
# Naver OAuth
NAVER_CLIENT_ID=발급된_클라이언트_아이디
NAVER_CLIENT_SECRET=발급된_시크릿_키
```

## 5. 개발 상태 및 검수

### 5.1 개발 상태
초기 상태는 **개발 중** 상태입니다.

**개발 중 상태의 제한사항:**
- 등록된 테스트 아이디만 로그인 가능
- 일반 사용자 로그인 불가

### 5.2 테스트 아이디 등록
1. **멤버 관리** 메뉴 클릭
2. **테스트 아이디 추가** 버튼 클릭
3. 테스터의 네이버 아이디 입력
4. 최대 20명까지 등록 가능

### 5.3 서비스 검수 신청 (운영 전 필수!)
1. **API 설정** 메뉴에서 **검수 요청** 버튼 클릭
2. 검수 신청서 작성:
   - 서비스 소개
   - 정보 이용 목적 상세 설명
   - 개인정보 처리방침 URL
   - 서비스 이용약관 URL

**검수 통과 후:**
- 상태가 **서비스 적용**으로 변경
- 모든 네이버 사용자 로그인 가능

## 6. NextAuth.js 네이버 프로바이더 설정

### 6.1 설치
```bash
npm install next-auth
```

### 6.2 프로바이더 설정 코드
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import NaverProvider from 'next-auth/providers/naver';

const handler = NextAuth({
  providers: [
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.response.id,
          email: profile.response.email,
          name: profile.response.name,
          image: profile.response.profile_image,
          phone: profile.response.mobile,
          // 추가 필드 매핑
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // 필수 정보 확인
      if (account?.provider === 'naver') {
        const naverProfile = profile as any;

        // 필수 정보가 없으면 로그인 거부
        if (!naverProfile.response.email ||
            !naverProfile.response.name ||
            !naverProfile.response.mobile) {
          return false;
        }
      }
      return true;
    },
    async jwt({ token, account, profile }) {
      if (account?.provider === 'naver') {
        const naverProfile = profile as any;
        token.phone = naverProfile.response.mobile;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.phone) {
        session.user.phone = token.phone as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
```

## 7. 로그인 버튼 구현

```tsx
// components/auth/NaverLoginButton.tsx
'use client';

import { signIn } from 'next-auth/react';

export default function NaverLoginButton() {
  const handleNaverLogin = () => {
    signIn('naver', {
      callbackUrl: '/dashboard',
      redirect: true
    });
  };

  return (
    <button
      onClick={handleNaverLogin}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#03C75A] text-white rounded-md hover:bg-[#02B351] transition-colors"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M13.5 10.7V3H17V17H13.5V10.3L6.5 17H3V3H6.5L13.5 10.7Z" fill="white"/>
      </svg>
      네이버로 로그인
    </button>
  );
}
```

## 8. 체크리스트

### 개발 환경 설정
- [ ] 네이버 개발자 센터 가입
- [ ] 애플리케이션 등록
- [ ] PC 웹 서비스 URL 등록
- [ ] 모바일 웹 서비스 URL 등록
- [ ] 콜백 URL 등록 (개발/운영)
- [ ] Client ID/Secret 발급
- [ ] 환경 변수 설정

### 필수 정보 설정
- [ ] 회원이름(name) - 필수 설정
- [ ] 이메일주소(email) - 필수 설정
- [ ] 휴대전화번호(mobile) - 필수 설정

### 테스트
- [ ] 테스트 아이디 등록
- [ ] 로그인 플로우 테스트
- [ ] 필수 정보 수신 확인

### 운영 준비
- [ ] 개인정보 처리방침 작성
- [ ] 서비스 이용약관 작성
- [ ] 검수 신청
- [ ] 검수 통과

## 9. 트러블슈팅

### 문제: "redirect_uri_mismatch" 오류
**해결:**
- 네이버 개발자 센터에 등록한 콜백 URL과 실제 요청 URL이 정확히 일치하는지 확인
- 프로토콜(http/https), 포트, 경로 모두 확인

### 문제: 필수 정보를 받을 수 없음
**해결:**
- 네이버 개발자 센터에서 해당 정보를 "필수"로 설정했는지 확인
- 사용자가 정보 제공에 동의했는지 확인

### 문제: 일반 사용자 로그인 불가
**해결:**
- 애플리케이션이 아직 "개발 중" 상태인지 확인
- 검수 신청 및 승인 필요

## 10. 참고 자료
- [네이버 로그인 개발가이드](https://developers.naver.com/docs/login/devguide/)
- [네이버 로그인 API 명세](https://developers.naver.com/docs/login/api/)
- [NextAuth.js Naver Provider](https://next-auth.js.org/providers/naver)