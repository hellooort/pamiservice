
import React, { useState } from 'react';
import { Technician, Partner } from '../types';
import { 
  User, Phone, Plus, Search, X, Edit3, ChevronRight, Star,
  ArrowRightLeft, Building2, Calendar, CheckCircle2, XCircle
} from 'lucide-react';

interface TechnicianManagementProps {
  technicians: Technician[];
  partners: Partner[];
  onUpdateTechnician: (tech: Technician) => void;
  onCreateTechnician: (tech: Technician) => void;
}

type ViewMode = 'list' | 'form' | 'transfer';

const TechnicianManagement: React.FC<TechnicianManagementProps> = ({ technicians, partners, onUpdateTechnician, onCreateTechnician }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [partnerFilter, setPartnerFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Technician>>({});
  const [transferTech, setTransferTech] = useState<Technician | null>(null);
  const [transferTargetPartner, setTransferTargetPartner] = useState('');

  const filteredTechs = technicians.filter(t => {
    const matchesSearch = t.name.includes(searchTerm) || t.phone.includes(searchTerm);
    const matchesPartner = partnerFilter === 'all' || t.partnerId === partnerFilter;
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesPartner && matchesStatus;
  });

  const getPartnerName = (partnerId: string) => partners.find(p => p.id === partnerId)?.name || '-';

  const handleOpenCreate = () => {
    setFormData({ status: 'active', joinedAt: new Date().toISOString().split('T')[0], completedCount: 0, rating: 0 });
    setIsEditMode(false);
    setViewMode('form');
  };

  const handleOpenEdit = (tech: Technician) => {
    setFormData(tech);
    setIsEditMode(true);
    setViewMode('form');
  };

  const handleSave = () => {
    if (isEditMode) {
      onUpdateTechnician(formData as Technician);
    } else {
      onCreateTechnician({ ...formData, id: `t${Date.now()}` } as Technician);
    }
    setViewMode('list');
  };

  const handleOpenTransfer = (tech: Technician) => {
    setTransferTech(tech);
    setTransferTargetPartner('');
    setViewMode('transfer');
  };

  const handleTransfer = () => {
    if (transferTech && transferTargetPartner) {
      onUpdateTechnician({ ...transferTech, partnerId: transferTargetPartner });
    }
    setViewMode('list');
    setTransferTech(null);
  };

  // ─── 소속 변경 ───
  if (viewMode === 'transfer' && transferTech) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setViewMode('list')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronRight className="rotate-180" size={20} />
          </button>
          <h3 className="text-lg font-bold text-gray-900">기사 소속 변경</h3>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
          <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
              {transferTech.name.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-gray-900">{transferTech.name} 기사</p>
              <p className="text-sm text-gray-500">{transferTech.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 bg-red-50 p-4 rounded-xl border border-red-100 text-center">
              <p className="text-xs text-red-500 font-bold mb-1">현재 소속</p>
              <p className="font-bold text-red-700">{getPartnerName(transferTech.partnerId)}</p>
            </div>
            <ArrowRightLeft className="text-gray-400 shrink-0" size={24} />
            <div className="flex-1 bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
              <p className="text-xs text-blue-500 font-bold mb-1">변경할 소속</p>
              <select
                value={transferTargetPartner}
                onChange={(e) => setTransferTargetPartner(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm font-bold text-blue-700 outline-none"
              >
                <option value="">선택하세요</option>
                {partners.filter(p => p.id !== transferTech.partnerId && p.status === 'active').map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-2">
            <svg className="text-amber-500 shrink-0 mt-0.5" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01M12 2l10 18H2z"/></svg>
            <p className="text-xs text-amber-800 leading-relaxed">
              소속 변경 시 해당 기사의 <strong>진행 중인 업무는 유지</strong>되며, 이후 배정되는 업무부터 새로운 협력사 기준으로 적용됩니다.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={() => setViewMode('list')} className="px-6 py-2.5 border border-gray-300 rounded-xl font-bold text-gray-600">취소</button>
          <button
            onClick={handleTransfer}
            disabled={!transferTargetPartner}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-200 disabled:text-gray-400"
          >
            소속 변경 확정
          </button>
        </div>
      </div>
    );
  }

  // ─── 등록/수정 폼 ───
  if (viewMode === 'form') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setViewMode('list')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronRight className="rotate-180" size={20} />
          </button>
          <h3 className="text-lg font-bold text-gray-900">{isEditMode ? '기사 정보 수정' : '기사 신규 등록'}</h3>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
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
              <label className="block text-sm font-bold text-gray-600 mb-1.5">연락처 <span className="text-red-500">*</span></label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="010-0000-0000"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1.5">소속 협력사 <span className="text-red-500">*</span></label>
              <select
                value={formData.partnerId || ''}
                onChange={(e) => setFormData({ ...formData, partnerId: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">선택하세요</option>
                {partners.filter(p => p.status === 'active').map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1.5">상태</label>
              <select
                value={formData.status || 'active'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="active">활성</option>
                <option value="inactive">비활성</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={() => setViewMode('list')} className="px-6 py-2.5 border border-gray-300 rounded-xl font-bold text-gray-600">취소</button>
          <button onClick={handleSave} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
            {isEditMode ? '수정 완료' : '등록하기'}
          </button>
        </div>
      </div>
    );
  }

  // ─── 목록 ───
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">기사 관리 ({filteredTechs.length}명)</h3>
        <button onClick={handleOpenCreate} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
          <Plus size={18} /> 기사 신규 등록
        </button>
      </div>

      {/* 검색/필터 */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="이름, 연락처로 검색..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <select value={partnerFilter} onChange={(e) => setPartnerFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium text-sm bg-white">
          <option value="all">전체 협력사</option>
          {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium text-sm bg-white">
          <option value="all">전체 상태</option>
          <option value="active">활성</option>
          <option value="inactive">비활성</option>
        </select>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">이름</th>
              <th className="px-6 py-4">연락처</th>
              <th className="px-6 py-4">소속 협력사</th>
              <th className="px-6 py-4">상태</th>
              <th className="px-6 py-4">누적 완료</th>
              <th className="px-6 py-4">평점</th>
              <th className="px-6 py-4">입사일</th>
              <th className="px-6 py-4 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTechs.map(tech => (
              <tr key={tech.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                      {tech.name.charAt(0)}
                    </div>
                    <span className="font-medium">{tech.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{tech.phone}</td>
                <td className="px-6 py-4">
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded-full font-medium">{getPartnerName(tech.partnerId)}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${tech.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {tech.status === 'active' ? <><CheckCircle2 size={10}/> 활성</> : <><XCircle size={10}/> 비활성</>}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium">{tech.completedCount}건</td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1 text-amber-600 font-bold">
                    <Star size={12} className="fill-amber-400 text-amber-400" /> {tech.rating}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-gray-500">{tech.joinedAt}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => handleOpenEdit(tech)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600" title="수정">
                      <Edit3 size={14} />
                    </button>
                    <button onClick={() => handleOpenTransfer(tech)} className="p-1.5 hover:bg-purple-50 rounded-lg text-purple-600" title="소속 변경">
                      <ArrowRightLeft size={14} />
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

export default TechnicianManagement;
