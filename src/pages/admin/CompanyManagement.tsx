import React, { useState } from 'react';
import { useAdminStore } from '../../stores/adminStore';
import { Building2, Plus, Edit2, Trash2, Link as LinkIcon } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import toast from 'react-hot-toast';

export const CompanyManagement: React.FC = () => {
  const {
    companies,
    createCompany,
    updateCompany,
    deleteCompany,
    isLoading
  } = useAdminStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  const handleDeleteCompany = async (id: string) => {
    if (!window.confirm('Bu firmayı silmek istediğinize emin misiniz?')) return;
    
    try {
      await deleteCompany(id);
    } catch (error) {
      console.error('Firma silinemedi:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Building2 className="h-6 w-6 text-blue-500 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Firma Yönetimi</h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Yeni Firma
          </button>
        </div>
      </div>

      {/* Firma Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map(company => (
          <div
            key={company.id}
            className="bg-white shadow-sm rounded-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-gray-500" />
                    </div>
                  )}
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      {company.name}
                    </h3>
                    {company.industry && (
                      <p className="text-sm text-gray-500">{company.industry}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedCompany(company.id);
                      // Düzenleme modalını aç
                    }}
                    className="text-gray-400 hover:text-blue-600"
                    title="Düzenle"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCompany(company.id)}
                    className="text-gray-400 hover:text-red-600"
                    title="Sil"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {company.description && (
                <p className="text-sm text-gray-500 mb-4">{company.description}</p>
              )}

              <div className="space-y-2">
                {company.website && (
                  <div className="flex items-center text-sm">
                    <LinkIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {company.website}
                    </a>
                  </div>
                )}

                <div className="flex items-center text-sm">
                  <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">
                    {company.size === 'small' ? 'Küçük İşletme' :
                     company.size === 'medium' ? 'Orta Ölçekli' :
                     company.size === 'large' ? 'Büyük İşletme' : 'Kurumsal'}
                  </span>
                </div>
              </div>

              {company.affiliateCode && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-700">
                    Gelir Ortaklığı Kodu: {company.affiliateCode}
                  </p>
                  <p className="text-xs text-blue-600">
                    Komisyon Oranı: %{company.affiliateRate}
                  </p>
                </div>
              )}

              <div className="mt-4 text-xs text-gray-500">
                Kayıt: {format(new Date(company.createdAt), 'd MMM yyyy', { locale: tr })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Yeni Firma Modalı */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Yeni Firma</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              // Form submit işlemi
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Firma Adı
                  </label>
                  <input
                    type="text"
                    className="mt-1 input"
                    placeholder="Firma adı"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Açıklama
                  </label>
                  <textarea
                    className="mt-1 input"
                    rows={3}
                    placeholder="Firma açıklaması"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Website
                  </label>
                  <input
                    type="url"
                    className="mt-1 input"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Sektör
                  </label>
                  <input
                    type="text"
                    className="mt-1 input"
                    placeholder="Firma sektörü"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Büyüklük
                  </label>
                  <select className="mt-1 input">
                    <option value="small">Küçük İşletme</option>
                    <option value="medium">Orta Ölçekli</option>
                    <option value="large">Büyük İşletme</option>
                    <option value="enterprise">Kurumsal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Logo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-1 input"
                  />
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