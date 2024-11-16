import React, { useState } from 'react';
import { useContactStore } from '../../stores/contactStore';
import { Users, Plus } from 'lucide-react';
import { ContactList } from '../../components/contacts';
import { ContactGroups } from '../../components/contacts';
import { ContactTags } from '../../components/contacts';
import { ImportExportTools } from '../../components/contacts';
import { ContactFilters } from '../../components/contacts';
import { BulkActions } from '../../components/contacts';
import { AddContactModal } from '../../components/contacts';

export const Contacts: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const { contacts } = useContactStore();

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="h-6 w-6 text-blue-500 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Kişiler</h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary inline-flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Yeni Kişi
          </button>
        </div>
        <p className="mt-2 text-gray-600">
          Tüm kişilerinizi yönetin, gruplandırın ve etiketleyin
        </p>
      </div>

      {/* Ana İçerik */}
      <div className="grid grid-cols-12 gap-6">
        {/* Sol Sidebar */}
        <div className="col-span-3 space-y-6">
          <ContactGroups />
          <ContactTags />
          <ImportExportTools />
        </div>

        {/* Ana Liste */}
        <div className="col-span-9 space-y-6">
          <div className="bg-white shadow-sm rounded-lg p-6">
            {/* Filtreler ve Toplu İşlemler */}
            <div className="mb-6 space-y-4">
              <ContactFilters />
              {selectedContacts.length > 0 && (
                <BulkActions
                  selectedCount={selectedContacts.length}
                  onClearSelection={() => setSelectedContacts([])}
                  selectedContactIds={selectedContacts}
                />
              )}
            </div>

            {/* Kişi Listesi */}
            <ContactList
              selectedContacts={selectedContacts}
              onSelectionChange={setSelectedContacts}
            />
          </div>
        </div>
      </div>

      {/* Yeni Kişi Modalı */}
      <AddContactModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
};