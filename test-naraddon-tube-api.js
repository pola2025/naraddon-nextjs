// naraddon-tube API 테스트 스크립트
const baseUrl = 'http://localhost:3000/api/naraddon-tube';
const password = 'vhffkvhffk82';

// 색상 설정
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

// 로그 헬퍼
const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  test: (msg) => console.log(`${colors.yellow}▸${colors.reset} ${msg}`),
};

// 테스트 함수들
async function testVerifyAPI() {
  log.test('Testing POST /verify - 비밀번호 인증');

  try {
    // 잘못된 비밀번호 테스트
    const wrongRes = await fetch(`${baseUrl}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'wrong' })
    });

    if (wrongRes.status === 401) {
      log.success('잘못된 비밀번호 거부됨');
    } else {
      log.error(`예상치 못한 상태 코드: ${wrongRes.status}`);
    }

    // 올바른 비밀번호 테스트
    const correctRes = await fetch(`${baseUrl}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    if (correctRes.status === 200) {
      const data = await correctRes.json();
      log.success(`인증 성공: ${JSON.stringify(data)}`);
      return true;
    } else {
      log.error(`인증 실패: ${correctRes.status}`);
      return false;
    }
  } catch (error) {
    log.error(`Verify API 에러: ${error.message}`);
    return false;
  }
}

async function testGetExaminersWithAuth() {
  log.test('Testing GET /verify - 인증된 심사관 목록 조회');

  try {
    const res = await fetch(`${baseUrl}/verify`, {
      method: 'GET',
      headers: {
        'x-admin-password': password
      }
    });

    if (res.status === 200) {
      const data = await res.json();
      log.success(`심사관 ${data.total}명 조회 성공`);
      if (data.examiners && data.examiners.length > 0) {
        log.info(`첫 번째 심사관: ${data.examiners[0].name} - ${data.examiners[0].position}`);
      }
      return data.examiners;
    } else {
      log.error(`조회 실패: ${res.status}`);
      const error = await res.json();
      log.error(`에러 메시지: ${error.message}`);
      return [];
    }
  } catch (error) {
    log.error(`GET Examiners 에러: ${error.message}`);
    return [];
  }
}

async function testGetExaminers() {
  log.test('Testing GET /examiners - 공개 심사관 목록 조회');

  try {
    const res = await fetch(`${baseUrl}/examiners`);

    if (res.status === 200) {
      const data = await res.json();
      log.success(`공개 심사관 ${data.total}명 조회 성공`);
      return data.examiners;
    } else {
      log.error(`조회 실패: ${res.status}`);
      return [];
    }
  } catch (error) {
    log.error(`GET Public Examiners 에러: ${error.message}`);
    return [];
  }
}

async function testCreateExaminer() {
  log.test('Testing POST /examiners - 새 심사관 생성');

  const newExaminer = {
    password,
    name: '테스트 심사관',
    position: '테스트 전문가',
    companyName: '테스트 회사',
    category: 'funding',
    brandIcon: 'fas fa-test',
    rating: 4.5,
    successRate: 95,
    consultCount: 100,
    expertiseTags: ['테스트', '자동화', 'API'],
    expertiseDescription: '테스트 전문 컨설팅',
    expertiseDetail: ['API 테스트', '자동화 테스트'],
    sortOrder: 999,
    isPublished: true
  };

  try {
    const res = await fetch(`${baseUrl}/examiners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newExaminer)
    });

    if (res.status === 201) {
      const data = await res.json();
      log.success(`심사관 생성 성공: ${data.examiner.name}`);
      return data.examiner._id;
    } else {
      const error = await res.json();
      log.error(`생성 실패: ${res.status} - ${error.message}`);
      return null;
    }
  } catch (error) {
    log.error(`CREATE Examiner 에러: ${error.message}`);
    return null;
  }
}

async function testUpdateExaminer(id) {
  log.test(`Testing PUT /examiners - 심사관 수정 (ID: ${id})`);

  const updateData = {
    password,
    id,
    position: '수석 테스트 전문가',
    successRate: 98,
    consultCount: 150
  };

  try {
    const res = await fetch(`${baseUrl}/examiners`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });

    if (res.status === 200) {
      const data = await res.json();
      log.success(`심사관 수정 성공: ${data.examiner.position}`);
      return true;
    } else {
      const error = await res.json();
      log.error(`수정 실패: ${res.status} - ${error.message}`);
      return false;
    }
  } catch (error) {
    log.error(`UPDATE Examiner 에러: ${error.message}`);
    return false;
  }
}

async function testGetExaminerById(id) {
  log.test(`Testing GET /examiners/[id] - 특정 심사관 조회 (ID: ${id})`);

  try {
    const res = await fetch(`${baseUrl}/examiners/${id}`);

    if (res.status === 200) {
      const data = await res.json();
      log.success(`심사관 조회 성공: ${data.examiner.name} - ${data.examiner.position}`);
      return true;
    } else {
      const error = await res.json();
      log.error(`조회 실패: ${res.status} - ${error.message}`);
      return false;
    }
  } catch (error) {
    log.error(`GET Examiner by ID 에러: ${error.message}`);
    return false;
  }
}

async function testDeleteExaminer(id) {
  log.test(`Testing DELETE /examiners/[id] - 심사관 삭제 (ID: ${id})`);

  try {
    const res = await fetch(`${baseUrl}/examiners/${id}`, {
      method: 'DELETE',
      headers: {
        'x-admin-password': password
      }
    });

    if (res.status === 200) {
      log.success('심사관 삭제 성공');
      return true;
    } else {
      const error = await res.json();
      log.error(`삭제 실패: ${res.status} - ${error.message}`);
      return false;
    }
  } catch (error) {
    log.error(`DELETE Examiner 에러: ${error.message}`);
    return false;
  }
}

// 메인 테스트 실행
async function runTests() {
  console.log(`\n${colors.blue}═══════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}      naraddon-tube API 테스트 시작${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════════════════${colors.reset}\n`);

  // 1. 비밀번호 인증 테스트
  const authSuccess = await testVerifyAPI();
  if (!authSuccess) {
    log.error('인증 실패로 테스트 중단');
    return;
  }

  console.log('');

  // 2. 인증된 심사관 목록 조회 (verify 엔드포인트)
  const authExaminers = await testGetExaminersWithAuth();
  log.info(`인증된 조회로 ${authExaminers.length}명 확인`);

  console.log('');

  // 3. 공개 심사관 목록 조회
  const publicExaminers = await testGetExaminers();
  log.info(`공개 조회로 ${publicExaminers.length}명 확인`);

  console.log('');

  // 4. 새 심사관 생성
  const newExaminerId = await testCreateExaminer();

  if (newExaminerId) {
    console.log('');

    // 5. 특정 심사관 조회
    await testGetExaminerById(newExaminerId);

    console.log('');

    // 6. 심사관 정보 수정
    await testUpdateExaminer(newExaminerId);

    console.log('');

    // 7. 수정된 심사관 다시 조회
    await testGetExaminerById(newExaminerId);

    console.log('');

    // 8. 심사관 삭제
    await testDeleteExaminer(newExaminerId);
  }

  console.log(`\n${colors.blue}═══════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}      테스트 완료${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════════════════${colors.reset}\n`);
}

// 테스트 실행
runTests().catch(error => {
  log.error(`테스트 실행 중 치명적 오류: ${error.message}`);
  process.exit(1);
});