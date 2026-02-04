
import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { MOCK_PARTNERS } from '../constants';
import { 
  ClipboardList, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Camera, 
  ChevronRight,
  AlertTriangle,
  History,
  User,
  Star,
  LogOut,
  Settings,
  Calendar,
  Clock
} from 'lucide-react';

interface TechViewProps {
  orders: Order[];
  onUpdateStatus: (id: string, status: OrderStatus, photos?: any, extra?: any) => void;
}

const TechnicianView: React.FC<TechViewProps> = ({ orders, onUpdateStatus }) => {
  const [currentTab, setCurrentTab] = useState<'jobs' | 'history' | 'profile'>('jobs');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [step, setStep] = useState<'list' | 'detail' | 'appoint' | 'work' | 'unable'>('list');
  const [photos, setPhotos] = useState<{before?: string, after?: string, issue?: string}>({});
  const [appointDate, setAppointDate] = useState('');
  const [appointTime, setAppointTime] = useState('');
  const [issueNote, setIssueNote] = useState('');

  const techOrders = orders.filter(o => 
    o.status !== OrderStatus.RECEIPT && 
    o.status !== OrderStatus.CANCELLED && 
    o.status !== OrderStatus.COMPLETED &&
    o.status !== OrderStatus.UNABLE
  );
  const completedOrders = orders.filter(o => o.status === OrderStatus.COMPLETED || o.status === OrderStatus.UNABLE);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setStep('detail');
  };

  const handleConfirmAppointment = () => {
    if (!selectedOrder || !appointDate || !appointTime) return;
    onUpdateStatus(selectedOrder.id, OrderStatus.APPOINTED, undefined, { appointmentDate: `${appointDate} ${appointTime}` });
    setStep('list');
    setSelectedOrder(null);
  };

  const handleStartWork = () => {
    if (!selectedOrder) return;
    onUpdateStatus(selectedOrder.id, OrderStatus.WORKING);
    setStep('work');
  };

  const handlePhotoUpload = (type: 'before' | 'after' | 'issue') => {
    const dummyUrl = `https://picsum.photos/seed/${type}-${Date.now()}/400/300`;
    setPhotos(prev => ({ ...prev, [type]: dummyUrl }));
  };

  const handleComplete = () => {
    if (!selectedOrder) return;
    if (!photos.before || !photos.after) {
      alert('필수 사진을 업로드해주세요.');
      return;
    }
    onUpdateStatus(selectedOrder.id, OrderStatus.COMPLETED, photos);
    setStep('list');
    setSelectedOrder(null);
    setPhotos({});
    setCurrentTab('history');
  };

  const handleUnable = () => {
    if (!selectedOrder) return;
    if (!photos.before) {
      alert('현장 사진을 업로드해주세요.');
      return;
    }
    if (!issueNote.trim()) {
      alert('조치 불가 사유를 입력해주세요.');
      return;
    }
    onUpdateStatus(selectedOrder.id, OrderStatus.UNABLE, photos, { issueNote });
    setStep('list');
    setSelectedOrder(null);
    setPhotos({});
    setIssueNote('');
    setCurrentTab('history');
  };

  const renderTabContent = () => {
    if (currentTab === 'jobs') {
      if (step === 'detail' && selectedOrder) {
        return (
          <div className="min-h-screen bg-gray-50 pb-24">
            <div className="p-4 bg-white border-b sticky top-12 z-10 flex items-center gap-4">
              <button onClick={() => setStep('list')} className="p-1 -ml-2 text-slate-600"><ChevronRight className="rotate-180" /></button>
              <h1 className="text-lg font-bold">상세 정보</h1>
            </div>
            <div className="p-4 space-y-6">
              <div className="bg-white p-5 rounded-2xl shadow-sm space-y-4">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Customer</p>
                  <p className="text-xl font-bold">{selectedOrder.customerName} 고객님</p>
                  <div className="flex gap-2 mt-4">
                    <a href={`tel:${selectedOrder.phone}`} className="flex-1 bg-green-50 text-green-700 py-3 rounded-xl flex items-center justify-center gap-2 font-bold active:scale-95 transition-transform">
                      <Phone size={18} /> 전화하기
                    </a>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-400 font-bold mb-1">주소</p>
                  <p className="text-gray-700">{selectedOrder.address}</p>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-400 font-bold mb-1">서비스 항목</p>
                  <p className="text-gray-900 font-semibold">{selectedOrder.serviceType}</p>
                </div>
                {selectedOrder.appointmentDate && (
                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-400 font-bold mb-1">방문 약속 일시</p>
                    <p className="text-blue-600 font-bold flex items-center gap-2"><Calendar size={14}/> {selectedOrder.appointmentDate}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="fixed bottom-16 left-0 w-full p-4 bg-white border-t">
              {selectedOrder.status === OrderStatus.TRANSFERRED || selectedOrder.status === OrderStatus.ASSIGNED ? (
                <button onClick={() => setStep('appoint')} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold">방문 일정 확정하기</button>
              ) : (
                <button onClick={handleStartWork} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">현장 도착 및 세척 시작</button>
              )}
            </div>
          </div>
        );
      }

      if (step === 'appoint' && selectedOrder) {
        return (
          <div className="min-h-screen bg-gray-50 pb-24">
             <div className="p-4 bg-white border-b sticky top-12 z-10 flex items-center gap-4">
              <button onClick={() => setStep('detail')} className="p-1 -ml-2 text-slate-600"><ChevronRight className="rotate-180" /></button>
              <h1 className="text-lg font-bold">방문 일정 확정</h1>
            </div>
            <div className="p-6 space-y-8">
               <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700">방문 날짜 선택</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                    <input type="date" value={appointDate} onChange={(e) => setAppointDate(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"/>
                  </div>
               </div>
               <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700">방문 시간 선택</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                    <input type="time" value={appointTime} onChange={(e) => setAppointTime(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"/>
                  </div>
               </div>
               <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-2">
                 <AlertTriangle size={18} className="text-blue-500 shrink-0 mt-0.5" />
                 <p className="text-xs text-blue-800 leading-relaxed">입력하신 일시에 방문한다는 내용의 <strong>알림톡이 고객님께 자동으로 발송</strong>됩니다. 신중하게 입력해주세요.</p>
               </div>
            </div>
            <div className="fixed bottom-16 left-0 w-full p-4 bg-white border-t">
                <button 
                  disabled={!appointDate || !appointTime}
                  onClick={handleConfirmAppointment}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold disabled:bg-gray-200 disabled:text-gray-400"
                >
                  일정 확정 및 안내톡 발송
                </button>
            </div>
          </div>
        );
      }

      if (step === 'work' && selectedOrder) {
        return (
          <div className="min-h-screen bg-gray-50 pb-24">
            <div className="p-4 bg-white border-b sticky top-12 z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setStep('detail')} className="p-1 -ml-2 text-slate-600"><ChevronRight className="rotate-180" /></button>
                <h1 className="text-lg font-bold">작업 증빙 업로드</h1>
              </div>
              <span className="text-xs text-red-500 font-bold bg-red-50 px-2 py-1 rounded">필수</span>
            </div>
            <div className="p-4 space-y-6">
              <div className="space-y-4">
                {[
                  { id: 'before', label: '세척 전 사진', required: true },
                  { id: 'after', label: '세척 후 사진', required: true },
                  { id: 'issue', label: '이상/고장 사진 (선택)', required: false }
                ].map(item => (
                  <div key={item.id} className={`bg-white p-4 rounded-2xl shadow-sm border border-dashed ${item.required ? 'border-gray-300' : 'border-orange-200'}`}>
                    <div className="flex justify-between items-center mb-4">
                      <span className={`font-bold ${item.required ? 'text-gray-700' : 'text-orange-600'}`}>{item.label}</span>
                      {photos[item.id as keyof typeof photos] && <CheckCircle2 className="text-green-500" size={20} />}
                    </div>
                    {photos[item.id as keyof typeof photos] ? (
                      <div className="relative rounded-xl overflow-hidden aspect-video">
                        <img src={photos[item.id as keyof typeof photos]} className="w-full h-full object-cover" />
                        <button onClick={() => setPhotos(prev => ({ ...prev, [item.id]: undefined }))} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"><ChevronRight className="rotate-45" size={16} /></button>
                      </div>
                    ) : (
                      <button onClick={() => handlePhotoUpload(item.id as any)} className="w-full aspect-video flex flex-col items-center justify-center gap-2 text-gray-400 bg-gray-50 rounded-xl active:bg-gray-100">
                        <Camera size={24} /><span className="text-xs font-medium">사진 촬영</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="fixed bottom-16 left-0 w-full p-4 bg-white border-t space-y-2">
              <button 
                onClick={handleComplete}
                disabled={!photos.before || !photos.after}
                className={`w-full py-4 rounded-xl font-bold transition-all ${(!photos.before || !photos.after) ? 'bg-gray-200 text-gray-400' : 'bg-green-600 text-white'}`}
              >
                세척 완료 처리
              </button>
              <button 
                onClick={() => setStep('unable')}
                className="w-full py-3 rounded-xl font-bold text-red-600 bg-red-50 border border-red-100"
              >
                조치 불가 처리
              </button>
            </div>
          </div>
        );
      }

      if (step === 'unable' && selectedOrder) {
        return (
          <div className="min-h-screen bg-gray-50 pb-24">
            <div className="p-4 bg-white border-b sticky top-12 z-10 flex items-center gap-4">
              <button onClick={() => setStep('work')} className="p-1 -ml-2 text-slate-600"><ChevronRight className="rotate-180" /></button>
              <h1 className="text-lg font-bold text-red-600">조치 불가 처리</h1>
            </div>
            <div className="p-4 space-y-6">
              <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex gap-2">
                <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-red-800 leading-relaxed">
                  조치 불가 처리 시 <strong>현장 사진과 사유를 반드시 기록</strong>해야 합니다. 
                  이 정보는 본사에 리포트됩니다.
                </p>
              </div>

              {/* 현장/이상 사진 */}
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-dashed border-red-300">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-red-700">현장/이상 사진 (필수)</span>
                  {(photos.before || photos.issue) && <CheckCircle2 className="text-green-500" size={20} />}
                </div>
                {(photos.before || photos.issue) ? (
                  <div className="relative rounded-xl overflow-hidden aspect-video">
                    <img src={photos.issue || photos.before} className="w-full h-full object-cover" />
                    <button onClick={() => setPhotos(prev => ({ ...prev, issue: undefined, before: undefined }))} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"><ChevronRight className="rotate-45" size={16} /></button>
                  </div>
                ) : (
                  <button onClick={() => handlePhotoUpload('issue')} className="w-full aspect-video flex flex-col items-center justify-center gap-2 text-red-400 bg-red-50 rounded-xl active:bg-red-100">
                    <Camera size={24} /><span className="text-xs font-medium">사진 촬영</span>
                  </button>
                )}
              </div>

              {/* 조치 불가 사유 */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">조치 불가 사유 (필수)</label>
                <textarea
                  value={issueNote}
                  onChange={(e) => setIssueNote(e.target.value)}
                  placeholder="고객 부재, 장비 고장, 안전 문제 등 상세히 기록해주세요..."
                  className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none resize-none h-32"
                />
              </div>
            </div>
            <div className="fixed bottom-16 left-0 w-full p-4 bg-white border-t">
              <button 
                onClick={handleUnable}
                disabled={(!photos.before && !photos.issue) || !issueNote.trim()}
                className={`w-full py-4 rounded-xl font-bold transition-all ${((!photos.before && !photos.issue) || !issueNote.trim()) ? 'bg-gray-200 text-gray-400' : 'bg-red-600 text-white'}`}
              >
                조치 불가 확정
              </button>
            </div>
          </div>
        );
      }

      return (
        <div className="flex flex-col min-h-screen bg-gray-50">
          <div className="p-4 bg-white border-b sticky top-12 z-10 flex justify-between items-center">
            <h1 className="text-xl font-bold text-slate-800">오늘의 할 일</h1>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">총 {techOrders.length}건</div>
          </div>
          <div className="flex-1 p-4 space-y-4">
            {techOrders.length === 0 ? (
              <div className="text-center py-20 text-gray-400">업무가 없습니다.</div>
            ) : techOrders.map(order => (
              <div key={order.id} onClick={() => handleOrderClick(order)} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center active:scale-[0.98] transition-transform">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${order.status === OrderStatus.APPOINTED ? 'bg-blue-500' : 'bg-gray-300'}`} />
                    <span className="text-xs font-semibold text-gray-500">{order.id}</span>
                  </div>
                  <h3 className="font-bold text-gray-900">{order.customerName} 고객님</h3>
                  <p className="text-sm text-gray-600 truncate max-w-[200px]">{order.address}</p>
                  <div className="flex gap-2">
                    <div className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded uppercase">{order.serviceType}</div>
                    {order.appointmentDate && <div className="text-[10px] text-slate-600 font-bold bg-slate-100 px-1.5 py-0.5 rounded">{order.appointmentDate}</div>}
                  </div>
                </div>
                <ChevronRight className="text-gray-300" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (currentTab === 'history') {
      return (
        <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
          <div className="p-4 bg-white border-b sticky top-12 z-10">
            <h1 className="text-xl font-bold text-slate-800">완료 내역</h1>
          </div>
          <div className="flex-1 p-4 space-y-4">
            {completedOrders.length === 0 ? (
              <div className="text-center py-20 text-gray-400">완료된 작업이 없습니다.</div>
            ) : completedOrders.map(order => (
              <div key={order.id} className={`bg-white p-4 rounded-xl shadow-sm border ${order.status === OrderStatus.UNABLE ? 'border-red-100' : 'border-gray-100'}`}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-gray-900">{order.customerName} 고객님</h3>
                  <span className={`text-xs font-bold ${order.status === OrderStatus.UNABLE ? 'text-red-600' : 'text-green-600'}`}>
                    {order.status === OrderStatus.UNABLE ? '조치 불가' : '완료'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-3">{order.serviceType} | {order.appointmentDate || '-'}</p>
                {order.status === OrderStatus.UNABLE && order.issueNote && (
                  <p className="text-xs text-red-600 bg-red-50 p-2 rounded mb-3">{order.issueNote}</p>
                )}
                <div className="flex gap-2 overflow-x-auto">
                   {order.photos?.before && <img src={order.photos.before} className="w-16 h-12 object-cover rounded opacity-60" />}
                   {order.photos?.after && <img src={order.photos.after} className="w-16 h-12 object-cover rounded" />}
                   {order.photos?.issue && <img src={order.photos.issue} className="w-16 h-12 object-cover rounded border-2 border-red-200" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (currentTab === 'profile') {
      return (
        <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
          <div className="p-4 bg-white border-b sticky top-12 z-10">
            <h1 className="text-xl font-bold text-slate-800">내 정보</h1>
          </div>
          <div className="p-6 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">김</div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">김철수 기사님</h2>
                <p className="text-sm text-gray-500">{MOCK_PARTNERS[0].name}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
                  <p className="text-xs text-gray-400 font-bold mb-1">이달 완료</p>
                  <p className="text-xl font-black text-blue-600">{completedOrders.length}건</p>
               </div>
               <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
                  <p className="text-xs text-gray-400 font-bold mb-1">평점</p>
                  <div className="flex items-center justify-center gap-1">
                     <Star size={14} className="text-amber-400 fill-amber-400" />
                     <p className="text-xl font-black text-gray-900">4.9</p>
                  </div>
               </div>
            </div>
            <button className="w-full p-4 bg-white rounded-2xl shadow-sm font-bold text-red-500 flex items-center justify-center gap-2 border border-red-50">
              <LogOut size={18} /> 로그아웃
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">{renderTabContent()}</div>
      <div className="bg-white border-t p-2 flex justify-around items-center sticky bottom-0 z-50">
        <button onClick={() => {setCurrentTab('jobs'); setStep('list');}} className={`flex flex-col items-center p-2 flex-1 ${currentTab === 'jobs' ? 'text-blue-600' : 'text-gray-400'}`}>
          <ClipboardList size={24} /><span className="text-[10px] mt-1 font-bold">배정업무</span>
        </button>
        <button onClick={() => {setCurrentTab('history'); setStep('list');}} className={`flex flex-col items-center p-2 flex-1 ${currentTab === 'history' ? 'text-blue-600' : 'text-gray-400'}`}>
          <History size={24} /><span className="text-[10px] mt-1 font-bold">완료내역</span>
        </button>
        <button onClick={() => {setCurrentTab('profile'); setStep('list');}} className={`flex flex-col items-center p-2 flex-1 ${currentTab === 'profile' ? 'text-blue-600' : 'text-gray-400'}`}>
          <User size={24} /><span className="text-[10px] mt-1 font-bold">내 정보</span>
        </button>
      </div>
    </div>
  );
};

export default TechnicianView;
