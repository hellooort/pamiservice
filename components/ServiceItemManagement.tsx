
import React, { useState } from 'react';
import { ServiceItem } from '../types';
import { 
  Plus, Search, Edit3, Trash2, Package, DollarSign,
  CheckCircle2, XCircle, Tag
} from 'lucide-react';

interface ServiceItemManagementProps {
  items: ServiceItem[];
  onUpdateItem: (item: ServiceItem) => void;
  onCreateItem: (item: ServiceItem) => void;
}

const ServiceItemManagement: React.FC<ServiceItemManagementProps> = ({ items, onUpdateItem, onCreateItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<ServiceItem>>({});

  const categories = [...new Set(items.map(i => i.category))];
  const filteredItems = items.filter(i => {
    const matchesSearch = i.name.includes(searchTerm);
    const matchesCategory = categoryFilter === 'all' || i.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenCreate = () => {
    setFormData({ status: 'active' });
    setIsEditMode(false);
    setShowForm(true);
  };

  const handleOpenEdit = (item: ServiceItem) => {
    setFormData(item);
    setIsEditMode(true);
    setShowForm(true);
  };

  const handleSave = () => {
    if (isEditMode) {
      onUpdateItem(formData as ServiceItem);
    } else {
      onCreateItem({ ...formData, id: `si${Date.now()}` } as ServiceItem);
    }
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">품목/단가 관리 ({filteredItems.length})</h3>
        <button onClick={handleOpenCreate} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700">
          <Plus size={18} /> 품목 추가
        </button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="품목명으로 검색..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium text-sm bg-white">
          <option value="all">전체 카테고리</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* 카테고리별 요약 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map(cat => {
          const catItems = items.filter(i => i.category === cat);
          const avgPrice = Math.round(catItems.reduce((s, i) => s + i.price, 0) / catItems.length);
          return (
            <div key={cat} className="bg-white p-4 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Tag size={14} className="text-blue-500" />
                <span className="text-sm font-bold text-gray-900">{cat}</span>
              </div>
              <p className="text-xs text-gray-500">{catItems.length}개 품목 | 평균 ₩{avgPrice.toLocaleString()}</p>
            </div>
          );
        })}
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">품목명</th>
              <th className="px-6 py-4">카테고리</th>
              <th className="px-6 py-4 text-right">소비자가</th>
              <th className="px-6 py-4 text-right">원가</th>
              <th className="px-6 py-4 text-right">마진</th>
              <th className="px-6 py-4">상태</th>
              <th className="px-6 py-4 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredItems.map(item => {
              const margin = item.price - item.cost;
              const marginRate = Math.round((margin / item.price) * 100);
              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium flex items-center gap-2">
                    <Package size={16} className="text-blue-500" /> {item.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">{item.category}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-gray-900">₩{item.price.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-gray-600">₩{item.cost.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-green-600 font-bold">₩{margin.toLocaleString()}</span>
                    <span className="text-xs text-gray-400 ml-1">({marginRate}%)</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {item.status === 'active' ? <><CheckCircle2 size={10}/> 활성</> : <><XCircle size={10}/> 비활성</>}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => handleOpenEdit(item)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600">
                      <Edit3 size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 등록/수정 모달 */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">{isEditMode ? '품목 수정' : '품목 추가'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-full">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1.5">품목명 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="벽걸이 에어컨 세척"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1.5">카테고리 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="에어컨"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1.5">소비자가 <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="number"
                      value={formData.price || ''}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      placeholder="80000"
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1.5">원가 <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="number"
                      value={formData.cost || ''}
                      onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                      placeholder="45000"
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              {formData.price && formData.cost && (
                <div className="bg-green-50 p-3 rounded-lg text-sm text-green-700 flex justify-between">
                  <span>마진: ₩{((formData.price || 0) - (formData.cost || 0)).toLocaleString()}</span>
                  <span>마진율: {Math.round((((formData.price || 0) - (formData.cost || 0)) / (formData.price || 1)) * 100)}%</span>
                </div>
              )}
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1.5">상태</label>
                <select
                  value={formData.status || 'active'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">활성</option>
                  <option value="inactive">비활성</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-300 rounded-xl font-bold text-gray-600">취소</button>
              <button onClick={handleSave} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">
                {isEditMode ? '수정 완료' : '추가하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceItemManagement;
