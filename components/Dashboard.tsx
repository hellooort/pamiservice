
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Order, OrderStatus } from '../types';

interface DashboardProps {
  orders: Order[];
}

const Dashboard: React.FC<DashboardProps> = ({ orders }) => {
  const statusLabels: Record<string, string> = {
    [OrderStatus.RECEIPT]: '접수',
    [OrderStatus.TRANSFERRED]: '이관',
    [OrderStatus.ASSIGNED]: '배정',
    [OrderStatus.APPOINTED]: '약속확정',
    [OrderStatus.VISITING]: '방문중',
    [OrderStatus.WORKING]: '작업중',
    [OrderStatus.COMPLETED]: '완료',
    [OrderStatus.UNABLE]: '조치불가',
    [OrderStatus.CANCELLED]: '취소'
  };

  const statusCounts = orders.reduce((acc, order) => {
    const label = statusLabels[order.status] || order.status;
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1', '#94a3b8', '#dc2626'];

  const stats = [
    { label: '전체 주문', value: orders.length, color: 'text-blue-600' },
    { label: '작업 완료', value: orders.filter(o => o.status === OrderStatus.COMPLETED).length, color: 'text-green-600' },
    { label: '미배정 건수', value: orders.filter(o => o.status === OrderStatus.RECEIPT).length, color: 'text-amber-600' },
    { label: '누적 매출', value: `₩${orders.reduce((sum, o) => sum + (o.revenue || 0), 0).toLocaleString()}`, color: 'text-indigo-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">업무 단계별 현황</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">성과 지표 요약</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pieData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
