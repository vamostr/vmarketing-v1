import React, { useState } from 'react';
import { ChatInterface } from '../../components/whatsapp/ChatInterface';
import { Link } from 'react-router-dom';
import { Tab } from '@headlessui/react';
import { MessageCircle, QrCode, Settings } from 'lucide-react';
import { useWhatsAppStore } from '../../stores/whatsappStore';

export const WhatsAppManager: React.FC = () => {
  const { activeSession, credentials } = useWhatsAppStore();

  const tabs = [
    { name: 'WhatsApp Business API', icon: MessageCircle },
    { name: 'WhatsApp Web QR', icon: QrCode }
  ];

  const renderContent = (selectedIndex: number) => {
    // WhatsApp Business API seçiliyse
    if (selectedIndex === 0) {
      if (!credentials || !activeSession) {
        return (
          <div className="bg-white shadow-sm rounded-lg p-8 text-center">
            <div className="max-w-md mx-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                WhatsApp Business API Bağlantısı Gerekli
              </h2>
              <p className="text-gray-600 mb-6">
                Mesajlaşmaya başlamak için önce WhatsApp Business API bağlantısını kurmanız gerekiyor.
              </p>
              <Link
                to="/settings"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Settings className="h-5 w-5 mr-2" />
                WhatsApp Ayarlarına Git
              </Link>
            </div>
          </div>
        );
      }
      return <ChatInterface />;
    }
    
    // WhatsApp Web QR seçiliyse
    return (
      <div className="bg-white shadow-sm rounded-lg p-8 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            WhatsApp Web QR Bağlantısı
          </h2>
          <p className="text-gray-600 mb-6">
            WhatsApp Web üzerinden mesajlaşmak için QR kod ile bağlantı kurmanız gerekiyor.
          </p>
          <Link
            to="/settings"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Settings className="h-5 w-5 mr-2" />
            QR Kod Ayarlarına Git
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">WhatsApp Mesajlaşma</h1>
        <p className="mt-2 text-gray-600">
          WhatsApp mesajlarınızı yönetin ve geçmiş sohbetleri görüntüleyin
        </p>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-4 bg-white p-2 rounded-lg shadow-sm mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Tab
                key={tab.name}
                className={({ selected }) => `
                  flex-1 flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-md
                  focus:outline-none transition-all duration-200
                  ${selected 
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon className="h-5 w-5 mr-2" />
                {tab.name}
              </Tab>
            );
          })}
        </Tab.List>

        <Tab.Panels>
          {({ selectedIndex }) => renderContent(selectedIndex)}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};