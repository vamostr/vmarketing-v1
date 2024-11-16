import React, { useState } from 'react';
import { useAdminStore } from '../../stores/adminStore';
import { Building2, Plus, Edit2, Trash2, Users, Link as LinkIcon } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Organization } from '../../types/admin';

export const OrganizationManagement: React.FC = () => {
  const {
    organizations,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    addOrganizationMember,
    removeOrganizationMember,
    isLoading
  } = useAdminStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [view, setView] = useState<'grid' | 'table'>('table');

  const handleDeleteOrganization = async (id: string) => {
    if (!window.confirm('Bu organizasyonu silmek istediğinize emin misiniz?')) return;
    
    try {
      await deleteOrganization(id);
    } catch (error) {
      console.error('Organizasyon silinemedi:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Building2 className="h-6 w-6 text-blue-500 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Ekipler & Firmalar</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setView('grid')}
                className={`px-3 py-1 rounded-md ${
                  view === 'grid'
                    ? 'bg-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setView('table')}
                className={`px-3 py-1 rounded-md ${
                  view === 'table'
                    ? 'bg-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Tablo
              </button>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Yeni Ekle
            </button>
          </div>
        </div>
      </div>

      {/* Filtreler */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tür</label>
            <select className="mt-1 input">
              <option value="all">Tümü</option>
              <option value="team">Ekipler</option>
              <option value="company">Firmalar</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Durum</label>
            <select className="mt-1 input">
              <option value="all">Tümü</option>
              <option value="active">Aktif</option>
              <option value="inactive">İnaktif</option>
              <option value="suspended">Askıda</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sıralama</label>
            <select className="mt-1 input">
              <option value="name">İsim</option>
              <option value="created">Oluşturma Tarihi</option>
              <option value="members">Üye Sayısı</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Arama</label>
            <input
              type="text"
              placeholder="İsim veya açıklama ara..."
              className="mt-1 input"
            />
          </div>
        </div>
      </div>

      {/* Organizasyon Listesi */}
      {view === 'table' ? (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organizasyon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tür
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Üyeler
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Oluşturulma
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {organizations.map((org) => (
                  <tr key={org.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {org.logo ? (
                          <img
                            src={org.logo}
                            alt={org.name}
                            className="h-10 w-10 rounded-lg"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-gray-500" />
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {org.name}
                          </div>
                          {org.description && (
                            <div className="text-sm text-gray-500">
                              {org.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        org.type === 'team'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {org.type === 'team' ? 'Ekip' : 'Firma'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex -space-x-2">
                          {org.members.slice(0, 3).map((member, index) => (
                            <div
                              key={member.id}
                              className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center"
                              style={{ zIndex: 3 - index }}
                            >
                              {member.userId[0].toUpperCase()}
                            </div>
                          ))}
                        </div>
                        {org.members.length > 3 && (
                          <div className="ml-2 text-sm text-gray-500">
                            +{org.members.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        org.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : org.status === 'inactive'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {org.status === 'active' ? 'Aktif' :
                         org.status === 'inactive' ? 'İnaktif' : 'Askıda'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(org.createdAt), 'd MMM yyyy', { locale: tr })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedOrganization(org);
                            setShowMemberModal(true);
                          }}
                          className="text-gray-400 hover:text-blue-600"
                          title="Üye Ekle"
                        >
                          <Users className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrganization(org);
                            // Düzenleme modalını aç
                          }}
                          className="text-gray-400 hover:text-blue-600"
                          title="Düzenle"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrganization(org.id)}
                          className="text-gray-400 hover:text-red-600"
                          title="Sil"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org) => (
            <div
              key={org.id}
              className="bg-white shadow-sm rounded-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {org.logo ? (
                      <img
                        src={org.logo}
                        alt={org.name}
                        className="h-10 w-10 rounded-lg"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-gray-500" />
                      </div>
                    )}
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {org.name}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        org.type === 'team'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {org.type === 'team' ? 'Ekip' : 'Firma'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedOrganization(org);
                        setShowMemberModal(true);
                      }}
                      className="text-gray-400 hover:text-blue-600"
                      title="Üye Ekle"
                    >
                      <Users className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedOrganization(org);
                        // Düzenleme modalını aç
                      }}
                      className="text-gray-400 hover:text-blue-600"
                      title="Düzenle"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteOrganization(org.id)}
                      className="text-gray-400 hover:text-red-600"
                      title="Sil"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {org.description && (
                  <p className="text-sm text-gray-500 mb-4">{org.description}</p>
                )}

                <div className="space-y-4">
                  {/* Üyeler */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Üyeler</h4>
                    <div className="flex items-center">
                      <div className="flex -space-x-2">
                        {org.members.slice(0, 3).map((member, index) => (
                          <div
                            key={member.id}
                            className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center"
                            style={{ zIndex: 3 - index }}
                          >
                            {member.userId[0].toUpperCase()}
                          </div>
                        ))}
                      </div>
                      {org.members.length > 3 && (
                        <div className="ml-2 text-sm text-gray-500">
                          +{org.members.length - 3} kişi
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Detaylar */}
                  {org.type === 'company' && (
                    <div className="space-y-2">
                      {org.website && (
                        <div className="flex items-center text-sm">
                          <LinkIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <a
                            href={org.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            {org.website}
                          </a>
                        </div>
                      )}
                      {org.industry && (
                        <div className="flex items-center text-sm">
                          <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-600">{org.industry}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Oluşturulma</span>
                    <span>{format(new Date(org.createdAt), 'd MMM yyyy', { locale: tr })}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Yeni Organizasyon Modalı */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Yeni Organizasyon
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              // Form submit işlemi
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tür
                  </label>
                  <select className="mt-1 input">
                    <option value="team">Ekip</option>
                    <option value="company">Firma</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    İsim
                  </label>
                  <input
                    type="text"
                    className="mt-1 input"
                    placeholder="Organizasyon adı"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Açıklama
                  </label>
                  <textarea
                    className="mt-1 input"
                    rows={3}
                    placeholder="Organizasyon açıklaması"
                  />
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

      {/* Üye Ekleme Modalı */}
      {showMemberModal && selectedOrganization && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Üye Ekle - {selectedOrganization.name}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              // Form submit işlemi
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Kullanıcı
                  </label>
                  <select className="mt-1 input">
                    <option value="">Kullanıcı seçin</option>
                    {/* Kullanıcı listesi */}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Rol
                  </label>
                  <select className="mt-1 input">
                    <option value="member">Üye</option>
                    <option value="admin">Yönetici</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMemberModal(false);
                      setSelectedOrganization(null);
                    }}
                    className="btn btn-secondary"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Ekleniyor...' : 'Ekle'}
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