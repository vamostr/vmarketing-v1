import React, { useState } from 'react';
import { useContactStore } from '../../stores/contactStore';
import { Users, Plus, Edit2, Trash2 } from 'lucide-react';

export const ContactGroups: React.FC = () => {
  const { groups, addGroup, updateGroup, deleteGroup } = useContactStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [editingGroup, setEditingGroup] = useState<string | null>(null);

  const handleAddGroup = () => {
    if (!newGroupName.trim()) return;

    addGroup({
      name: newGroupName,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      description: ''
    });

    setNewGroupName('');
    setIsAdding(false);
  };

  const handleUpdateGroup = (id: string, name: string) => {
    updateGroup(id, { name });
    setEditingGroup(null);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Gruplar</h3>
        <button
          onClick={() => setIsAdding(true)}
          className="text-blue-600 hover:text-blue-700"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-2">
        {isAdding && (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Grup adı..."
              className="flex-1 input text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleAddGroup()}
            />
            <button
              onClick={handleAddGroup}
              className="text-green-600 hover:text-green-700"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}

        {groups.map(group => (
          <div
            key={group.id}
            className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50"
          >
            {editingGroup === group.id ? (
              <input
                type="text"
                defaultValue={group.name}
                className="flex-1 input text-sm mr-2"
                onBlur={(e) => handleUpdateGroup(group.id, e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleUpdateGroup(group.id, e.currentTarget.value)}
                autoFocus
              />
            ) : (
              <div className="flex items-center space-x-2 flex-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: group.color }}
                />
                <span className="text-sm">{group.name}</span>
              </div>
            )}

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setEditingGroup(group.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => deleteGroup(group.id)}
                className="text-gray-400 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};