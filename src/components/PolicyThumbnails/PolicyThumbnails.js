import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './PolicyThumbnails.css';

const PolicyThumbnails = () => {
  const [thumbnailData, setThumbnailData] = useState([]);

  // 기본 정책소식 데이터 - public 폴더 이미지 사용
  const defaultPolicyNews = [
    {
      id: 1,
      image: '/images/board/government-startup-funding-2024.jpg', // 실제 파일 경로
      title: '2025년 중소기업 정책자금 신청 안내',
      description: '중소벤처기업부가 2025년도 중소기업 정책자금 운용계획을 발표했습니다.',
      date: '2025.01.08',
      badge: 'NEW',
      views: 1234,
      isPinned: true,
      category: 'funding',
    },
    {
      id: 2,
      image: '/images/board/small-business-rent-support.jpg', // 실제 파일 경로
      title: '소상공인 특별지원 프로그램 시행',
      description: '코로나19 피해 소상공인을 위한 특별 금융지원 프로그램이 시작됩니다.',
      date: '2025.01.07',
      badge: 'HOT',
      views: 2341,
      isPinned: true,
      category: 'support',
    },
    {
      id: 3,
      image: '/images/board/startup-tax-guide.jpg', // 실제 파일 경로
      title: '청년창업 지원사업 모집 공고',
      description: '만 39세 이하 청년 창업자를 위한 정부 지원사업 신청이 시작됩니다.',
      date: '2025.01.06',
      badge: '추천',
      views: 987,
      isPinned: false,
      category: 'startup',
    },
    {
      id: 4,
      image: '/images/board/2024-sme-rd-support.jpg', // 실제 파일 경로
      title: 'R&D 지원사업 선정 결과 발표',
      description: '2025년 1차 중소기업 R&D 지원사업 선정 기업이 발표되었습니다.',
      date: '2025.01.05',
      badge: 'NEW',
      views: 756,
      isPinned: false,
      category: 'rnd',
    },
  ];

  useEffect(() => {
    // 실제로는 API에서 데이터를 가져오는 로직
    // 관리자가 고정한 게시글 우선, 그 다음 최신순
    const fetchPolicyNews = async () => {
      try {
        // const response = await fetch('/api/policy-news/featured');
        // const data = await response.json();
        // setThumbnailData(data);

        // 임시로 기본 데이터 사용
        const sortedData = [...defaultPolicyNews].sort((a, b) => {
          // 고정된 게시글 우선
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          // 그 다음 날짜순
          return new Date(b.date) - new Date(a.date);
        });

        setThumbnailData(sortedData.slice(0, 4)); // 상위 4개만 표시
      } catch (error) {
        console.error('정책소식 데이터 로드 실패:', error);
        setThumbnailData(defaultPolicyNews.slice(0, 4));
      }
    };

    fetchPolicyNews();
  }, []);

  const getBadgeClass = (badge) => {
    const badgeMap = {
      NEW: 'new',
      HOT: 'hot',
      추천: 'recommend',
      중요: 'important',
    };
    return badgeMap[badge] || 'default';
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      funding: '💰',
      support: '🤝',
      startup: '🚀',
      rnd: '🔬',
      policy: '📋',
    };
    return iconMap[category] || '📄';
  };

  return (
    <section className="policy-thumbnails-section">
      <div className="container">
        <div className="thumbnails-header">
          <div className="header-content">
            <h3 className="thumbnails-title">
              나라똔에서 전해드리는 <span className="highlight">정책소식</span>
            </h3>
            <p className="thumbnails-subtitle">
              최신 정부 정책과 지원사업 소식을 빠르게 전달해드립니다
            </p>
          </div>
          <Link href="/policy-analysis" className="view-all-btn">
            전체보기
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>

        <div className="thumbnails-grid">
          {thumbnailData.map((item) => (
            <Link key={item.id} href={`/policy-analysis?id=${item.id}`} className="thumbnail-item">
              <div className="thumbnail-image-wrapper">
                <img src={item.image} alt={item.title} className="thumbnail-image" />
                {item.isPinned && (
                  <div className="pinned-badge">
                    <i className="fas fa-thumbtack"></i>
                  </div>
                )}
                <div className={`thumbnail-badge badge-${getBadgeClass(item.badge)}`}>
                  {item.badge}
                </div>
                <div className="thumbnail-overlay">
                  <p className="overlay-description">{item.description}</p>
                  <span className="read-more">자세히 보기 →</span>
                </div>
              </div>

              <div className="thumbnail-info">
                <div className="category-tag">
                  <span className="category-icon">{getCategoryIcon(item.category)}</span>
                  <span className="category-name">
                    {item.category === 'funding' && '정책자금'}
                    {item.category === 'support' && '지원사업'}
                    {item.category === 'startup' && '창업지원'}
                    {item.category === 'rnd' && 'R&D'}
                    {item.category === 'policy' && '정책일반'}
                  </span>
                </div>

                <h3 className="thumbnail-title">{item.title}</h3>

                <div className="thumbnail-meta">
                  <span className="thumbnail-date">
                    <i className="far fa-calendar"></i> {item.date}
                  </span>
                  <span className="thumbnail-views">
                    <i className="far fa-eye"></i> {item.views?.toLocaleString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="thumbnails-footer">
          <p className="update-info">
            <i className="fas fa-sync-alt"></i>
            매일 오전 9시 업데이트
          </p>
        </div>
      </div>
    </section>
  );
};

export default PolicyThumbnails;
