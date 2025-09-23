'use client';

import { useState, useEffect } from 'react';
import DataTable, { Column } from '@/components/admin/common/DataTable';
import ProfileCard from '@/components/profile/ProfileCard';
import { User, UserRole, UserStatus } from '@/types/user.types';
import {
  UserGroupIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

// 임시 데이터
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@naraddon.com',
    name: '관리자',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    provider: 'email' as any,
    profile: {
      company: '나라똔',
      position: '시스템 관리자',
      phone: '010-1234-5678',
      address: {
        zipCode: '12345',
        address1: '서울시 강남구',
        address2: '테헤란로 123'
      }
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    lastLoginAt: new Date()
  },
  {
    id: '2',
    email: 'examiner@company.com',
    name: '김심사',
    role: UserRole.EXAMINER,
    status: UserStatus.ACTIVE,
    provider: 'google' as any,
    profile: {
      company: '심사전문기업',
      position: '수석 심사관',
      phone: '010-2345-6789',
      specialty: ['IT', '제조업', '서비스업'],
      experience: 10
    },
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date(),
    lastLoginAt: new Date()
  },
  {
    id: '3',
    email: 'expert@consulting.com',
    name: '이전문',
    role: UserRole.EXPERT,
    status: UserStatus.ACTIVE,
    provider: 'naver' as any,
    profile: {
      company: '전문컨설팅',
      position: '대표 컨설턴트',
      phone: '010-3456-7890',
      specialty: ['경영전략', '마케팅', '재무'],
      experience: 15,
      rating: 4.8
    },
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date(),
    lastLoginAt: new Date()
  },
  {
    id: '4',
    email: 'user@business.com',
    name: '박기업',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    provider: 'kakao' as any,
    profile: {
      company: '일반기업',
      position: '대표이사',
      phone: '010-4567-8901',
      businessNumber: '123-45-67890'
    },
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date(),
    lastLoginAt: new Date()
  },
  {
    id: '5',
    email: 'pending@newcompany.com',
    name: '최신규',
    role: UserRole.USER,
    status: UserStatus.PENDING,
    provider: 'google' as any,
    profile: {
      company: '신규회사',
      position: '팀장'
    },
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date()
  }
];

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN: return '관리자';
      case UserRole.EXAMINER: return '기업심사관';
      case UserRole.EXPERT: return '전문가';
      case UserRole.USER: return '일반회원';
      default: return role;
    }
  };

  const getStatusLabel = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE: return '활성';
      case UserStatus.INACTIVE: return '비활성';
      case UserStatus.SUSPENDED: return '정지';
      case UserStatus.PENDING: return '대기';
      default: return status;
    }
  };

  const columns: Column<User>[] = [
    {
      key: 'name',
      label: '이름',
      sortable: true,
      render: (user) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <UserGroupIcon className="h-10 w-10 text-gray-400" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'profile.company',
      label: '회사',
      sortable: true,
      render: (user) => user.profile.company || '-'
    },
    {
      key: 'role',
      label: '등급',
      sortable: true,
      render: (user) => {
        const roleColors = {
          [UserRole.ADMIN]: 'bg-red-100 text-red-800',
          [UserRole.EXAMINER]: 'bg-purple-100 text-purple-800',
          [UserRole.EXPERT]: 'bg-blue-100 text-blue-800',
          [UserRole.USER]: 'bg-gray-100 text-gray-800'
        };
        return (
          <span className={`inline-flex px-2 text-xs font-semibold rounded-full ${roleColors[user.role]}`}>
            {getRoleLabel(user.role)}
          </span>
        );
      }
    },
    {
      key: 'status',
      label: '상태',
      sortable: true,
      render: (user) => {
        const statusColors = {
          [UserStatus.ACTIVE]: 'bg-green-100 text-green-800',
          [UserStatus.INACTIVE]: 'bg-yellow-100 text-yellow-800',
          [UserStatus.SUSPENDED]: 'bg-red-100 text-red-800',
          [UserStatus.PENDING]: 'bg-orange-100 text-orange-800'
        };
        return (
          <span className={`inline-flex px-2 text-xs font-semibold rounded-full ${statusColors[user.status]}`}>
            {getStatusLabel(user.status)}
          </span>
        );
      }
    },
    {
      key: 'createdAt',
      label: '가입일',
      sortable: true,
      render: (user) => new Date(user.createdAt).toLocaleDateString('ko-KR')
    },
    {
      key: 'lastLoginAt',
      label: '최근 접속',
      sortable: true,
      render: (user) => user.lastLoginAt
        ? new Date(user.lastLoginAt).toLocaleDateString('ko-KR')
        : '-'
    }
  ];

  // 필터링된 데이터
  const filteredUsers = users.filter(user => {
    if (filterRole !== 'all' && user.role !== filterRole) return false;
    if (filterStatus !== 'all' && user.status !== filterStatus) return false;
    return true;
  });

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, role: newRole } : user
    ));
    // API 호출 추가 필요
    console.log(`Changed user ${userId} role to ${newRole}`);
  };

  const handleStatusChange = (userId: string, newStatus: UserStatus) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, status: newStatus } : user
    ));
    // API 호출 추가 필요
    console.log(`Changed user ${userId} status to ${newStatus}`);
  };

  const handleExport = () => {
    // 엑셀 다운로드 로직 추가 필요
    console.log('Exporting users to Excel...');
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">회원 관리</h1>
          <p className="mt-1 text-sm text-gray-500">
            전체 회원 {users.length}명 | 활성 {users.filter(u => u.status === UserStatus.ACTIVE).length}명
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {viewMode === 'table' ? '카드 보기' : '테이블 보기'}
          </button>
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
            엑셀 다운로드
          </button>
        </div>
      </div>

      {/* 필터 */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">필터:</span>
          </div>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">모든 등급</option>
            <option value={UserRole.ADMIN}>관리자</option>
            <option value={UserRole.EXAMINER}>기업심사관</option>
            <option value={UserRole.EXPERT}>전문가</option>
            <option value={UserRole.USER}>일반회원</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">모든 상태</option>
            <option value={UserStatus.ACTIVE}>활성</option>
            <option value={UserStatus.INACTIVE}>비활성</option>
            <option value={UserStatus.SUSPENDED}>정지</option>
            <option value={UserStatus.PENDING}>대기</option>
          </select>

          <div className="ml-auto text-sm text-gray-500">
            {filteredUsers.length}명 검색됨
          </div>
        </div>
      </div>

      {/* 승격 대기 알림 */}
      {users.filter(u => u.status === UserStatus.PENDING).length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <span className="font-medium">승인 대기 중인 회원이 {users.filter(u => u.status === UserStatus.PENDING).length}명 있습니다.</span>
                {' '}회원 정보를 검토하고 등급을 부여해주세요.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 데이터 표시 */}
      {viewMode === 'table' ? (
        <DataTable
          data={filteredUsers}
          columns={columns}
          onRowClick={(user) => setSelectedUser(user)}
          searchPlaceholder="이름, 이메일, 회사 검색..."
          actions={(user) => (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleRoleChange(user.id, UserRole.EXAMINER)}
                className="text-purple-600 hover:text-purple-900 text-sm"
              >
                등급변경
              </button>
              <button className="text-blue-600 hover:text-blue-900 text-sm">
                상세
              </button>
            </div>
          )}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <ProfileCard
              key={user.id}
              user={user}
              mode="admin"
              onRoleChange={(newRole) => handleRoleChange(user.id, newRole)}
              onStatusChange={(newStatus) => handleStatusChange(user.id, newStatus)}
            />
          ))}
        </div>
      )}

      {/* 선택된 사용자 모달 */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75"
              onClick={() => setSelectedUser(null)}
            />
            <div className="relative bg-white rounded-lg max-w-2xl w-full p-6">
              <ProfileCard
                user={selectedUser}
                mode="admin"
                onRoleChange={(newRole) => {
                  handleRoleChange(selectedUser.id, newRole);
                  setSelectedUser(null);
                }}
                onStatusChange={(newStatus) => {
                  handleStatusChange(selectedUser.id, newStatus);
                  setSelectedUser(null);
                }}
              />
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}