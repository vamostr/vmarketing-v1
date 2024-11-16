import React, { useState } from 'react';
import { useContactStore } from '../../stores/contactStore';
import { Search, Filter } from 'lucide-react';

export const ContactFilters: React.FC = () => {
  const { groups, tags } = useContactStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleGroupToggle = (groupId: string) => {
    setSelectedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <div className="space-y-4">
      {/* Arama */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="İsim, telefon veya e-posta ile ara..."
          className="w-full pl-10 input"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      {/* Filtreler */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-sm text-gray-600">Filtrele:</span>
        </div>

        {/* Grup Filtreleri */}
        {groups.map(group => (
          <button
            key={group.id}
            onClick={() => handleGroupToggle(group.id)}
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
              selectedGroups.includes(group.id)
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: group.color }}
            />
            {group.name}
          </button>
        ))}

        {/* Etiket Filtreleri */}
        {tags.map(tag => (
          <button
            key={tag.id}
            onClick={() => handleTagToggle(tag.id)}
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
              selectedTags.includes(tag.id)
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: tag.color }}
            />
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
};