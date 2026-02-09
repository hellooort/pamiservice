
export enum UserRole {
  ADMIN = 'ADMIN',           // 본사 총괄 관리자
  OPERATOR = 'OPERATOR',     // 본사 운영자
  PARTNER_ADMIN = 'PARTNER_ADMIN', // 협력사(지사) 관리자
  TECHNICIAN = 'TECHNICIAN'  // 현장 기사
}

export enum OrderStatus {
  RECEIPT = 'RECEIPT',           // 신규 접수
  TRANSFERRED = 'TRANSFERRED',  // 협력사 이관
  ASSIGNED = 'ASSIGNED',        // 기사 배정
  APPOINTED = 'APPOINTED',      // 약속 확정
  VISITING = 'VISITING',        // 방문중
  WORKING = 'WORKING',          // 작업중
  PHOTO_UPLOADED = 'PHOTO_UPLOADED', // 사진 업로드 완료
  COMPLETED = 'COMPLETED',      // 최종 완료
  UNABLE = 'UNABLE',            // 조치 불가
  CANCELLED = 'CANCELLED'       // 취소됨
}

export interface OrderPhoto {
  url: string;
  type: 'before' | 'after' | 'issue';
  uploadedAt: string;
  note?: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  serviceType: string;
  serviceItemId?: string;   // 품목 ID
  status: OrderStatus;
  receivedAt: string;
  partnerId?: string;
  technicianId?: string;
  appointmentDate?: string;
  photos?: {
    before?: string;
    after?: string;
    issue?: string;
  };
  photoList?: OrderPhoto[];   // 다중 사진 목록
  completionRate?: number;
  revenue?: number;
  cost?: number;              // 원가
  customerFeedback?: {
    rating: number;
    comment: string;
  };
  issueNote?: string;         // 조치 불가 사유
  memo?: string;              // 비고/특이사항
  completedAt?: string;       // 완료 일시
}

export interface Partner {
  id: string;
  name: string;
  location: string;
  contactName: string;    // 담당자명
  contactPhone: string;   // 담당자 연락처
  businessNumber: string; // 사업자번호
  address: string;        // 사업장 주소
  status: 'active' | 'inactive'; // 활성/비활성
  createdAt: string;
}

export interface Technician {
  id: string;
  name: string;
  partnerId: string;
  phone: string;
  status: 'active' | 'inactive';
  joinedAt: string;
  completedCount?: number;  // 누적 완료 건수
  rating?: number;          // 평균 평점
}

export interface ServiceItem {
  id: string;
  name: string;         // 품목명 (예: 에어컨 정밀 세척)
  category: string;     // 카테고리 (예: 에어컨, 세탁기 등)
  price: number;        // 소비자 가격
  cost: number;         // 원가 (기사 정산 기준)
  status: 'active' | 'inactive';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  partnerId?: string;
  status: 'active' | 'pending' | 'inactive'; // pending = 최초 비밀번호 미설정
  createdAt: string;
  lastLoginAt?: string;
}
