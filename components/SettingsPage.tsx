
import React, { useState } from 'react';
import { 
  Bell, Shield, Palette, Globe, Database, 
  ChevronRight, Moon, Sun, Monitor
} from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush, setNotifyPush] = useState(true);
  const [autoAssign, setAutoAssign] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');

  const Toggle: React.FC<{ value: boolean; onChange: (v: boolean) => void }> = ({ value, onChange }) => (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-blue-600' : 'bg-gray-300'}`}
    >
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${value ? 'translate-x-5' : ''}`} />
    </button>
  );

  return (
    <div className="space-y-8 max-w-3xl">
      {/* 알림 설정 */}
      <section>
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4"><Bell size={20} /> 알림 설정</h3>
        <div className="bg-white rounded-2xl border border-gray-200 divide-y">
          <div className="p-5 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">이메일 알림</p>
              <p className="text-xs text-gray-500 mt-0.5">새 업무 접수, 완료 보고 등을 이메일로 수신합니다</p>
            </div>
            <Toggle value={notifyEmail} onChange={setNotifyEmail} />
          </div>
          <div className="p-5 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">PWA 푸시 알림</p>
              <p className="text-xs text-gray-500 mt-0.5">브라우저 알림으로 실시간 업데이트를 수신합니다</p>
            </div>
            <Toggle value={notifyPush} onChange={setNotifyPush} />
          </div>
        </div>
      </section>

      {/* 업무 설정 */}
      <section>
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4"><Database size={20} /> 업무 설정</h3>
        <div className="bg-white rounded-2xl border border-gray-200 divide-y">
          <div className="p-5 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">자동 배정</p>
              <p className="text-xs text-gray-500 mt-0.5">지역 기반으로 협력사에 자동 배정합니다</p>
            </div>
            <Toggle value={autoAssign} onChange={setAutoAssign} />
          </div>
          <div className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50">
            <div>
              <p className="font-medium text-gray-900">보고서 양식 관리</p>
              <p className="text-xs text-gray-500 mt-0.5">보고서 템플릿을 편집하거나 새로 추가합니다</p>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
          <div className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50">
            <div>
              <p className="font-medium text-gray-900">엑셀 업로드 양식</p>
              <p className="text-xs text-gray-500 mt-0.5">엑셀 업로드 시 사용하는 양식을 관리합니다</p>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
        </div>
      </section>

      {/* 테마 설정 */}
      <section>
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4"><Palette size={20} /> 화면 설정</h3>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="font-medium text-gray-900 mb-3">테마</p>
          <div className="flex gap-3">
            {[
              { id: 'light' as const, label: '라이트', icon: Sun },
              { id: 'dark' as const, label: '다크', icon: Moon },
              { id: 'system' as const, label: '시스템', icon: Monitor },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex-1 py-3 rounded-xl flex flex-col items-center gap-2 text-sm font-bold border-2 transition-all ${
                  theme === t.id ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <t.icon size={20} />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 보안 설정 */}
      <section>
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4"><Shield size={20} /> 보안</h3>
        <div className="bg-white rounded-2xl border border-gray-200 divide-y">
          <div className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50">
            <div>
              <p className="font-medium text-gray-900">비밀번호 변경</p>
              <p className="text-xs text-gray-500 mt-0.5">현재 비밀번호를 변경합니다</p>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
          <div className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50">
            <div>
              <p className="font-medium text-gray-900">로그인 기록</p>
              <p className="text-xs text-gray-500 mt-0.5">최근 로그인 기록을 확인합니다</p>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
        </div>
      </section>

      {/* 시스템 정보 */}
      <section>
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4"><Globe size={20} /> 시스템 정보</h3>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">버전</span>
            <span className="font-medium">v1.0.0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">빌드</span>
            <span className="font-medium">2024.01.15</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">환경</span>
            <span className="font-medium text-green-600">Production</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;
