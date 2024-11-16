import React from 'react';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';

export const QRCodeChat: React.FC = () => {
  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            WhatsApp Web Bağlantısı Gerekli
          </h2>
          <p className="text-gray-600 mb-8">
            WhatsApp Web üzerinden mesajlaşmaya başlamak için önce QR kod ile bağlantı kurmanız gerekiyor.
          </p>
          <Link
            to="/settings"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Settings className="h-5 w-5 mr-2" />
            Ayarlara Git
          </Link>
        </div>
      </div>
    </div>
  );
};