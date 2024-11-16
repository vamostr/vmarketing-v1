import React, { useState } from 'react';
import { CreditCard, Search, Filter, ArrowUp, ArrowDown, Download } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

// Örnek abonelik verileri
const mockSubscriptions = [
  {
    id: '1',
    userId: '1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    plan: 'pro',
    status: 'active',
    amount: 499,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    lastPayment: new Date('2024-03-01'),
    nextPayment: new Date('2024-04-01'),
    paymentMethod: 'credit_card',
    autoRenew: true,
  },
  {
    id: '2',
    userId: '2',
    userName: 'Jane Smith',
    userEmail: 'jane@example.com',
    plan: 'free',
    status: 'trial',
    amount: 0,
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-04-01'),
    lastPayment: null,
    nextPayment: new Date('2024-04-01'),
    paymentMethod: null,
    autoRenew: false,
  },
];

const planColors = {
  free: 'text-blue-700 bg-blue-50 border-blue-200',
  pro: 'text-yellow-700 bg-yellow-50 border-yellow-200',
  enterprise: 'text-purple-700 bg-purple-50 border-purple-200',
};

const statusColors = {
  active: 'text-green-700 bg-green-50 border-green-200',
  trial: 'text-orange-700 bg-orange-50 border-orange-200',
  expired: 'text-red-700 bg-red-50 border-red-200',
};

export const SubscriptionManagement: React.FC = () => {
  const [subscriptions] = useState(mockSubscriptions);
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const matchesSearch = 
      subscription.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPlan = planFilter === 'all' || subscription.plan === planFilter;
    const matchesStatus = statusFilter === 'all' || subscription.status === statusFilter;

    return matchesSearch && matchesPlan && matchesStatus;
  });

  // Toplam gelir hesaplama
  const totalRevenue = subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + s.amount, 0);

  // Aktif abonelik sayısı
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CreditCard className="h-6 w-6 text-blue-500 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Abonelik Yönetimi</h1>
          </div>
          <button
            onClick={() => {/* Excel export */}}
            className="btn btn-secondary inline-flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Excel'e Aktar
          </button>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Aylık Gelir</h3>
            <span className={`flex items-center text-sm ${
              totalRevenue > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {totalRevenue > 0 ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              %12.5
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {totalRevenue.toLocaleString('tr-TR')} ₺
          </p>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Aktif Abonelikler</h3>
            <span className="flex items-center text-sm text-green-600">
              <ArrowUp className="h-4 w-4 mr-1" />
              %8.3
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {activeSubscriptions}
          </p>
        </div>
      </div>

      {/* Filtreler */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Arama */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Kullanıcı adı veya e-posta ara..."
              className="input pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          {/* Plan Filtresi */}
          <div className="relative">
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="input pl-10 appearance-none"
            >
              <option value="all">Tüm Planlar</option>
              <option value="free">Ücretsiz Plan</option>
              <option value="pro">Pro Plan</option>
              <option value="enterprise">Kurumsal Plan</option>
            </select>
            <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          {/* Durum Filtresi */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input pl-10 appearance-none"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="active">Aktif</option>
              <option value="trial">Deneme</option>
              <option value="expired">Süresi Dolmuş</option>
            </select>
            <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Abonelik Listesi */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Başlangıç
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bitiş
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sonraki Ödeme
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubscriptions.map((subscription) => (
                <tr key={subscription.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {subscription.userName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {subscription.userEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${planColors[subscription.plan as keyof typeof planColors]}`}>
                      {subscription.plan === 'free' ? 'Ücretsiz' :
                       subscription.plan === 'pro' ? 'Pro' : 'Kurumsal'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[subscription.status as keyof typeof statusColors]}`}>
                      {subscription.status === 'active' ? 'Aktif' :
                       subscription.status === 'trial' ? 'Deneme' : 'Süresi Dolmuş'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {subscription.amount > 0 ? `${subscription.amount} ₺` : 'Ücretsiz'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(subscription.startDate), 'd MMM yyyy', { locale: tr })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(subscription.endDate), 'd MMM yyyy', { locale: tr })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {subscription.nextPayment ? (
                      <div>
                        <div className="text-sm text-gray-900">
                          {format(new Date(subscription.nextPayment), 'd MMM yyyy', { locale: tr })}
                        </div>
                        {subscription.autoRenew && (
                          <div className="text-xs text-green-600">Otomatik Yenileme Aktif</div>
                        )}
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