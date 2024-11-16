import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Link } from 'react-router-dom';
import {
  Users,
  CreditCard,
  ArrowUp,
  ArrowDown,
  UserPlus,
  Mail,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Activity,
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
} from 'recharts';

// Örnek veriler
const stats = {
  users: {
    total: 850,
    active: 720,
    trial: 95,
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
  messages: {
    whatsapp: 12500,
    email: 45000,
    growth: 15.2,
  },
};

// Son 7 günlük aktivite verileri
const activityData = Array.from({ length: 7 }).map((_, index) => ({
  date: format(subDays(new Date(), 6 - index), 'd MMM', { locale: tr }),
  users: Math.floor(Math.random() * 50),
  revenue: Math.floor(Math.random() * 5000),
}));

// Son kayıtlar
const recentRegistrations = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    plan: 'pro',
    date: new Date('2024-03-18T10:30:00'),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    plan: 'free',
    date: new Date('2024-03-18T09:15:00'),
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    plan: 'enterprise',
    date: new Date('2024-03-17T16:45:00'),
  },
];

// Sistem durumu
const systemStatus = [
  {
    name: 'WhatsApp API',
    status: 'operational',
    uptime: '99.9%',
  },
  {
    name: 'E-posta Servisi',
    status: 'operational',
    uptime: '99.8%',
  },
  {
    name: 'Webhook Servisi',
    status: 'degraded',
    uptime: '98.5%',
  },
];

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Hoş Geldiniz Kartı */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Hoş Geldiniz, {user?.name}
        </h1>
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
          <Link
            to="/admin/users"
            className="mt-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
          >
            <UserPlus className="h-4 w-4 mr-1" />
            Kullanıcıları Yönet
          </Link>
        </div>

        {/* Gelir İstatistikleri */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-green-500 mr-2" />
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
          <Link
            to="/admin/subscriptions"
            className="mt-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
          >
            <CreditCard className="h-4 w-4 mr-1" />
            Abonelikleri Yönet
          </Link>
        </div>

        {/* Mesaj İstatistikleri */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="h-5 w-5 text-purple-500 mr-2" />
              <h3 className="text-lg font-medium">Mesaj Aktivitesi</h3>
            </div>
            <div className={`flex items-center ${stats.messages.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stats.messages.growth >= 0 ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              {Math.abs(stats.messages.growth)}%
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center text-sm text-gray-500">
                <MessageCircle className="h-4 w-4 mr-1" />
                WhatsApp
              </div>
              <p className="text-2xl font-semibold">
                {stats.messages.whatsapp.toLocaleString()}
              </p>
            </div>
            <div>
              <div className="flex items-center text-sm text-gray-500">
                <Mail className="h-4 w-4 mr-1" />
                E-posta
              </div>
              <p className="text-2xl font-semibold">
                {stats.messages.email.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kullanıcı Aktivitesi */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium mb-6">Kullanıcı Aktivitesi</h3>
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
          <h3 className="text-lg font-medium mb-6">Gelir Analizi</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Gelir (₺)"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Alt Kartlar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Son Kayıtlar */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Son Kayıtlar</h3>
          <div className="space-y-4">
            {recentRegistrations.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.plan === 'free' ? 'bg-blue-100 text-blue-800' :
                    user.plan === 'pro' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {user.plan === 'free' ? 'Ücretsiz' :
                     user.plan === 'pro' ? 'Pro' : 'Kurumsal'}
                  </span>
                  <p className="mt-1 text-xs text-gray-500">
                    {format(new Date(user.date), 'HH:mm', { locale: tr })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sistem Durumu */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Sistem Durumu</h3>
          <div className="space-y-4">
            {systemStatus.map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  {service.status === 'operational' ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : service.status === 'degraded' ? (
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-gray-500">
                      Uptime: {service.uptime}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  service.status === 'operational' ? 'bg-green-100 text-green-800' :
                  service.status === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {service.status === 'operational' ? 'Aktif' :
                   service.status === 'degraded' ? 'Yavaş' : 'Kapalı'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};