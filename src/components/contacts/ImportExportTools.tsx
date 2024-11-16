import React, { useRef, useState } from 'react';
import { useContactStore } from '../../stores/contactStore';
import { Upload, Download, FileText, AlertCircle, CheckCircle } from 'lucide-react';

export const ImportExportTools: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { importContacts, exportContacts, isLoading } = useContactStore();
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await importContacts(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    const csvContent = `Ad Soyad,Telefon,E-posta,Şirket,Notlar
John Doe,+905321234567,john@example.com,ABC Şirketi,VIP Müşteri
Jane Smith,+905551234567,jane@example.com,XYZ Ltd,Potansiyel Müşteri`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'kisi-listesi-sablonu.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-4">
      <h3 className="text-lg font-medium mb-4">İçe/Dışa Aktar</h3>

      <div className="space-y-3">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="w-full btn btn-secondary flex items-center justify-center"
          >
            <Upload className="h-4 w-4 mr-2" />
            CSV İçe Aktar
          </button>
        </div>

        <button
          onClick={() => exportContacts('csv')}
          className="w-full btn btn-secondary flex items-center justify-center"
        >
          <Download className="h-4 w-4 mr-2" />
          CSV Dışa Aktar
        </button>

        <div className="border-t pt-3">
          <button
            onClick={() => setShowTemplateModal(true)}
            className="w-full text-blue-600 hover:text-blue-700 text-sm flex items-center justify-center"
          >
            <FileText className="h-4 w-4 mr-2" />
            İçe Aktarma Şablonu
          </button>
        </div>
      </div>

      {/* Şablon Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-medium mb-4">CSV İçe Aktarma Şablonu</h3>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">
                      Önemli Bilgiler
                    </h4>
                    <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
                      <li>CSV dosyanız UTF-8 formatında olmalıdır</li>
                      <li>İlk satır sütun başlıklarını içermelidir</li>
                      <li>Telefon numaraları +90 ile başlamalıdır</li>
                      <li>E-posta adresleri geçerli formatta olmalıdır</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Gerekli Sütunlar
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">Ad Soyad</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">Telefon</span>
                  </div>
                </div>

                <h4 className="text-sm font-medium text-gray-700 mt-4 mb-2">
                  Opsiyonel Sütunlar
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600">E-posta</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600">Şirket</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600">Notlar</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={downloadTemplate}
                  className="btn btn-primary flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Örnek Şablonu İndir
                </button>

                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="btn btn-secondary"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};