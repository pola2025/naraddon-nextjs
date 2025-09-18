import React, { useState, useEffect } from 'react';
import './SaveSection.css';

function SaveSection() {
  const [coinAnimation, setCoinAnimation] = useState(false);

  // 절약 내용 데이터
  const saveItems = [
    {
      icon: 'fa-calculator',
      title: '전문가와 함께 정책분석',
      amount: '1억 이상',
      description: '최대한도 자금확보 목표',
    },
    {
      icon: 'fa-clock',
      title: '시간 단축',
      amount: '1,000만원',
      description: '시간의 가치',
    },
    {
      icon: 'fa-chart-line',
      title: '성공률 향상',
      amount: '100만원 이상',
      description: '재신청 시간+비용 절감',
    },
    {
      icon: 'fa-shield-alt',
      title: '리스크 방지',
      amount: '300만원',
      description: '실패 비용 예방',
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const section = document.querySelector('.save-section');
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 0.8;

      if (isVisible && !coinAnimation) {
        setCoinAnimation(true);
      }
    };

    setTimeout(() => {
      handleScroll();
    }, 100);

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="save-section horizontal">
      <div className="container">
        {/* 가로 레이아웃 */}
        <div className="save-content-horizontal">
          {/* 왼쪽: 타이틀과 금액 */}
          <div className="save-left">
            <div className="coin-title-group">
              <div className={`coin-icon-large ${coinAnimation ? 'animate' : ''}`}>
                <i className="fas fa-calculator"></i>
                <div className="coin-pulse"></div>
                <div className="amount-badge-large">1억+</div>
              </div>
              <div className="title-group">
                <h2 className="save-title-compact">
                  기업심사관과 함께
                  <br />
                  <span className="highlight">한도는 높이고, 이자율은 낮추고</span>
                </h2>
                <p className="save-subtitle-compact">
                  <span className="brand-name">기업심사관</span>과 함께{' '}
                  <span className="system-text">비용은 줄이고, 성공률은 높이고</span>
                </p>
              </div>
            </div>
          </div>

          {/* 중앙: 3개 핵심 절약 포인트 */}
          <div className="save-center">
            <div className="save-features-horizontal">
              <div className="save-item-horizontal">
                <i className="fas fa-hand-holding-usd"></i>
                <span>전문가와 함께 최대한도</span>
              </div>
              <div className="save-item-horizontal">
                <i className="fas fa-rocket"></i>
                <span>처리 기간 3배 단축</span>
              </div>
              <div className="save-item-horizontal">
                <i className="fas fa-trophy"></i>
                <span>승인율 95% 달성</span>
              </div>
            </div>
          </div>

          {/* 오른쪽: 4개 절약 항목 */}
          <div className="save-right">
            <div className="save-items-horizontal">
              {saveItems.map((item, index) => (
                <div key={index} className="save-detail-horizontal">
                  <i className={`fas ${item.icon}`}></i>
                  <div className="detail-text">
                    <h4>{item.title}</h4>
                    <span className="amount">{item.amount}</span>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <span className="save-note-horizontal">*평균 절감 비용 기준 (2024년 고객 데이터)</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SaveSection;
