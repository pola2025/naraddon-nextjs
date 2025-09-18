'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useAuth } from '@/contexts/AuthContext';
import CanAccess from './CanAccess';

// 로고 이미지 경로 - 주황색 "똔" 로고
const LOGO_URL = '/images/Logo_old.png'; // 실제 나라똔 로고
const LOGO_FALLBACK_URL =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDUiIGhlaWdodD0iNDUiIHZpZXdCb3g9IjAgMCA0NSA0NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ1IiBoZWlnaHQ9IjQ1IiByeD0iOCIgZmlsbD0idXJsKCNncmFkaWVudCkiLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iYm9sZCI+TjwvdGV4dD4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNENBRjUwO3N0b3Atb3BhY2l0eToxIiAvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM0NWEwNDk7c3RvcC1vcGFjaXR5OjEiIC8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHeroPreview = pathname === '/hero-preview';
  const { data: session, status } = useSession();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 프로필 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (isHeroPreview) return null;

  return (
    <>
      <header className={`App-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          <div className="logo-wrapper">
            <Link href="/" className="logo-section">
              {!logoError ? (
                <img
                  src={LOGO_URL}
                  alt="나라똔 로고"
                  className="logo"
                  style={{ width: '45px', height: '45px', objectFit: 'contain' }}
                  onError={(e) => {
                    console.error('로고 로드 실패, 폴백 이미지 사용');
                    setLogoError(true);
                  }}
                />
              ) : (
                <div className="logo-fallback">
                  <span>N</span>
                </div>
              )}
              <div className="logo-text">
                <h1>NARADDON</h1>
                <span className="logo-subtitle">정부정책자금 전문 플랫폼</span>
              </div>
            </Link>
          </div>

          <div className="header-center">
            <nav className="main-nav">
              <ul>
                <li>
                  <Link href="/" className={pathname === '/' ? 'active' : ''}>
                    나라똔
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policy-analysis"
                    className={pathname === '/policy-analysis' ? 'active' : ''}
                  >
                    정책분석
                  </Link>
                </li>
                <li>
                  <Link
                    href="/business-voice"
                    className={pathname === '/business-voice' ? 'active' : ''}
                  >
                    사업자 목소리
                  </Link>
                </li>
                <li>
                  <Link
                    href="/certified-examiners"
                    className={pathname === '/certified-examiners' ? 'active' : ''}
                  >
                    인증 기업심사관
                  </Link>
                </li>
                <li>
                  <Link
                    href="/expert-services"
                    className={pathname === '/expert-services' ? 'active' : ''}
                  >
                    전문가 서비스
                  </Link>
                </li>
                <li>
                  <Link
                    href="/consultation-request"
                    className={pathname === '/consultation-request' ? 'active' : ''}
                  >
                    상담신청
                  </Link>
                </li>

                {/* 관리자 메뉴 */}
                <CanAccess role="admin">
                  <li>
                    <Link href="/admin" className={pathname.startsWith('/admin') ? 'active' : ''}>
                      관리자
                    </Link>
                  </li>
                </CanAccess>

                {/* 심사관 메뉴 */}
                <CanAccess role="examiner">
                  <li>
                    <Link
                      href="/examiner"
                      className={pathname.startsWith('/examiner') ? 'active' : ''}
                    >
                      심사관
                    </Link>
                  </li>
                </CanAccess>
              </ul>
            </nav>
          </div>

          <div className="header-right">
            {/* 로그인/프로필 */}
            {isAuthenticated ? (
              <div className="profile-dropdown relative">
                <button
                  className="profile-button flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.name?.[0] || user?.email?.[0] || 'U'}
                  </div>
                  <span className="hidden md:block text-sm font-medium">
                    {user?.name || user?.email?.split('@')[0]}
                  </span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user?.name || '사용자'}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      {user?.role && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                          {user.role === 'admin'
                            ? '관리자'
                            : user.role === 'examiner'
                              ? '심사관'
                              : '일반 사용자'}
                        </span>
                      )}
                    </div>

                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        프로필 설정
                      </Link>

                      <CanAccess role="admin">
                        <Link
                          href="/admin/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          관리자 대시보드
                        </Link>
                      </CanAccess>

                      <CanAccess role="examiner">
                        <Link
                          href="/examiner/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          심사관 대시보드
                        </Link>
                      </CanAccess>

                      <Link
                        href="/my-consultations"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        내 상담 내역
                      </Link>
                    </div>

                    <div className="border-t border-gray-200">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        로그아웃
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="login-button">
                <i className="fas fa-user"></i>
                <span>로그인</span>
              </Link>
            )}
          </div>
        </div>

        {/* 모바일 네비게이션 - 블록 형태 */}
        <div className="mobile-block-nav">
          <div className="mobile-nav-grid">
            <Link href="/" className={`mobile-nav-block ${pathname === '/' ? 'active' : ''}`}>
              <i className="fas fa-home"></i>
              <span>나라똔</span>
            </Link>
            <Link
              href="/ttontok"
              className={`mobile-nav-block ${pathname === '/ttontok' ? 'active' : ''}`}
            >
              <i className="fas fa-comments"></i>
              <span>똔톡</span>
            </Link>
            <Link
              href="/policy-analysis"
              className={`mobile-nav-block ${pathname === '/policy-analysis' ? 'active' : ''}`}
            >
              <i className="fas fa-chart-line"></i>
              <span>정책분석</span>
            </Link>
            <Link
              href="/business-voice"
              className={`mobile-nav-block ${pathname === '/business-voice' ? 'active' : ''}`}
            >
              <i className="fas fa-comments"></i>
              <span>사업자목소리</span>
            </Link>
            <Link
              href="/certified-examiners"
              className={`mobile-nav-block ${pathname === '/certified-examiners' ? 'active' : ''}`}
            >
              <i className="fas fa-user-check"></i>
              <span>인증심사관</span>
            </Link>
            <Link
              href="/expert-services"
              className={`mobile-nav-block ${pathname === '/expert-services' ? 'active' : ''}`}
            >
              <i className="fas fa-briefcase"></i>
              <span>전문서비스</span>
            </Link>
            <Link
              href="/consultation-request"
              className={`mobile-nav-block ${pathname === '/consultation-request' ? 'active' : ''}`}
            >
              <i className="fas fa-headset"></i>
              <span>상담신청</span>
            </Link>

            {/* 관리자 모바일 메뉴 */}
            <CanAccess role="admin">
              <Link
                href="/admin"
                className={`mobile-nav-block ${pathname.startsWith('/admin') ? 'active' : ''}`}
              >
                <i className="fas fa-cog"></i>
                <span>관리자</span>
              </Link>
            </CanAccess>

            {/* 심사관 모바일 메뉴 */}
            <CanAccess role="examiner">
              <Link
                href="/examiner"
                className={`mobile-nav-block ${pathname.startsWith('/examiner') ? 'active' : ''}`}
              >
                <i className="fas fa-clipboard-check"></i>
                <span>심사관</span>
              </Link>
            </CanAccess>

            {/* 로그인/로그아웃 */}
            {isAuthenticated ? (
              <button onClick={handleLogout} className="mobile-nav-block">
                <i className="fas fa-sign-out-alt"></i>
                <span>로그아웃</span>
              </button>
            ) : (
              <Link href="/auth/login" className="mobile-nav-block">
                <i className="fas fa-user"></i>
                <span>로그인</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <style jsx>{`
        .App-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background-color: white;
          z-index: 1000;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .App-header.scrolled {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .header-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo-wrapper {
          flex-shrink: 0;
        }

        .logo-section {
          display: flex;
          align-items: center;
          text-decoration: none;
          gap: 12px;
          transition: all 0.3s ease;
        }

        .logo-section:hover {
          transform: translateX(3px);
        }

        .logo {
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .logo-fallback {
          width: 45px;
          height: 45px;
          background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .logo-text h1 {
          font-size: 24px;
          font-weight: 700;
          color: #333;
          margin: 0;
          line-height: 1.2;
        }

        .logo-subtitle {
          font-size: 10px;
          color: #666;
          font-weight: 500;
          margin-top: 2px;
        }

        .header-center {
          flex: 1;
          display: flex;
          justify-content: center;
          padding: 0 20px;
        }

        .main-nav ul {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 20px;
        }

        .main-nav a {
          text-decoration: none;
          color: #333;
          font-weight: 500;
          font-size: 14px;
          padding: 8px 12px;
          border-radius: 8px;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .main-nav a:hover {
          background-color: #f0f0f0;
          color: #4caf50;
        }

        .main-nav a.active {
          background-color: #e8f5e9;
          color: #4caf50;
        }

        .header-right {
          flex-shrink: 0;
        }

        .login-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
          color: white;
          border: none;
          border-radius: 25px;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .login-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        }

        .mobile-block-nav {
          display: none;
        }

        /* 대형 화면에서 메뉴 간격 조정 */
        @media (max-width: 1280px) {
          .main-nav ul {
            gap: 15px;
          }

          .main-nav a {
            font-size: 13px;
            padding: 6px 10px;
          }
        }

        @media (max-width: 1024px) {
          .header-container {
            padding: 0 15px;
          }

          .header-center {
            display: none;
          }

          .logo-text h1 {
            font-size: 20px;
          }

          .logo-subtitle {
            display: none;
          }

          .mobile-block-nav {
            display: block;
            background: white;
            border-top: 1px solid #e0e0e0;
            padding: 10px;
          }

          .mobile-nav-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            max-width: 600px;
            margin: 0 auto;
          }

          .mobile-nav-block {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 10px 6px;
            background: #f8f9fa;
            border-radius: 10px;
            text-decoration: none;
            color: #333;
            font-size: 10px;
            font-weight: 500;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            width: 100%;
            min-height: 60px;
          }

          .mobile-nav-block i {
            font-size: 16px;
            margin-bottom: 4px;
            color: #666;
          }

          .mobile-nav-block span {
            text-align: center;
            line-height: 1.2;
          }

          .mobile-nav-block:hover,
          .mobile-nav-block.active {
            background: #e8f5e9;
            color: #4caf50;
          }

          .mobile-nav-block:hover i,
          .mobile-nav-block.active i {
            color: #4caf50;
          }
        }

        @media (max-width: 640px) {
          .mobile-nav-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 6px;
          }

          .mobile-nav-block {
            font-size: 9px;
            padding: 8px 4px;
            min-height: 55px;
          }

          .mobile-nav-block i {
            font-size: 14px;
          }

          .logo {
            width: 35px !important;
            height: 35px !important;
          }

          .logo-text h1 {
            font-size: 18px;
          }
        }

        @media (max-width: 480px) {
          .mobile-nav-grid {
            gap: 4px;
          }

          .mobile-nav-block {
            font-size: 8px;
            padding: 6px 2px;
            min-height: 50px;
          }

          .mobile-nav-block i {
            font-size: 12px;
            margin-bottom: 2px;
          }
        }

        .profile-dropdown {
          position: relative;
        }

        .profile-button {
          background: white;
          border: 1px solid #e0e0e0;
        }

        .profile-button:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </>
  );
}
