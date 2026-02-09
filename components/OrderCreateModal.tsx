
import React, { useState } from 'react';
import { X, Plus, Upload } from 'lucide-react';
import { MOCK_SERVICE_ITEMS } from '../constants';

interface OrderCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (order: any) => void;
}

type ModalTab = 'single' | 'excel';

const OrderCreateModal: React.FC<OrderCreateModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [tab, setTab] = useState<ModalTab>('single');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [serviceItemId, setServiceItemId] = useState('');
  const [memo, setMemo] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedItem = MOCK_SERVICE_ITEMS.find(i => i.id === serviceItemId);

  const handleSingleCreate = () => {
    onCreate({
      customerName, phone, address, serviceItemId,
      serviceType: selectedItem?.name || '',
      revenue: selectedItem?.price || 0,
      cost: selectedItem?.cost || 0,
      memo,
    });
    // 초기화
    setCustomerName(''); setPhone(''); setAddress(''); setServiceItemId(''); setMemo('');
    onClose();
  };

  const handleExcelUpload = () => {
    setUploadedFile('업무목록_2024년01월.xlsx');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">업무 등록</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
        </div>

        {/* 탭 */}
        <div className="flex border-b">
          <button
            onClick={() => setTab('single')}
            className={`flex-1 py-3 text-sm font-bold transition-colors ${tab === 'single' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Plus size={16} className="inline mr-1.5 -mt-0.5" />
            개별 등록
          </button>
          <button
            onClick={() => setTab('excel')}
            className={`flex-1 py-3 text-sm font-bold transition-colors ${tab === 'excel' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Upload size={16} className="inline mr-1.5 -mt-0.5" />
            엑셀 업로드
          </button>
        </div>

        {/* 본문 */}
        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'single' ? (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1.5">고객명 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="홍길동"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1.5">연락처 <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="010-0000-0000"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1.5">주소 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="서울특별시 강남구 테헤란로 123, 405호"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1.5">서비스 품목 <span className="text-red-500">*</span></label>
                <select
                  value={serviceItemId}
                  onChange={(e) => setServiceItemId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">품목을 선택하세요</option>
                  {MOCK_SERVICE_ITEMS.filter(i => i.status === 'active').map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} (₩{item.price.toLocaleString()})
                    </option>
                  ))}
                </select>
                {selectedItem && (
                  <div className="mt-2 bg-blue-50 p-3 rounded-lg flex justify-between text-sm">
                    <span className="text-blue-700 font-medium">소비자가: ₩{selectedItem.price.toLocaleString()}</span>
                    <span className="text-gray-500">원가: ₩{selectedItem.cost.toLocaleString()}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1.5">비고 / 특이사항</label>
                <textarea
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="고객 요청사항, 특이사항 등"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 엑셀 템플릿 다운로드 */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-blue-900">엑셀 양식 다운로드</p>
                  <p className="text-xs text-blue-600 mt-0.5">양식에 맞춰 작성 후 업로드해주세요</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
                  양식 다운로드
                </button>
              </div>

              {/* 드래그 앤 드롭 영역 */}
              <div
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                  dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleExcelUpload(); }}
              >
                {uploadedFile ? (
                  <div className="space-y-3">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-2xl">
                      <svg className="text-green-600" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg>
                    </div>
                    <p className="font-bold text-gray-900">{uploadedFile}</p>
                    <p className="text-sm text-green-600 font-medium">파일이 업로드되었습니다</p>
                    <div className="bg-white p-4 rounded-xl border mt-4 text-left">
                      <p className="text-sm font-bold text-gray-700 mb-2">미리보기 (총 25건)</p>
                      <table className="w-full text-xs text-left">
                        <thead className="text-gray-500 border-b">
                          <tr>
                            <th className="py-2">고객명</th>
                            <th className="py-2">연락처</th>
                            <th className="py-2">품목</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          <tr><td className="py-1.5">홍길동</td><td>010-1111-2222</td><td>에어컨 세척</td></tr>
                          <tr><td className="py-1.5">김영희</td><td>010-3333-4444</td><td>세탁기 청소</td></tr>
                          <tr><td className="py-1.5 text-gray-400">... 외 23건</td><td></td><td></td></tr>
                        </tbody>
                      </table>
                    </div>
                    <button onClick={() => setUploadedFile(null)} className="text-sm text-red-500 font-medium hover:underline mt-2">파일 삭제</button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-200 rounded-2xl">
                      <Upload className="text-gray-500" size={28} />
                    </div>
                    <p className="font-bold text-gray-700">엑셀 파일을 드래그하거나 클릭하여 업로드</p>
                    <p className="text-sm text-gray-500">.xlsx, .xls 파일만 지원 (최대 10MB)</p>
                    <button onClick={handleExcelUpload} className="mt-4 bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">
                      파일 선택
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 border border-gray-300 rounded-xl font-bold text-gray-600 hover:bg-white transition-colors">
            취소
          </button>
          <button
            onClick={tab === 'single' ? handleSingleCreate : () => { onClose(); }}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
          >
            {tab === 'single' ? '등록하기' : `일괄 등록 (${uploadedFile ? '25건' : '0건'})`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCreateModal;
