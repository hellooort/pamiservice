
import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { MOCK_PARTNERS, MOCK_TECHNICIANS } from '../constants';
import { 
  Download, FileText, Camera, CheckSquare, Square, Filter,
  Calendar, Image, ChevronDown, Printer, Eye
} from 'lucide-react';

interface ReportDownloadProps {
  orders: Order[];
}

type ReportTab = 'customer' | 'technician';

const ReportDownload: React.FC<ReportDownloadProps> = ({ orders }) => {
  const [tab, setTab] = useState<ReportTab>('customer');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [dateFrom, setDateFrom] = useState('2024-01-01');
  const [dateTo, setDateTo] = useState('2024-01-31');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed'>('completed');
  const [previewOrder, setPreviewOrder] = useState<Order | null>(null);

  const completedOrders = orders.filter(o => {
    const matchesStatus = statusFilter === 'all' || o.status === OrderStatus.COMPLETED;
    return matchesStatus;
  });

  // 기사별 그룹핑
  const technicianGroups = MOCK_TECHNICIANS.map(tech => {
    const techOrders = completedOrders.filter(o => o.technicianId === tech.id);
    return { tech, orders: techOrders, totalRevenue: techOrders.reduce((sum, o) => sum + (o.revenue || 0), 0) };
  }).filter(g => g.orders.length > 0);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };

  const toggleAll = (ids: string[]) => {
    const allSelected = ids.every(id => selectedIds.has(id));
    const next = new Set(selectedIds);
    if (allSelected) {
      ids.forEach(id => next.delete(id));
    } else {
      ids.forEach(id => next.add(id));
    }
    setSelectedIds(next);
  };

  const allCustomerIds = completedOrders.map(o => o.id);
  const allTechIds = technicianGroups.map(g => g.tech.id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">보고서 다운로드</h3>
        <button
          disabled={selectedIds.size === 0}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-200 disabled:text-gray-400 shadow-lg shadow-blue-600/20"
        >
          <Download size={18} /> 보고서 다운로드 ({selectedIds.size}건)
        </button>
      </div>

      {/* 필터 영역 */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-400" />
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm" />
          <span className="text-gray-400">~</span>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm" />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
        >
          <option value="completed">완료 건만</option>
          <option value="all">전체</option>
        </select>
      </div>

      {/* 탭 */}
      <div className="flex border-b">
        <button
          onClick={() => { setTab('customer'); setSelectedIds(new Set()); }}
          className={`flex-1 py-3 text-sm font-bold transition-colors ${tab === 'customer' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          고객 단위 보고서
        </button>
        <button
          onClick={() => { setTab('technician'); setSelectedIds(new Set()); }}
          className={`flex-1 py-3 text-sm font-bold transition-colors ${tab === 'technician' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          기사 단위 보고서
        </button>
      </div>

      {/* 고객 단위 */}
      {tab === 'customer' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3 w-12">
                  <button onClick={() => toggleAll(allCustomerIds)}>
                    {allCustomerIds.every(id => selectedIds.has(id)) ? <CheckSquare size={18} className="text-blue-600" /> : <Square size={18} className="text-gray-400" />}
                  </button>
                </th>
                <th className="px-4 py-3">접수번호</th>
                <th className="px-4 py-3">고객명</th>
                <th className="px-4 py-3">서비스</th>
                <th className="px-4 py-3">기사</th>
                <th className="px-4 py-3">완료일</th>
                <th className="px-4 py-3">사진</th>
                <th className="px-4 py-3 text-center">미리보기</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {completedOrders.map(order => {
                const tech = MOCK_TECHNICIANS.find(t => t.id === order.technicianId);
                return (
                  <tr key={order.id} className={`hover:bg-gray-50 ${selectedIds.has(order.id) ? 'bg-blue-50/50' : ''}`}>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleSelect(order.id)}>
                        {selectedIds.has(order.id) ? <CheckSquare size={18} className="text-blue-600" /> : <Square size={18} className="text-gray-400" />}
                      </button>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{order.id}</td>
                    <td className="px-4 py-3 font-medium">{order.customerName}</td>
                    <td className="px-4 py-3 text-gray-600">{order.serviceType}</td>
                    <td className="px-4 py-3 text-gray-600">{tech?.name || '-'}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{order.completedAt || order.appointmentDate || '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {order.photos?.before && <div className="w-6 h-6 bg-gray-200 rounded overflow-hidden"><img src={order.photos.before} className="w-full h-full object-cover" /></div>}
                        {order.photos?.after && <div className="w-6 h-6 bg-green-200 rounded overflow-hidden"><img src={order.photos.after} className="w-full h-full object-cover" /></div>}
                        {!order.photos?.before && !order.photos?.after && <span className="text-gray-400 text-xs">없음</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => setPreviewOrder(order)} className="text-blue-600 hover:underline text-xs font-bold flex items-center gap-1 justify-center">
                        <Eye size={14} /> 보기
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 기사 단위 */}
      {tab === 'technician' && (
        <div className="space-y-4">
          {technicianGroups.map(group => {
            const isSelected = selectedIds.has(group.tech.id);
            const partner = MOCK_PARTNERS.find(p => p.id === group.tech.partnerId);
            return (
              <div key={group.tech.id} className={`bg-white rounded-xl border ${isSelected ? 'border-blue-300 ring-2 ring-blue-100' : 'border-gray-200'} overflow-hidden`}>
                <div className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50" onClick={() => toggleSelect(group.tech.id)}>
                  {isSelected ? <CheckSquare size={20} className="text-blue-600" /> : <Square size={20} className="text-gray-400" />}
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {group.tech.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{group.tech.name} 기사</span>
                      <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-gray-600">{partner?.name}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">완료 {group.orders.length}건 | 매출 ₩{group.totalRevenue.toLocaleString()}</p>
                  </div>
                  <ChevronDown size={18} className="text-gray-400" />
                </div>
                <div className="border-t bg-gray-50/50 px-4 py-3">
                  <table className="w-full text-xs">
                    <thead className="text-gray-500">
                      <tr>
                        <th className="text-left py-1">접수번호</th>
                        <th className="text-left py-1">고객명</th>
                        <th className="text-left py-1">서비스</th>
                        <th className="text-left py-1">완료일</th>
                        <th className="text-right py-1">금액</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {group.orders.map(o => (
                        <tr key={o.id}>
                          <td className="py-1.5 font-mono">{o.id}</td>
                          <td className="py-1.5">{o.customerName}</td>
                          <td className="py-1.5 text-gray-500">{o.serviceType}</td>
                          <td className="py-1.5 text-gray-500">{o.completedAt || '-'}</td>
                          <td className="py-1.5 text-right font-medium">₩{(o.revenue || 0).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 보고서 미리보기 모달 */}
      {previewOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setPreviewOrder(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
            <div className="p-5 border-b flex justify-between items-center">
              <h3 className="font-bold text-lg">보고서 미리보기</h3>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><Printer size={18} /></button>
                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><Download size={18} /></button>
                <button onClick={() => setPreviewOrder(null)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">✕</button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* 보고서 양식 미리보기 */}
              <div className="border-2 border-gray-200 rounded-xl p-6 space-y-4 bg-white">
                <div className="text-center border-b pb-4">
                  <h2 className="text-xl font-black text-gray-900">작업 완료 보고서</h2>
                  <p className="text-sm text-gray-500 mt-1">FieldOps Operation Management System</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-400 font-bold">접수번호</p>
                    <p className="font-bold">{previewOrder.id}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-400 font-bold">고객명</p>
                    <p className="font-bold">{previewOrder.customerName}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-400 font-bold">서비스</p>
                    <p className="font-bold">{previewOrder.serviceType}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-400 font-bold">수행 기사</p>
                    <p className="font-bold">{MOCK_TECHNICIANS.find(t => t.id === previewOrder.technicianId)?.name || '-'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                    <p className="text-xs text-gray-400 font-bold">주소</p>
                    <p className="font-bold">{previewOrder.address}</p>
                  </div>
                </div>
                {previewOrder.photos && (
                  <div className="space-y-3 pt-4 border-t">
                    <p className="text-sm font-bold text-gray-700 flex items-center gap-2"><Camera size={16}/> 작업 증빙 사진</p>
                    <div className="grid grid-cols-2 gap-3">
                      {previewOrder.photos.before && (
                        <div>
                          <p className="text-[10px] text-center text-gray-500 font-bold mb-1">작업 전</p>
                          <img src={previewOrder.photos.before} className="w-full aspect-video object-cover rounded-lg border" />
                        </div>
                      )}
                      {previewOrder.photos.after && (
                        <div>
                          <p className="text-[10px] text-center text-green-600 font-bold mb-1">작업 후</p>
                          <img src={previewOrder.photos.after} className="w-full aspect-video object-cover rounded-lg border" />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div className="pt-4 border-t text-xs text-gray-400 text-center">
                  발행일: {new Date().toLocaleDateString('ko-KR')} | 필드옵스 OMS
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportDownload;
