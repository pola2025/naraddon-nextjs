'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './page.css';

const CATEGORY_OPTIONS = [
  { id: 'startup', label: '창업', icon: '🚀' },
  { id: 'operation', label: '운영', icon: '🏭' },
  { id: 'trouble', label: '고충', icon: '🤔' },
  { id: 'network', label: '네트워킹', icon: '🤝' },
  { id: 'support', label: '지원', icon: '💰' },
  { id: 'success', label: '성공사례', icon: '🏆' },
  { id: 'question', label: '질문', icon: '❓' },
];

const PASSWORD_STORAGE_KEY = 'naraddon_ttontok_write_authorized';
const PASSWORD_VALUE_KEY = `${PASSWORD_STORAGE_KEY}_value`;
const DEFAULT_NICKNAME = process.env.NEXT_PUBLIC_TTONTOK_DEFAULT_NICKNAME || '나라똔 관리자';

interface FormState {
  category: string;
  title: string;
  content: string;
  isAnonymous: boolean;
  businessType: string;
  region: string;
  yearsInBusiness: string;
}

const initialFormState: FormState = {
  category: '',
  title: '',
  content: '',
  isAnonymous: false,
  businessType: '',
  region: '',
  yearsInBusiness: '',
};

export default function TtontokWritePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [authorizedPassword, setAuthorizedPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const storedAuth = sessionStorage.getItem(PASSWORD_STORAGE_KEY);
    const storedPassword = sessionStorage.getItem(PASSWORD_VALUE_KEY);
    if (storedAuth === 'true' && storedPassword) {
      setAuthorizedPassword(storedPassword);
      setIsAuthorized(true);
    }
  }, []);

  const hasBusinessInfo = useMemo(() => !formData.isAnonymous, [formData.isAnonymous]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (event.target as HTMLInputElement).checked : value,
    }));
  };

  const handleVerifyPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordError(null);

    const trimmed = passwordInput.trim();
    if (!trimmed) {
      setPasswordError('비밀번호를 입력해주세요.');
      return;
    }

    try {
      setVerifying(true);
      const response = await fetch('/api/ttontok/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: trimmed }),
      });

      if (!response.ok) {
        throw new Error('인증에 실패했습니다.');
      }

      sessionStorage.setItem(PASSWORD_STORAGE_KEY, 'true');
      sessionStorage.setItem(PASSWORD_VALUE_KEY, trimmed);
      setAuthorizedPassword(trimmed);
      setIsAuthorized(true);
      setPasswordInput('');
      setPasswordError(null);
    } catch (error) {
      console.error(error);
      setPasswordError('비밀번호가 올바르지 않습니다.');
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    if (!authorizedPassword) {
      setSubmitError('인증 정보가 없습니다. 다시 시도해주세요.');
      setIsAuthorized(false);
      return;
    }

    if (!formData.category) {
      setSubmitError('카테고리를 선택해주세요.');
      return;
    }

    if (!formData.title.trim()) {
      setSubmitError('제목을 입력해주세요.');
      return;
    }

    if (formData.content.trim().length < 30) {
      setSubmitError('본문은 최소 30자 이상 입력해주세요.');
      return;
    }

    const payload = {
      password: authorizedPassword,
      category: formData.category,
      title: formData.title.trim(),
      content: formData.content.trim(),
      nickname: DEFAULT_NICKNAME,
      isAnonymous: formData.isAnonymous,
      businessType: hasBusinessInfo ? formData.businessType.trim() : '',
      region: hasBusinessInfo ? formData.region.trim() : '',
      yearsInBusiness: hasBusinessInfo && formData.yearsInBusiness ? Number(formData.yearsInBusiness) : null,
    };

    try {
      setSubmitting(true);
      const response = await fetch('/api/ttontok/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => undefined);
        throw new Error(data?.message ?? '게시글 등록 중 오류가 발생했습니다.');
      }

      sessionStorage.removeItem(PASSWORD_VALUE_KEY);
      router.push('/ttontok');
    } catch (error) {
      console.error(error);
      setSubmitError(error instanceof Error ? error.message : '게시글 등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="write-password-overlay">
        <form className="write-password-card" onSubmit={handleVerifyPassword}>
          <h1>비밀번호 확인</h1>
          <p>똔톡 작성 권한을 확인하기 위해 비밀번호를 입력해주세요.</p>
          <input
            type="password"
            className="write-password-input"
            value={passwordInput}
            onChange={(event) => setPasswordInput(event.target.value)}
            placeholder="비밀번호"
            autoFocus
          />
          {passwordError ? <p className="write-password-error">{passwordError}</p> : null}
          <button type="submit" className="btn-primary" disabled={verifying}>
            {verifying ? '확인 중...' : '확인'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => router.back()}>
            돌아가기
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="write-container">
      <div className="write-header">
        <h1>똔톡 글쓰기</h1>
        <Link href="/ttontok" className="cancel-button">
          목록으로
        </Link>
      </div>

      <form className="write-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <label className="form-label required">카테고리</label>
          <div className="category-select">
            {CATEGORY_OPTIONS.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`category-option${formData.category === category.id ? ' selected' : ''}`}
                onClick={() => setFormData((prev) => ({ ...prev, category: category.id }))}
              >
                <span className="category-icon">{category.icon}</span> {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-section">
          <label htmlFor="title" className="form-label required">
            제목
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="제목을 입력해주세요"
            maxLength={100}
            className="form-input"
          />
          <div className="char-count">{formData.title.length}/100</div>
        </div>

        <div className="form-section">
          <label htmlFor="content" className="form-label required">
            내용
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder={`다른 사업자들과 경험을 나누고 싶은 이야기를 자유롭게 작성해주세요.

- 창업 준비 과정에서 겪은 어려움
- 운영 중 마주한 문제와 해결 방법
- 정부 지원금 / 정책자금 참여 후기
- 세무·노무·마케팅 등 전문 영역 질문

※ 최소 30자 이상 입력해주세요.`}
            rows={15}
            className="form-input"
          />
          <div className="char-count">{formData.content.length}자</div>
        </div>

        <div className="form-section">
          <div className="checkbox-wrapper">
            <input
              type="checkbox"
              id="isAnonymous"
              name="isAnonymous"
              checked={formData.isAnonymous}
              onChange={handleChange}
            />
            <label htmlFor="isAnonymous">익명으로 작성</label>
          </div>
        </div>

        {hasBusinessInfo && (
          <div className="business-info-section">
            <h3 className="section-title">사업 정보 (선택)</h3>
            <p className="section-description">사업 정보를 입력하면 유사한 상황의 사업자들이 더 쉽게 도움을 드릴 수 있습니다.</p>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="businessType">업종</label>
                <input
                  type="text"
                  id="businessType"
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  placeholder="예: 제조, IT, 도소매"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="region">지역</label>
                <input
                  type="text"
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  placeholder="예: 서울, 부산"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="yearsInBusiness">운영 기간 (년)</label>
                <input
                  type="number"
                  id="yearsInBusiness"
                  name="yearsInBusiness"
                  value={formData.yearsInBusiness}
                  onChange={handleChange}
                  placeholder="예: 3"
                  min="0"
                  max="99"
                  className="form-input"
                />
              </div>
            </div>
          </div>
        )}

        {submitError ? <p className="form-error">{submitError}</p> : null}

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => router.back()}>
            취소
          </button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? '등록 중...' : '등록하기'}
          </button>
        </div>
      </form>
    </div>
  );
}
