import React from 'react';
import { useAdminStore } from '../../stores/adminStore';
import {
  Users,
  CreditCard,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Activity,
  Bell,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

// Örnek veriler
const stats = {
  users: {
    total: 850,
    active: 720,
    growth: 12.5,
  },
  revenue: {
    monthly: 24950,
    growth: 8.3,
    subscriptions: {
      free: 450,
      pro: 285,
      enterprise: 15,
    },
  },
  affiliates: {
    total: 45,
    active: 38,
    earnings: 12500,
    growth: 15.2,
  },
};

// Son 7 günlük aktivite verileri
const activityData = Array.from({ length: 7 }).map((_, index) => ({
  date: format(subDays(new Date(), 6 - index), 'd MMM', { locale: tr }),
  users: Math.floor(Math.random() * 50),
  revenue: Math.floor(Math.random() * 5000),
}));

// Son işlemler
const recentTransactions = [
  {
    id: '1',
    type: 'subscription',
    user: 'John Doe',
    amount: 499,
    plan: 'pro',
    status: 'completed',
    date: new Date('2024-03-18T10:30:00'),
  },
  {
    id: '2',
    type: 'affiliate',
    user: 'Jane Smith',
    amount: 250,
    status: 'pending',
    date: new Date('2024-03-18T09:15:00'),
  },
  {
    id: '3',
    type: 'subscription',
    user: 'Bob Wilson',
    amount: 1999,
    plan: 'enterprise',
    status: 'failed',
    date: new Date('2024-03-17T16:45:00'),
  },
];

// Sistem bildirimleri
const systemAlerts = [
  {
    id: '1',
    type: 'warning',
    message: 'Yüksek CPU kullanımı tespit edildi',
    date: new Date('2024-03-18T11:30:00'),
  },
  {
    id: '2',
    type: 'success',
    message: 'Sistem yedeklemesi başarıyla tamamlandı',
    date: new Date('2024-03-18T10:15:00'),
  },
  {
    id: '3',
    type: 'error',
    message: 'E-posta gönderim hatası',
    date: new Date('2024-03-18T09:45:00'),
  },
];

export const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-gray-600">
          Sistem durumunu ve istatistikleri görüntüleyin
        </p>
      </div>

      {/* Ana İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kullanıcı İstatistikleri */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="text-lg font-medium">Kullanıcılar</h3>
            </div>
            <div className={`flex items-center ${stats.users.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stats.users.growth >= 0 ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              {Math.abs(stats.users.growth)}%
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Toplam</p>
              <p className="text-2xl font-semibold">{stats.users.total}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Aktif</p>
              <p className="text-2xl font-semibold">{stats.users.active}</p>
            </div>
          </div>
        </div>

        {/* Gelir İstatistikleri */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 text-green-500 mr-2" />
              <h3 className="text-lg font-medium">Aylık Gelir</h3>
            </div>
            <div className={`flex items-center ${stats.revenue.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stats.revenue.growth >= 0 ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              {Math.abs(stats.revenue.growth)}%
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold">
            {stats.revenue.monthly.toLocaleString('tr-TR')} ₺
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-xs text-gray-500">Ücretsiz</p>
              <p className="font-medium">{stats.revenue.subscriptions.free}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Pro</p>
              <p className="font-medium">{stats.revenue.subscriptions.pro}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Kurumsal</p>
              <p className="font-medium">{stats.revenue.subscriptions.enterprise}</p>
            </div>
          </div>
        </div>

        {/* Gelir Ortaklığı İstatistikleri */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-yellow-500 mr-2" />
              <h3 className="text-lg font-medium">Gelir Ortaklığı</h3>
            </div>
            <div className={`flex items-center ${stats.affiliates.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stats.affiliates.growth >= 0 ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              {Math.abs(stats.affiliates.growth)}%
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Toplam Ortak</p>
              <p className="text-2xl font-semibold">{stats.affiliates.total}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Toplam Kazanç</p>
              <p className="text-2xl font-semibold">
                {stats.affiliates.earnings.toLocaleString('tr-TR')} ₺
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kullanıcı Aktivitesi */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Kullanıcı Aktivitesi</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="users"
                  name="Yeni Kullanıcı"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gelir Grafiği */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Gelir Analizi</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="revenue"
                  name="Gelir (₺)"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Alt Kartlar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Son İşlemler */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Son İşlemler</h3>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="flex items-center">
                    {transaction.type === 'subscription' ? (
                      <CreditCard className="h-5 w-5 text-blue-500 mr-2" />
                    ) : (
                      <DollarSign className="h-5 w-5 text-yellow-500 mr-2" />
                    )}
                    <div>
                      <p className="font-medium">{transaction.user}</p>
                      <p className="text-sm text-gray-500">
                        {transaction.type === 'subscription'
                          ? `${transaction.plan.toUpperCase()} Plan`
                          : 'Gelir Ortaklığı Ödemesi'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {transaction.amount.toLocaleString('tr-TR')} ₺
                  </p>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : transaction.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status === 'completed' ? 'Tamamlandı' :
                       transaction.status === 'pending' ? 'Beklemede' : 'Başarısız'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sistem Bildirimleri */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Sistem Bildirimleri</h3>
            <Bell className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {systemAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg"
              >
                {alert.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                ) : alert.type === 'warning' ? (
                  <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(alert.date), 'HH:mm', { locale: tr })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};