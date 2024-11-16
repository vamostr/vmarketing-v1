import React, { useState } from 'react';
import { useAdminStore } from '../../stores/adminStore';
import { Shield, Plus, Edit2, Trash2, User, Key } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Role, Permission, AdminUser } from '../../types/admin';

export const Permissions: React.FC = () => {
  const {
    roles,
    permissions,
    adminUsers,
    createRole,
    updateRole,
    deleteRole,
    assignPermissionsToRole,
    createAdminUser,
    updateAdminUser,
    deleteAdminUser,
    isLoading
  } = useAdminStore();

  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const handleDeleteRole = async (id: string) => {
    if (!window.confirm('Bu rolü silmek istediğinize emin misiniz?')) return;
    try {
      await deleteRole(id);
    } catch (error) {
      console.error('Rol silinemedi:', error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Bu yetkiliyi silmek istediğinize emin misiniz?')) return;
    try {
      await deleteAdminUser(id);
    } catch (error) {
      console.error('Yetkili silinemedi:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-blue-500 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Yetki Yönetimi</h1>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowAddRoleModal(true)}
              className="btn btn-secondary inline-flex items-center"
            >
              <Key className="h-4 w-4 mr-2" />
              Yeni Rol
            </button>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="btn btn-primary inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Yeni Yetkili
            </button>
          </div>
        </div>
      </div>

      {/* Yetkililer Tablosu */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-medium text-gray-900">Yetkililer</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yetkili
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Son Giriş
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kayıt Tarihi
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {adminUsers?.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {admin.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {admin.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {admin.role.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      admin.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : admin.status === 'inactive'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {admin.status === 'active' ? 'Aktif' :
                       admin.status === 'inactive' ? 'İnaktif' : 'Askıda'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {admin.lastLogin
                      ? format(new Date(admin.lastLogin), 'd MMM yyyy HH:mm', { locale: tr })
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(admin.createdAt), 'd MMM yyyy', { locale: tr })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(admin);
                          setShowAddUserModal(true);
                        }}
                        className="text-gray-400 hover:text-blue-600"
                        title="Düzenle"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(admin.id)}
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

      {/* Roller ve İzinler */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-medium text-gray-900">Roller ve İzinler</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Açıklama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İzinler
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {roles?.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {role.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {role.description}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((permission) => (
                        <span
                          key={permission.id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {permission.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedRole(role);
                          setShowAddRoleModal(true);
                        }}
                        className="text-gray-400 hover:text-blue-600"
                        title="Düzenle"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRole(role.id)}
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

      {/* Yeni Rol Modalı */}
      {showAddRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {selectedRole ? 'Rolü Düzenle' : 'Yeni Rol'}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              // Form submit işlemi
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Rol Adı
                  </label>
                  <input
                    type="text"
                    className="mt-1 input"
                    placeholder="Rol adı"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Açıklama
                  </label>
                  <textarea
                    className="mt-1 input"
                    rows={3}
                    placeholder="Rol açıklaması"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    İzinler
                  </label>
                  <div className="mt-2 space-y-2">
                    {permissions?.map((permission) => (
                      <label
                        key={permission.id}
                        className="inline-flex items-center"
                      >
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          defaultChecked={selectedRole?.permissions.some(
                            p => p.id === permission.id
                          )}
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {permission.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddRoleModal(false);
                      setSelectedRole(null);
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
                    {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Yeni Yetkili Modalı */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {selectedUser ? 'Yetkiliyi Düzenle' : 'Yeni Yetkili'}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              // Form submit işlemi
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    className="mt-1 input"
                    placeholder="Ad soyad"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    E-posta
                  </label>
                  <input
                    type="email"
                    className="mt-1 input"
                    placeholder="E-posta adresi"
                  />
                </div>

                {!selectedUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Şifre
                    </label>
                    <input
                      type="password"
                      className="mt-1 input"
                      placeholder="Şifre"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Rol
                  </label>
                  <select className="mt-1 input">
                    <option value="">Rol seçin</option>
                    {roles?.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Durum
                  </label>
                  <select className="mt-1 input">
                    <option value="active">Aktif</option>
                    <option value="inactive">İnaktif</option>
                    <option value="suspended">Askıda</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddUserModal(false);
                      setSelectedUser(null);
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
                    {isLoading ? 'Ka ydediliyor...' : 'Kaydet'}
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