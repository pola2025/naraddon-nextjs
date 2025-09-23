'use client';

import { useState, useEffect } from 'react';
import ProfileCard from '@/components/profile/ProfileCard';
import ProfileEditModal from './ProfileEditModal';
import { User, UserRole, UserStatus, isProfileComplete } from '@/types/user.types';
import { UserActivity, UserStats, ActivityType, ContentType, ReactionType } from '@/types/activity.types';
import {
  UserCircleIcon,
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  CalendarIcon,
  ClockIcon,
  ChatBubbleLeftIcon,
  PencilSquareIcon,
  HeartIcon,
  HandThumbUpIcon,
  EyeIcon,
  ChartBarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// 임시 현재 사용자 데이터
const mockCurrentUser: User = {
  id: '4',
  email: 'user@business.com',
  name: '박기업',
  role: UserRole.USER,
  status: UserStatus.ACTIVE,
  provider: 'kakao' as any,
  profile: {
    company: '나라똔 테크',
    position: '대표이사',
    phone: '010-4567-8901',
    businessNumber: '123-45-67890',
    introduction: '안녕하세요. 나라똔 테크의 대표 박기업입니다. IT 솔루션 개발과 컨설팅을 주로 하고 있습니다.',
    address: {
      zipCode: '12345',
      address1: '서울시 강남구 테헤란로 123',
      address2: '나라똔빌딩 5층'
    },
    website: 'https://naraddon-tech.com'
  },
  createdAt: new Date('2024-04-01'),
  updatedAt: new Date(),
  lastLoginAt: new Date()
};

export default function MyPage() {
  const [user, setUser] = useState<User>(mockCurrentUser);
  const [activeTab, setActiveTab] = useState<'profile' | 'activity' | 'stats' | 'settings'>('profile');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activityFilter, setActivityFilter] = useState<'all' | ActivityType>('all');
  const [showProfileAlert, setShowProfileAlert] = useState(!isProfileComplete(mockCurrentUser.profile));

  // 사용자 통계 데이터 (임시)
  const userStats: UserStats = {
    totalPosts: 15,
    totalComments: 47,
    totalReactions: 123,
    totalViews: 892,
    reactions: {
      likes: 65,
      helpfuls: 38,
      empathies: 20
    },
    contentStats: {
      [ContentType.POLICY_NEWS]: {
        posts: 3,
        comments: 12,
        reactions: 34,
        views: 245
      },
      [ContentType.BUSINESS_VOICE]: {
        posts: 5,
        comments: 18,
        reactions: 42,
        views: 387
      },
      [ContentType.TTONTOK]: {
        posts: 7,
        comments: 17,
        reactions: 47,
        views: 260
      }
    },
    activityByPeriod: {
      today: 5,
      thisWeek: 23,
      thisMonth: 78,
      total: 282
    },
    activityScore: 1250,
    level: 3,
    nextLevelProgress: 65
  };

  // 최근 활동 데이터 (임시)
  const recentActivities: UserActivity[] = [
    {
      id: '1',
      userId: user.id,
      activityType: ActivityType.POST,
      contentType: ContentType.POLICY_NEWS,
      contentId: 'post-1',
      contentTitle: '2024년 중소기업 지원정책 안내',
      createdAt: new Date('2024-05-20 14:30')
    },
    {
      id: '2',
      userId: user.id,
      activityType: ActivityType.COMMENT,
      contentType: ContentType.BUSINESS_VOICE,
      contentId: 'comment-1',
      contentTitle: 'CEO 인터뷰: 디지털 전환 성공 사례',
      details: {
        comment: '매우 유익한 내용이었습니다. 저희 회사에도 적용해보고 싶네요.'
      },
      createdAt: new Date('2024-05-20 11:15')
    },
    {
      id: '3',
      userId: user.id,
      activityType: ActivityType.REACTION,
      contentType: ContentType.TTONTOK,
      contentId: 'reaction-1',
      contentTitle: '스타트업 성장 전략 공유',
      details: {
        reactionType: ReactionType.HELPFUL
      },
      createdAt: new Date('2024-05-19 16:45')
    },
    {
      id: '4',
      userId: user.id,
      activityType: ActivityType.VIEW,
      contentType: ContentType.NARADDON_TUBE,
      contentId: 'view-1',
      contentTitle: '나라똔 정책 브리핑 5월호',
      createdAt: new Date('2024-05-19 10:20')
    },
    {
      id: '5',
      userId: user.id,
      activityType: ActivityType.CONSULTATION,
      contentType: ContentType.EXPERT_CONSULTATION,
      contentId: 'consult-1',
      contentTitle: '경영 전략 컨설팅',
      createdAt: new Date('2024-05-18 15:00')
    }
  ];

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (updatedUser: User) => {
    setUser(updatedUser);
    setShowProfileAlert(!isProfileComplete(updatedUser.profile));
    // 여기서 API 호출하여 서버에 저장
  };

  const getRoleBadgeInfo = () => {
    switch (user.role) {
      case UserRole.EXAMINER:
        return {
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: ShieldCheckIcon,
          label: '기업심사관',
          description: '기업 심사 권한을 보유한 전문 심사관입니다.'
        };
      case UserRole.EXPERT:
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: UserCircleIcon,
          label: '전문가',
          description: '전문 상담 서비스를 제공하는 인증된 전문가입니다.'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: UserCircleIcon,
          label: '일반회원',
          description: '나라똔의 일반 회원입니다.'
        };
    }
  };

  const roleInfo = getRoleBadgeInfo();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">마이페이지</h1>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽 사이드바 */}
          <div className="lg:col-span-1">
            {/* 프로필 요약 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="text-center">
                <div className="inline-block relative">
                  <UserCircleIcon className="w-24 h-24 text-gray-400" />
                  {user.role !== UserRole.USER && (
                    <div className="absolute -top-2 -right-2">
                      <roleInfo.icon className="w-8 h-8 text-blue-500" />
                    </div>
                  )}
                </div>
                <h2 className="mt-4 text-xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>

                {/* 등급 배지 */}
                <div className="mt-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${roleInfo.color}`}>
                    {roleInfo.label}
                  </span>
                  <p className="mt-2 text-xs text-gray-600">{roleInfo.description}</p>
                </div>

                {/* 프로필 완성도 */}
                <div className="mt-6">
                  {!isProfileComplete(user.profile) && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center">
                        <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-2" />
                        <div>
                          <p className="text-xs font-semibold text-red-800">필수 정보 미입력</p>
                          <p className="text-xs text-red-600 mt-0.5">
                            게시글 작성을 위해 필수 정보를 입력해주세요
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleEditProfile}
                        className="mt-2 w-full text-xs bg-red-600 text-white py-1.5 rounded hover:bg-red-700"
                      >
                        정보 입력하기
                      </button>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>프로필 완성도</span>
                    <span>{isProfileComplete(user.profile) ? '100%' : '60%'}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        isProfileComplete(user.profile) ? 'bg-green-600' : 'bg-yellow-600'
                      }`}
                      style={{ width: isProfileComplete(user.profile) ? '100%' : '60%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 빠른 메뉴 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">빠른 메뉴</h3>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'profile'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <UserCircleIcon className="w-5 h-5 mr-3" />
                  프로필 정보
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'activity'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ClockIcon className="w-5 h-5 mr-3" />
                  활동 내역
                </button>
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'stats'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ChartBarIcon className="w-5 h-5 mr-3" />
                  통계
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'settings'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <CogIcon className="w-5 h-5 mr-3" />
                  계정 설정
                </button>
              </nav>
            </div>
          </div>

          {/* 오른쪽 메인 영역 */}
          <div className="lg:col-span-2">
            {activeTab === 'profile' && (
              <ProfileCard
                user={user}
                mode="mypage"
                editable={true}
                onEdit={handleEditProfile}
                className="mb-6"
              />
            )}

            {activeTab === 'activity' && (
              <div className="space-y-6">
                {/* 활동 필터 */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActivityFilter('all')}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        activityFilter === 'all'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      전체
                    </button>
                    <button
                      onClick={() => setActivityFilter(ActivityType.POST)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        activityFilter === ActivityType.POST
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      게시글
                    </button>
                    <button
                      onClick={() => setActivityFilter(ActivityType.COMMENT)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        activityFilter === ActivityType.COMMENT
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      댓글
                    </button>
                    <button
                      onClick={() => setActivityFilter(ActivityType.REACTION)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        activityFilter === ActivityType.REACTION
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      반응
                    </button>
                  </div>
                </div>

                {/* 활동 목록 */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 활동 내역</h3>
                  <div className="space-y-4">
                    {recentActivities
                      .filter(activity => activityFilter === 'all' || activity.activityType === activityFilter)
                      .map((activity) => {
                        const getActivityIcon = () => {
                          switch (activity.activityType) {
                            case ActivityType.POST: return <PencilSquareIcon className="w-5 h-5" />;
                            case ActivityType.COMMENT: return <ChatBubbleLeftIcon className="w-5 h-5" />;
                            case ActivityType.REACTION:
                              if (activity.details?.reactionType === ReactionType.LIKE) return <HeartIcon className="w-5 h-5" />;
                              if (activity.details?.reactionType === ReactionType.HELPFUL) return <HandThumbUpIcon className="w-5 h-5" />;
                              return <HeartIcon className="w-5 h-5" />;
                            case ActivityType.VIEW: return <EyeIcon className="w-5 h-5" />;
                            case ActivityType.CONSULTATION: return <UserCircleIcon className="w-5 h-5" />;
                            default: return <DocumentTextIcon className="w-5 h-5" />;
                          }
                        };

                        const getActivityLabel = () => {
                          switch (activity.activityType) {
                            case ActivityType.POST: return '게시글 작성';
                            case ActivityType.COMMENT: return '댓글 작성';
                            case ActivityType.REACTION:
                              if (activity.details?.reactionType === ReactionType.LIKE) return '좋아요';
                              if (activity.details?.reactionType === ReactionType.HELPFUL) return '도움이 되요';
                              if (activity.details?.reactionType === ReactionType.EMPATHY) return '공감';
                              return '반응';
                            case ActivityType.VIEW: return '조회';
                            case ActivityType.CONSULTATION: return '상담';
                            default: return activity.activityType;
                          }
                        };

                        return (
                          <div key={activity.id} className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                                {getActivityIcon()}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                {getActivityLabel()}
                              </p>
                              <p className="text-sm text-gray-600 truncate">
                                {activity.contentTitle}
                              </p>
                              {activity.details?.comment && (
                                <p className="mt-1 text-sm text-gray-500 italic">
                                  "{activity.details.comment}"
                                </p>
                              )}
                              <p className="mt-1 text-xs text-gray-500">
                                {new Date(activity.createdAt).toLocaleString('ko-KR')}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-6">
                {/* 전체 통계 */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">활동 통계</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{userStats.totalPosts}</div>
                      <div className="text-sm text-gray-500">게시글</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{userStats.totalComments}</div>
                      <div className="text-sm text-gray-500">댓글</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{userStats.totalReactions}</div>
                      <div className="text-sm text-gray-500">반응</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{userStats.totalViews}</div>
                      <div className="text-sm text-gray-500">조회수</div>
                    </div>
                  </div>
                </div>

                {/* 반응 통계 */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">반응 분석</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <HeartIcon className="w-5 h-5 text-red-500 mr-3" />
                      <span className="text-sm text-gray-600 w-20">좋아요</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 ml-3">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${(userStats.reactions.likes / userStats.totalReactions) * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-3 text-sm font-medium">{userStats.reactions.likes}</span>
                    </div>
                    <div className="flex items-center">
                      <HandThumbUpIcon className="w-5 h-5 text-blue-500 mr-3" />
                      <span className="text-sm text-gray-600 w-20">도움이 되요</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 ml-3">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(userStats.reactions.helpfuls / userStats.totalReactions) * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-3 text-sm font-medium">{userStats.reactions.helpfuls}</span>
                    </div>
                    <div className="flex items-center">
                      <HeartIcon className="w-5 h-5 text-purple-500 mr-3" />
                      <span className="text-sm text-gray-600 w-20">공감</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 ml-3">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${(userStats.reactions.empathies / userStats.totalReactions) * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-3 text-sm font-medium">{userStats.reactions.empathies}</span>
                    </div>
                  </div>
                </div>

                {/* 레벨 및 점수 */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">활동 레벨</h4>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">레벨 {userStats.level}</span>
                    <span className="text-sm text-gray-600">레벨 {userStats.level + 1}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                      style={{ width: `${userStats.nextLevelProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-center text-sm text-gray-600">
                    활동 점수: <span className="font-bold text-blue-600">{userStats.activityScore}</span>
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">계정 설정</h3>

                <div className="space-y-6">
                  {/* 비밀번호 변경 */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">보안</h4>
                    <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">비밀번호 변경</span>
                        <span className="text-sm text-gray-500">→</span>
                      </div>
                    </button>
                  </div>

                  {/* 알림 설정 */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">알림</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600" defaultChecked />
                        <span className="ml-2 text-sm text-gray-700">이메일 알림 받기</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600" defaultChecked />
                        <span className="ml-2 text-sm text-gray-700">SMS 알림 받기</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                        <span className="ml-2 text-sm text-gray-700">마케팅 정보 수신</span>
                      </label>
                    </div>
                  </div>

                  {/* 계정 삭제 */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">계정 관리</h4>
                    <button className="text-red-600 hover:text-red-700 text-sm">
                      회원 탈퇴
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 서비스 이용 현황 (프로필 탭) */}
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">상담 이용</h4>
                    <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">3건</p>
                  <p className="text-xs text-gray-500 mt-1">전체 상담 내역</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">활동 점수</h4>
                    <CalendarIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">450점</p>
                  <p className="text-xs text-gray-500 mt-1">이번 달 활동</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 프로필 편집 모달 */}
      <ProfileEditModal
        user={user}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
      />
    </div>
  );
}