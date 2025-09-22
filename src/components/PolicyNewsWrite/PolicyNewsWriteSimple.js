'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import './PolicyNewsWrite.css';

const categories = [
  { value: '', label: '카테고리를 선택해주세요' },
  { value: '정부지원', label: '정부지원' },
  { value: '중소기업', label: '중소기업' },
  { value: '창업지원', label: '창업지원' },
  { value: '연구개발', label: '연구개발' },
  { value: '금융지원', label: '금융지원' },
  { value: '세제지원', label: '세제지원' },
  { value: '고용지원', label: '고용지원' },
  { value: '지역정책', label: '지역정책' },
  { value: '환경정책', label: '환경정책' },
  { value: '기타', label: '기타' },
];

const PolicyNewsWriteSimple = () => {
  const router = useRouter();
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    excerpt: '',
    content: '',
    tags: '',
    thumbnail: '',
    isMainNews: false,
  });

  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadedImages, setUploadedImages] = useState([]);

  // 비밀번호 검증
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/policy-news/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthorized(true);
        sessionStorage.setItem('policyNewsAuthorized', 'true');
      } else {
        setErrors({ password: '비밀번호가 올바르지 않습니다.' });
      }
    } catch (error) {
      setErrors({ password: '인증 중 오류가 발생했습니다.' });
    }
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (3MB 제한)
    if (file.size > 3 * 1024 * 1024) {
      alert('이미지 파일 크기는 3MB를 초과할 수 없습니다.');
      e.target.value = '';
      return;
    }

    // 파일 타입 체크
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      e.target.value = '';
      return;
    }

    // 이미지를 Base64로 변환 (또는 서버에 업로드)
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      const imageMarkdown = `\n![${file.name}](${imageUrl})\n`;

      // 커서 위치에 이미지 마크다운 삽입
      const textarea = textareaRef.current;
      const cursorPos = textarea.selectionStart;
      const textBefore = formData.content.substring(0, cursorPos);
      const textAfter = formData.content.substring(cursorPos);

      setFormData({
        ...formData,
        content: textBefore + imageMarkdown + textAfter,
      });

      // 업로드된 이미지 목록에 추가
      setUploadedImages([...uploadedImages, { name: file.name, url: imageUrl }]);
    };
    reader.readAsDataURL(file);

    // 입력 초기화
    e.target.value = '';
  };

  // 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // 유효성 검사
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = '제목을 입력해주세요.';
    if (!formData.category) newErrors.category = '카테고리를 선택해주세요.';
    if (!formData.content.trim()) newErrors.content = '내용을 입력해주세요.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/policy-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          password,
          isMain: formData.isMainNews,
        }),
      });

      if (response.ok) {
        alert('정책소식이 등록되었습니다.');
        router.push('/policy-news');
      } else {
        const error = await response.json();
        alert(error.message || '등록에 실패했습니다.');
      }
    } catch (error) {
      alert('등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 미리보기 생성
  const renderPreview = () => {
    return formData.content.split('\n').map((line, index) => {
      if (!line.trim()) return null;

      // 이미지 패턴
      const imagePattern = /^!\[([^\]]*)\]\(([^)]+)\)$/;
      const imageMatch = line.match(imagePattern);
      if (imageMatch) {
        const [, alt, url] = imageMatch;
        return (
          <div key={index} className="preview-image">
            <img src={url} alt={alt} />
            {alt && <p className="preview-caption">{alt}</p>}
          </div>
        );
      }

      // 제목 패턴
      const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
      if (headingMatch) {
        const [, hashes, text] = headingMatch;
        const level = hashes.length;
        return <div key={index} className={`preview-h${level}`}>{text}</div>;
      }

      // 구분선
      if (line.match(/^(-{3,}|\*{3,})$/)) {
        return <hr key={index} className="preview-divider" />;
      }

      // 일반 텍스트
      return <p key={index} className="preview-paragraph">{line}</p>;
    });
  };

  if (!isAuthorized) {
    return (
      <div className="policy-news-write">
        <div className="write-container">
          <h1>정책소식 작성</h1>
          <form className="password-form" onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label>관리자 비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                required
              />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>
            <button type="submit" className="submit-btn">인증</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="policy-news-write">
      <div className="write-container">
        <h1>정책소식 작성</h1>

        <div className="write-guide">
          <h3>📝 작성 가이드</h3>
          <ul>
            <li><strong>제목:</strong> # 제목 텍스트</li>
            <li><strong>소제목:</strong> ## 소제목 텍스트</li>
            <li><strong>구분선:</strong> --- (3개 이상)</li>
            <li><strong>이미지:</strong> 아래 버튼으로 업로드 (3MB 제한)</li>
            <li><strong>문단:</strong> 엔터로 구분</li>
          </ul>
        </div>

        <form className="write-form" onSubmit={handleSubmit}>
          {/* 제목 */}
          <div className="form-group">
            <label>제목 *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="정책소식 제목을 입력하세요"
            />
            {errors.title && <span className="error">{errors.title}</span>}
          </div>

          {/* 카테고리 */}
          <div className="form-group">
            <label>카테고리 *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && <span className="error">{errors.category}</span>}
          </div>

          {/* 요약 */}
          <div className="form-group">
            <label>요약</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="간단한 요약을 입력하세요"
              rows="3"
            />
          </div>

          {/* 내용 */}
          <div className="form-group">
            <label>내용 *</label>
            <div className="editor-toolbar">
              <button
                type="button"
                className="toolbar-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                📷 이미지 추가 (3MB 제한)
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
            </div>
            <textarea
              ref={textareaRef}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder={`내용을 입력하세요.\n\n# 제목\n## 소제목\n일반 텍스트\n--- (구분선)\n\n이미지는 위 버튼으로 추가하세요.`}
              rows="20"
              className="content-editor"
            />
            {errors.content && <span className="error">{errors.content}</span>}
          </div>

          {/* 미리보기 */}
          {formData.content && (
            <div className="form-group">
              <label>미리보기</label>
              <div className="content-preview">
                {renderPreview()}
              </div>
            </div>
          )}

          {/* 태그 */}
          <div className="form-group">
            <label>태그</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="태그1, 태그2, 태그3 (쉼표로 구분)"
            />
          </div>

          {/* 썸네일 */}
          <div className="form-group">
            <label>썸네일 URL</label>
            <input
              type="url"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* 메인 노출 */}
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={formData.isMainNews}
                onChange={(e) => setFormData({ ...formData, isMainNews: e.target.checked })}
              />
              메인 페이지 노출
            </label>
          </div>

          {/* 버튼 */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => router.push('/policy-news')}
            >
              취소
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? '등록 중...' : '등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PolicyNewsWriteSimple;