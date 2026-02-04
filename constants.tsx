
import { Order, OrderStatus, Partner, Technician, UserRole } from './types';

export const MOCK_PARTNERS: Partner[] = [
  { id: 'p1', name: '(주)알파 클리닝', location: '서울/수도권' },
  { id: 'p2', name: '베타 유지보수', location: '경기/강원' },
  { id: 'p3', name: '감마 테크 서비스', location: '충청/전라' },
];

export const MOCK_TECHNICIANS: Technician[] = [
  { id: 't1', name: '김철수', partnerId: 'p1', phone: '010-1234-5678' },
  { id: 't2', name: '이영희', partnerId: 'p1', phone: '010-2345-6789' },
  { id: 't3', name: '박민준', partnerId: 'p2', phone: '010-3456-7890' },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-2023-1001',
    customerName: '홍길동',
    phone: '010-1111-2222',
    address: '서울특별시 강남구 테헤란로 123, 405호',
    serviceType: '에어컨 정밀 세척',
    status: OrderStatus.RECEIPT,
    receivedAt: '2023-11-20 09:00',
    revenue: 150000,
  },
  {
    id: 'ORD-2023-1002',
    customerName: '김지현',
    phone: '010-3333-4444',
    address: '경기도 성남시 분당구 불정로 6, 101동',
    serviceType: '세탁기 분해 청소',
    status: OrderStatus.TRANSFERRED,
    receivedAt: '2023-11-20 10:15',
    partnerId: 'p1',
    revenue: 85000,
  },
  {
    id: 'ORD-2023-1003',
    customerName: '최승우',
    phone: '010-5555-6666',
    address: '서울특별시 송파구 올림픽로 300, 25층',
    serviceType: '시스템 에어컨 점검',
    status: OrderStatus.COMPLETED,
    receivedAt: '2023-11-19 14:00',
    partnerId: 'p2',
    technicianId: 't3',
    appointmentDate: '2023-11-20 11:00',
    revenue: 120000,
    photos: {
      before: 'https://picsum.photos/seed/before1/400/300',
      after: 'https://picsum.photos/seed/after1/400/300',
    },
    customerFeedback: {
      rating: 5,
      comment: '기사님이 매우 친절하시고 세척도 꼼꼼하게 잘 해주셨습니다. 다음에 또 이용하고 싶네요!'
    }
  },
  {
    id: 'ORD-2023-1004',
    customerName: '박영수',
    phone: '010-7777-8888',
    address: '서울특별시 마포구 양화로 45, 302호',
    serviceType: '에어컨 정밀 세척',
    status: OrderStatus.ASSIGNED,
    receivedAt: '2023-11-20 11:30',
    partnerId: 'p1',
    technicianId: 't1',
    revenue: 150000,
  },
  {
    id: 'ORD-2023-1005',
    customerName: '이수진',
    phone: '010-9999-0000',
    address: '경기도 수원시 영통구 광교로 128',
    serviceType: '냉장고 청소',
    status: OrderStatus.UNABLE,
    receivedAt: '2023-11-19 09:00',
    partnerId: 'p1',
    technicianId: 't2',
    appointmentDate: '2023-11-20 14:00',
    revenue: 95000,
    photos: {
      before: 'https://picsum.photos/seed/before2/400/300',
      issue: 'https://picsum.photos/seed/issue1/400/300',
    },
    issueNote: '고객 부재로 작업 불가. 2회 방문 시도 후 연락 두절.'
  },
];
