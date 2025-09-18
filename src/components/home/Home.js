import React, { useState, useEffect, useCallback } from 'react';
import './Home.css';
import HeroSection from './components/HeroSection';
import IntroVideo from './components/IntroVideo';
import TrustSection from '../TrustSection';
import PolicyThumbnails from '../PolicyThumbnails';
import SaveSection from '../SaveSection';
import NaraddonTube from '../NaraddonTube';
import EmpathySection from '../EmpathySection';
import { captions } from './constants/captions';

function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [showStartButton, setShowStartButton] = useState(true);
  const [showGreenOverlay, setShowGreenOverlay] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [currentCaption, setCurrentCaption] = useState('');
  const [isCaptionVisible, setIsCaptionVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // 자막 업데이트
  useEffect(() => {
    if (!showIntro) return;

    const startTime = Date.now();

    const updateCaption = () => {
      const elapsed = (Date.now() - startTime) / 1000;

      const caption = captions.find((cap) => elapsed >= cap.time && elapsed < cap.endTime);

      if (caption) {
        if (caption.text !== currentCaption) {
          setIsCaptionVisible(false);

          setTimeout(() => {
            setCurrentCaption(caption.text);
            setIsCaptionVisible(true);
          }, 200);
        }
      } else {
        setCurrentCaption('');
      }
    };

    const interval = setInterval(updateCaption, 100);

    return () => clearInterval(interval);
  }, [showIntro]);

  // 시작 버튼 클릭 핸들러
  const handleStartClick = useCallback(() => {
    setShowGreenOverlay(true);

    setTimeout(() => {
      setShowIntro(false);
      setShowStartButton(false);
      setShowGreenOverlay(false);
      document.body.style.overflow = 'auto';
    }, 1000);
  }, []);

  // NaraddonTube 확장 토글
  const handleExpandToggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  // 초기 스크롤 잠금
  useEffect(() => {
    if (showIntro) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showIntro]);

  return (
    <div className="home-page">
      {/* 인트로 비디오 (전체 화면) */}
      {showIntro && (
        <IntroVideo
          showStartButton={showStartButton}
          currentCaption={currentCaption}
          isCaptionVisible={isCaptionVisible}
          showGreenOverlay={showGreenOverlay}
          onStartClick={handleStartClick}
          videoError={videoError}
          setVideoError={setVideoError}
        />
      )}

      {/* 메인 콘텐츠 (인트로 후 표시) */}
      {!showIntro && (
        <div className="main-content-area">
          {/* 영상 배경 래퍼 */}
          <div className="video-section-wrapper">
            {/* 배경 영상 */}
            <div className="video-background">
              <video
                autoPlay
                muted
                loop
                playsInline
                onError={(e) => {
                  console.error('메인 페이지 배경 영상 로드 실패:', e);
                  // 영상 로드 실패 시 대체 배경
                  const videoElement = e.target;
                  if (videoElement && videoElement.parentElement) {
                    videoElement.style.display = 'none';
                    videoElement.parentElement.style.background =
                      'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
                  }
                }}
                onLoadedData={() => {
                  console.log('✅ 메인 페이지 배경 영상 로드 성공');
                }}
              >
                <source src="/videos/Naraddon_main_2nd.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="video-overlay"></div>
            </div>

            {/* 히어로 섹션 */}
            <HeroSection />
          </div>

          {/* 신뢰 보증 섹션 */}
          <TrustSection />

          {/* 정책 썸네일 섹션 */}
          <PolicyThumbnails />

          {/* 나라똔Tube 섹션 */}
          <NaraddonTube isExpanded={isExpanded} onExpandToggle={handleExpandToggle} />

          {/* 계산기 영역 - 푸터 바로 위 */}
          <SaveSection />

          {/* 보라색 CTA 섹션 */}
          <EmpathySection />

          {/* 정부기관 로고 롤링 섹션 - 맨 아래로 이동 */}
          <section
            className="government-logos-section"
            style={{
              padding: '60px 0 80px',
              background: '#ffffff',
              overflow: 'hidden',
              borderBottom: '1px solid #e0e0e0',
            }}
          >
            <div
              className="container"
              style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}
            >
              <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative' }}>
                <h2
                  style={{
                    fontSize: '36px',
                    fontWeight: '700',
                    color: '#2c3e50',
                    marginBottom: '10px',
                    display: 'inline-block',
                    position: 'relative',
                    paddingBottom: '15px',
                  }}
                >
                  함께하는 정부기관
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '0',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '80px',
                      height: '4px',
                      background: 'linear-gradient(90deg, #4CAF50, #45a049)',
                      borderRadius: '2px',
                    }}
                  ></span>
                </h2>
                <p
                  style={{
                    display: 'block',
                    fontSize: '16px',
                    color: '#666666',
                    fontWeight: '400',
                    marginTop: '10px',
                  }}
                >
                  신뢰할 수 있는 정부기관과 함께 성공을 만들어갑니다
                </p>
              </div>
              <div
                className="government-logos-wrapper"
                style={{
                  position: 'relative',
                  width: '100%',
                  overflow: 'hidden',
                  height: '80px',
                }}
              >
                <div
                  className="government-logos"
                  style={{
                    display: 'flex',
                    animation: 'scrollLogos 60s linear infinite',
                    width: 'fit-content',
                  }}
                >
                  {/* 첫 번째 트랙 */}
                  <div
                    className="logos-track"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '60px',
                      paddingRight: '60px',
                    }}
                  >
                    {[...Array(17)].map((_, i) => (
                      <div
                        key={i}
                        className="government-logo"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: '140px',
                          height: '70px',
                          opacity: 0.8,
                          transition: 'all 0.3s ease',
                          filter: 'grayscale(0%)',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '1';
                          e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '0.8';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <img
                          src={`/images/${i + 1}.png`}
                          alt={`정부기관 로고 ${i + 1}`}
                          style={{
                            maxWidth: '120px',
                            maxHeight: '60px',
                            objectFit: 'contain',
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  {/* 두 번째 트랙 (무한 루프용) */}
                  <div
                    className="logos-track"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '60px',
                      paddingRight: '60px',
                    }}
                  >
                    {[...Array(17)].map((_, i) => (
                      <div
                        key={`dup-${i}`}
                        className="government-logo"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: '140px',
                          height: '70px',
                          opacity: 0.8,
                          transition: 'all 0.3s ease',
                          filter: 'grayscale(0%)',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '1';
                          e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '0.8';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <img
                          src={`/images/${i + 1}.png`}
                          alt={`정부기관 로고 ${i + 1}`}
                          style={{
                            maxWidth: '120px',
                            maxHeight: '60px',
                            objectFit: 'contain',
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <style jsx>{`
              @keyframes scrollLogos {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(-50%);
                }
              }
            `}</style>
          </section>
        </div>
      )}
    </div>
  );
}

export default Home;
