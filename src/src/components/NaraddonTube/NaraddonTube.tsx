'use client';

import React, { useState } from 'react';
import './NaraddonTube.css';

// ì»¤ìŠ¤?€ ?´ë?ì§€ ?¬ìš©
const thumb1 = '/images/youtube/20250901__image1.jpg';
const thumb2 = '/images/youtube/20250901_image2.jpg';
const thumb3 = '/images/youtube/20250901__image3.jpg';
const thumb4 = '/images/youtube/20250901_image4.jpg';

// ?˜ë¼?”íŠœë¸??¤ì œ ?°ì´??- YouTube ?ìƒ ?°ë™
const thumbnailData = [
  {
    id: 1,
    title: '?¼í•´?¬ë? ì£¼ì˜ë³?,
    image: thumb1,
    videos: [
      {
        id: 'v1',
        title: '?¼í•´?¬ë? ì£¼ì˜ë³?1',
        youtubeId: 'ieWLah6HzG0',
        thumbnail: 'https://img.youtube.com/vi/ieWLah6HzG0/mqdefault.jpg',
      },
      {
        id: 'v2',
        title: '?¼í•´?¬ë? ì£¼ì˜ë³?2',
        youtubeId: 'YLYMd0KUfyA',
        thumbnail: 'https://img.youtube.com/vi/YLYMd0KUfyA/mqdefault.jpg',
      },
    ],
  },
  {
    id: 2,
    title: 'ë°˜ë“œ???˜ë¼???´ìš©?˜ì…”???©ë‹ˆ??,
    image: thumb2,
    videos: [
      {
        id: 'v3',
        title: '?˜ë¼???´ìš© ?ˆë‚´ 1',
        youtubeId: 'aCuMv1TV6YQ',
        thumbnail: 'https://img.youtube.com/vi/aCuMv1TV6YQ/mqdefault.jpg',
      },
      {
        id: 'v4',
        title: '?˜ë¼???´ìš© ?ˆë‚´ 2',
        youtubeId: 'gEyR5cSxHIY',
        thumbnail: 'https://img.youtube.com/vi/gEyR5cSxHIY/mqdefault.jpg',
      },
    ],
  },
  {
    id: 3,
    title: '?ˆì‹¬ë³´ì¦ 100%',
    image: thumb3,
    videos: [
      {
        id: 'v5',
        title: '?ˆì‹¬ë³´ì¦ ?¬ë? 1',
        youtubeId: 'Yg-Ww1xCSFA',
        thumbnail: 'https://img.youtube.com/vi/Yg-Ww1xCSFA/mqdefault.jpg',
      },
      {
        id: 'v6',
        title: '?ˆì‹¬ë³´ì¦ ?¬ë? 2',
        youtubeId: 'gId4FD7ESSs',
        thumbnail: 'https://img.youtube.com/vi/gId4FD7ESSs/mqdefault.jpg',
      },
    ],
  },
  {
    id: 4,
    title: '?¤ì œ ?€?œë‹˜ ?¸í„°ë·?ê¼?ë³´ì„¸??,
    image: thumb4,
    videos: [
      {
        id: 'v7',
        title: '?€?œë‹˜ ?¸í„°ë·?1',
        youtubeId: 'kiJ4XHJ_aXQ',
        thumbnail: 'https://img.youtube.com/vi/kiJ4XHJ_aXQ/mqdefault.jpg',
      },
      {
        id: 'v8',
        title: '?€?œë‹˜ ?¸í„°ë·?2',
        youtubeId: 'P60GUAk8RCY',
        thumbnail: 'https://img.youtube.com/vi/P60GUAk8RCY/mqdefault.jpg',
      },
    ],
  },
];

const NaraddonTube = () => {
  const [expandedThumb, setExpandedThumb] = useState<number | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  // ?¸ë„¤???´ë¦­ ???•ì¥/ì¶•ì†Œ ? ê?
  const handleThumbnailClick = (id: number) => {
    if (isTransitioning) return;
    setExpandedThumb(expandedThumb === id ? null : id);
  };

  // ?¸ë²„ ??ë¶€?œëŸ¬???„í™˜
  const handleMouseEnter = (id: number) => {
    // ê¸°ì¡´ ?€?„ì•„???´ë¦¬??    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }

    // ?´ë? ?¤ë¥¸ ê²ƒì´ ?•ì¥?˜ì–´ ?ˆìœ¼ë©??„í™˜ ? ë‹ˆë©”ì´??    if (expandedThumb && expandedThumb !== id) {
      setIsTransitioning(true);
      setExpandedThumb(null);

      // ì§§ì? ?œë ˆ?????ˆë¡œ??ê²??•ì¥
      const timeout = setTimeout(() => {
        setExpandedThumb(id);
        setIsTransitioning(false);
      }, 300);
      setHoverTimeout(timeout);
    } else if (!expandedThumb) {
      // ?„ë¬´ê²ƒë„ ?•ì¥?˜ì–´ ?ˆì? ?Šìœ¼ë©?ë°”ë¡œ ?•ì¥
      setExpandedThumb(id);
    }
  };

  // ë§ˆìš°?¤ê? ?˜ê°ˆ ??- ?ì—­ ê°ì? ê°œì„ 
  const handleMouseLeave = (e: React.MouseEvent, id: number) => {
    // ë§ˆìš°?¤ê? ì¹´ë“œ ?ì—­ ?´ì— ?ˆìœ¼ë©?? ì?
    const card = e.currentTarget as HTMLElement;
    const relatedTarget = e.relatedTarget as HTMLElement | null;

    // relatedTarget??null?´ê±°??Nodeê°€ ?„ë‹Œ ê²½ìš° ì²˜ë¦¬
    if (relatedTarget && card && card.contains && relatedTarget instanceof Node) {
      if (card.contains(relatedTarget)) {
        return; // ê°™ì? ì¹´ë“œ ?´ì—???´ë™?˜ë©´ ? ì?
      }
    }

    // ê¸°ì¡´ ?€?„ì•„???´ë¦¬??    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }

    // ?½ê°„???œë ˆ?´ë? ì£¼ì–´ ?¤ìˆ˜ë¡?ë²—ì–´?¬ì„ ??ë°”ë¡œ ?«íˆì§€ ?Šë„ë¡?    const timeout = setTimeout(() => {
      if (expandedThumb === id) {
        setExpandedThumb(null);
      }
    }, 300); // ?œë ˆ??ì¦ê?
    setHoverTimeout(timeout);
  };

  // ?ìƒ ?´ë¦­ ???•ë? ?¬ìƒ
  const handleVideoClick = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPlayingVideo(videoId);
  };

  // ëª¨ë‹¬ ?«ê¸°
  const handleClose = () => {
    setPlayingVideo(null);
  };

  // ì»´í¬?ŒíŠ¸ ?¸ë§ˆ?´íŠ¸ ???€?„ì•„???´ë¦¬??  React.useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  return (
    <section className="naraddon-tube-section">
      <div className="naraddon-tube-container">
        <div className="section-header">
          <h2 className="section-title">?˜ë¼?”íŠœë¸?/h2>
        </div>
        <p className="section-subtitle">?±ê³µ?ì¸ ?•ì±…?ê¸ˆ ?œìš© ?¬ë?ë¥??ìƒ?¼ë¡œ ë§Œë‚˜ë³´ì„¸??/p>

        {/* YouTube ?¤í???ê°€ë¡?4ê°?ë°°ì—´ ?ˆì´?„ì›ƒ */}
        <div className="youtube-style-grid">
          {thumbnailData.map((item) => {
            const isExpanded = expandedThumb === item.id;

            return (
              <div
                key={item.id}
                className={`youtube-card ${isExpanded ? 'expanded' : ''}`}
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={(e) => handleMouseLeave(e, item.id)}
              >
                {/* ?¸ë„¤???´ë?ì§€ ?¹ì…˜ - ??ƒ ?œì‹œ */}
                <div className="thumbnail-section" onClick={() => handleThumbnailClick(item.id)}>
                  <div className="thumbnail-wrapper">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="thumbnail-image"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg';
                      }}
                    />
                    {/* YouTube ë§ˆí¬ ?œê±° - ?´ë?ì§€ë§??œì‹œ */}
                  </div>
                  <div className="thumbnail-info">
                    <h3 className="thumbnail-title" style={isExpanded ? { color: 'white' } : {}}>
                      {item.title}
                    </h3>
                    <p className="video-count" style={isExpanded ? { color: '#00ffff' } : {}}>
                      {item.videos.length}ê°??ìƒ
                    </p>
                  </div>
                </div>

                {/* ?•ì¥ ???˜ë‹¨???˜í??˜ëŠ” ?ìƒ ëª©ë¡ */}
                {isExpanded && (
                  <div className="expanded-videos">
                    <div className="videos-grid">
                      {item.videos.map((video) => (
                        <div
                          key={video.id}
                          className="video-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVideoClick(video.youtubeId || video.id, e);
                          }}
                        >
                          <div className="video-thumbnail">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="video-thumb-img"
                            />
                            <div className="video-hover-overlay">
                              <svg className="play-icon-small" viewBox="0 0 24 24" fill="white">
                                <path d="M8 5v14l11-7z" fill="white" />
                              </svg>
                              <span className="watch-now" style={{ color: 'white' }}>
                                ?œì²­?˜ê¸°
                              </span>
                            </div>
                          </div>
                          <p className="video-title" style={{ color: 'white' }}>
                            {video.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* YouTube ?ìƒ ?¬ìƒ ëª¨ë‹¬ */}
        {playingVideo && (
          <>
            <div className="video-modal-backdrop" onClick={handleClose} />
            <div className="video-modal">
              <button className="close-button" onClick={handleClose}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <div className="video-player-container">
                <iframe
                  src={`https://www.youtube.com/embed/${playingVideo}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="youtube-player"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default NaraddonTube;


