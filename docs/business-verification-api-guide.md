# 사업자등록정보 진위확인 API 사용 가이드

## 1. API 키 발급 절차

### 1.1 공공데이터포털 회원가입
1. [https://www.data.go.kr](https://www.data.go.kr) 접속
2. 상단 "회원가입" 클릭
3. 회원정보 입력:
   - 아이디: 이메일 주소 사용
   - 비밀번호: 8자 이상 (영문, 숫자, 특수문자 포함)
   - 휴대폰 인증 필수

### 1.2 API 활용 신청
1. 로그인 후 검색창에 "사업자등록정보 진위확인" 검색
2. 또는 직접 링크 접속: [https://www.data.go.kr/data/15081808/openapi.do](https://www.data.go.kr/data/15081808/openapi.do)
3. "활용신청" 버튼 클릭

### 1.3 활용신청서 작성
```
활용목적: 나라똤 플랫폼 사업자 인증
활용정보: 사업자등록번호 진위확인
상세설명: 
- 회원가입 시 사업자 번호 유효성 검증
- 게시글 작성 권한 부여를 위한 사업자 확인
- 서비스 신뢰도 향상을 위한 기업 인증

활용구분: 웹서비스
사이트 URL: https://naraddon.com
```

### 1.4 승인 대기
- **자동승인**: 대부분 즉시 승인
- **수동승인**: 1-2일 소요 (업무일 기준)
- 승인 상태는 "마이페이지 > 활용신청 현황"에서 확인

### 1.5 API 키 확인
1. 마이페이지 > 활용신청 현황
2. 승인된 서비스 클릭
3. "인증키" 항목에서 API Key 확인
4. **Encoding 및 Decoding 키 모두 복사해서 저장**

## 2. 환경변수 설정

`.env.local` 파일에 추가:
```env
# 공공데이터포털 API (사업자등록정보 진위확인)
DATA_GO_KR_API_KEY=여기에_발급받은_Encoding_키_입력
```

## 3. API 사용 정보

### 3.1 엔드포인트
```
POST https://api.odcloud.kr/api/nts-businessman/v1/validate
```

### 3.2 요청 헤더
```javascript
{
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json'
}
```

### 3.3 요청 바디
```javascript
{
  "businesses": [
    {
      "b_no": "1234567890",        // 사업자번호 (10자리, - 제외)
      "start_dt": "20200101",       // 개업일자 (YYYYMMDD) - 선택
      "p_nm": "홍길동"               // 대표자명 - 선택
    }
  ]
}
```

### 3.4 응답 형식
```javascript
{
  "status_code": "OK",
  "match_cnt": 1,
  "data": [
    {
      "b_no": "1234567890",
      "valid": "01",              // 01: 계속사업자, 02: 휴업자, 03: 폐업자
      "valid_msg": "계속사업자 입니다.",
      "request_param": {
        "b_no": "1234567890",
        "start_dt": "20200101",
        "p_nm": "홍길동"
      },
      "status": {
        "b_no": "OK",
        "start_dt": "OK",
        "p_nm": "OK"
      }
    }
  ]
}
```

## 4. 구현 예시

### 4.1 개발 환경 테스트
API 키가 없을 경우 개발 환경에서 테스트용 데이터를 사용합니다:

```javascript
// /api/business/verify/route.ts
if (process.env.NODE_ENV === 'development' && !API_KEY) {
  // 테스트용 사업자번호
  // 삼성전자: 120-81-47035
  // SK: 110-81-11025
  // LG: 107-86-14075
  
  if (cleanedNumber === '1208147035') {
    return NextResponse.json({
      valid: true,
      businessNumber: businessNumber,
      companyName: '삼성전자주식회사',
      businessStatus: '계속사업자',
      message: '검증 성공 (개발 테스트)'
    });
  }
}
```

### 4.2 프론트엔드 호출
```javascript
const verifyBusinessNumber = async (businessNumber: string) => {
  try {
    const response = await fetch('/api/business/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessNumber })
    });
    
    const result = await response.json();
    
    if (result.valid) {
      // 사업자 번호가 유효함
      console.log('상호명:', result.companyName);
      console.log('상태:', result.businessStatus);
    } else {
      // 유효하지 않은 사업자 번호
      alert(result.message);
    }
  } catch (error) {
    console.error('검증 실패:', error);
  }
};
```

## 5. 주의사항

### 5.1 API 제한
- **일일 호출 횟수**: 10,000건
- **동시 호출**: 최대 10건
- **응답 시간**: 평균 0.5초 이내

### 5.2 오류 처리
```javascript
// API 키 만료 시
if (response.status === 401) {
  console.error('API 키가 만료되었거나 유효하지 않습니다.');
}

// 일일 호출 횟수 초과
if (response.status === 429) {
  console.error('일일 API 호출 횟수를 초과했습니다.');
}
```

### 5.3 보안 고려사항
- API 키는 반드시 환경변수로 관리
- 클라이언트 측에서 직접 API 호출 금지
- 서버 API를 통해서만 호출
- 검증 결과는 DB에 캐싱하여 중복 호출 방지

## 6. 테스트 사업자 번호

개발 시 테스트용으로 사용 가능한 대기업 사업자 번호:

| 회사명 | 사업자번호 | 대표자명 |
|--------|------------|----------|
| 삼성전자 | 120-81-47035 | 한종희 |
| SK텔레콤 | 104-81-37225 | 유영상 |
| LG전자 | 107-86-14075 | 조주완 |
| 현대자동차 | 101-81-09652 | 장재훈 |
| 네이버 | 220-81-62517 | 최수연 |
| 카카오 | 120-81-47521 | 홍은택 |

## 7. 문제 해결

### Q1. API 키가 승인되지 않아요
- 활용목적을 명확하게 작성했는지 확인
- 기업/기관 회원으로 가입했는지 확인
- 공공데이터포털 고객센터: 1566-9988

### Q2. API 호출이 안 돼요
- API 키가 환경변수에 잘 설정되었는지 확인
- Bearer 토큰 형식으로 전송하는지 확인
- 사업자 번호에서 '-' 제거 후 10자리인지 확인

### Q3. 개발환경에서 테스트하고 싶어요
- 환경변수 `DATA_GO_KR_API_KEY`를 설정하지 않으면 자동으로 테스트 모드 사용
- 위에 제공된 테스트 사업자 번호 사용

## 8. 참고 링크

- [공공데이터포털](https://www.data.go.kr)
- [사업자등록정보 진위확인 API](https://www.data.go.kr/data/15081808/openapi.do)
- [공공데이터포털 사용자 가이드](https://www.data.go.kr/ugs/selectPublicDataUseGuideView.do)

---
*마지막 업데이트: 2025-09-23*