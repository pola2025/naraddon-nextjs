// API 검증 스크립트
const password = process.env.NARADDON_TUBE_PASSWORD;

// 색상 설정
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// 로그 헬퍼
const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  test: (msg) => console.log(`${colors.yellow}▸${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.cyan}═══ ${msg} ═══${colors.reset}\n`)
};

// 테스트 환경 설정
const environments = {
  local: {
    name: '로컬 환경',
    baseUrl: 'http://localhost:3000',
    timeout: 5000
  },
  production: {
    name: '프로덕션 환경',
    baseUrl: 'https://naraddon-homepage.vercel.app',
    timeout: 10000
  }
};

// API 테스트 함수
async function testVerifyAPI(env) {
  const { baseUrl, timeout } = env;

  try {
    // 1. 잘못된 비밀번호 테스트
    const wrongRes = await fetch(`${baseUrl}/api/naraddon-tube/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'wrong' }),
      signal: AbortSignal.timeout(timeout)
    });

    if (wrongRes.status === 401) {
      log.success('잘못된 비밀번호 거부 확인');
    } else {
      log.error(`예상치 못한 상태 코드: ${wrongRes.status}`);
      const text = await wrongRes.text();
      console.log('응답:', text.substring(0, 200));
    }

    // 2. 올바른 비밀번호 테스트
    const correctRes = await fetch(`${baseUrl}/api/naraddon-tube/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
      signal: AbortSignal.timeout(timeout)
    });

    if (correctRes.status === 200) {
      const data = await correctRes.json();
      log.success(`인증 성공: ${JSON.stringify(data)}`);
      return true;
    } else {
      log.error(`인증 실패: ${correctRes.status}`);
      const text = await correctRes.text();
      console.log('응답:', text.substring(0, 200));
      return false;
    }
  } catch (error) {
    log.error(`Verify API 에러: ${error.message}`);
    return false;
  }
}

async function testGetExaminers(env) {
  const { baseUrl, timeout } = env;

  try {
    const res = await fetch(`${baseUrl}/api/naraddon-tube/examiners`, {
      signal: AbortSignal.timeout(timeout)
    });

    if (res.status === 200) {
      const data = await res.json();
      log.success(`심사관 ${data.total || data.examiners?.length || 0}명 조회 성공`);
      if (data.examiners && data.examiners.length > 0) {
        log.info(`첫 번째 심사관: ${data.examiners[0].name} - ${data.examiners[0].position}`);
      }
      return data.examiners || [];
    } else {
      log.error(`조회 실패: ${res.status}`);
      return [];
    }
  } catch (error) {
    log.error(`GET Examiners 에러: ${error.message}`);
    return [];
  }
}

async function testCRUDOperations(env) {
  const { baseUrl, timeout } = env;
  let testId = null;

  try {
    // CREATE 테스트
    log.test('CREATE - 새 심사관 생성');
    const createRes = await fetch(`${baseUrl}/api/naraddon-tube/examiners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password,
        name: '테스트 심사관',
        position: 'API 테스트 전문가',
        companyName: 'API 테스트 회사',
        category: 'funding',
        isPublished: false
      }),
      signal: AbortSignal.timeout(timeout)
    });

    if (createRes.status === 201) {
      const data = await createRes.json();
      testId = data.examiner._id;
      log.success(`심사관 생성 성공 (ID: ${testId})`);
    } else {
      log.error(`생성 실패: ${createRes.status}`);
      const text = await createRes.text();
      console.log('응답:', text.substring(0, 200));
      return false;
    }

    // READ 테스트
    if (testId) {
      log.test(`READ - 심사관 조회 (ID: ${testId})`);
      const readRes = await fetch(`${baseUrl}/api/naraddon-tube/examiners/${testId}`, {
        signal: AbortSignal.timeout(timeout)
      });

      if (readRes.status === 200) {
        const data = await readRes.json();
        log.success(`심사관 조회 성공: ${data.examiner.name}`);
      } else {
        log.error(`조회 실패: ${readRes.status}`);
      }

      // UPDATE 테스트
      log.test('UPDATE - 심사관 수정');
      const updateRes = await fetch(`${baseUrl}/api/naraddon-tube/examiners/${testId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          position: '수석 API 테스트 전문가',
          successRate: 99
        }),
        signal: AbortSignal.timeout(timeout)
      });

      if (updateRes.status === 200) {
        const data = await updateRes.json();
        log.success(`심사관 수정 성공: ${data.examiner.position}`);
      } else {
        log.error(`수정 실패: ${updateRes.status}`);
      }

      // DELETE 테스트
      log.test('DELETE - 심사관 삭제');
      const deleteRes = await fetch(`${baseUrl}/api/naraddon-tube/examiners/${testId}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': password },
        signal: AbortSignal.timeout(timeout)
      });

      if (deleteRes.status === 200) {
        log.success('심사관 삭제 성공');
      } else {
        log.error(`삭제 실패: ${deleteRes.status}`);
      }
    }

    return true;
  } catch (error) {
    log.error(`CRUD 작업 에러: ${error.message}`);

    // 에러 발생 시 테스트 데이터 정리
    if (testId) {
      try {
        await fetch(`${baseUrl}/api/naraddon-tube/examiners/${testId}`, {
          method: 'DELETE',
          headers: { 'x-admin-password': password },
          signal: AbortSignal.timeout(timeout)
        });
        log.info('테스트 데이터 정리 완료');
      } catch (cleanupError) {
        // 정리 실패는 무시
      }
    }

    return false;
  }
}

// 메인 실행 함수
async function runTests() {
  console.log(`\n${colors.blue}═══════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}      naraddon-tube API 검증 시작${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════════════════${colors.reset}\n`);

  const results = {
    local: { verify: false, examiners: false, crud: false },
    production: { verify: false, examiners: false, crud: false }
  };

  // 로컬 환경 테스트
  log.section(environments.local.name);

  results.local.verify = await testVerifyAPI(environments.local);
  await new Promise(r => setTimeout(r, 500));

  if (results.local.verify) {
    results.local.examiners = (await testGetExaminers(environments.local)).length > 0;
    await new Promise(r => setTimeout(r, 500));

    results.local.crud = await testCRUDOperations(environments.local);
  }

  // 프로덕션 환경 테스트
  log.section(environments.production.name);

  log.info('Vercel 배포 확인 중...');
  results.production.verify = await testVerifyAPI(environments.production);
  await new Promise(r => setTimeout(r, 500));

  if (results.production.verify) {
    results.production.examiners = (await testGetExaminers(environments.production)).length > 0;
    await new Promise(r => setTimeout(r, 500));

    results.production.crud = await testCRUDOperations(environments.production);
  }

  // 결과 요약
  log.section('테스트 결과 요약');

  console.log('로컬 환경:');
  console.log(`  - 인증 API: ${results.local.verify ? '✅ 성공' : '❌ 실패'}`);
  console.log(`  - 조회 API: ${results.local.examiners ? '✅ 성공' : '❌ 실패'}`);
  console.log(`  - CRUD API: ${results.local.crud ? '✅ 성공' : '❌ 실패'}`);

  console.log('\n프로덕션 환경:');
  console.log(`  - 인증 API: ${results.production.verify ? '✅ 성공' : '❌ 실패'}`);
  console.log(`  - 조회 API: ${results.production.examiners ? '✅ 성공' : '❌ 실패'}`);
  console.log(`  - CRUD API: ${results.production.crud ? '✅ 성공' : '❌ 실패'}`);

  const allPassed = Object.values(results.local).every(v => v) &&
                    Object.values(results.production).every(v => v);

  console.log(`\n${colors.blue}═══════════════════════════════════════════════════${colors.reset}`);
  if (allPassed) {
    console.log(`${colors.green}      ✅ 모든 테스트 통과!${colors.reset}`);
  } else {
    console.log(`${colors.red}      ⚠️  일부 테스트 실패${colors.reset}`);
  }
  console.log(`${colors.blue}═══════════════════════════════════════════════════${colors.reset}\n`);
}

// 테스트 실행
runTests().catch(error => {
  log.error(`테스트 실행 중 치명적 오류: ${error.message}`);
  process.exit(1);
});