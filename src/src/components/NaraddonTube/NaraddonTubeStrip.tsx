'use client';

import React, { useCallback, useState } from 'react';
import { useEmbedOrigin } from '@/hooks/useEmbedOrigin';
import './NaraddonTubeStrip.css';

// Ïª§Ïä§?Ä ?¥Î?ÏßÄ ?¨Ïö© (Í∏∞Ï°¥Í≥??ôÏùº)
const thumb1 = '/images/youtube/20250901__image1.jpg';
const thumb2 = '/images/youtube/20250901_image2.jpg';
const thumb3 = '/images/youtube/20250901__image3.jpg';
const thumb4 = '/images/youtube/20250901_image4.jpg';

// ?òÎùº?îÌäúÎ∏??†Î∞∞?àÌòï ?∞Ïù¥??- ÏßÄÍ∑∏Ïû¨Í∑?Î∞∞Ïπò
const stripData = [
  {
    id: 1,
    title: '?ºÌï¥?¨Î? Ï£ºÏùòÎ≥?,
    image: thumb1,
    position: 'left', // ?¥Î?ÏßÄ ?ºÏ™Ω
    videos: [
      {
        id: 'v1',
        title: '?ºÌï¥?¨Î? Ï£ºÏùòÎ≥?1',
        youtubeId: 'ieWLah6HzG0',
        thumbnail: 'https://img.youtube.com/vi/ieWLah6HzG0/mqdefault.jpg',
      },
      {
        id: 'v2',
        title: '?ºÌï¥?¨Î? Ï£ºÏùòÎ≥?2',
        youtubeId: 'YLYMd0KUfyA',
        thumbnail: 'https://img.youtube.com/vi/YLYMd0KUfyA/mqdefault.jpg',
      },
    ],
  },
  {
    id: 2,
    title: 'Î∞òÎìú???òÎùº???¥Ïö©?òÏÖî???©Îãà??,
    image: thumb2,
    position: 'right', // ?¥Î?ÏßÄ ?§Î•∏Ï™?    videos: [
      {
        id: 'v3',
        title: '?òÎùº???¥Ïö© ?àÎÇ¥ 1',
        youtubeId: 'aCuMv1TV6YQ',
        thumbnail: 'https://img.youtube.com/vi/aCuMv1TV6YQ/mqdefault.jpg',
      },
      {
        id: 'v4',
        title: '?òÎùº???¥Ïö© ?àÎÇ¥ 2',
        youtubeId: 'gEyR5cSxHIY',
        thumbnail: 'https://img.youtube.com/vi/gEyR5cSxHIY/mqdefault.jpg',
      },
    ],
  },
  {
    id: 3,
    title: '?àÏã¨Î≥¥Ï¶ù 100%',
    image: thumb3,
    position: 'left', // ?¥Î?ÏßÄ ?ºÏ™Ω
    videos: [
      {
        id: 'v5',
        title: '?àÏã¨Î≥¥Ï¶ù ?¨Î? 1',
        youtubeId: 'Yg-Ww1xCSFA',
        thumbnail: 'https://img.youtube.com/vi/Yg-Ww1xCSFA/mqdefault.jpg',
      },
      {
        id: 'v6',
        title: '?àÏã¨Î≥¥Ï¶ù ?¨Î? 2',
        youtubeId: 'gId4FD7ESSs',
        thumbnail: 'https://img.youtube.com/vi/gId4FD7ESSs/mqdefault.jpg',
      },
    ],
  },
  {
    id: 4,
    title: '?§Ï†ú ?Ä?úÎãò ?∏ÌÑ∞Î∑?Íº?Î≥¥ÏÑ∏??,
    image: thumb4,
    position: 'right', // ?¥Î?ÏßÄ ?§Î•∏Ï™?    videos: [
      {
        id: 'v7',
        title: '?Ä?úÎãò ?∏ÌÑ∞Î∑?1',
        youtubeId: 'kiJ4XHJ_aXQ',
        thumbnail: 'https://img.youtube.com/vi/kiJ4XHJ_aXQ/mqdefault.jpg',
      },
      {
        id: 'v8',
        title: '?Ä?úÎãò ?∏ÌÑ∞Î∑?2',
        youtubeId: 'P60GUAk8RCY',
        thumbnail: 'https://img.youtube.com/vi/P60GUAk8RCY/mqdefault.jpg',
      },
    ],
  },
];

const NaraddonTubeStrip = () => {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [hoveredStrip, setHoveredStrip] = useState<number | null>(null);

  // ?ÅÏÉÅ ?¥Î¶≠ ???¨ÏÉù
  const handleVideoClick = (videoId: string) => {
    setPlayingVideo(videoId);
  };

  // Î™®Îã¨ ?´Í∏∞
  const handleClose = () => {
    setPlayingVideo(null);
  };

  return (
    <section className="naraddon-tube-strip-section">
      <div className="strip-container">
        <div className="strip-header">
          <h2 className="strip-title">?òÎùº?îÌäúÎ∏?Ïª¨Î†â??/h2>
          <p className="strip-subtitle">?µÏã¨ ÏΩòÌÖêÏ∏†Î? ?úÎàà??ÎßåÎÇòÎ≥¥ÏÑ∏??/p>
        </div>

        <div className="strips-wrapper">
          {stripData.map((item) => (
            <div
              key={item.id}
              className={`strip-item ${item.position} ${hoveredStrip === item.id ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredStrip(item.id)}
              onMouseLeave={() => setHoveredStrip(null)}
            >
              {/* ?¥Î?ÏßÄ ?πÏÖò */}
              <div className="strip-image-section">
                <div className="strip-image-wrapper">
                  <img src={item.image} alt={item.title} className="strip-image" />
                  <div className="strip-image-overlay">
                    <h3 className="strip-image-title">{item.title}</h3>
                  </div>
                </div>
              </div>

              {/* ?ÅÏÉÅ ?πÏÖò */}
              <div className="strip-videos-section">
                <div className="strip-videos-grid">
                  {item.videos.map((video) => (
                    <div
                      key={video.id}
                      className="strip-video-item"
                      onClick={() => handleVideoClick(video.youtubeId)}
                    >
                      <div className="strip-video-thumbnail">
                        <img src={video.thumbnail} alt={video.title} className="strip-video-img" />
                        <div className="strip-video-overlay">
                          <svg className="strip-play-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      <p className="strip-video-title">{video.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* YouTube ?ÅÏÉÅ ?¨ÏÉù Î™®Îã¨ (Í∏∞Ï°¥Í≥??ôÏùº) */}
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

export default NaraddonTubeStrip;
