import React, { useState } from 'react';
import { Bell, Plus, Edit2, Trash2, Send, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import toast from 'react-hot-toast';

// Örnek duyurular
const defaultAnnouncements = [
  {
    id: '1',
    title: 'Yeni Özellik: Toplu WhatsApp Mesajları',
    content: 'Artık tek seferde birden fazla kişiye WhatsApp mesajı gönderebilirsiniz.',
    type: 'feature',
    status: 'active',
    createdAt: new Date('2024-03-15'),
    sentTo: 'all',
  },
  {
    id: '2',
    title: 'Planlı Bakım Duyurusu',
    content: '20 Mart 2024 tarihinde 02:00-04:00 saatleri arasında sistem bakımda olacaktır.',
    type: 'maintenance',
    status: 'scheduled',
    createdAt: new Date('2024-03-16'),
    scheduledFor: new Date('2024-03-20'),
    sentTo: 'pro',
  },
];

const typeColors = {
  feature: 'text-green-700 bg-green-50 border-green-200',
  maintenance: 'text-orange-700 bg-orange-50 border-orange-200',
  update: 'text-blue-700 bg-blue-50 border-blue-200',
  alert: 'text-red-700 bg-red-50 border-red-200',
};

export const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState(defaultAnnouncements);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu duyuruyu silmek istediğinize emin misiniz?')) return;

    setIsProcessing(true);
    try {
      // API çağrısı burada yapılacak
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnnouncements(announcements.filter(a => a.id !== id));
      toast.success('Duyuru silindi');
    } catch (error) {
      toast.error('Duyuru silinemedi');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSend = async (id: string) => {
    setIsProcessing(true);
    try {
      // API çağrısı burada yapılacak
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Duyuru gönderildi');
    } catch (error) {
      toast.error('Duyuru gönderilemedi');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="h-6 w-6 text-blue-500 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Duyuru Yönetimi</h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Yeni Duyuru
          </button>
        </div>
      </div>

      {/* Duyuru Listesi */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duyuru
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tür
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hedef
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {announcements.map((announcement) => (
                <tr key={announcement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {announcement.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {announcement.content}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      typeColors[announcement.type as keyof typeof typeColors]
                    }`}>
                      {announcement.type === 'feature' ? 'Yeni Özellik' :
                       announcement.type === 'maintenance' ? 'Bakım' :
                       announcement.type === 'update' ? 'Güncelleme' : 'Uyarı'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      announcement.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {announcement.status === 'active' ? 'Aktif' : 'Planlandı'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(announcement.createdAt), 'd MMM yyyy', { locale: tr })}
                    {announcement.scheduledFor && (
                      <div className="text-xs">
                        Planlanan: {format(new Date(announcement.scheduledFor), 'd MMM yyyy', { locale: tr })}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {announcement.sentTo === 'all' ? 'Tüm Kullanıcılar' :
                       announcement.sentTo === 'pro' ? 'Pro Kullanıcılar' : 'Seçili Kullanıcılar'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleSend(announcement.id)}
                        disabled={isProcessing}
                        className="text-gray-400 hover:text-blue-600"
                        title="Gönder"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => console.log('Edit:', announcement.id)}
                        className="text-gray-400 hover:text-blue-600"
                        title="Düzenle"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(announcement.id)}
                        disabled={isProcessing}
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

      {/* Yeni Duyuru Modalı */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Yeni Duyuru</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Başlık
                </label>
                <input
                  type="text"
                  className="mt-1 input"
                  placeholder="Duyuru başlığı"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  İçerik
                </label>
                <textarea
                  rows={4}
                  className="mt-1 input"
                  placeholder="Duyuru içeriği"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tür
                  </label>
                  <select className="mt-1 input">
                    <option value="feature">Yeni Özellik</option>
                    <option value="maintenance">Bakım</option>
                    <option value="update">Güncelleme</option>
                    <option value="alert">Uyarı</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Hedef Kitle
                  </label>
                  <select className="mt-1 input">
                    <option value="all">Tüm Kullanıcılar</option>
                    <option value="pro">Pro Kullanıcılar</option>
                    <option value="selected">Seçili Kullanıcılar</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="schedule"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="schedule" className="ml-2 text-sm text-gray-700">
                  İleri tarihli gönderim
                </label>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                >
                  İptal
                </button>
                <button
                  onClick={() => {
                    // Kaydetme işlemi
                    setShowAddModal(false);
                  }}
                  className="btn btn-primary"
                >
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};