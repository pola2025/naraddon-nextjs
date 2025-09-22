'use client';

import { useState, useEffect } from 'react';
import './qna-section.css';

interface QnAItem {
  _id: string;
  question: string;
  questionAuthor: string;
  questionTime: string;
  category: string;
  views: number;
  answers: Answer[];
  isHot?: boolean;
  isSolved?: boolean;
}

interface Answer {
  _id: string;
  content: string;
  author: string;
  authorRole?: 'general' | 'expert' | 'certified_examiner';
  authorInfo?: {
    name: string;
    company?: string;
  };
  time: string;
  isAccepted?: boolean;
  helpfulCount: number;
}

export default function QnASection() {
  const [qnaItems, setQnaItems] = useState<QnAItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchQnAData();
  }, []);

  const fetchQnAData = async () => {
    try {
      // 실제 API 호출로 교체 예정
      setIsLoading(false);
      // 임시 데이터
      setQnaItems([
        {
          _id: '1',
          question: '사업자등록 후 첫 세금신고는 언제 해야 하나요?',
          questionAuthor: '파란하늘',
          questionTime: '2시간 전',
          category: 'tax',
          views: 234,
          isHot: true,
          isSolved: true,
          answers: [
            {
              _id: 'a1',
              content: '사업자등록 후 부가가치세는 일반과세자의 경우 분기별로 신고합니다. 1월, 4월, 7월, 10월에 신고 기간이 있으며, 간이과세자는 1월과 7월에 신고합니다.',
              author: '박현숙',
              authorRole: 'certified_examiner',
              authorInfo: { name: '박현숙', company: 'KPJ' },
              time: '1시간 전',
              isAccepted: true,
              helpfulCount: 15
            },
            {
              _id: 'a2',
              content: '저도 처음엔 헷갈렸는데, 홈택스에서 안내 문자가 와요! 놓치지 마세요.',
              author: '겨울바람',
              authorRole: 'general',
              time: '30분 전',
              helpfulCount: 8
            }
          ]
        },
        {
          _id: '2',
          question: '정책자금 신청할 때 사업계획서는 어떻게 작성하나요?',
          questionAuthor: '봄날햇살',
          questionTime: '5시간 전',
          category: 'funding',
          views: 189,
          isSolved: true,
          answers: [
            {
              _id: 'a3',
              content: '사업계획서는 1)사업개요 2)시장분석 3)마케팅전략 4)재무계획 순으로 작성하시면 됩니다. 특히 수익성과 성장가능성을 구체적인 수치로 제시하는 것이 중요합니다.',
              author: '김범준',
              authorRole: 'certified_examiner',
              authorInfo: { name: '김범준', company: 'SJ' },
              time: '3시간 전',
              isAccepted: true,
              helpfulCount: 23
            }
          ]
        },
        {
          _id: '3',
          question: '직원 첫 채용 시 꼭 해야 할 절차가 뭔가요?',
          questionAuthor: '노을빛',
          questionTime: '1일 전',
          category: 'hr',
          views: 156,
          answers: [
            {
              _id: 'a4',
              content: '1) 근로계약서 작성 2) 4대보험 가입 3) 최저임금 준수 4) 근로기준법 준수사항 확인이 필수입니다. 특히 4대보험은 입사일로부터 14일 이내 신고해야 합니다.',
              author: '손지숙',
              authorRole: 'certified_examiner',
              authorInfo: { name: '손지숙', company: '손스타컴퍼니' },
              time: '12시간 전',
              helpfulCount: 19
            }
          ]
        },
        {
          _id: '4',
          question: '온라인 쇼핑몰 창업 시 통신판매업 신고는 필수인가요?',
          questionAuthor: '여름바다',
          questionTime: '6시간 전',
          category: 'legal',
          views: 278,
          answers: [
            {
              _id: 'a5',
              content: '통신판매업 신고는 연매출 1,200만원 이상이면 의무입니다. 사업 초기라도 미리 신고하시는 것을 권장합니다. 온라인에서 간편하게 신고 가능합니다.',
              author: '전지선',
              authorRole: 'certified_examiner',
              authorInfo: { name: '전지선', company: 'JTL' },
              time: '4시간 전',
              helpfulCount: 12
            },
            {
              _id: 'a6',
              content: '저는 처음부터 신고했어요. 나중에 급하게 하느라 고생하는 것보다 미리 하는게 낫더라구요.',
              author: '가을단풍',
              authorRole: 'general',
              time: '2시간 전',
              helpfulCount: 5
            }
          ]
        },
        {
          _id: '5',
          question: '소상공인 정책자금 대출 신청 자격이 어떻게 되나요?',
          questionAuthor: '초록물결',
          questionTime: '3시간 전',
          category: 'funding',
          views: 312,
          isHot: true,
          answers: [
            {
              _id: 'a7',
              content: '소상공인 정책자금은 상시근로자 10인 미만(제조업은 50인 미만) 사업자가 대상입니다. 업력 3개월 이상, 신용등급 기준 충족 시 신청 가능합니다.',
              author: '김영희',
              authorRole: 'certified_examiner',
              authorInfo: { name: '김영희', company: '세움' },
              time: '1시간 전',
              helpfulCount: 28
            }
          ]
        },
        {
          _id: '6',
          question: '개인사업자에서 법인 전환 시 절차가 어떻게 되나요?',
          questionAuthor: '달빛고양이',
          questionTime: '4시간 전',
          category: 'legal',
          views: 423,
          answers: [
            {
              _id: 'a8',
              content: '법인 설립은 1)정관 작성 2)법인설립등기 3)사업자등록 순입니다. 자본금 준비와 등기비용을 고려하세요.',
              author: '황만규',
              authorRole: 'certified_examiner',
              authorInfo: { name: '황만규', company: '바름' },
              time: '2시간 전',
              helpfulCount: 17
            }
          ]
        },
        {
          _id: '7',
          question: '배달앱 수수료가 너무 높은데 절감 방법 없을까요?',
          questionAuthor: '바다소리',
          questionTime: '7시간 전',
          category: 'marketing',
          views: 567,
          isHot: true,
          answers: [
            {
              _id: 'a9',
              content: '자체 배달앱이나 포장할인, 네이버 주문 등 다양한 채널을 활용하세요.',
              author: '가을하늘',
              authorRole: 'general',
              time: '5시간 전',
              helpfulCount: 21
            }
          ]
        },
        {
          _id: '8',
          question: '연말정산 간소화 서비스 등록은 어떻게 하나요?',
          questionAuthor: '새벽이슬',
          questionTime: '10시간 전',
          category: 'tax',
          views: 234,
          answers: []
        },
        {
          _id: '9',
          question: '청년고용 지원금 신청 조건이 뭔가요?',
          questionAuthor: '푸른바다',
          questionTime: '12시간 전',
          category: 'funding',
          views: 445,
          answers: [
            {
              _id: 'a10',
              content: '만 15~34세 청년을 정규직으로 신규 채용 시 월 최대 80만원까지 지원됩니다.',
              author: '전예진',
              authorRole: 'certified_examiner',
              authorInfo: { name: '전예진', company: '비젠' },
              time: '8시간 전',
              helpfulCount: 33
            }
          ]
        },
        {
          _id: '10',
          question: '근로자 퇴직금 적립은 언제부터 해야 하나요?',
          questionAuthor: '하늘구름',
          questionTime: '1일 전',
          category: 'hr',
          views: 189,
          isSolved: true,
          answers: [
            {
              _id: 'a11',
              content: '1년 이상 근무한 근로자부터 퇴직금 지급 의무가 발생합니다. 매월 적립하시는 것을 권장합니다.',
              author: '김태은',
              authorRole: 'certified_examiner',
              authorInfo: { name: '김태은', company: '가나안' },
              time: '20시간 전',
              isAccepted: true,
              helpfulCount: 25
            }
          ]
        }
      ]);
    } catch (error) {
      console.error('Q&A 데이터 로딩 실패:', error);
      setIsLoading(false);
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'certified_examiner':
        return <span className="role-badge badge-examiner">기업심사관</span>;
      case 'expert':
        return <span className="role-badge badge-expert">전문가</span>;
      default:
        return null;
    }
  };

  return (
    <section id="qna-section" className="qna-section">
      <div className="qna-container">
        <div className="section-header">
          <h2>묻고 답하기</h2>
          <p>사업하면서 궁금한 것들에 대한<br />
질문과 답변을 나누는 공간입니다</p>
        </div>

        {isLoading ? (
          <div className="qna-loading">
            <div className="qna-skeleton-item" />
            <div className="qna-skeleton-item" />
            <div className="qna-skeleton-item" />
          </div>
        ) : (
          <div className="qna-main-wrapper">
            {/* 왼쪽: 카드 형식 Q&A */}
            <div className="qna-cards">
              {qnaItems.slice(0, 3).map((item) => (
              <div key={item._id} className="qna-item">
                <div className="qna-question-area">
                  <div className="qna-header">
                    <div className="qna-meta">
                      {item.isHot && <span className="hot-badge">🔥 HOT</span>}
                      {item.isSolved && <span className="solved-badge">✓ 해결됨</span>}
                      <span className={`qna-category category-${item.category}`}>
                        {item.category === 'tax' ? '세무' :
                         item.category === 'funding' ? '자금' :
                         item.category === 'legal' ? '법무' :
                         item.category === 'hr' ? '노무' : '마케팅'}
                      </span>
                      <span className="qna-author">{item.questionAuthor}</span>
                      <span className="qna-time">{item.questionTime}</span>
                      <span className="qna-views">조회 {item.views}</span>
                    </div>
                  </div>

                  <h3 className="qna-title">
                    <span className="q-mark">Q</span>
                    {item.question}
                  </h3>

                  <div className="qna-actions">
                    <button
                      className="btn-toggle-answers"
                      onClick={() => toggleExpanded(item._id)}
                    >
                      {expandedItems.has(item._id) ? (
                        <>답변 닫기 <i className="fas fa-chevron-up" /></>
                      ) : (
                        <>답변 {item.answers.length}개 보기 <i className="fas fa-chevron-down" /></>
                      )}
                    </button>
                    {!item.isSolved && (
                      <button className="btn-write-answer">
                        답변하기
                      </button>
                    )}
                  </div>
                </div>

                {expandedItems.has(item._id) && (
                  <div className="qna-answers-area">
                    {item.answers.map((answer) => (
                      <div
                        key={answer._id}
                        className={`qna-answer ${answer.isAccepted ? 'accepted-answer' : ''} ${answer.authorRole ? `role-${answer.authorRole}` : ''}`}
                      >
                        <div className="answer-header">
                          <span className="a-mark">A</span>
                          <div className="answer-author-info">
                            <span className="answer-author">{answer.author}</span>
                            {getRoleBadge(answer.authorRole)}
                            {answer.authorInfo?.company && (
                              <span className="author-company">{answer.authorInfo.company}</span>
                            )}
                          </div>
                          {answer.isAccepted && (
                            <span className="accepted-badge">✓ 채택됨</span>
                          )}
                          <span className="answer-time">{answer.time}</span>
                        </div>

                        <div className="answer-content">
                          {answer.content}
                        </div>

                        <div className="answer-footer">
                          <button className="helpful-btn">
                            <i className="far fa-thumbs-up" /> 도움됨 {answer.helpfulCount}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            </div>

            {/* 오른쪽: 테이블 형식 Q&A */}
            <div className="qna-table-section">
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '12px', color: '#1f2937' }}>
                전체 Q&A
              </h3>
              <div className="qna-table-wrapper">
                <table className="qna-table">
                  <thead>
                    <tr>
                      <th width="60">분류</th>
                      <th>질문</th>
                      <th width="80">작성자</th>
                      <th width="60">조회</th>
                    </tr>
                  </thead>
                  <tbody>
                    {qnaItems.slice(0, 10).map((item) => (
                      <tr key={item._id}>
                        <td className="category-cell">
                          <span className={`category-badge category-${item.category}`}>
                            {item.category === 'tax' ? '세무' :
                             item.category === 'funding' ? '자금' :
                             item.category === 'legal' ? '법무' : '노무'}
                          </span>
                        </td>
                        <td className="title-cell">
                          {item.question}
                          {item.answers.length > 0 && (
                            <span style={{ color: '#2563eb', fontWeight: 600, marginLeft: '4px' }}>
                              ({item.answers.length})
                            </span>
                          )}
                          {item.isSolved && ' ✓'}
                        </td>
                        <td style={{ fontSize: '0.7rem', color: '#64748b' }}>
                          {item.questionAuthor.substring(0, 6)}
                        </td>
                        <td style={{ textAlign: 'center', fontSize: '0.7rem', color: '#94a3b8' }}>
                          {item.questionTime.split(' ')[0]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 페이지네이션 추가 */}
              <div className="qna-pagination">
                <button className="qna-page-btn active">1</button>
                <button className="qna-page-btn">2</button>
                <button className="qna-page-btn">3</button>
                <button className="qna-page-btn">4</button>
                <button className="qna-page-btn">5</button>
                <button className="qna-page-btn">다음 ›</button>
              </div>
            </div>
          </div>
        )}

        <div className="qna-actions">
          <button className="ask-btn">
            <i className="fas fa-edit" /> 질문하기
          </button>
          <button className="more-qa-btn">
            더 많은 Q&A 보기
          </button>
        </div>
      </div>
    </section>
  );
}