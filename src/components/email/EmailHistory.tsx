import React, { useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  Mail,
  Search,
  Calendar,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  RefreshCw,
  Download,
} from 'lucide-react';

// Örnek e-posta geçmişi
const defaultEmails = [
  {
    id: '1',
    subject: 'Mart Ayı Kampanyası',
    recipients: ['john@example.com', 'jane@example.com', 'bob@example.com'],
    sentAt: new Date('2024-03-15T10:30:00'),
    status: 'delivered',
    openRate: 85,
    clickRate: 45,
    template: 'Kampanya Duyurusu',
    type: 'bulk',
  },
  {
    id: '2',
    subject: 'Hoş Geldiniz!',
    recipients: ['alice@example.com'],
    sentAt: new Date('2024-03-14T15:20:00'),
    status: 'opened',
    openRate: 100,
    clickRate: 100,
    template: 'Hoş Geldin E-postası',
    type: 'single',
  },
  {
    id: '3',
    subject: 'Özel Teklif',
    recipients: ['mark@example.com', 'sarah@example.com'],
    sentAt: new Date('2024-03-13T09:15:00'),
    status: 'failed',
    error: 'Invalid email address',
    type: 'bulk',
  },
];

const statusColors = {
  delivered: 'text-green-700 bg-green-50 border-green-200',
  opened: 'text-blue-700 bg-blue-50 border-blue-200',
  failed: 'text-red-700 bg-red-50 border-red-200',
  pending: 'text-yellow-700 bg-yellow-50 border-yellow-200',
};

const statusIcons = {
  delivered: CheckCircle,
  opened: Eye,
  failed: XCircle,
  pending: RefreshCw,
};

export const EmailHistory: React.FC = () => {
  const [emails] = useState(defaultEmails);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('7');

  const filteredEmails = emails.filter(email => {
    const matchesSearch = email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.recipients.some(r => r.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || email.status === statusFilter;
    const matchesType = typeFilter === 'all' || email.type === typeFilter;
    const emailDate = new Date(email.sentAt);
    const daysAgo = (new Date().getTime() - emailDate.getTime()) / (1000 * 3600 * 24);
    const matchesDate = parseInt(dateRange) === 0 || daysAgo <= parseInt(dateRange);

    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  const getStatusBadge = (status: string) => {
    const StatusIcon = statusIcons[status as keyof typeof statusIcons];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[status as keyof typeof statusColors]}`}>
        <StatusIcon className="w-3 h-3 mr-1" />
        {status === 'delivered' ? 'İletildi' :
         status === 'opened' ? 'Açıldı' :
         status === 'failed' ? 'Başarısız' : 'Beklemede'}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-900">E-posta Geçmişi</h2>
          <p className="text-sm text-gray-500">
            Gönderilen e-postaları görüntüleyin ve analiz edin
          </p>
        </div>
        <button
          onClick={() => {/* Excel export işlemi */}}
          className="btn btn-secondary inline-flex items-center"
        >
          <Download className="h-4 w-4 mr-2" />
          Excel'e Aktar
        </button>
      </div>

      {/* Filtreler */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Arama */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Konu veya alıcı ara..."
              className="input pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          {/* Durum Filtresi */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input pl-10 appearance-none"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="delivered">İletildi</option>
              <option value="opened">Açıldı</option>
              <option value="failed">Başarısız</option>
              <option value="pending">Beklemede</option>
            </select>
            <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          {/* Tür Filtresi */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input pl-10 appearance-none"
            >
              <option value="all">Tüm Türler</option>
              <option value="single">Tekli E-posta</option>
              <option value="bulk">Toplu E-posta</option>
            </select>
            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          {/* Tarih Filtresi */}
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="input pl-10 appearance-none"
            >
              <option value="7">Son 7 gün</option>
              <option value="30">Son 30 gün</option>
              <option value="90">Son 90 gün</option>
              <option value="0">Tüm zamanlar</option>
            </select>
            <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* E-posta Listesi */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Konu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alıcılar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gönderim Tarihi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Açılma Oranı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tıklanma Oranı
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmails.map((email) => (
                <tr key={email.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {email.type === 'bulk' ? (
                          <Users className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Mail className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {email.subject}
                        </div>
                        {email.template && (
                          <div className="text-sm text-gray-500">
                            Şablon: {email.template}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {email.recipients.length > 1
                        ? `${email.recipients[0]} +${email.recipients.length - 1}`
                        : email.recipients[0]}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {format(new Date(email.sentAt), 'dd MMM yyyy HH:mm', { locale: tr })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(email.status)}
                    {email.error && (
                      <div className="mt-1 flex items-center text-xs text-red-600">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {email.error}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {email.openRate !== undefined ? (
                      <div className="flex items-center">
                        <div className="relative w-16 h-2 bg-gray-200 rounded-full">
                          <div
                            className="absolute left-0 top-0 h-2 bg-green-500 rounded-full"
                            style={{ width: `${email.openRate}%` }}
                          />
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {email.openRate}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {email.clickRate !== undefined ? (
                      <div className="flex items-center">
                        <div className="relative w-16 h-2 bg-gray-200 rounded-full">
                          <div
                            className="absolute left-0 top-0 h-2 bg-blue-500 rounded-full"
                            style={{ width: `${email.clickRate}%` }}
                          />
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {email.clickRate}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};