import React, { useState } from 'react';
import { useAdminStore } from '../../stores/adminStore';
import { DollarSign, Users, CreditCard, Plus, Edit2, Trash2, CheckCircle, XCircle, ArrowUp } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import toast from 'react-hot-toast';

const statusColors = {
  active: 'text-green-700 bg-green-50 border-green-200',
  pending: 'text-yellow-700 bg-yellow-50 border-yellow-200',
  rejected: 'text-red-700 bg-red-50 border-red-200',
  suspended: 'text-gray-700 bg-gray-50 border-gray-200',
};

export const AffiliateManagement: React.FC = () => {
  const {
    affiliatePrograms,
    affiliateReferrals,
    affiliatePayments,
    createAffiliateProgram,
    updateAffiliateProgram,
    deleteAffiliateProgram,
    approveReferral,
    rejectReferral,
    processPayment,
    isLoading,
  } = useAdminStore();

  const [activeTab, setActiveTab] = useState<'programs' | 'referrals' | 'payments'>('programs');
  const [showAddModal, setShowAddModal] = useState(false);

  // Toplam kazanç hesaplama
  const totalEarnings = affiliatePrograms.reduce((sum, program) => sum + program.totalEarnings, 0);
  const pendingPayments = affiliatePayments.filter(p => p.status === 'pending').length;

  const handleDeleteProgram = async (id: string) => {
    if (!window.confirm('Bu programı silmek istediğinize emin misiniz?')) return;
    try {
      await deleteAffiliateProgram(id);
    } catch (error) {
      console.error('Program silinemedi:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <DollarSign className="h-6 w-6 text-blue-500 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Gelir Ortaklığı Yönetimi</h1>
          </div>
          {activeTab === 'programs' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Yeni Program
            </button>
          )}
        </div>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Toplam Kazanç</h3>
            <span className="flex items-center text-sm text-green-600">
              <ArrowUp className="h-4 w-4 mr-1" />
              %12.5
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {totalEarnings.toLocaleString('tr-TR')} ₺
          </p>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Aktif Ortaklar</h3>
            <span className="flex items-center text-sm text-green-600">
              <ArrowUp className="h-4 w-4 mr-1" />
              %8.3
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {affiliatePrograms.filter(p => p.status === 'active').length}
          </p>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Bekleyen Ödemeler</h3>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{pendingPayments}</p>
        </div>
      </div>

      {/* Sekmeler */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('programs')}
              className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                activeTab === 'programs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <DollarSign className="h-5 w-5 mr-2" />
              Programlar
            </button>

            <button
              onClick={() => setActiveTab('referrals')}
              className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                activeTab === 'referrals'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="h-5 w-5 mr-2" />
              Referanslar
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                activeTab === 'payments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Ödemeler
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Programlar */}
          {activeTab === 'programs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {affiliatePrograms.map(program => (
                <div
                  key={program.id}
                  className="bg-white border rounded-lg overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {program.company.name}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          statusColors[program.status as keyof typeof statusColors]
                        }`}>
                          {program.status === 'active' ? 'Aktif' :
                           program.status === 'pending' ? 'Beklemede' :
                           program.status === 'rejected' ? 'Reddedildi' : 'Askıda'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            // Düzenleme modalını aç
                          }}
                          className="text-gray-400 hover:text-blue-600"
                          title="Düzenle"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProgram(program.id)}
                          className="text-gray-400 hover:text-red-600"
                          title="Sil"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Komisyon Oranı</span>
                        <span className="font-medium">%{program.rate}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Toplam Kazanç</span>
                        <span className="font-medium">{program.totalEarnings.toLocaleString('tr-TR')} ₺</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Minimum Ödeme</span>
                        <span className="font-medium">{program.minimumPayout.toLocaleString('tr-TR')} ₺</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Referans Kodu</span>
                        <code className="font-mono bg-gray-100 px-2 py-1 rounded">
                          {program.code}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Referanslar */}
          {activeTab === 'referrals' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kullanıcı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Program
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Komisyon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {affiliateReferrals.map(referral => (
                    <tr key={referral.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {referral.referredUser.name[0]}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {referral.referredUser.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {referral.referredUser.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {referral.program.company.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {referral.subscriptionPlan}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          referral.status === 'approved'
                            ? 'text-green-700 bg-green-50 border-green-200'
                            : referral.status === 'pending'
                            ? 'text-yellow-700 bg-yellow-50 border-yellow-200'
                            : 'text-red-700 bg-red-50 border-red-200'
                        }`}>
                          {referral.status === 'approved' ? 'Onaylandı' :
                           referral.status === 'pending' ? 'Beklemede' : 'Reddedildi'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {referral.commission.toLocaleString('tr-TR')} ₺
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(referral.createdAt), 'd MMM yyyy', { locale: tr })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {referral.status === 'pending' && (
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => approveReferral(referral.id)}
                              className="text-green-600 hover:text-green-700"
                              title="Onayla"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => rejectReferral(referral.id)}
                              className="text-red-600 hover:text-red-700"
                              title="Reddet"
                            >
                              <XCircle className="h-5 w-5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Ödemeler */}
          {activeTab === 'payments' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Program
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tutar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ödeme Yöntemi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Talep Tarihi
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {affiliatePayments.map(payment => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.program.company.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.amount.toLocaleString('tr-TR')} ₺
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          payment.status === 'completed'
                            ? 'text-green-700 bg-green-50 border-green-200'
                            : payment.status === 'pending'
                            ? 'text-yellow-700 bg-yellow-50 border-yellow-200'
                            : payment.status === 'processing'
                            ? 'text-blue-700 bg-blue-50 border-blue-200'
                            : 'text-red-700 bg-red-50 border-red-200'
                        }`}>
                          {payment.status === 'completed' ? 'Tamamlandı' :
                           payment.status === 'pending' ? 'Beklemede' :
                           payment.status === 'processing' ? 'İşleniyor' : 'Başarısız'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {payment.method === 'bank' ? 'Banka Transferi' : 'PayPal'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {payment.method === 'bank'
                            ? payment.details.bankName
                            : payment.details.paypalEmail}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(payment.requestedAt), 'd MMM yyyy', { locale: tr })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {payment.status === 'pending' && (
                          <button
                            onClick={() => processPayment(payment.id)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            İşleme Al
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Yeni Program Modalı */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Yeni Gelir Ortaklığı Programı</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              // Form submit işlemi
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Firma
                  </label>
                  <select className="mt-1 input">
                    <option value="">Firma seçin</option>
                    {/* Firma listesi */}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Komisyon Oranı (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    className="mt-1 input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Minimum Ödeme Tutarı (₺)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    className="mt-1 input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ödeme Yöntemi
                  </label>
                  <select className="mt-1 input">
                    <option value="bank">Banka Transferi</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn btn-secondary"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Oluşturuluyor...' : 'Oluştur'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};