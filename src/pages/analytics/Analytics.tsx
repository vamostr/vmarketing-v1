import React, { useState } from 'react';
import { BarChart2, MessageCircle, Mail, Users, ArrowUp, ArrowDown } from 'lucide-react';
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
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState('7'); // 7, 30, 90 gün

  // Örnek veriler
  const messageStats = {
    total: 1250,
    delivered: 1200,
    read: 980,
    failed: 50,
    growth: 12.5
  };

  const emailStats = {
    total: 5000,
    opened: 3500,
    clicked: 2000,
    bounced: 150,
    growth: -2.3
  };

  const contactStats = {
    total: 850,
    active: 720,
    inactive: 130,
    growth: 5.8
  };

  // Örnek grafik verileri
  const generateTimelineData = (days: number) => {
    return Array.from({ length: days }).map((_, index) => ({
      date: format(subDays(new Date(), days - 1 - index), 'd MMM', { locale: tr }),
      whatsapp: Math.floor(Math.random() * 100),
      email: Math.floor(Math.random() * 200),
    }));
  };

  const timelineData = generateTimelineData(parseInt(dateRange));

  const channelDistribution = [
    { name: 'WhatsApp', value: messageStats.total },
    { name: 'E-posta', value: emailStats.total },
  ];

  const messageStatusData = [
    { name: 'İletildi', value: messageStats.delivered },
    { name: 'Okundu', value: messageStats.read },
    { name: 'Başarısız', value: messageStats.failed },
  ];

  const emailStatusData = [
    { name: 'Açıldı', value: emailStats.opened },
    { name: 'Tıklandı', value: emailStats.clicked },
    { name: 'Geri Döndü', value: emailStats.bounced },
  ];

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BarChart2 className="h-6 w-6 text-blue-500 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Analitik</h1>
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input w-40"
          >
            <option value="7">Son 7 gün</option>
            <option value="30">Son 30 gün</option>
            <option value="90">Son 90 gün</option>
          </select>
        </div>
      </div>

      {/* Özet Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* WhatsApp İstatistikleri */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MessageCircle className="h-5 w-5 text-green-500 mr-2" />
              <h3 className="text-lg font-medium">WhatsApp</h3>
            </div>
            <div className={`flex items-center ${messageStats.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {messageStats.growth >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
              {Math.abs(messageStats.growth)}%
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Toplam Mesaj</p>
              <p className="text-2xl font-semibold">{messageStats.total}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">İletilme Oranı</p>
              <p className="text-2xl font-semibold">
                {((messageStats.delivered / messageStats.total) * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Okunma Oranı</p>
              <p className="text-2xl font-semibold">
                {((messageStats.read / messageStats.delivered) * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Başarısız</p>
              <p className="text-2xl font-semibold text-red-500">{messageStats.failed}</p>
            </div>
          </div>
        </div>

        {/* E-posta İstatistikleri */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="text-lg font-medium">E-posta</h3>
            </div>
            <div className={`flex items-center ${emailStats.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {emailStats.growth >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
              {Math.abs(emailStats.growth)}%
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Toplam E-posta</p>
              <p className="text-2xl font-semibold">{emailStats.total}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Açılma Oranı</p>
              <p className="text-2xl font-semibold">
                {((emailStats.opened / emailStats.total) * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tıklanma Oranı</p>
              <p className="text-2xl font-semibold">
                {((emailStats.clicked / emailStats.opened) * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Geri Dönme</p>
              <p className="text-2xl font-semibold text-red-500">{emailStats.bounced}</p>
            </div>
          </div>
        </div>

        {/* Kişi İstatistikleri */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-purple-500 mr-2" />
              <h3 className="text-lg font-medium">Kişiler</h3>
            </div>
            <div className={`flex items-center ${contactStats.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {contactStats.growth >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
              {Math.abs(contactStats.growth)}%
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Toplam Kişi</p>
              <p className="text-2xl font-semibold">{contactStats.total}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Aktif Kişiler</p>
              <p className="text-2xl font-semibold">{contactStats.active}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Aktiflik Oranı</p>
              <p className="text-2xl font-semibold">
                {((contactStats.active / contactStats.total) * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">İnaktif</p>
              <p className="text-2xl font-semibold text-yellow-500">{contactStats.inactive}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Zaman Çizelgesi */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium mb-6">Mesaj Aktivitesi</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="whatsapp"
                  name="WhatsApp"
                  stackId="1"
                  stroke="#25D366"
                  fill="#25D366"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="email"
                  name="E-posta"
                  stackId="1"
                  stroke="#0088FE"
                  fill="#0088FE"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Kanal Dağılımı */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium mb-6">Kanal Dağılımı</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {channelDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* WhatsApp Mesaj Durumları */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium mb-6">WhatsApp Mesaj Durumları</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={messageStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#25D366" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* E-posta Durumları */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium mb-6">E-posta Durumları</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emailStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};