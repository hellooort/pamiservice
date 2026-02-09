
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
  Clock,
  Copy,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  Upload,
  ImageIcon,
  X
} from 'lucide-react';

interface TechViewProps {
  orders: Order[];
  onUpdateStatus: (id: string, status: OrderStatus, photos?: any, extra?: any) => void;
}

const TechnicianView: React.FC<TechViewProps> = ({ orders, onUpdateStatus }) => {
  const [currentTab, setCurrentTab] = useState<'jobs' | 'history' | 'profile'>('jobs');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [step, setStep] = useState<'list' | 'detail' | 'appoint' | 'work' | 'unable' | 'changePassword'>('list');
  const [photos, setPhotos] = useState<{before?: string, after?: string, issue?: string}>({});
  const [appointDate, setAppointDate] = useState('');
  const [appointTime, setAppointTime] = useState('');
  const [issueNote, setIssueNote] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // 비밀번호 변경 상태
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

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

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const renderTabContent = () => {
    // ─── 비밀번호 변경 ───
    if (step === 'changePassword') {
      return (
        <div className="min-h-screen bg-gray-50 pb-24">
          <div className="p-4 bg-white border-b sticky top-12 z-10 flex items-center gap-4">
            <button onClick={() => { setStep('list'); setCurrentTab('profile'); }} className="p-1 -ml-2 text-slate-600"><ChevronRight className="rotate-180" /></button>
            <h1 className="text-lg font-bold">비밀번호 변경</h1>
          </div>
          <div className="p-6 space-y-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">현재 비밀번호</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showCurrentPw ? 'text' : 'password'}
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    placeholder="현재 비밀번호"
                    className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showCurrentPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">새 비밀번호</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showNewPw ? 'text' : 'password'}
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    placeholder="8자 이상, 영문+숫자+특수문자"
                    className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showNewPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">새 비밀번호 확인</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    placeholder="새 비밀번호 다시 입력"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {confirmPw && newPw !== confirmPw && (
                  <p className="text-xs text-red-500 mt-1.5">비밀번호가 일치하지 않습니다</p>
                )}
              </div>
            </div>
          </div>
          <div className="fixed bottom-16 left-0 w-full p-4 bg-white border-t">
            <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">비밀번호 변경</button>
          </div>
        </div>
      );
    }

    if (currentTab === 'jobs') {
      // ─── 상세 ───
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
                  {/* 고객명/접수번호 복사 */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleCopy(selectedOrder.customerName, 'name')}
                      className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold active:scale-95 transition-transform"
                    >
                      <Copy size={12} />
                      {copiedField === 'name' ? '복사됨!' : '고객명 복사'}
                    </button>
                    <button
                      onClick={() => handleCopy(selectedOrder.id, 'id')}
                      className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold active:scale-95 transition-transform"
                    >
                      <Copy size={12} />
                      {copiedField === 'id' ? '복사됨!' : '접수번호 복사'}
                    </button>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <a href={`tel:${selectedOrder.phone}`} className="flex-1 bg-green-50 text-green-700 py-3 rounded-xl flex items-center justify-center gap-2 font-bold active:scale-95 transition-transform">
                      <Phone size={18} /> 전화하기
                    </a>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-400 font-bold mb-1">접수번호</p>
                  <p className="text-gray-700 font-mono">{selectedOrder.id}</p>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-400 font-bold mb-1">주소</p>
                  <p className="text-gray-700">{selectedOrder.address}</p>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-400 font-bold mb-1">서비스 항목</p>
                  <p className="text-gray-900 font-semibold">{selectedOrder.serviceType}</p>
                </div>
                {selectedOrder.revenue && (
                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-400 font-bold mb-1">서비스 금액</p>
                    <p className="text-blue-600 font-bold">₩{selectedOrder.revenue.toLocaleString()}</p>
                  </div>
                )}
                {selectedOrder.appointmentDate && (
                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-400 font-bold mb-1">방문 약속 일시</p>
                    <p className="text-blue-600 font-bold flex items-center gap-2"><Calendar size={14}/> {selectedOrder.appointmentDate}</p>
                  </div>
                )}
                {selectedOrder.memo && (
                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-400 font-bold mb-1">특이사항</p>
                    <p className="text-gray-600 text-sm">{selectedOrder.memo}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="fixed bottom-16 left-0 w-full p-4 bg-white border-t">
              {selectedOrder.status === OrderStatus.TRANSFERRED || selectedOrder.status === OrderStatus.ASSIGNED ? (
                <button onClick={() => setStep('appoint')} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold">방문 일정 확정하기</button>
              ) : (
                <button onClick={handleStartWork} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">현장 도착 및 작업 시작</button>
              )}
            </div>
          </div>
        );
      }

      // ─── 일정 확정 ───
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
                <p className="text-xs text-blue-800 leading-relaxed">입력하신 일시에 방문한다는 내용이 <strong>고객님께 안내</strong>됩니다. 신중하게 입력해주세요.</p>
              </div>
            </div>
            <div className="fixed bottom-16 left-0 w-full p-4 bg-white border-t">
              <button 
                disabled={!appointDate || !appointTime}
                onClick={handleConfirmAppointment}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold disabled:bg-gray-200 disabled:text-gray-400"
              >
                일정 확정
              </button>
            </div>
          </div>
        );
      }

      // ─── 작업 증빙 (사진 업로드 → 업무 완료) ───
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
              {/* 고객 정보 요약 */}
              <div className="bg-white p-4 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-400 font-bold">고객</p>
                    <p className="font-bold text-gray-900">{selectedOrder.customerName}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(selectedOrder.customerName, 'name')}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${copiedField === 'name' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                    >
                      <Copy size={10} /> {copiedField === 'name' ? '복사됨' : '고객명'}
                    </button>
                    <button
                      onClick={() => handleCopy(selectedOrder.id, 'id')}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${copiedField === 'id' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                    >
                      <Copy size={10} /> {copiedField === 'id' ? '복사됨' : '접수번호'}
                    </button>
                  </div>
                </div>
              </div>

              {/* 사진 업로드 */}
              <div className="space-y-4">
                {[
                  { id: 'before', label: '작업 전 사진', required: true },
                  { id: 'after', label: '작업 후 사진', required: true },
                  { id: 'issue', label: '특이사항 사진 (선택)', required: false }
                ].map(item => (
                  <div key={item.id} className={`bg-white p-4 rounded-2xl shadow-sm border border-dashed ${item.required ? 'border-gray-300' : 'border-orange-200'}`}>
                    <div className="flex justify-between items-center mb-4">
                      <span className={`font-bold ${item.required ? 'text-gray-700' : 'text-orange-600'}`}>{item.label}</span>
                      {photos[item.id as keyof typeof photos] && <CheckCircle2 className="text-green-500" size={20} />}
                    </div>
                    {photos[item.id as keyof typeof photos] ? (
                      <div className="relative rounded-xl overflow-hidden aspect-video">
                        <img src={photos[item.id as keyof typeof photos]} className="w-full h-full object-cover" />
                        <button onClick={() => setPhotos(prev => ({ ...prev, [item.id]: undefined }))} className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full"><X size={16} /></button>
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
                업무 완료
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

      // ─── 조치 불가 ───
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
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-dashed border-red-300">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-red-700">현장/이상 사진 (필수)</span>
                  {(photos.before || photos.issue) && <CheckCircle2 className="text-green-500" size={20} />}
                </div>
                {(photos.before || photos.issue) ? (
                  <div className="relative rounded-xl overflow-hidden aspect-video">
                    <img src={photos.issue || photos.before} className="w-full h-full object-cover" />
                    <button onClick={() => setPhotos(prev => ({ ...prev, issue: undefined, before: undefined }))} className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full"><X size={16} /></button>
                  </div>
                ) : (
                  <button onClick={() => handlePhotoUpload('issue')} className="w-full aspect-video flex flex-col items-center justify-center gap-2 text-red-400 bg-red-50 rounded-xl active:bg-red-100">
                    <Camera size={24} /><span className="text-xs font-medium">사진 촬영</span>
                  </button>
                )}
              </div>
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

      // ─── 업무 목록 ───
      return (
        <div className="flex flex-col min-h-screen bg-gray-50">
          <div className="p-4 bg-white border-b sticky top-12 z-10 flex justify-between items-center">
            <h1 className="text-xl font-bold text-slate-800">오늘의 할 일</h1>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">총 {techOrders.length}건</div>
          </div>
          <div className="flex-1 p-4 space-y-4">
            {techOrders.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <ClipboardList size={48} className="mx-auto mb-3 opacity-30" />
                <p>배정된 업무가 없습니다.</p>
              </div>
            ) : techOrders.map(order => (
              <div key={order.id} onClick={() => handleOrderClick(order)} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center active:scale-[0.98] transition-transform">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${order.status === OrderStatus.APPOINTED ? 'bg-blue-500' : order.status === OrderStatus.WORKING ? 'bg-amber-500' : 'bg-gray-300'}`} />
                    <span className="text-xs font-semibold text-gray-500">{order.id}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      order.status === OrderStatus.WORKING ? 'bg-amber-100 text-amber-700' :
                      order.status === OrderStatus.APPOINTED ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {order.status === OrderStatus.WORKING ? '작업중' :
                       order.status === OrderStatus.APPOINTED ? '약속확정' :
                       order.status === OrderStatus.ASSIGNED ? '배정됨' : '이관됨'}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900">{order.customerName} 고객님</h3>
                  <p className="text-sm text-gray-600 truncate max-w-[250px]">{order.address}</p>
                  <div className="flex gap-2 flex-wrap">
                    <div className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded">{order.serviceType}</div>
                    {order.appointmentDate && <div className="text-[10px] text-slate-600 font-bold bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-0.5"><Calendar size={8}/> {order.appointmentDate}</div>}
                  </div>
                </div>
                <ChevronRight className="text-gray-300 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    // ─── 완료 내역 ───
    if (currentTab === 'history') {
      return (
        <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
          <div className="p-4 bg-white border-b sticky top-12 z-10">
            <h1 className="text-xl font-bold text-slate-800">완료 내역</h1>
          </div>
          <div className="flex-1 p-4 space-y-4">
            {completedOrders.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <History size={48} className="mx-auto mb-3 opacity-30" />
                <p>완료된 작업이 없습니다.</p>
              </div>
            ) : completedOrders.map(order => (
              <div key={order.id} className={`bg-white p-4 rounded-xl shadow-sm border ${order.status === OrderStatus.UNABLE ? 'border-red-100' : 'border-gray-100'}`}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-gray-900">{order.customerName} 고객님</h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${order.status === OrderStatus.UNABLE ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
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

    // ─── 내 정보 ───
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
                <p className="text-xs text-gray-400 mt-0.5">010-1234-5678</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
                <p className="text-xs text-gray-400 font-bold mb-1">이달 완료</p>
                <p className="text-xl font-black text-blue-600">{completedOrders.length}건</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
                <p className="text-xs text-gray-400 font-bold mb-1">진행중</p>
                <p className="text-xl font-black text-amber-600">{techOrders.length}건</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
                <p className="text-xs text-gray-400 font-bold mb-1">평점</p>
                <div className="flex items-center justify-center gap-1">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <p className="text-xl font-black text-gray-900">4.9</p>
                </div>
              </div>
            </div>

            {/* 메뉴 */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <button
                onClick={() => setStep('changePassword')}
                className="w-full p-4 flex items-center gap-3 text-gray-700 font-medium border-b hover:bg-gray-50 transition-colors"
              >
                <KeyRound size={18} className="text-gray-400" />
                비밀번호 변경
                <ChevronRight size={16} className="ml-auto text-gray-300" />
              </button>
              <button className="w-full p-4 flex items-center gap-3 text-gray-700 font-medium border-b hover:bg-gray-50 transition-colors">
                <Settings size={18} className="text-gray-400" />
                알림 설정
                <ChevronRight size={16} className="ml-auto text-gray-300" />
              </button>
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
