'use client';

import React from 'react';

export const ExaminerCardSkeleton = React.memo(() => {
  return (
    <article className="certified-examiners-card">
      <div className="certified-examiners-card__media">
        <span className="certified-examiners-card__badge" style={{ opacity: 0.5 }}>
          <i className="fas fa-check" aria-hidden="true" /> 인증된 전문가
        </span>
        <div className="certified-examiners-card__image certified-examiners-card__image--placeholder">
          <div
            className="animate-pulse"
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite'
            }}
          />
        </div>
      </div>
      <div className="certified-examiners-card__body">
        <div
          className="animate-pulse"
          style={{
            height: '24px',
            background: '#f0f0f0',
            borderRadius: '4px',
            marginBottom: '8px',
            width: '80%'
          }}
        />
        <div
          className="animate-pulse"
          style={{
            height: '16px',
            background: '#f0f0f0',
            borderRadius: '4px',
            marginBottom: '16px',
            width: '60%'
          }}
        />
        <div
          className="animate-pulse"
          style={{
            height: '40px',
            background: '#f0f0f0',
            borderRadius: '20px',
            width: '120px'
          }}
        />
      </div>
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </article>
  );
});

ExaminerCardSkeleton.displayName = 'ExaminerCardSkeleton';