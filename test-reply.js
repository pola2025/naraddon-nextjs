// 전문가 댓글 테스트

async function addExpertReply() {
  const postId = '68d0a578e2ac2775c2d3fbd1';

  // 검증자 댓글 추가
  const examinerReply = await fetch(`http://localhost:3003/api/business-voice/ttontok/${postId}/replies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nickname: '천명숙',
      companyName: '한국기업평가원',
      content: '시드 투자 단계에서는 팀의 역량과 비전이 가장 중요합니다. MVP는 핵심 기능이 작동하는 수준이면 충분하며, 공동창업자 2-3명의 균형잡힌 팀 구성을 추천드립니다.',
      role: 'certified_examiner'
    })
  });

  // 전문가 댓글 추가
  const expertReply = await fetch(`http://localhost:3003/api/business-voice/ttontok/${postId}/replies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nickname: '김철수',
      companyName: '스타트업 컨설팅',
      content: '초기 스타트업의 경우 시장 검증이 우선입니다. 고객 인터뷰를 통해 실제 문제를 해결하고 있는지 확인하세요.',
      role: 'expert'
    })
  });

  // 일반 댓글 추가
  const generalReply = await fetch(`http://localhost:3003/api/business-voice/ttontok/${postId}/replies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nickname: '창업준비생',
      content: '좋은 정보 감사합니다! MVP 개발 중인데 도움이 많이 되었어요.',
      role: 'general'
    })
  });

  console.log('댓글 추가 완료');
  console.log('검증자:', await examinerReply.json());
  console.log('전문가:', await expertReply.json());
  console.log('일반:', await generalReply.json());
}

addExpertReply().catch(console.error);