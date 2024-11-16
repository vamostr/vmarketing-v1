import React from 'react';
import { Tab } from '@headlessui/react';
import { Mail, Users, History, FileText } from 'lucide-react';
import { SingleEmail, BulkEmail, EmailTemplates, EmailHistory } from '../../components/email';

export const EmailCampaigns: React.FC = () => {
  const tabs = [
    { name: 'Tekli E-posta', icon: Mail, component: SingleEmail },
    { name: 'Toplu E-posta', icon: Users, component: BulkEmail },
    { name: 'Şablonlar', icon: FileText, component: EmailTemplates },
    { name: 'Geçmiş', icon: History, component: EmailHistory },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">E-posta Kampanyaları</h1>
        <p className="mt-2 text-gray-600">
          Tekli veya toplu e-posta gönderin, şablonları yönetin ve geçmişi görüntüleyin
        </p>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-4 bg-white p-2 rounded-lg shadow-sm">
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
          {tabs.map((tab) => {
            const Component = tab.component;
            return (
              <Tab.Panel key={tab.name}>
                <Component />
              </Tab.Panel>
            );
          })}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};