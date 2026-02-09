
import React, { useState } from 'react';
import { Order, OrderStatus, Technician } from '../types';
import { MOCK_PARTNERS, MOCK_TECHNICIANS } from '../constants';
import { 
  ClipboardList, Users, BarChart3, Settings, LogOut,
  Search, ChevronRight, Phone, MapPin, User, Calendar,
  Camera, Star, CheckCircle2, X, FileText, Building2
} from 'lucide-react';

interface PartnerAdminViewProps {
  orders: Order[];
  partnerId: string;
  onAssignTechnician: (orderId: string, technicianId: string) => void;
}

type ActiveTab = 'orders' | 'technicians' | 'stats';

const PartnerAdminView: React.FC<PartnerAdminViewProps> = ({ orders, partnerId, onAssignTechnician }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('orders');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');

  const partner = MOCK_PARTNERS.find(p => p.id === partnerId);
  const partnerTechnicians = MOCK_TECHNICIANS.filter(t => t.partnerId === partnerId);
  const partnerOrders = orders.filter(o => o.partnerId === partnerId);

  const getStatusLabel = (status: OrderStatus) => {
    const labels: Record<string, string> = {
      TRANSFERRED: '배정 대기', ASSIGNED: '기사 배정', APPOINTED: '약속 확정',
      VISITING: '방문중', WORKING: '작업중', PHOTO_UPLOADED: '사진 업로드', COMPLETED: '완료', UNABLE: '조치 불가', CANCELLED: '취소'
    };
    return labels[status] || status;
  };

  const getStatusStyle = (status: OrderStatus) => {
    const styles: Record<string, string> = {
      TRANSFERRED: 'bg-purple-100 text-purple-700', ASSIGNED: 'bg-indigo-100 text-indigo-700',
      APPOINTED: 'bg-cyan-100 text-cyan-700', WORKING: 'bg-amber-100 text-amber-700',
      COMPLETED: 'bg-green-100 text-green-700', UNABLE: 'bg-red-100 text-red-700'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const filteredOrders = partnerOrders.filter(o => {
    const matchesSearch = searchTerm === '' || o.customerName.includes(searchTerm) || o.id.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: partnerOrders.length,
    pending: partnerOrders.filter(o => o.status === OrderStatus.TRANSFERRED).length,
    inProgress: partnerOrders.filter(o => [OrderStatus.ASSIGNED, OrderStatus.APPOINTED, OrderStatus.WORKING].includes(o.status)).length,
    completed: partnerOrders.filter(o => o.status === OrderStatus.COMPLETED).length,
    totalRevenue: partnerOrders.filter(o => o.status === OrderStatus.COMPLETED).reduce((s, o) => s + (o.revenue || 0), 0),
  };

  const tabConfig = [
    { id: 'orders' as ActiveTab, label: '업무 관리', icon: ClipboardList },
    { id: 'technicians' as ActiveTab, label: '기사 현황', icon: Users },
    { id: 'stats' as ActiveTab, label: '실적 현황', icon: BarChart3 },
  ];

  return (
    <div className="flex min-h-screen">
      {/* 사이드바 */}
      <aside className="w-64 bg-slate-900 text-white shrink-0 hidden md:flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-sm font-black">PA</div>
            협력사 관리
          </h2>
          <p className="text-xs text-slate-400 mt-1">{partner?.name}</p>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {tabConfig.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === t.id ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <t.icon size={20} /> {t.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white rounded-xl"><Settings size={20} /> 설정</button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 rounded-xl"><LogOut size={20} /> 로그아웃</button>
        </div>
      </aside>

      {/* 메인 */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between shrink-0">
          <h1 className="text-xl font-bold text-gray-900">
            {tabConfig.find(t => t.id === activeTab)?.label}
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{partner?.contactName}</p>
              <p className="text-xs text-gray-500">{partner?.name}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-600">
              <Building2 size={20} />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
          {/* ─── 업무 관리 ─── */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* KPI */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border"><p className="text-xs text-gray-500 font-bold">전체</p><p className="text-2xl font-black text-gray-900">{stats.total}</p></div>
                <div className="bg-white p-4 rounded-xl border"><p className="text-xs text-gray-500 font-bold">배정 대기</p><p className="text-2xl font-black text-purple-600">{stats.pending}</p></div>
                <div className="bg-white p-4 rounded-xl border"><p className="text-xs text-gray-500 font-bold">진행중</p><p className="text-2xl font-black text-amber-600">{stats.inProgress}</p></div>
                <div className="bg-white p-4 rounded-xl border"><p className="text-xs text-gray-500 font-bold">완료</p><p className="text-2xl font-black text-green-600">{stats.completed}</p></div>
              </div>

              {/* 검색/필터 */}
              <div className="bg-white rounded-xl border overflow-hidden">
                <div className="p-4 border-b flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="접수번호, 고객명 검색..."
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium">
                    <option value="ALL">전체 상태</option>
                    <option value={OrderStatus.TRANSFERRED}>배정 대기</option>
                    <option value={OrderStatus.ASSIGNED}>기사 배정</option>
                    <option value={OrderStatus.APPOINTED}>약속 확정</option>
                    <option value={OrderStatus.WORKING}>작업중</option>
                    <option value={OrderStatus.COMPLETED}>완료</option>
                  </select>
                </div>

                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold">
                    <tr>
                      <th className="px-6 py-3">접수번호</th>
                      <th className="px-6 py-3">고객명</th>
                      <th className="px-6 py-3">서비스</th>
                      <th className="px-6 py-3">상태</th>
                      <th className="px-6 py-3">담당 기사</th>
                      <th className="px-6 py-3">방문 예정</th>
                      <th className="px-6 py-3 text-center">상세</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredOrders.map(order => {
                      const tech = MOCK_TECHNICIANS.find(t => t.id === order.technicianId);
                      return (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-3 font-mono text-xs">{order.id}</td>
                          <td className="px-6 py-3 font-medium">{order.customerName}</td>
                          <td className="px-6 py-3 text-gray-600">{order.serviceType}</td>
                          <td className="px-6 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusStyle(order.status)}`}>
                              {getStatusLabel(order.status)}
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            {tech ? (
                              <span className="text-xs font-medium">{tech.name}</span>
                            ) : order.status === OrderStatus.TRANSFERRED ? (
                              <select
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => onAssignTechnician(order.id, e.target.value)}
                                className="text-xs border rounded px-2 py-1 w-full"
                              >
                                <option value="">기사 배정</option>
                                {partnerTechnicians.filter(t => t.status === 'active').map(t => (
                                  <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                              </select>
                            ) : <span className="text-gray-400 text-xs">-</span>}
                          </td>
                          <td className="px-6 py-3 text-xs text-gray-500">{order.appointmentDate || '-'}</td>
                          <td className="px-6 py-3 text-center">
                            <button onClick={() => setSelectedOrder(order)} className="text-purple-600 hover:underline text-xs font-bold">보기</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── 기사 현황 ─── */}
          {activeTab === 'technicians' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {partnerTechnicians.map(tech => {
                  const techOrders = partnerOrders.filter(o => o.technicianId === tech.id);
                  const activeOrders = techOrders.filter(o => ![OrderStatus.COMPLETED, OrderStatus.UNABLE, OrderStatus.CANCELLED].includes(o.status));
                  const completedOrders = techOrders.filter(o => o.status === OrderStatus.COMPLETED);
                  return (
                    <div key={tech.id} className={`bg-white p-5 rounded-2xl border ${tech.status === 'active' ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                          {tech.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{tech.name}</p>
                          <p className="text-xs text-gray-500">{tech.phone}</p>
                        </div>
                        <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${tech.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {tech.status === 'active' ? '활성' : '비활성'}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-gray-50 p-2 rounded-lg">
                          <p className="text-[10px] text-gray-400 font-bold">진행중</p>
                          <p className="text-lg font-black text-amber-600">{activeOrders.length}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-lg">
                          <p className="text-[10px] text-gray-400 font-bold">완료</p>
                          <p className="text-lg font-black text-green-600">{completedOrders.length}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-lg">
                          <p className="text-[10px] text-gray-400 font-bold">평점</p>
                          <p className="text-lg font-black text-amber-500 flex items-center justify-center gap-0.5">
                            <Star size={12} className="fill-amber-400 text-amber-400" /> {tech.rating}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── 실적 현황 ─── */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border">
                  <p className="text-sm font-bold text-gray-500 mb-2">이번 달 매출</p>
                  <p className="text-3xl font-black text-gray-900">₩{stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border">
                  <p className="text-sm font-bold text-gray-500 mb-2">완료율</p>
                  <p className="text-3xl font-black text-green-600">
                    {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl border">
                  <p className="text-sm font-bold text-gray-500 mb-2">활성 기사 수</p>
                  <p className="text-3xl font-black text-blue-600">{partnerTechnicians.filter(t => t.status === 'active').length}명</p>
                </div>
              </div>

              {/* 기사별 실적 테이블 */}
              <div className="bg-white rounded-xl border overflow-hidden">
                <div className="p-4 border-b">
                  <h4 className="font-bold text-gray-900">기사별 실적</h4>
                </div>
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                    <tr>
                      <th className="px-6 py-3">기사</th>
                      <th className="px-6 py-3 text-right">배정</th>
                      <th className="px-6 py-3 text-right">완료</th>
                      <th className="px-6 py-3 text-right">완료율</th>
                      <th className="px-6 py-3 text-right">매출</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {partnerTechnicians.map(tech => {
                      const tOrders = partnerOrders.filter(o => o.technicianId === tech.id);
                      const tCompleted = tOrders.filter(o => o.status === OrderStatus.COMPLETED);
                      const tRevenue = tCompleted.reduce((s, o) => s + (o.revenue || 0), 0);
                      return (
                        <tr key={tech.id} className="hover:bg-gray-50">
                          <td className="px-6 py-3 font-medium">{tech.name}</td>
                          <td className="px-6 py-3 text-right">{tOrders.length}건</td>
                          <td className="px-6 py-3 text-right">{tCompleted.length}건</td>
                          <td className="px-6 py-3 text-right font-bold text-green-600">
                            {tOrders.length > 0 ? Math.round((tCompleted.length / tOrders.length) * 100) : 0}%
                          </td>
                          <td className="px-6 py-3 text-right font-bold">₩{tRevenue.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 주문 상세 슬라이드오버 */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">업무 상세</h2>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-400 font-bold">접수번호</p>
                  <p className="text-lg font-mono font-bold">{selectedOrder.id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(selectedOrder.status)}`}>
                  {getStatusLabel(selectedOrder.status)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl text-sm">
                <div>
                  <p className="text-xs text-gray-400 font-bold mb-1">고객명</p>
                  <p className="font-bold">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold mb-1">연락처</p>
                  <p className="font-bold">{selectedOrder.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-400 font-bold mb-1">주소</p>
                  <p className="font-medium">{selectedOrder.address}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold mb-1">서비스</p>
                  <p className="font-medium">{selectedOrder.serviceType}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold mb-1">담당 기사</p>
                  <p className="font-medium">{MOCK_TECHNICIANS.find(t => t.id === selectedOrder.technicianId)?.name || '미배정'}</p>
                </div>
              </div>
              {selectedOrder.photos && (
                <div className="space-y-3">
                  <h4 className="font-bold text-sm flex items-center gap-2"><Camera size={16}/> 작업 증빙</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedOrder.photos.before && (
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold mb-1 text-center">작업 전</p>
                        <img src={selectedOrder.photos.before} className="w-full aspect-video object-cover rounded-lg border" />
                      </div>
                    )}
                    {selectedOrder.photos.after && (
                      <div>
                        <p className="text-[10px] text-green-600 font-bold mb-1 text-center">작업 후</p>
                        <img src={selectedOrder.photos.after} className="w-full aspect-video object-cover rounded-lg border" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerAdminView;
