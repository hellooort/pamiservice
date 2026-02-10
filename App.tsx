
import React, { useState } from 'react';
import Layout from './components/Layout';
import AdminOrderList from './components/AdminOrderList';
import TechnicianView from './components/TechnicianView';
import LoginPage from './components/LoginPage';
import OrderCreateModal from './components/OrderCreateModal';
import PartnerManagement from './components/PartnerManagement';
import TechnicianManagement from './components/TechnicianManagement';
import ReportDownload from './components/ReportDownload';
import AccountManagement from './components/AccountManagement';
import ServiceItemManagement from './components/ServiceItemManagement';
import PartnerAdminView from './components/PartnerAdminView';
import { UserRole, Order, OrderStatus, Partner, Technician, ServiceItem, User } from './types';
import { INITIAL_ORDERS, MOCK_PARTNERS, MOCK_TECHNICIANS, MOCK_SERVICE_ITEMS, MOCK_USERS } from './constants';
import { 
  FileText, 
  LogOut, 
  Building2, 
  Package,
  UserCog,
  Download,
  Wrench
} from 'lucide-react';

type AdminTab = 'orders' | 'partners' | 'technicians' | 'serviceItems' | 'reports' | 'accounts';

const App: React.FC = () => {
  // ─── 글로벌 상태 ───
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 시뮬레이션 모드에서는 true
  const [role, setRole] = useState<UserRole>(UserRole.ADMIN);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [partners, setPartners] = useState<Partner[]>(MOCK_PARTNERS);
  const [technicians, setTechnicians] = useState<Technician[]>(MOCK_TECHNICIANS);
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>(MOCK_SERVICE_ITEMS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');
  const [showCreateOrder, setShowCreateOrder] = useState(false);

  // ─── 핸들러 ───
  const handleUpdateStatus = (id: string, status: OrderStatus, photos?: any, extra?: any) => {
    setOrders(prev => prev.map(o => o.id === id ? { 
      ...o, 
      status, 
      photos: photos || o.photos,
      ...extra,
      ...(status === OrderStatus.COMPLETED ? { completedAt: new Date().toISOString() } : {})
    } : o));
  };

  const handleAssignPartner = (orderId: string, partnerId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, partnerId, status: OrderStatus.TRANSFERRED } : o));
  };

  const handleAssignTechnician = (orderId: string, technicianId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, technicianId, status: OrderStatus.ASSIGNED } : o));
  };

  const handleCreateOrder = (orderData: any) => {
    const newOrder: Order = {
      id: `ORD-2024-${String(orders.length + 1).padStart(4, '0')}`,
      customerName: orderData.customerName,
      phone: orderData.phone,
      address: orderData.address,
      serviceType: orderData.serviceType,
      serviceItemId: orderData.serviceItemId,
      status: OrderStatus.RECEIPT,
      receivedAt: new Date().toISOString(),
      revenue: orderData.revenue,
      cost: orderData.cost,
      memo: orderData.memo,
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  // ─── 로그인 화면 ───
  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  // ─── 기사 모바일 뷰 ───
  if (role === UserRole.TECHNICIAN) {
    return (
      <Layout role={role} onRoleChange={setRole}>
        <TechnicianView orders={orders} onUpdateStatus={handleUpdateStatus} />
      </Layout>
    );
  }

  // ─── 협력사 관리자 뷰 ───
  if (role === UserRole.PARTNER_ADMIN) {
    return (
      <Layout role={role} onRoleChange={setRole}>
        <PartnerAdminView 
          orders={orders} 
          partnerId="p1"
          onAssignTechnician={handleAssignTechnician}
        />
      </Layout>
    );
  }

  // ─── 본사 관리자 / 운영자 뷰 ───
  const sidebarItems: { id: AdminTab; label: string; icon: React.FC<any> }[] = [
    { id: 'orders', label: '업무 운영 관리', icon: FileText },
    { id: 'partners', label: '협력사 관리', icon: Building2 },
    { id: 'technicians', label: '기사 관리', icon: Wrench },
    { id: 'serviceItems', label: '품목/단가 관리', icon: Package },
    { id: 'reports', label: '보고서', icon: Download },
    { id: 'accounts', label: '계정 관리', icon: UserCog },
  ];

  const tabLabels: Record<AdminTab, string> = {
    orders: '업무 운영 관리',
    partners: '협력사 관리',
    technicians: '기사 관리',
    serviceItems: '품목/단가 관리',
    reports: '보고서 다운로드',
    accounts: '계정 관리',
  };

  return (
    <Layout role={role} onRoleChange={setRole}>
      <div className="flex min-h-screen">
        {/* 사이드바 */}
        <aside className="w-64 bg-slate-900 text-white shrink-0 hidden md:flex flex-col">
          <div className="p-6">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm font-black">FO</div>
              필드옵스 OMS
            </h2>
            <p className="text-xs text-slate-500 mt-1">업무 운영 관리 시스템</p>
          </div>
          <nav className="flex-1 px-4 space-y-1">
            {sidebarItems.map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              >
                <item.icon size={20} /> {item.label}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-slate-800">
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 rounded-xl transition-colors"
            >
              <LogOut size={20} /> 로그아웃
            </button>
          </div>
        </aside>

        {/* 메인 콘텐츠 */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="h-16 bg-white border-b px-8 flex items-center justify-between shrink-0">
            <h1 className="text-xl font-bold text-gray-900">{tabLabels[activeTab]}</h1>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">
                  {role === UserRole.ADMIN ? '본사 총괄 관리자' : '본사 운영자'}
                </p>
                <p className="text-xs text-gray-500">운영전략팀</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">본사</div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
            {activeTab === 'orders' && (
              <>
                <AdminOrderList 
                  orders={orders} 
                  onAssignPartner={handleAssignPartner}
                  onAssignTechnician={handleAssignTechnician}
                  role={role}
                  onOpenCreate={() => setShowCreateOrder(true)}
                />
                <OrderCreateModal 
                  isOpen={showCreateOrder}
                  onClose={() => setShowCreateOrder(false)}
                  onCreate={handleCreateOrder}
                />
              </>
            )}

            {activeTab === 'partners' && (
              <PartnerManagement
                partners={partners}
                onUpdatePartner={(p) => setPartners(prev => prev.map(pp => pp.id === p.id ? p : pp))}
                onCreatePartner={(p) => setPartners(prev => [...prev, p])}
              />
            )}

            {activeTab === 'technicians' && (
              <TechnicianManagement
                technicians={technicians}
                partners={partners}
                onUpdateTechnician={(t) => setTechnicians(prev => prev.map(tt => tt.id === t.id ? t : tt))}
                onCreateTechnician={(t) => setTechnicians(prev => [...prev, t])}
              />
            )}

            {activeTab === 'serviceItems' && (
              <ServiceItemManagement
                items={serviceItems}
                onUpdateItem={(i) => setServiceItems(prev => prev.map(ii => ii.id === i.id ? i : ii))}
                onCreateItem={(i) => setServiceItems(prev => [...prev, i])}
              />
            )}

            {activeTab === 'reports' && <ReportDownload orders={orders} />}

            {activeTab === 'accounts' && (
              <AccountManagement
                users={users}
                onUpdateUser={(u) => setUsers(prev => prev.map(uu => uu.id === u.id ? u : uu))}
                onCreateUser={(u) => setUsers(prev => [...prev, u])}
              />
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default App;
