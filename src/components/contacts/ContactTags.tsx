import React, { useState } from 'react';
import { useContactStore } from '../../stores/contactStore';
import { Tag, Plus, Edit2, Trash2 } from 'lucide-react';

export const ContactTags: React.FC = () => {
  const { tags, addTag, updateTag, deleteTag } = useContactStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [editingTag, setEditingTag] = useState<string | null>(null);

  const handleAddTag = () => {
    if (!newTagName.trim()) return;

    addTag({
      name: newTagName,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    });

    setNewTagName('');
    setIsAdding(false);
  };

  const handleUpdateTag = (id: string, name: string) => {
    updateTag(id, { name });
    setEditingTag(null);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Etiketler</h3>
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
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Etiket adı..."
              className="flex-1 input text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            />
            <button
              onClick={handleAddTag}
              className="text-green-600 hover:text-green-700"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}

        {tags.map(tag => (
          <div
            key={tag.id}
            className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50"
          >
            {editingTag === tag.id ? (
              <input
                type="text"
                defaultValue={tag.name}
                className="flex-1 input text-sm mr-2"
                onBlur={(e) => handleUpdateTag(tag.id, e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleUpdateTag(tag.id, e.currentTarget.value)}
                autoFocus
              />
            ) : (
              <div className="flex items-center space-x-2 flex-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
                <span className="text-sm">{tag.name}</span>
              </div>
            )}

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setEditingTag(tag.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => deleteTag(tag.id)}
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