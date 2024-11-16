import React from 'react';
import { Activity, Server, Database, Globe, RefreshCw, AlertCircle } from 'lucide-react';

// Örnek sistem durumu verileri
const services = [
  {
    name: 'WhatsApp API',
    status: 'operational',
    uptime: '99.9%',
    responseTime: '120ms',
    lastIncident: null,
  },
  {
    name: 'E-posta Servisi',
    status: 'degraded',
    uptime: '98.5%',
    responseTime: '450ms',
    lastIncident: new Date('2024-03-15'),
  },
  {
    name: 'Veritabanı',
    status: 'operational',
    uptime: '99.99%',
    responseTime: '50ms',
    lastIncident: null,
  },
  {
    name: 'Web Sunucusu',
    status: 'operational',
    uptime: '99.8%',
    responseTime: '180ms',
    lastIncident: null,
  },
];

const metrics = [
  {
    name: 'CPU Kullanımı',
    value: '45%',
    trend: 'stable',
  },
  {
    name: 'RAM Kullanımı',
    value: '65%',
    trend: 'increasing',
  },
  {
    name: 'Disk Kullanımı',
    value: '72%',
    trend: 'stable',
  },
  {
    name: 'Aktif Bağlantılar',
    value: '1,250',
    trend: 'decreasing',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'operational':
      return 'text-green-700 bg-green-50 border-green-200';
    case 'degraded':
      return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    default:
      return 'text-red-700 bg-red-50 border-red-200';
  }
};

const getTrendColor = (trend: string) => {
  switch (trend) {
    case 'increasing':
      return 'text-red-600';
    case 'decreasing':
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
};

export const SystemStatus: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="h-6 w-6 text-blue-500 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Sistem Durumu</h1>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-secondary inline-flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Yenile
          </button>
        </div>
      </div>

      {/* Servis Durumları */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Servis Durumları</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <div
              key={service.name}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {service.name === 'WhatsApp API' && <Globe className="h-5 w-5 text-gray-400 mr-2" />}
                  {service.name === 'E-posta Servisi' && <Server className="h-5 w-5 text-gray-400 mr-2" />}
                  {service.name === 'Veritabanı' && <Database className="h-5 w-5 text-gray-400 mr-2" />}
                  {service.name === 'Web Sunucusu' && <Globe className="h-5 w-5 text-gray-400 mr-2" />}
                  <h3 className="font-medium text-gray-900">{service.name}</h3>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(service.status)}`}>
                  {service.status === 'operational' ? 'Aktif' :
                   service.status === 'degraded' ? 'Yavaş' : 'Kapalı'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Uptime</p>
                  <p className="font-medium">{service.uptime}</p>
                </div>
                <div>
                  <p className="text-gray-500">Yanıt Süresi</p>
                  <p className="font-medium">{service.responseTime}</p>
                </div>
              </div>
              {service.lastIncident && (
                <div className="mt-4 flex items-center text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Son olay: {new Date(service.lastIncident).toLocaleDateString('tr-TR')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sistem Metrikleri */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Sistem Metrikleri</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric) => (
            <div
              key={metric.name}
              className="border rounded-lg p-4"
            >
              <h3 className="text-sm font-medium text-gray-500">{metric.name}</h3>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
                <span className={`flex items-center text-sm ${getTrendColor(metric.trend)}`}>
                  {metric.trend === 'increasing' && '↑'}
                  {metric.trend === 'decreasing' && '↓'}
                  {metric.trend === 'stable' && '→'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Canlı Log */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Sistem Logları</h2>
        <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300 h-64 overflow-y-auto">
          <div className="space-y-2">
            <p>[2024-03-18 15:45:23] INFO: Yeni kullanıcı kaydı oluşturuldu (ID: 12345)</p>
            <p>[2024-03-18 15:44:12] WARN: E-posta gönderim gecikmesi tespit edildi</p>
            <p>[2024-03-18 15:43:01] INFO: WhatsApp API bağlantısı yenilendi</p>
            <p>[2024-03-18 15:42:55] ERROR: Veritabanı bağlantı hatası - otomatik yeniden bağlanıldı</p>
            <p>[2024-03-18 15:41:30] INFO: Sistem yedeklemesi tamamlandı</p>
          </div>
        </div>
      </div>
    </div>
  );
};