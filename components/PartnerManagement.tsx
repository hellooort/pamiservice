
import React, { useState } from 'react';
import { Partner, Technician } from '../types';
import { MOCK_TECHNICIANS } from '../constants';
import { 
  Building2, MapPin, Phone, User, Plus, Search, X, Edit3, 
  ChevronRight, ShieldCheck, ShieldOff, Users, FileText, Hash
} from 'lucide-react';

interface PartnerManagementProps {
  partners: Partner[];
  onUpdatePartner: (partner: Partner) => void;
  onCreatePartner: (partner: Partner) => void;
}

type ViewMode = 'list' | 'detail' | 'form';

const PartnerManagement: React.FC<PartnerManagementProps> = ({ partners, onUpdatePartner, onCreatePartner }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isEditMode, setIsEditMode] = useState(false);

  // 폼 상태
  const [formData, setFormData] = useState<Partial<Partner>>({});

  const filteredPartners = partners.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.location.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPartnerTechnicians = (partnerId: string): Technician[] => {
    return MOCK_TECHNICIANS.filter(t => t.partnerId === partnerId);
  };

  const handleOpenCreate = () => {
    setFormData({ status: 'active', createdAt: new Date().toISOString().split('T')[0] });
    setIsEditMode(false);
    setViewMode('form');
  };

  const handleOpenEdit = (partner: Partner) => {
    setFormData(partner);
    setIsEditMode(true);
    setViewMode('form');
  };

  const handleSave = () => {
    if (isEditMode) {
      onUpdatePartner(formData as Partner);
    } else {
      onCreatePartner({ ...formData, id: `p${Date.now()}` } as Partner);
    }
    setViewMode('list');
  };

  // ─── 상세 뷰 ───
  if (viewMode === 'detail' && selectedPartner) {
    const techs = getPartnerTechnicians(selectedPartner.id);
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => { setViewMode('list'); setSelectedPartner(null); }} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronRight className="rotate-180" size={20} />
          </button>
          <h3 className="text-lg font-bold text-gray-900 flex-1">협력사 상세</h3>
          <button onClick={() => handleOpenEdit(selectedPartner)} className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50">
            <Edit3 size={16} /> 수정
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><Building2 size={28} /></div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-xl font-bold text-gray-900">{selectedPartner.name}</h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${selectedPartner.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                  {selectedPartner.status === 'active' ? <><ShieldCheck size={10}/> 활성</> : <><ShieldOff size={10}/> 비활성</>}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{selectedPartner.location}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div>
              <p className="text-xs text-gray-400 font-bold mb-1 flex items-center gap-1"><User size={12}/> 담당자</p>
              <p className="font-medium text-gray-900">{selectedPartner.contactName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold mb-1 flex items-center gap-1"><Phone size={12}/> 연락처</p>
              <p className="font-medium text-gray-900">{selectedPartner.contactPhone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold mb-1 flex items-center gap-1"><Hash size={12}/> 사업자번호</p>
              <p className="font-medium text-gray-900">{selectedPartner.businessNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold mb-1 flex items-center gap-1"><MapPin size={12}/> 사업장 주소</p>
              <p className="font-medium text-gray-900">{selectedPartner.address}</p>
            </div>
          </div>
        </div>

        {/* 소속 기사 목록 */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h4 className="font-bold text-gray-900 flex items-center gap-2"><Users size={18}/> 소속 기사 ({techs.length}명)</h4>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-3">이름</th>
                <th className="px-6 py-3">연락처</th>
                <th className="px-6 py-3">상태</th>
                <th className="px-6 py-3">누적 완료</th>
                <th className="px-6 py-3">평점</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {techs.map(t => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium">{t.name}</td>
                  <td className="px-6 py-3 text-gray-600">{t.phone}</td>
                  <td className="px-6 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {t.status === 'active' ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-600">{t.completedCount}건</td>
                  <td className="px-6 py-3 text-amber-600 font-bold">{t.rating}</td>
                </tr>
              ))}
              {techs.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">소속 기사가 없습니다</td></tr>
              )}
            </tbody>
          </table>
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
          <h3 className="text-lg font-bold text-gray-900">{isEditMode ? '협력사 수정' : '협력사 신규 등록'}</h3>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1.5">협력사명 <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="(주)알파 클리닝"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1.5">지역 <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="서울/수도권"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1.5">담당자명 <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.contactName || ''}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                placeholder="김대표"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1.5">담당자 연락처 <span className="text-red-500">*</span></label>
              <input
                type="tel"
                value={formData.contactPhone || ''}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="02-1234-5678"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1.5">사업자번호</label>
              <input
                type="text"
                value={formData.businessNumber || ''}
                onChange={(e) => setFormData({ ...formData, businessNumber: e.target.value })}
                placeholder="123-45-67890"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
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
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1.5">사업장 주소</label>
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="서울특별시 강남구 테헤란로 123"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={() => setViewMode('list')} className="px-6 py-2.5 border border-gray-300 rounded-xl font-bold text-gray-600 hover:bg-white transition-colors">
            취소
          </button>
          <button onClick={handleSave} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
            {isEditMode ? '수정 완료' : '등록하기'}
          </button>
        </div>
      </div>
    );
  }

  // ─── 목록 뷰 ───
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">협력사 관리 ({filteredPartners.length})</h3>
        <button onClick={handleOpenCreate} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
          <Plus size={18} /> 협력사 신규 등록
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
            placeholder="협력사명, 지역으로 검색..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
          className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium text-sm bg-white"
        >
          <option value="all">전체 상태</option>
          <option value="active">활성</option>
          <option value="inactive">비활성</option>
        </select>
      </div>

      {/* 카드 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.map(partner => {
          const techs = getPartnerTechnicians(partner.id);
          const activeTechs = techs.filter(t => t.status === 'active');
          return (
            <div
              key={partner.id}
              onClick={() => { setSelectedPartner(partner); setViewMode('detail'); }}
              className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors"><Building2 size={24} /></div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border flex items-center gap-1 ${partner.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                  {partner.status === 'active' ? <><ShieldCheck size={12}/> 활성</> : <><ShieldOff size={12}/> 비활성</>}
                </span>
              </div>
              <h4 className="text-lg font-bold text-gray-900">{partner.name}</h4>
              <p className="text-sm text-gray-500 flex items-center gap-1 mb-1"><MapPin size={14} /> {partner.location}</p>
              <p className="text-xs text-gray-400 mb-4">담당: {partner.contactName} | {partner.contactPhone}</p>
              <div className="grid grid-cols-2 gap-2 border-t pt-4">
                <div className="text-center border-r">
                  <p className="text-xs text-gray-400 font-bold">소속 기사</p>
                  <p className="text-lg font-bold">{activeTechs.length}명</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400 font-bold">등록일</p>
                  <p className="text-sm font-bold text-gray-600">{partner.createdAt}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PartnerManagement;
