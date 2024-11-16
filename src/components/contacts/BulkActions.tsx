import React, { useState } from 'react';
import { useContactStore } from '../../stores/contactStore';
import { Trash2, Tag, Users, X } from 'lucide-react';

interface Props {
  selectedCount: number;
  onClearSelection: () => void;
  selectedContactIds: string[];
}

export const BulkActions: React.FC<Props> = ({
  selectedCount,
  onClearSelection,
  selectedContactIds,
}) => {
  const {
    groups,
    tags,
    deleteContacts,
    assignGroupToContacts,
    assignTagToContacts,
  } = useContactStore();

  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  const handleDelete = () => {
    if (window.confirm(`${selectedCount} kişiyi silmek istediğinize emin misiniz?`)) {
      deleteContacts(selectedContactIds);
      onClearSelection();
    }
  };

  return (
    <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
      <div className="flex items-center">
        <span className="text-sm font-medium text-blue-700">
          {selectedCount} kişi seçildi
        </span>
        <button
          onClick={onClearSelection}
          className="ml-2 text-blue-600 hover:text-blue-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center space-x-2">
        {/* Grup Atama */}
        <div className="relative">
          <button
            onClick={() => setShowGroupDropdown(!showGroupDropdown)}
            className="btn btn-secondary flex items-center"
          >
            <Users className="h-4 w-4 mr-2" />
            Gruba Ekle
          </button>

          {showGroupDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <div className="py-1">
                {groups.map(group => (
                  <button
                    key={group.id}
                    onClick={() => {
                      assignGroupToContacts(selectedContactIds, group.id);
                      setShowGroupDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {group.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Etiket Atama */}
        <div className="relative">
          <button
            onClick={() => setShowTagDropdown(!showTagDropdown)}
            className="btn btn-secondary flex items-center"
          >
            <Tag className="h-4 w-4 mr-2" />
            Etiket Ekle
          </button>

          {showTagDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <div className="py-1">
                {tags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => {
                      assignTagToContacts(selectedContactIds, tag.id);
                      setShowTagDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Silme */}
        <button
          onClick={handleDelete}
          className="btn bg-red-600 text-white hover:bg-red-700 flex items-center"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Sil
        </button>
      </div>
    </div>
  );
};