import React, { useState } from 'react';
import { useAdminStore } from '../../stores/adminStore';
import { Users2, Plus, Edit2, Trash2, UserPlus, UserMinus } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import toast from 'react-hot-toast';

export const TeamManagement: React.FC = () => {
  const {
    teams,
    createTeam,
    updateTeam,
    deleteTeam,
    addTeamMember,
    removeTeamMember,
    isLoading
  } = useAdminStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const handleDeleteTeam = async (id: string) => {
    if (!window.confirm('Bu ekibi silmek istediğinize emin misiniz?')) return;
    
    try {
      await deleteTeam(id);
    } catch (error) {
      console.error('Ekip silinemedi:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Users2 className="h-6 w-6 text-blue-500 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Ekip Yönetimi</h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Yeni Ekip
          </button>
        </div>
      </div>

      {/* Ekip Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map(team => (
          <div
            key={team.id}
            className="bg-white shadow-sm rounded-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">{team.name}</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedTeam(team.id);
                      setShowMemberModal(true);
                    }}
                    className="text-gray-400 hover:text-blue-600"
                    title="Üye Ekle"
                  >
                    <UserPlus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTeam(team.id);
                      // Düzenleme modalını aç
                    }}
                    className="text-gray-400 hover:text-blue-600"
                    title="Düzenle"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTeam(team.id)}
                    className="text-gray-400 hover:text-red-600"
                    title="Sil"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {team.description && (
                <p className="text-sm text-gray-500 mb-4">{team.description}</p>
              )}

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Üyeler</h4>
                <div className="space-y-2">
                  {team.members.map(member => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {member.user.name[0]}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {member.user.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {member.role === 'admin' ? 'Yönetici' : 'Üye'}
                          </p>
                        </div>
                      </div>
                      {member.role !== 'admin' && (
                        <button
                          onClick={() => removeTeamMember(team.id, member.user.id)}
                          className="text-gray-400 hover:text-red-600"
                          title="Üyeyi Çıkar"
                        >
                          <UserMinus className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                Oluşturulma: {format(new Date(team.createdAt), 'd MMM yyyy', { locale: tr })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Yeni Ekip Modalı */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Yeni Ekip</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              // Form submit işlemi
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ekip Adı
                  </label>
                  <input
                    type="text"
                    className="mt-1 input"
                    placeholder="Ekip adı"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Açıklama
                  </label>
                  <textarea
                    className="mt-1 input"
                    rows={3}
                    placeholder="Ekip açıklaması"
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
      {showMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Üye Ekle</h2>
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
                    onClick={() => setShowMemberModal(false)}
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