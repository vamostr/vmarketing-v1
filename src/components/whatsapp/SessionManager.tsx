import React from 'react';
import { useWhatsAppStore } from '../../stores/whatsappStore';
import { MessageCircle, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export const SessionManager: React.FC = () => {
  const { 
    sessions, 
    activeSession,
    refreshBusinessToken,
    setActiveSession,
  } = useWhatsAppStore();

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'expired':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <RefreshCw className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <MessageCircle className="h-6 w-6 text-blue-500 mr-2" />
          <h2 className="text-xl font-semibold">WhatsApp Oturum Durumu</h2>
        </div>
      </div>

      {sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.map(session => {
            const isActive = activeSession?.id === session.id;
            const statusColor = getStatusBadgeColor(session.status);
            const StatusIcon = () => getStatusIcon(session.status);

            return (
              <div
                key={session.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'
                }`}
                onClick={() => setActiveSession(session)}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <StatusIcon />
                    <span className="font-medium">WhatsApp Business API</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${statusColor}`}>
                    {session.status === 'active' ? 'Aktif' : 
                     session.status === 'expired' ? 'Süresi Dolmuş' : 'Beklemede'}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <p>Telefon Numarası ID: {session.phoneNumberId}</p>
                  <p>Business Account ID: {session.businessAccountId}</p>
                  {session.expiresAt && (
                    <p>Geçerlilik: {format(new Date(session.expiresAt), 'd MMMM yyyy HH:mm', { locale: tr })}</p>
                  )}
                </div>

                {session.status === 'active' && (
                  <div className="mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        refreshBusinessToken();
                      }}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Token Yenile
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aktif WhatsApp Oturumu Yok
          </h3>
          <p className="text-gray-600 mb-4">
            WhatsApp Business API bağlantısı kurmak için ayarlar sayfasından gerekli bilgileri girin.
          </p>
        </div>
      )}
    </div>
  );
};