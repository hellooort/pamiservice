
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AdminOrderList from './components/AdminOrderList';
import TechnicianView from './components/TechnicianView';
import { UserRole, Order, OrderStatus } from './types';
import { INITIAL_ORDERS, MOCK_PARTNERS } from './constants';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  BarChart3, 
  Plus, 
  Building2, 
  ShieldCheck, 
  MapPin 
} from 'lucide-react';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.ADMIN);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'partners' | 'reports'>('dashboard');

  const handleUpdateStatus = (id: string, status: OrderStatus, photos?: any, extra?: any) => {
    setOrders(prev => prev.map(o => o.id === id ? { 
      ...o, 
      status, 
      photos: photos || o.photos,
      ...extra 
    } : o));
  };

  const handleAssignPartner = (orderId: string, partnerId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, partnerId, status: OrderStatus.TRANSFERRED } : o));
  };

  const handleAssignTechnician = (orderId: string, technicianId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, technicianId, status: OrderStatus.ASSIGNED } : o));
  };

  if (role === UserRole.TECHNICIAN) {
    return (
      <Layout role={role} onRoleChange={setRole}>
        <TechnicianView orders={orders} onUpdateStatus={handleUpdateStatus} />
      </Layout>
    );
  }

  const tabLabels = {
    dashboard: '종합 현황',
    orders: '주문/운영 관리',
    partners: '협력사 관리',
    reports: '정산 및 통계'
  };

  return (
    <Layout role={role} onRoleChange={setRole}>
      <div className="flex min-h-screen">
        <aside className="w-64 bg-slate-900 text-white shrink-0 hidden md:flex flex-col">
          <div className="p-6">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm font-black">FO</div>
              필드옵스 OMS
            </h2>
          </div>
          <nav className="flex-1 px-4 space-y-1">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <LayoutDashboard size={20} /> 종합 대시보드
            </button>
            <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'orders' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <FileText size={20} /> 업무 운영 관리
            </button>
            <button onClick={() => setActiveTab('partners')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'partners' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <Users size={20} /> 도급사/기사 관리
            </button>
            <button onClick={() => setActiveTab('reports')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'reports' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <BarChart3 size={20} /> 정산 및 리포트
            </button>
          </nav>
          <div className="p-4 border-t border-slate-800">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white rounded-xl transition-colors"><Settings size={20} /> 설정</button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 rounded-xl transition-colors"><LogOut size={20} /> 로그아웃</button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="h-16 bg-white border-b px-8 flex items-center justify-between shrink-0">
            <h1 className="text-xl font-bold text-gray-900">{tabLabels[activeTab]}</h1>
            <div className="flex items-center gap-4">
               <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">본사 총괄 관리자</p>
                  <p className="text-xs text-gray-500">운영전략팀</p>
               </div>
               <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">본사</div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
            {activeTab === 'dashboard' && <Dashboard orders={orders} />}
            {activeTab === 'orders' && (
              <AdminOrderList 
                orders={orders} 
                onAssignPartner={handleAssignPartner}
                onAssignTechnician={handleAssignTechnician}
                role={role}
              />
            )}
            {activeTab === 'partners' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <h3 className="text-lg font-bold text-gray-900">협력사 현황 ({MOCK_PARTNERS.length})</h3>
                   <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold"><Plus size={18} /> 협력사 신규 등록</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {MOCK_PARTNERS.map(partner => (
                     <div key={partner.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm group">
                        <div className="flex justify-between items-start mb-4">
                           <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><Building2 size={24} /></div>
                           <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full border border-green-100 flex items-center gap-1"><ShieldCheck size={12} /> 승인됨</span>
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">{partner.name}</h4>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mb-4"><MapPin size={14} /> {partner.location}</p>
                        <div className="grid grid-cols-2 gap-2 border-t pt-4">
                           <div className="text-center border-r">
                              <p className="text-xs text-gray-400 font-bold">배정 기사</p>
                              <p className="text-lg font-bold">8명</p>
                           </div>
                           <div className="text-center">
                              <p className="text-xs text-gray-400 font-bold">이달 수행</p>
                              <p className="text-lg font-bold">142건</p>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            )}
            {activeTab === 'reports' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                      <p className="text-sm font-bold text-gray-500 mb-2">지급 예정액 (도급)</p>
                      <p className="text-3xl font-black text-slate-900">₩45,280,000</p>
                   </div>
                   <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                      <p className="text-sm font-bold text-gray-500 mb-2">미정산 건수</p>
                      <p className="text-3xl font-black text-amber-600">12건</p>
                   </div>
                   <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                      <p className="text-sm font-bold text-gray-500 mb-2">평균 고객 평점</p>
                      <div className="flex items-center gap-2">
                         <p className="text-3xl font-black text-slate-900">4.8</p>
                         <div className="flex text-amber-400">
                           {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor"/>)}
                         </div>
                      </div>
                   </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {[
                     { title: '매출 리포트', desc: '협력사별/지역별 매출 통계' },
                     { title: '고객 만족도(CSAT)', desc: '알림톡 발송 후 회신된 만족도 분석' },
                     { title: '운영 효율 지표', desc: '접수-완료 리드타임 분석' }
                   ].map((card, i) => (
                     <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all cursor-pointer">
                        <BarChart3 className="text-blue-500 mb-4" size={24} />
                        <h4 className="font-bold mb-1">{card.title}</h4>
                        <p className="text-xs text-gray-500 mb-4">{card.desc}</p>
                        <button className="text-blue-600 text-xs font-bold">엑셀 다운로드</button>
                     </div>
                   ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
};

// Use React.FC to properly handle React internal props like 'key' in TypeScript
const Star: React.FC<{ size: number, className?: string, fill?: string }> = ({ size, className, fill }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);

export default App;
