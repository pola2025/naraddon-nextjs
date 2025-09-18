'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import './PolicyNewsSection.css';

// 정책소식 이미지 import (홈페이지와 동일한 이미지 사용)
import boardImage1 from '@/assets/images/board/board_image_01.jpg';
import boardImage2 from '@/assets/images/board/board_image_02.jpg';
import boardImage3 from '@/assets/images/board/board_image_03.jpg';
import boardImage4 from '@/assets/images/board/board_image_04.png';

const PolicyNewsSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [newsPosts, setNewsPosts] = useState([]);
  const [mainNewsList, setMainNewsList] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNewsId, setSelectedNewsId] = useState(null);

  // 관리자 권한 체크 (추후 실제 권한 체크 로직으로 대체)
  const [isAdmin, setIsAdmin] = useState(false);

  // 홈페이지 정책소식 이미지 배열 (4개 이미지 롤링)
  const policyImages = [boardImage1, boardImage2, boardImage3, boardImage4];

  // 정책소식 데이터 생성 함수
  const generateSampleNews = () => {
    const newsData = [
      {
        id: 1,
        title: '2025년 중소기업 정책자금 신청 안내',
        excerpt:
          '중소벤처기업부가 2025년도 중소기업 정책자금 운용계획을 발표했습니다. 올해는 디지털 전환과 친환경 분야에 대한 지원이 대폭 확대됩니다.',
        content: `중소벤처기업부는 2025년 중소기업 정책자금 지원 규모를 전년 대비 30% 확대한 5조원 규모로 운영한다고 발표했습니다.
        
        주요 변경사항:
        - 디지털 전환 지원: 1조 5천억원 (전년 대비 50% 증가)
        - 친환경 전환 지원: 8천억원 (전년 대비 60% 증가)
        - 청년창업 지원: 5천억원 (전년 대비 40% 증가)
        
        신청 자격 및 절차 등 자세한 사항은 중소벤처기업부 홈페이지를 참고하시기 바랍니다.`,
        thumbnail: boardImage1, // 홈페이지 이미지 사용
        date: '2025.01.08',
        views: 15234,
        likes: 523,
        comments: 87,
        tags: ['정책자금', '중소기업', '2025년'],
        category: '정책자금',
        isPinned: true,
        isMain: true,
        badge: 'NEW',
      },
      {
        id: 2,
        title: '소상공인 특별지원 프로그램 시행',
        excerpt:
          '코로나19 피해 소상공인을 위한 특별 금융지원 프로그램이 시작됩니다. 최대 5천만원까지 저금리 대출이 가능합니다.',
        content: `소상공인시장진흥공단에서 코로나19로 어려움을 겪는 소상공인들을 위한 특별지원 프로그램을 시행합니다.
        
        지원 내용:
        - 대출 한도: 최대 5천만원
        - 금리: 연 1.9% (고정금리)
        - 대출 기간: 5년 (2년 거치 3년 상환)
        
        신청 기간: 2025년 1월 15일 ~ 예산 소진 시까지`,
        thumbnail: boardImage2, // 홈페이지 이미지 사용
        date: '2025.01.07',
        views: 8432,
        likes: 234,
        comments: 45,
        tags: ['소상공인', '금융지원', '코로나19'],
        category: '지원사업',
        isPinned: true,
        isMain: true,
        badge: 'HOT',
      },
      {
        id: 3,
        title: '청년창업 지원사업 모집 공고',
        excerpt:
          '만 39세 이하 청년 창업자를 위한 정부 지원사업 신청이 시작됩니다. 사업화 자금 최대 1억원을 지원합니다.',
        content: `창업진흥원에서 청년 창업가들의 도전을 응원하는 청년창업 지원사업을 시작합니다.
        
        지원 대상:
        - 만 39세 이하 예비창업자 또는 3년 미만 창업기업
        - 혁신적인 아이디어와 기술을 보유한 청년 창업가
        
        지원 내용:
        - 사업화 자금: 최대 1억원
        - 멘토링 및 교육 프로그램
        - 사무공간 제공 (선정자에 한함)`,
        thumbnail: boardImage3, // 홈페이지 이미지 사용
        date: '2025.01.06',
        views: 12543,
        likes: 456,
        comments: 78,
        tags: ['청년창업', '스타트업', '창업지원'],
        category: '창업지원',
        isPinned: false,
        isMain: true,
        badge: '추천',
      },
      {
        id: 4,
        title: 'R&D 지원사업 선정 결과 발표',
        excerpt:
          '2025년 1차 중소기업 R&D 지원사업 선정 기업이 발표되었습니다. 총 500개 기업이 선정되었습니다.',
        content: `한국산업기술진흥원에서 2025년 1차 R&D 지원사업 선정 결과를 발표했습니다.
        
        선정 결과:
        - 총 선정 기업: 500개사
        - 평균 지원금: 2억원
        - 경쟁률: 3.5:1
        
        선정된 기업은 개별 통보되며, 협약 체결 후 지원금이 지급됩니다.`,
        thumbnail: boardImage4, // 홈페이지 이미지 사용
        date: '2025.01.05',
        views: 6789,
        likes: 189,
        comments: 34,
        tags: ['R&D', '기술개발', '선정결과'],
        category: 'R&D',
        isPinned: false,
        isMain: true,
        badge: 'NEW',
      },
      {
        id: 5,
        title: '스마트공장 구축 지원사업 신청 접수',
        excerpt: '제조업 디지털 전환을 위한 스마트공장 구축 지원사업이 오늘부터 접수를 시작합니다.',
        thumbnail: policyImages[0], // 이미지 롤링
        date: '2025.01.04',
        views: 8432,
        likes: 234,
        comments: 45,
        tags: ['스마트공장', '제조업', '디지털전환'],
        category: '제조업',
        isMain: true,
      },
      {
        id: 6,
        title: 'ESG 경영 도입 지원사업 모집',
        excerpt: '중소기업의 ESG 경영 도입을 지원하는 컨설팅 및 인증 비용 지원사업이 시작됩니다.',
        thumbnail: policyImages[1], // 이미지 롤링
        date: '2025.01.03',
        views: 5432,
        likes: 167,
        comments: 23,
        tags: ['ESG', '지속가능경영', '컨설팅'],
        category: '경영지원',
      },
      {
        id: 7,
        title: '수출바우처 사업 참여기업 모집',
        excerpt: '해외 진출을 준비하는 중소기업을 위한 수출바우처 사업 참여기업을 모집합니다.',
        thumbnail: policyImages[2], // 이미지 롤링
        date: '2025.01.02',
        views: 7654,
        likes: 234,
        comments: 45,
        tags: ['수출지원', '해외진출', '바우처'],
        category: '수출지원',
      },
      {
        id: 8,
        title: '디지털 전환 지원사업 설명회',
        excerpt: '중소기업 디지털 전환 지원사업에 대한 온라인 설명회가 1월 15일 개최됩니다.',
        thumbnail: policyImages[3], // 이미지 롤링
        date: '2025.01.01',
        views: 4321,
        likes: 123,
        comments: 19,
        tags: ['디지털전환', 'DX', '설명회'],
        category: '기술지원',
      },
      {
        id: 9,
        title: '여성기업 전용 정책자금 신설',
        excerpt: '여성 기업인들을 위한 전용 정책자금 300억원이 신설되어 운영됩니다.',
        thumbnail: policyImages[0], // 이미지 롤링
        date: '2024.12.31',
        views: 6543,
        likes: 298,
        comments: 67,
        tags: ['여성기업', '정책자금'],
        category: '특별지원',
      },
      {
        id: 10,
        title: '그린뉴딜 지원사업 2차 모집',
        excerpt: '친환경 전환을 위한 그린뉴딜 지원사업 2차 모집이 시작됩니다.',
        thumbnail: policyImages[1], // 이미지 롤링
        date: '2024.12.30',
        views: 5678,
        likes: 201,
        comments: 38,
        tags: ['그린뉴딜', '친환경'],
        category: '환경지원',
      },
    ];

    return newsData;
  };

  useEffect(() => {
    // URL 파라미터에서 특정 뉴스 ID 확인 (홈에서 클릭한 경우)
    const newsId = searchParams.get('id');
    if (newsId) {
      setSelectedNewsId(parseInt(newsId));
    }

    // 데이터 로드 시뮬레이션
    setTimeout(() => {
      const news = generateSampleNews();

      // 관리자가 고정한 게시글과 최신순 정렬
      const sortedNews = news.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.date) - new Date(a.date);
      });

      setMainNewsList(sortedNews.slice(0, 5)); // 메인 슬라이드용 (상위 5개)
      setNewsPosts(sortedNews.slice(5, 10)); // 나머지 리스트 (5~10번째)
      setIsLoading(false);

      // 특정 뉴스가 선택된 경우 해당 슬라이드로 이동
      if (newsId) {
        const index = sortedNews.slice(0, 5).findIndex((n) => n.id === parseInt(newsId));
        if (index !== -1) {
          setCurrentSlide(index);
        }
      }
    }, 500);

    // 추후 실제 관리자 권한 체크 로직 구현
    // setIsAdmin(true); // 관리자인 경우
  }, [searchParams]);

  // 슬라이드 자동 전환
  useEffect(() => {
    if (mainNewsList.length > 0 && !selectedNewsId) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % mainNewsList.length);
      }, 5000); // 5초마다 전환
      return () => clearInterval(timer);
    }
  }, [mainNewsList, selectedNewsId]);

  // 뉴스 상세 보기
  const handleNewsClick = (newsId) => {
    router.push(`/policy-news/${newsId}`);
  };

  // 더보기 클릭
  const handleMoreClick = () => {
    router.push('/policy-news');
  };

  // 글쓰기 클릭 (관리자용)
  const handleWriteClick = () => {
    router.push('/policy-news/write');
  };

  const getBadgeClass = (badge) => {
    const badgeMap = {
      NEW: 'new',
      HOT: 'hot',
      추천: 'recommend',
      중요: 'important',
    };
    return badgeMap[badge] || 'default';
  };

  if (isLoading) {
    return (
      <div className="policy-news-section loading">
        <div className="loader">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="policy-news-section">
      <div className="news-section-header">
        <div className="header-left">
          <h2 className="section-title">
            <i className="fas fa-newspaper"></i> 정책소식
          </h2>
          <p className="section-subtitle">최신 정부 정책과 지원사업 소식을 빠르게 전달해드립니다</p>
        </div>
        {/* 관리자에게만 표시되는 버튼 */}
        {isAdmin && (
          <div className="header-right">
            <button className="write-news-btn" onClick={handleWriteClick}>
              <i className="fas fa-pen"></i> 소식 작성
            </button>
          </div>
        )}
      </div>

      <div className="news-content-wrapper">
        {/* 메인 뉴스 슬라이드 (왼쪽) */}
        {mainNewsList.length > 0 && (
          <div className="main-news-slider">
            <div className="slider-container">
              {mainNewsList.map((news, index) => (
                <div
                  key={news.id}
                  className={`slide-item ${index === currentSlide ? 'active' : ''} ${news.id === selectedNewsId ? 'highlighted' : ''}`}
                  onClick={() => handleNewsClick(news.id)}
                >
                  <div className="slide-image">
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Image
                        src={news.thumbnail}
                        alt={news.title}
                        width={400}
                        height={750}
                        style={{
                          width: 'auto',
                          height: '100%',
                          maxWidth: '100%',
                          objectFit: 'contain',
                        }}
                        priority={index === 0}
                      />
                    </div>
                    <div className="slide-overlay">
                      {news.isPinned && (
                        <span className="news-badge pinned">
                          <i className="fas fa-thumbtack"></i> 고정
                        </span>
                      )}
                      {news.badge && (
                        <span className={`news-badge ${getBadgeClass(news.badge)}`}>
                          {news.badge}
                        </span>
                      )}
                      <span className="news-category">{news.category}</span>
                    </div>
                  </div>
                  <div className="slide-content">
                    <h3 className="slide-title">{news.title}</h3>
                    <p className="slide-excerpt">{news.excerpt}</p>
                    <div className="slide-meta">
                      <span className="news-date">
                        <i className="far fa-calendar"></i> {news.date}
                      </span>
                      <div className="news-stats">
                        <span>
                          <i className="far fa-eye"></i> {news.views.toLocaleString()}
                        </span>
                        <span>
                          <i className="far fa-heart"></i> {news.likes}
                        </span>
                        <span>
                          <i className="far fa-comment"></i> {news.comments}
                        </span>
                      </div>
                    </div>
                    <div className="slide-tags">
                      {news.tags.map((tag, idx) => (
                        <span key={idx} className="news-tag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* 슬라이드 컨트롤 */}
            <button
              className="slider-control prev"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide((prev) => (prev - 1 + mainNewsList.length) % mainNewsList.length);
              }}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button
              className="slider-control next"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide((prev) => (prev + 1) % mainNewsList.length);
              }}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        )}

        {/* 뉴스 목록 (오른쪽) */}
        <div className="news-list">
          <div className="list-header">
            <h3>최근 소식</h3>
            <button className="more-btn" onClick={handleMoreClick}>
              전체보기 <i className="fas fa-arrow-right"></i>
            </button>
          </div>

          <div className="news-items">
            {newsPosts.map((news) => (
              <div key={news.id} className="news-item" onClick={() => handleNewsClick(news.id)}>
                <div className="news-item-thumbnail">
                  <Image
                    src={news.thumbnail}
                    alt={news.title}
                    width={80}
                    height={60}
                    style={{
                      width: 'auto',
                      height: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain',
                    }}
                  />
                  {news.isPinned && (
                    <div className="pinned-icon">
                      <i className="fas fa-thumbtack"></i>
                    </div>
                  )}
                </div>
                <div className="news-item-content">
                  <div className="news-item-header">
                    <span className="news-item-category">{news.category}</span>
                    <span className="news-item-date">{news.date}</span>
                  </div>
                  <h4 className="news-item-title">{news.title}</h4>
                  <div className="news-item-meta">
                    <div className="news-item-stats">
                      <span>
                        <i className="far fa-eye"></i> {news.views.toLocaleString()}
                      </span>
                      <span>
                        <i className="far fa-heart"></i> {news.likes}
                      </span>
                      <span>
                        <i className="far fa-comment"></i> {news.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyNewsSection;
