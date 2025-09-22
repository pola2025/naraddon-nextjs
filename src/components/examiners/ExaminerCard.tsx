'use client';

import React from 'react';
import Link from 'next/link';
import type { ExaminerProfile } from './examinerTypes';

interface ExaminerCardProps {
  examiner: ExaminerProfile;
  priority?: boolean;
}

export const ExaminerCard = React.memo(({ examiner, priority = false }: ExaminerCardProps) => {
  const companyLabel = examiner.companyName?.trim();
  const imageUrl = examiner.imageUrl?.trim();
  const hasImage = Boolean(imageUrl);
  const roleLabel = examiner.position?.trim() || '인증 기업심사관';

  return (
    <article className="certified-examiners-card">
      <div className="certified-examiners-card__media">
        <span className="certified-examiners-card__badge">
          <i className="fas fa-check" aria-hidden="true" /> 인증된 전문가
        </span>
        <div
          className={
            hasImage
              ? 'certified-examiners-card__image'
              : 'certified-examiners-card__image certified-examiners-card__image--placeholder'
          }
        >
          {hasImage ? (
            <img
              src={imageUrl}
              alt={examiner.imageAlt?.trim() || `${examiner.name} 프로필`}
              width={220}
              height={260}
              className="certified-examiners-card__photo"
              loading={priority ? "eager" : "lazy"}
            />
          ) : (
            <i className="fas fa-user-tie" aria-hidden="true" />
          )}
        </div>
      </div>
      <div className="certified-examiners-card__body">
        <h3 className="certified-examiners-card__name">
          {examiner.name}
          {companyLabel ? (
            <span className="certified-examiners-card__company"> | {companyLabel}</span>
          ) : null}
        </h3>
        <p className="certified-examiners-card__role">{roleLabel}</p>
        <Link href="/consultation-request#form-section" className="certified-examiners-card__action">
          상담 신청하기
          <i className="fas fa-arrow-right" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
});

ExaminerCard.displayName = 'ExaminerCard';