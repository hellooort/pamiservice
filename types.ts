
export enum UserRole {
  ADMIN = 'ADMIN', // HQ Admin
  OPERATOR = 'OPERATOR', // HQ Operator
  PARTNER_ADMIN = 'PARTNER_ADMIN', // Partner/Subcontractor Manager
  TECHNICIAN = 'TECHNICIAN' // Field Technician
}

export enum OrderStatus {
  RECEIPT = 'RECEIPT',
  TRANSFERRED = 'TRANSFERRED',
  ASSIGNED = 'ASSIGNED',
  APPOINTED = 'APPOINTED',
  VISITING = 'VISITING',
  WORKING = 'WORKING',
  COMPLETED = 'COMPLETED',
  UNABLE = 'UNABLE', // 조치 불가
  CANCELLED = 'CANCELLED'
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  serviceType: string;
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
  completionRate?: number;
  revenue?: number;
  customerFeedback?: {
    rating: number;
    comment: string;
  };
  issueNote?: string; // 조치 불가 사유
}

export interface Partner {
  id: string;
  name: string;
  location: string;
}

export interface Technician {
  id: string;
  name: string;
  partnerId: string;
  phone: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  partnerId?: string;
}
