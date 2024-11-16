import React, { useState } from 'react';
import { Users, Mail, MessageCircle, Upload, Download, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const BulkOperations: React.FC = () => {
  const [selectedOperation, setSelectedOperation] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const operations = [
    {
      id: 'import_users',
      name: 'Toplu Kullanıcı İçe Aktar',
      icon: Upload,
      description: 'CSV dosyasından kullanıcıları içe aktarın',
      template: '/templates/users_import_template.csv',
    },
    {
      id: 'export_users',
      name: 'Kullanıcıları Dışa Aktar',
      icon: Download,
      description: 'Tüm kullanıcı verilerini dışa aktarın',
    },
    {
      id: 'bulk_email',
      name: 'Toplu E-posta',
      icon: Mail,
      description: 'Tüm kullanıcılara e-posta gönderin',
    },
    {
      id: 'bulk_whatsapp',
      name: 'Toplu WhatsApp',
      icon: MessageCircle,
      description: 'Tüm kullanıcılara WhatsApp mesajı gönderin',
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleProcess = async () => {
    setIsProcessing(true);
    try {
      // Simüle edilmiş işlem
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('İşlem başarıyla tamamlandı');
      setSelectedFile(null);
      setSelectedOperation('');
    } catch (error) {
      toast.error('İşlem sırasında bir hata oluştu');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center">
          <Users className="h-6 w-6 text-blue-500 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">Toplu İşlemler</h1>
        </div>
      </div>

      {/* İşlem Seçimi */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">İşlem Seçin</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {operations.map((operation) => {
            const Icon = operation.icon;
            const isSelected = selectedOperation === operation.id;

            return (
              <div
                key={operation.id}
                onClick={() => setSelectedOperation(operation.id)}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{operation.name}</h3>
                    <p className="text-sm text-gray-500">{operation.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* İşlem Detayları */}
      {selectedOperation && (
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">İşlem Detayları</h2>
          
          {selectedOperation === 'import_users' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="btn btn-secondary">
                      CSV Dosyası Seç
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    veya sürükleyip bırakın
                  </p>
                </div>
              </div>

              {selectedFile && (
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Upload className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium">{selectedFile.name}</span>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Kaldır
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between">
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-700"
                  onClick={(e) => {
                    e.preventDefault();
                    // Şablon indirme işlemi
                  }}
                >
                  İçe aktarma şablonunu indir
                </a>

                <button
                  onClick={handleProcess}
                  disabled={!selectedFile || isProcessing}
                  className="btn btn-primary inline-flex items-center"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      İşleniyor...
                    </>
                  ) : (
                    'İçe Aktar'
                  )}
                </button>
              </div>
            </div>
          )}

          {selectedOperation === 'bulk_email' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Konu
                </label>
                <input
                  type="text"
                  className="mt-1 input"
                  placeholder="E-posta konusu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  İçerik
                </label>
                <textarea
                  rows={6}
                  className="mt-1 input"
                  placeholder="E-posta içeriği"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="btn btn-primary inline-flex items-center"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Gönderiliyor...
                    </>
                  ) : (
                    'Toplu E-posta Gönder'
                  )}
                </button>
              </div>
            </div>
          )}

          {selectedOperation === 'bulk_whatsapp' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mesaj
                </label>
                <textarea
                  rows={4}
                  className="mt-1 input"
                  placeholder="WhatsApp mesajı"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="btn btn-primary inline-flex items-center"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Gönderiliyor...
                    </>
                  ) : (
                    'Toplu WhatsApp Gönder'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};