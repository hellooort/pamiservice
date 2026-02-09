
import React, { useState } from 'react';
import { Order, OrderStatus, UserRole } from '../types';
import { MOCK_PARTNERS, MOCK_TECHNICIANS } from '../constants';
import { 
  Filter, Search, Download, Upload, X, Camera, MapPin, User, Phone, 
  Star, AlertTriangle, FileText, CheckSquare, Square, ArrowRight,
  Copy, Calendar, Clock, Building2
} from 'lucide-react';

interface AdminOrderListProps {
  orders: Order[];
  onAssignPartner: (orderId: string, partnerId: string) => void;
  onAssignTechnician: (orderId: string, technicianId: string) => void;
  role: UserRole;
  onOpenCreate?: () => void;
}

const AdminOrderList: React.FC<AdminOrderListProps> = ({ orders, onAssignPartner, onAssignTechnician, role, onOpenCreate }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [showBulkAssign, setShowBulkAssign] = useState(false);
  const [bulkPartnerId, setBulkPartnerId] = useState('');
  const [bulkTechnicianId, setBulkTechnicianId] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.RECEIPT: return '신규 접수';
      case OrderStatus.TRANSFERRED: return '협력사 이관';
      case OrderStatus.ASSIGNED: return '기사 배정';
      case OrderStatus.APPOINTED: return '약속 확정';
      case OrderStatus.WORKING: return '작업중';
      case OrderStatus.PHOTO_UPLOADED: return '사진 업로드';
      case OrderStatus.COMPLETED: return '최종 완료';
      case OrderStatus.UNABLE: return '조치 불가';
      case OrderStatus.CANCELLED: return '취소됨';
      default: return status;
    }
  };

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.RECEIPT: return 'bg-blue-100 text-blue-700';
      case OrderStatus.TRANSFERRED: return 'bg-purple-100 text-purple-700';
      case OrderStatus.ASSIGNED: return 'bg-indigo-100 text-indigo-700';
      case OrderStatus.APPOINTED: return 'bg-cyan-100 text-cyan-700';
      case OrderStatus.WORKING: return 'bg-amber-100 text-amber-700';
      case OrderStatus.PHOTO_UPLOADED: return 'bg-teal-100 text-teal-700';
      case OrderStatus.COMPLETED: return 'bg-green-100 text-green-700';
      case OrderStatus.UNABLE: return 'bg-red-100 text-red-700';
      case OrderStatus.CANCELLED: return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getAvailableTechnicians = (partnerId: string) => {
    return MOCK_TECHNICIANS.filter(t => t.partnerId === partnerId && t.status === 'active');
  };

  const toggleCheck = (id: string) => {
    const next = new Set(checkedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setCheckedIds(next);
  };

  const toggleAll = () => {
    const allIds = filteredOrders.map(o => o.id);
    const allChecked = allIds.every(id => checkedIds.has(id));
    setCheckedIds(allChecked ? new Set() : new Set(allIds));
  };

  const handleBulkAssign = () => {
    checkedIds.forEach(id => {
      if (bulkPartnerId) {
        onAssignPartner(id, bulkPartnerId);
      }
    });
    setCheckedIds(new Set());
    setShowBulkAssign(false);
    setBulkPartnerId('');
    setBulkTechnicianId('');
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  // 상태별 건수
  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* KPI 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: '전체', count: orders.length, color: 'text-gray-900' },
          { label: '미배정', count: statusCounts[OrderStatus.RECEIPT] || 0, color: 'text-blue-600' },
          { label: '진행중', count: (statusCounts[OrderStatus.ASSIGNED] || 0) + (statusCounts[OrderStatus.APPOINTED] || 0) + (statusCounts[OrderStatus.WORKING] || 0), color: 'text-amber-600' },
          { label: '완료', count: statusCounts[OrderStatus.COMPLETED] || 0, color: 'text-green-600' },
          { label: '조치불가', count: statusCounts[OrderStatus.UNABLE] || 0, color: 'text-red-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-bold text-gray-500">{s.label}</p>
            <p className={`text-2xl font-black ${s.color}`}>{s.count}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative">
        {/* 검색/필터/액션 바 */}
        <div className="p-4 border-b flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="주문번호, 고객명, 연락처 검색..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'ALL')}
              className="flex-1 md:flex-none px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium text-sm bg-white"
            >
              <option value="ALL">전체 상태</option>
              <option value={OrderStatus.RECEIPT}>신규 접수</option>
              <option value={OrderStatus.TRANSFERRED}>협력사 이관</option>
              <option value={OrderStatus.ASSIGNED}>기사 배정</option>
              <option value={OrderStatus.APPOINTED}>약속 확정</option>
              <option value={OrderStatus.WORKING}>작업중</option>
              <option value={OrderStatus.COMPLETED}>완료</option>
              <option value={OrderStatus.UNABLE}>조치 불가</option>
            </select>
            {(role === UserRole.ADMIN || role === UserRole.OPERATOR) && (
              <>
                {onOpenCreate && (
                  <button onClick={onOpenCreate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700">
                    <Upload size={16} /> 업무 등록
                  </button>
                )}
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50">
                  <Download size={16} /> 엑셀
                </button>
              </>
            )}
          </div>
        </div>

        {/* 일괄 배정 액션바 */}
        {checkedIds.size > 0 && (
          <div className="p-3 bg-blue-50 border-b flex items-center gap-4 flex-wrap">
            <span className="text-sm font-bold text-blue-700">{checkedIds.size}건 선택됨</span>
            <div className="flex items-center gap-2">
              <select
                value={bulkPartnerId}
                onChange={(e) => setBulkPartnerId(e.target.value)}
                className="text-sm border border-blue-200 rounded-lg px-3 py-1.5 bg-white"
              >
                <option value="">협력사 선택</option>
                {MOCK_PARTNERS.filter(p => p.status === 'active').map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <button
                onClick={handleBulkAssign}
                disabled={!bulkPartnerId}
                className="flex items-center gap-1 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold disabled:bg-gray-300 disabled:text-gray-500"
              >
                <ArrowRight size={14} /> 일괄 이관
              </button>
            </div>
            <button onClick={() => setCheckedIds(new Set())} className="text-sm text-gray-500 hover:text-gray-700 ml-auto">선택 해제</button>
          </div>
        )}

        {/* 테이블 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-4 py-4 w-12">
                  <button onClick={toggleAll}>
                    {filteredOrders.length > 0 && filteredOrders.every(o => checkedIds.has(o.id)) ? <CheckSquare size={16} className="text-blue-600" /> : <Square size={16} className="text-gray-400" />}
                  </button>
                </th>
                <th className="px-4 py-4">접수번호</th>
                <th className="px-4 py-4">고객명</th>
                <th className="px-4 py-4">품목</th>
                <th className="px-4 py-4">상태</th>
                <th className="px-4 py-4">협력사 / 기사</th>
                <th className="px-4 py-4">방문일</th>
                <th className="px-4 py-4 text-right">금액</th>
                <th className="px-4 py-4 text-center">상세</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredOrders.map((order) => (
                <tr key={order.id} className={`hover:bg-gray-50 cursor-pointer ${checkedIds.has(order.id) ? 'bg-blue-50/50' : ''}`}>
                  <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => toggleCheck(order.id)}>
                      {checkedIds.has(order.id) ? <CheckSquare size={16} className="text-blue-600" /> : <Square size={16} className="text-gray-400" />}
                    </button>
                  </td>
                  <td className="px-4 py-4 font-mono text-xs">{order.id}</td>
                  <td className="px-4 py-4 font-medium">{order.customerName}</td>
                  <td className="px-4 py-4 text-gray-600 text-xs">{order.serviceType}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${getStatusStyle(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {order.partnerId ? (
                      <div className="space-y-1">
                        <div className="text-xs font-medium">{MOCK_PARTNERS.find(p => p.id === order.partnerId)?.name}</div>
                        {order.technicianId ? (
                          <div className="text-[10px] text-gray-500">
                            기사: {MOCK_TECHNICIANS.find(t => t.id === order.technicianId)?.name}
                          </div>
                        ) : (role === UserRole.ADMIN || role === UserRole.OPERATOR || role === UserRole.PARTNER_ADMIN) && order.status === OrderStatus.TRANSFERRED ? (
                          <select 
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => onAssignTechnician(order.id, e.target.value)}
                            className="text-[10px] border rounded px-1 py-0.5 w-full"
                          >
                            <option value="">기사 배정</option>
                            {getAvailableTechnicians(order.partnerId).map(t => (
                              <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                          </select>
                        ) : null}
                      </div>
                    ) : (
                      <select 
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => onAssignPartner(order.id, e.target.value)}
                        className="text-xs border rounded px-1 py-1"
                      >
                        <option value="">협력사 지정</option>
                        {MOCK_PARTNERS.filter(p => p.status === 'active').map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-500">{order.appointmentDate || '-'}</td>
                  <td className="px-4 py-4 text-right text-xs font-medium">₩{(order.revenue || 0).toLocaleString()}</td>
                  <td className="px-4 py-4 text-center">
                    <button onClick={() => setSelectedOrder(order)} className="text-blue-600 hover:underline text-xs font-bold">보기</button>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center text-gray-400">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 하단 페이지네이션 영역 (UI만) */}
        <div className="p-4 border-t flex justify-between items-center text-sm text-gray-500">
          <span>총 {filteredOrders.length}건</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 border rounded hover:bg-gray-50">이전</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">3</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">다음</button>
          </div>
        </div>
      </div>

      {/* ─── 주문 상세 슬라이드오버 ─── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">업무 상세</h2>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full"><X /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* 기본 정보 */}
              <section className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">접수번호</p>
                    <p className="text-lg font-mono font-bold">{selectedOrder.id}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(selectedOrder.status)}`}>
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </div>

                {/* 고객명/접수번호 복사 */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(selectedOrder.customerName, `detail-name`)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${copiedField === 'detail-name' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    <Copy size={12} /> {copiedField === 'detail-name' ? '복사됨!' : '고객명 복사'}
                  </button>
                  <button
                    onClick={() => handleCopy(selectedOrder.id, `detail-id`)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${copiedField === 'detail-id' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    <Copy size={12} /> {copiedField === 'detail-id' ? '복사됨!' : '접수번호 복사'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                  <div>
                    <p className="text-xs text-gray-400 font-bold mb-1 flex items-center gap-1"><User size={12} /> 고객명</p>
                    <p className="font-bold">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold mb-1 flex items-center gap-1"><Phone size={12} /> 연락처</p>
                    <p className="font-bold">{selectedOrder.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400 font-bold mb-1 flex items-center gap-1"><MapPin size={12} /> 주소</p>
                    <p className="font-medium text-gray-700">{selectedOrder.address}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold mb-1">품목</p>
                    <p className="font-medium">{selectedOrder.serviceType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold mb-1">금액</p>
                    <p className="font-bold text-blue-600">₩{(selectedOrder.revenue || 0).toLocaleString()}</p>
                  </div>
                  {selectedOrder.partnerId && (
                    <div>
                      <p className="text-xs text-gray-400 font-bold mb-1 flex items-center gap-1"><Building2 size={12} /> 협력사</p>
                      <p className="font-medium">{MOCK_PARTNERS.find(p => p.id === selectedOrder.partnerId)?.name}</p>
                    </div>
                  )}
                  {selectedOrder.technicianId && (
                    <div>
                      <p className="text-xs text-gray-400 font-bold mb-1">담당 기사</p>
                      <p className="font-medium">{MOCK_TECHNICIANS.find(t => t.id === selectedOrder.technicianId)?.name}</p>
                    </div>
                  )}
                  {selectedOrder.appointmentDate && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-400 font-bold mb-1 flex items-center gap-1"><Calendar size={12} /> 방문 예정</p>
                      <p className="font-medium text-blue-600">{selectedOrder.appointmentDate}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* 작업 증빙 사진 */}
              <section className="space-y-3">
                <h3 className="font-bold flex items-center gap-2"><Camera size={18} /> 현장 작업 증빙</h3>
                {selectedOrder.photos ? (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedOrder.photos.before && (
                      <div className="space-y-1">
                        <p className="text-xs text-center font-bold text-gray-500">작업 전</p>
                        <div className="aspect-video rounded-lg overflow-hidden border">
                          <img src={selectedOrder.photos.before} className="w-full h-full object-cover" alt="Before" />
                        </div>
                      </div>
                    )}
                    {selectedOrder.photos.after && (
                      <div className="space-y-1">
                        <p className="text-xs text-center font-bold text-green-600">작업 후</p>
                        <div className="aspect-video rounded-lg overflow-hidden border">
                          <img src={selectedOrder.photos.after} className="w-full h-full object-cover" alt="After" />
                        </div>
                      </div>
                    )}
                    {selectedOrder.photos.issue && (
                      <div className="space-y-1 col-span-2">
                        <p className="text-xs text-center font-bold text-red-600">특이사항</p>
                        <div className="aspect-video rounded-lg overflow-hidden border border-red-200">
                          <img src={selectedOrder.photos.issue} className="w-full h-full object-cover" alt="Issue" />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 py-12 rounded-xl text-center text-gray-400 text-sm">아직 등록된 사진이 없습니다.</div>
                )}
              </section>

              {/* 고객 피드백 */}
              {selectedOrder.status === OrderStatus.COMPLETED && selectedOrder.customerFeedback && (
                <section className="space-y-3 pt-4 border-t">
                  <h3 className="font-bold flex items-center gap-2 text-amber-600"><Star size={18} /> 고객 만족도</h3>
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                    <div className="flex items-center gap-1 mb-2">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={16} className={`${i <= (selectedOrder.customerFeedback?.rating || 5) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                      ))}
                      <span className="ml-2 font-bold text-amber-700">{selectedOrder.customerFeedback?.rating} / 5.0</span>
                    </div>
                    <p className="text-sm text-amber-800 italic">"{selectedOrder.customerFeedback?.comment}"</p>
                  </div>
                </section>
              )}

              {/* 조치 불가 */}
              {selectedOrder.status === OrderStatus.UNABLE && (
                <section className="space-y-3 pt-4 border-t">
                  <h3 className="font-bold flex items-center gap-2 text-red-600"><AlertTriangle size={18} /> 조치 불가 사유</h3>
                  <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                    <p className="text-sm text-red-800">{selectedOrder.issueNote || '사유가 기록되지 않았습니다.'}</p>
                  </div>
                </section>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50 flex gap-3">
              <button className="flex-1 py-3 border border-gray-300 rounded-xl font-bold text-gray-600 hover:bg-white">이관 취소</button>
              <button className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">작업 검수 완료</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderList;
