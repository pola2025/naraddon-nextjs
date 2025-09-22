import React from 'react';
import './PolicyNewsSection.css';

const PolicyNewsSkeleton = () => {
  return (
    <div className="policy-news-section">
      <div className="policy-news-container">
        <div className="policy-news__section-header">
          <div className="policy-news__section-heading">
            <h2 className="policy-news__section-title">
              <i className="fas fa-newspaper"></i> 정책소식
            </h2>
            <p className="policy-news__section-subtitle">
              나라똔에서 최신 정부정책 소식을 전달합니다.
            </p>
          </div>
          <div className="policy-news__section-actions">
            <div className="skeleton-button" style={{ width: '140px', height: '40px', borderRadius: '20px', background: '#f0f0f0' }}></div>
          </div>
        </div>

        <div className="news-content-wrapper">
          <div className="main-news-slider">
            <div className="slider-container">
              <div className="slide-item active">
                <div className="skeleton-image" style={{ width: '100%', height: '400px', background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }}></div>
                <div className="slide-content">
                  <div className="skeleton-text" style={{ width: '80%', height: '24px', marginBottom: '12px', background: '#f0f0f0', borderRadius: '4px' }}></div>
                  <div className="skeleton-text" style={{ width: '100%', height: '16px', marginBottom: '8px', background: '#f0f0f0', borderRadius: '4px' }}></div>
                  <div className="skeleton-text" style={{ width: '90%', height: '16px', marginBottom: '16px', background: '#f0f0f0', borderRadius: '4px' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="news-list">
            <div className="list-header">
              <h3>최근 게시글</h3>
              <div className="skeleton-button" style={{ width: '100px', height: '32px', borderRadius: '16px', background: '#f0f0f0' }}></div>
            </div>

            <div className="news-items-wrapper">
              <div className="news-items">
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <div key={index} className="news-item">
                    <div style={{ cursor: 'pointer', flex: 1, display: 'flex' }}>
                      <div className="skeleton-thumbnail" style={{ width: '80px', height: '60px', borderRadius: '8px', background: '#f0f0f0', flexShrink: 0 }}></div>
                      <div className="news-item-content">
                        <div className="skeleton-text" style={{ width: '60%', height: '14px', marginBottom: '8px', background: '#f0f0f0', borderRadius: '4px' }}></div>
                        <div className="skeleton-text" style={{ width: '100%', height: '16px', marginBottom: '8px', background: '#f0f0f0', borderRadius: '4px' }}></div>
                        <div className="skeleton-text" style={{ width: '40%', height: '12px', background: '#f0f0f0', borderRadius: '4px' }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
};

export default PolicyNewsSkeleton;