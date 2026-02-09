
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { MOCK_PARTNERS } from '../constants';
import { 
  Plus, Search, Edit3, Key, Shield, ShieldCheck, ShieldOff,
  Mail, Clock, X, Eye, EyeOff
} from 'lucide-react';

interface AccountManagementProps {
  users: User[];
  onUpdateUser: (user: User) => void;
  onCreateUser: (user: User) => void;
}

type ViewMode = 'list' | 'form' | 'resetPassword';

const AccountManagement: React.FC<AccountManagementProps> = ({ users, onUpdateUser, onCreateUser }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [resetTarget, setResetTarget] = useState<User | null>(null);
  const [showTempPassword, setShowTempPassword] = useState(false);

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN: return '본사 관리자';
      case UserRole.OPERATOR: return '본사 운영자';
      case UserRole.PARTNER_ADMIN: return '협력사 관리자';
      case UserRole.TECHNICIAN: return '현장 기사';
    }
  };

  const getRoleStyle = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN: return 'bg-red-100 text-red-700';
      case UserRole.OPERATOR: return 'bg-blue-100 text-blue-700';
      case UserRole.PARTNER_ADMIN: return 'bg-purple-100 text-purple-700';
      case UserRole.TECHNICIAN: return 'bg-green-100 text-green-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return '활성';
      case 'pending': return '비밀번호 미설정';
      case 'inactive': return '비활성';
      default: return status;
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.includes(searchTerm) || u.email.includes(searchTerm);
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenCreate = () => {
    setFormData({ status: 'pending', createdAt: new Date().toISOString().split('T')[0] });
    setIsEditMode(false);
    setViewMode('form');
  };

  const handleSave = () => {
    if (isEditMode) {
      onUpdateUser(formData as User);
    } else {
      onCreateUser({ ...formData, id: `u${Date.now()}` } as User);
    }
    setViewMode('list');
  };

  // ─── 비밀번호 초기화 ───
  if (viewMode === 'resetPassword' && resetTarget) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setViewMode('list')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">←</button>
          <h3 className="text-lg font-bold text-gray-900">비밀번호 초기화</h3>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6 max-w-lg">
          <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
              {resetTarget.name.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-gray-900">{resetTarget.name}</p>
              <p className="text-sm text-gray-500">{resetTarget.email}</p>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-2">
            <svg className="text-amber-500 shrink-0 mt-0.5" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01M12 2l10 18H2z"/></svg>
            <p className="text-xs text-amber-800 leading-relaxed">
              비밀번호를 초기화하면 <strong>임시 비밀번호가 생성</strong>되며, 사용자는 로그인 시 새 비밀번호를 설정해야 합니다.
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1.5">생성된 임시 비밀번호</label>
            <div className="relative">
              <input
                type={showTempPassword ? 'text' : 'password'}
                value="Tmp@2024!xK9"
                readOnly
                className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl font-mono"
              />
              <button onClick={() => setShowTempPassword(!showTempPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showTempPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button className="mt-2 text-sm text-blue-600 font-bold hover:underline">클립보드에 복사</button>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setViewMode('list')} className="flex-1 py-2.5 border border-gray-300 rounded-xl font-bold text-gray-600">취소</button>
            <button onClick={() => { onUpdateUser({ ...resetTarget, status: 'pending' }); setViewMode('list'); }} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700">
              초기화 확정
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── 계정 등록/수정 폼 ───
  if (viewMode === 'form') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setViewMode('list')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">←</button>
          <h3 className="text-lg font-bold text-gray-900">{isEditMode ? '계정 수정' : '계정 발급'}</h3>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5 max-w-lg">
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1.5">이름 <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="홍길동"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1.5">이메일 (로그인 ID) <span className="text-red-500">*</span></label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="user@fieldops.co.kr"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1.5">권한 <span className="text-red-500">*</span></label>
            <select
              value={formData.role || ''}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">선택하세요</option>
              <option value={UserRole.ADMIN}>본사 관리자</option>
              <option value={UserRole.OPERATOR}>본사 운영자</option>
              <option value={UserRole.PARTNER_ADMIN}>협력사 관리자</option>
              <option value={UserRole.TECHNICIAN}>현장 기사</option>
            </select>
          </div>
          {(formData.role === UserRole.PARTNER_ADMIN || formData.role === UserRole.TECHNICIAN) && (
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1.5">소속 협력사</label>
              <select
                value={formData.partnerId || ''}
                onChange={(e) => setFormData({ ...formData, partnerId: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">선택하세요</option>
                {MOCK_PARTNERS.filter(p => p.status === 'active').map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-xs text-blue-800 leading-relaxed">
            계정 발급 시 <strong>임시 비밀번호가 자동 생성</strong>됩니다. 사용자에게 이메일과 임시 비밀번호를 전달해주세요.
            사용자는 최초 로그인 시 비밀번호를 직접 설정합니다.
          </div>
        </div>

        <div className="flex gap-3 max-w-lg">
          <button onClick={() => setViewMode('list')} className="flex-1 py-2.5 border border-gray-300 rounded-xl font-bold text-gray-600">취소</button>
          <button onClick={handleSave} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">
            {isEditMode ? '수정 완료' : '계정 발급'}
          </button>
        </div>
      </div>
    );
  }

  // ─── 목록 ───
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">계정 관리 ({filteredUsers.length}명)</h3>
        <button onClick={handleOpenCreate} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700">
          <Plus size={18} /> 계정 발급
        </button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="이름, 이메일로 검색..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium text-sm bg-white">
          <option value="all">전체 권한</option>
          <option value={UserRole.ADMIN}>본사 관리자</option>
          <option value={UserRole.OPERATOR}>본사 운영자</option>
          <option value={UserRole.PARTNER_ADMIN}>협력사 관리자</option>
          <option value={UserRole.TECHNICIAN}>현장 기사</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">이름</th>
              <th className="px-6 py-4">이메일</th>
              <th className="px-6 py-4">권한</th>
              <th className="px-6 py-4">소속</th>
              <th className="px-6 py-4">상태</th>
              <th className="px-6 py-4">최근 로그인</th>
              <th className="px-6 py-4 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{user.name}</td>
                <td className="px-6 py-4 text-gray-600 flex items-center gap-1"><Mail size={14} className="text-gray-400" /> {user.email}</td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getRoleStyle(user.role)}`}>
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 text-xs">
                  {user.partnerId ? MOCK_PARTNERS.find(p => p.id === user.partnerId)?.name : '-'}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    user.status === 'active' ? 'bg-green-100 text-green-700' :
                    user.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {getStatusLabel(user.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={12} /> {user.lastLoginAt || '-'}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => { setFormData(user); setIsEditMode(true); setViewMode('form'); }} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600" title="수정">
                      <Edit3 size={14} />
                    </button>
                    <button onClick={() => { setResetTarget(user); setViewMode('resetPassword'); }} className="p-1.5 hover:bg-amber-50 rounded-lg text-amber-600" title="비밀번호 초기화">
                      <Key size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountManagement;
