'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import './ttontok-list-board.css';

interface TtontokPost {
  _id?: string;
  id?: string;
  title: string;
  content: string;
  category: string;
  nickname: string;
  viewCount: number;
  likeCount: number;
  replyCount: number;
  createdAt: string;
  replies?: TtontokReply[];
}

interface TtontokReply {
  _id: string;
  content: string;
  nickname: string;
  role: 'general' | 'expert' | 'certified_examiner';
  createdAt: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  funding: '자금',
  tax: '세무',
  hr: '노무',
  marketing: '마케팅',
  strategy: '전략',
  tech: '기술',
  legal: '법무',
  etc: '기타',
};

export default function TtontokListBoard() {
  const [posts, setPosts] = useState<TtontokPost[]>([]);
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/business-voice/ttontok');
      const data = await response.json();

      if (data.items) {
        // 임시 데이터 추가
        const mockPosts: TtontokPost[] = [
          {
            _id: '1',
            title: '소상공인 전기료 지원 받으셨나요?',
            content: '2025년 소상공인 전기료 지원사업 신청하셨나요? 연매출 3억원 이하면 월 최대 20만원까지 지원받을 수 있어요. 소상공인시장진흥공단 홈페이지에서 신청 가능합니다.',
            category: 'funding',
            nickname: '블루베리머핀',
            viewCount: 1234,
            likeCount: 45,
            replyCount: 3,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            replies: [
              {
                _id: 'r1',
                content: '저도 신청했어요! 서류 준비가 생각보다 간단하더라구요.',
                nickname: '달빛고양이',
                role: 'general',
                createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
              },
              {
                _id: 'r2',
                content: '전기료 지원사업은 소상공인시장진흥공단에서 운영합니다. 신청 시 사업자등록증과 매출증빙서류가 필요합니다.',
                nickname: '김철수',
                role: 'certified_examiner',
                createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
              }
            ]
          },
          {
            _id: '2',
            title: '부가세 신고 꿀팁 있나요?',
            content: '이번달 부가세 신고 기간이네요. 매입세액공제 빠뜨리기 쉬운 항목들 체크하세요! 특히 신용카드 매입세액공제 놓치지 마세요.',
            category: 'tax',
            nickname: '초록물결',
            viewCount: 1567,
            likeCount: 78,
            replyCount: 2,
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            replies: [
              {
                _id: 'r3',
                content: '부가세 신고 시 세금계산서 미수취분도 매입세액공제 가능합니다. 단, 신고 후 30일 이내 받아야 해요.',
                nickname: '박영희',
                role: 'expert',
                createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
              }
            ]
          },
          {
            _id: '3',
            title: '카페 창업 3개월차 후기',
            content: '드디어 손익분기점 넘었어요! 하루 100잔 목표였는데 이제 평균 120잔 나가네요. 인스타 마케팅이 효과가 좋았어요.',
            category: 'etc',
            nickname: '커피향기',
            viewCount: 2100,
            likeCount: 167,
            replyCount: 4,
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        setPosts(data.items?.length > 0 ? data.items : mockPosts);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      // 에러 시 목업 데이터 사용
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpanded = (postId: string) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return '방금 전';
    if (hours < 24) return `${hours}시간 전`;
    if (hours < 48) return '어제';

    return date.toLocaleDateString('ko-KR');
  };

  const handleWriteClick = () => {
    alert('회원가입 후 작성 가능합니다.');
  };

  const handleReplyClick = () => {
    alert('회원가입 후 댓글 작성이 가능합니다.');
  };

  return (
    <section id="ttontok-section" className="ttontok-list-board">
      <div className="ttontok-container">
        <div className="section-header">
          <h2>똔톡 - 실시간 사업자 이야기</h2>
          <p>사업자 고충과 정보를 공유하는 톡게시판</p>
        </div>

        {isLoading ? (
          <div className="ttontok-loading">
            {[1, 2, 3].map(i => (
              <div key={i} className="ttontok-skeleton-item" />
            ))}
          </div>
        ) : (
          <div className="ttontok-list">
            {posts.map((post) => (
              <div key={post._id || post.id} className="ttontok-item">
                <div className="ttontok-post-area">
                  <div className="ttontok-header">
                    <div className="ttontok-meta">
                      <span className={`category-badge category-${post.category}`}>
                        {CATEGORY_LABELS[post.category]}
                      </span>
                      <span className="ttontok-author">{post.nickname}</span>
                      <span className="ttontok-time">{formatDate(post.createdAt)}</span>
                      <span className="ttontok-views">조회 {post.viewCount}</span>
                      <span className="ttontok-likes">👍 {post.likeCount}</span>
                    </div>
                  </div>

                  <Link href={`/ttontok/${post._id || post.id}`} className="ttontok-title-link">
                    <h3 className="ttontok-title">{post.title}</h3>
                  </Link>
                  <p className="ttontok-content">{post.content}</p>

                  <div className="ttontok-actions">
                    {post.replies && post.replies.length > 0 && (
                      <button
                        className="btn-toggle-replies"
                        onClick={() => toggleExpanded(post._id || post.id || '')}
                      >
                        {expandedPosts.has(post._id || post.id || '') ? (
                          <>댓글 닫기 <i className="fas fa-chevron-up" /></>
                        ) : (
                          <>댓글 {post.replyCount}개 보기 <i className="fas fa-chevron-down" /></>
                        )}
                      </button>
                    )}
                    <button className="btn-write-reply" onClick={handleReplyClick}>댓글 작성</button>
                  </div>
                </div>

                {expandedPosts.has(post._id || post.id || '') && post.replies && (
                  <div className="ttontok-replies-area">
                    {post.replies.map((reply) => (
                      <div
                        key={reply._id}
                        className={`ttontok-reply ${reply.role !== 'general' ? `role-${reply.role}` : ''}`}
                      >
                        <div className="reply-header">
                          <span className="reply-author">{reply.nickname}</span>
                          {reply.role === 'certified_examiner' && (
                            <span className="role-badge examiner">기업심사관</span>
                          )}
                          {reply.role === 'expert' && (
                            <span className="role-badge expert">전문가</span>
                          )}
                          <span className="reply-time">{formatDate(reply.createdAt)}</span>
                        </div>
                        <p className="reply-content">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="ttontok-write-section">
          <button className="write-btn" onClick={handleWriteClick}>
            <i className="fas fa-edit" /> 똔톡 작성하기
          </button>
          <button className="more-btn">더 많은 똔톡 보기</button>
        </div>
      </div>
    </section>
  );
}