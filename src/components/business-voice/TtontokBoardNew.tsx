'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import './ttontok-board-new.css';

interface TtontokPost {
  _id: string;
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

export default function TtontokBoardNew() {
  const [posts, setPosts] = useState<TtontokPost[]>([]);
  const [bestPosts, setBestPosts] = useState<TtontokPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<TtontokPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/ttontok/posts');
      const data = await response.json();

      if (data.success) {
        setPosts(data.posts || []);
        // 좋아요 수가 많은 상위 2개를 베스트로
        const sorted = [...(data.posts || [])].sort((a, b) => b.likeCount - a.likeCount);
        setBestPosts(sorted.slice(0, 2));
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostClick = async (postId: string) => {
    try {
      const response = await fetch(`/api/ttontok/posts/${postId}`);
      const data = await response.json();

      if (data.success) {
        setSelectedPost(data.post);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Failed to fetch post detail:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return '방금 전';
    if (hours < 24) return `${hours}시간 전`;
    if (hours < 48) return '어제';

    return date.toLocaleDateString('ko-KR', {
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <section id="ttontok-section" className="ttontok-board-new">
      <div className="ttontok-container">
        {/* 헤더 */}
        <div className="ttontok-header">
          <h2>똔톡 - 실시간 사업자 이야기</h2>
          <p>사업자 고충과 정보를 공유하는 톡게시판</p>
        </div>

        {/* 베스트 똔톡 */}
        {bestPosts.length > 0 && (
          <div className="ttontok-best-section">
            <h3 className="section-subtitle">🔥 베스트 똔톡</h3>
            <div className="ttontok-best-grid">
              {bestPosts.map((post) => (
                <div
                  key={post._id}
                  className="ttontok-best-card"
                  onClick={() => handlePostClick(post._id)}
                >
                  <div className="best-card-header">
                    <span className={`category-badge category-${post.category}`}>
                      {CATEGORY_LABELS[post.category]}
                    </span>
                    <div className="best-stats">
                      <span>👍 {post.likeCount}</span>
                      <span>💬 {post.replyCount}</span>
                    </div>
                  </div>
                  <h4 className="best-title">{post.title}</h4>
                  <p className="best-content">{post.content.slice(0, 100)}...</p>
                  <div className="best-footer">
                    <span className="best-author">{post.nickname}</span>
                    <span className="best-time">{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 똔톡 목록 */}
        <div className="ttontok-list-section">
          <div className="list-header">
            <h3 className="section-subtitle">전체 똔톡</h3>
            <Link href="/ttontok/write" className="write-btn">
              + 글쓰기
            </Link>
          </div>

          {isLoading ? (
            <div className="loading-skeleton">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="skeleton-item" />
              ))}
            </div>
          ) : (
            <table className="ttontok-table">
              <thead>
                <tr>
                  <th width="100">카테고리</th>
                  <th>제목</th>
                  <th width="120">작성자</th>
                  <th width="100">작성일</th>
                  <th width="60">댓글</th>
                  <th width="60">조회</th>
                  <th width="60">좋아요</th>
                </tr>
              </thead>
              <tbody>
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="empty-message">
                      아직 등록된 똔톡이 없습니다.
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr
                      key={post._id}
                      onClick={() => handlePostClick(post._id)}
                      className="ttontok-row"
                    >
                      <td>
                        <span className={`category-badge category-${post.category}`}>
                          {CATEGORY_LABELS[post.category]}
                        </span>
                      </td>
                      <td className="title-cell">
                        {post.title}
                        {post.replyCount > 0 && (
                          <span className="reply-count">[{post.replyCount}]</span>
                        )}
                      </td>
                      <td>{post.nickname}</td>
                      <td>{formatDate(post.createdAt)}</td>
                      <td className="number-cell">{post.replyCount}</td>
                      <td className="number-cell">{post.viewCount}</td>
                      <td className="number-cell">{post.likeCount}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* 더보기 버튼 */}
          <div className="list-footer">
            <Link href="/ttontok" className="more-btn">
              더 많은 똔톡 보기 →
            </Link>
          </div>
        </div>

        {/* 글쓰기 영역 */}
        <div className="ttontok-write-section">
          <h3 className="section-subtitle">똔톡 작성하기</h3>
          <div className="write-form">
            <p className="write-description">
              사업 운영 중 겪은 고충이나 유용한 정보를 공유해주세요.
            </p>
            <Link href="/ttontok/write" className="write-main-btn">
              똔톡 작성하러 가기
            </Link>
          </div>
        </div>
      </div>

      {/* 상세보기 모달 */}
      {showModal && selectedPost && (
        <div className="ttontok-modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              ✕
            </button>

            <div className="modal-header">
              <span className={`category-badge category-${selectedPost.category}`}>
                {CATEGORY_LABELS[selectedPost.category]}
              </span>
              <h3>{selectedPost.title}</h3>
              <div className="modal-meta">
                <span>{selectedPost.nickname}</span>
                <span>{formatDate(selectedPost.createdAt)}</span>
                <span>조회 {selectedPost.viewCount}</span>
              </div>
            </div>

            <div className="modal-body">
              <p className="post-content">{selectedPost.content}</p>

              {selectedPost.replies && selectedPost.replies.length > 0 && (
                <div className="replies-section">
                  <h4>댓글 {selectedPost.replies.length}</h4>
                  {selectedPost.replies.map((reply) => (
                    <div key={reply._id} className={`reply-item role-${reply.role}`}>
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

            <div className="modal-footer">
              <button className="like-btn">
                👍 좋아요 {selectedPost.likeCount}
              </button>
              <button className="reply-btn">댓글 작성</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}