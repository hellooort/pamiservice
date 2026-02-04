
import React from 'react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, role, onRoleChange }) => {
  const isMobile = role === UserRole.TECHNICIAN;

  return (
    <div className={`min-h-screen ${isMobile ? 'bg-gray-100' : 'bg-gray-50'}`}>
      <div className="bg-slate-900 text-white p-2 flex justify-between items-center text-xs sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="font-bold">FieldOps OMS</span>
          <span className="px-2 py-0.5 bg-blue-600 rounded">시뮬레이션 모드</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="opacity-70">역할 변경:</span>
          <select 
            value={role} 
            onChange={(e) => onRoleChange(e.target.value as UserRole)}
            className="bg-slate-800 border-none rounded text-white cursor-pointer px-2 py-0.5 outline-none"
          >
            <option value={UserRole.ADMIN}>관리자 (본사)</option>
            <option value={UserRole.OPERATOR}>운영자 (실무)</option>
            <option value={UserRole.PARTNER_ADMIN}>도급 관리자</option>
            <option value={UserRole.TECHNICIAN}>현장 기사 (모바일)</option>
          </select>
        </div>
      </div>

      <main className={`${isMobile ? 'pb-20' : 'p-0'} transition-all`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
