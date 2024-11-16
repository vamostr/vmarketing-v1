import React from 'react';
import { useContactStore } from '../../stores/contactStore';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { User, Mail, Building2, Phone } from 'lucide-react';

interface Props {
  selectedContacts: string[];
  onSelectionChange: (ids: string[]) => void;
}

export const ContactList: React.FC<Props> = ({
  selectedContacts,
  onSelectionChange,
}) => {
  const { contacts, groups, tags } = useContactStore();

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelectionChange(e.target.checked ? contacts.map(c => c.id) : []);
  };

  const handleSelectOne = (id: string) => {
    onSelectionChange(
      selectedContacts.includes(id)
        ? selectedContacts.filter(contactId => contactId !== id)
        : [...selectedContacts, id]
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={selectedContacts.length === contacts.length}
                onChange={handleSelectAll}
              />
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ad Soyad
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              İletişim
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Gruplar
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Etiketler
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Son Etkileşim
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {contacts.map(contact => (
            <tr
              key={contact.id}
              className={`hover:bg-gray-50 ${
                selectedContacts.includes(contact.id) ? 'bg-blue-50' : ''
              }`}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={selectedContacts.includes(contact.id)}
                  onChange={() => handleSelectOne(contact.id)}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {contact.name}
                    </div>
                    {contact.company && (
                      <div className="text-sm text-gray-500 flex items-center">
                        <Building2 className="h-4 w-4 mr-1" />
                        {contact.company}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  {contact.phone}
                </div>
                {contact.email && (
                  <div className="text-sm text-gray-500 flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {contact.email}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-wrap gap-1">
                  {contact.groups.map(groupId => {
                    const group = groups.find(g => g.id === groupId);
                    if (!group) return null;
                    return (
                      <span
                        key={group.id}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}
                        style={{
                          backgroundColor: `${group.color}20`,
                          color: group.color,
                        }}
                      >
                        {group.name}
                      </span>
                    );
                  })}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-wrap gap-1">
                  {contact.tags.map(tagId => {
                    const tag = tags.find(t => t.id === tagId);
                    if (!tag) return null;
                    return (
                      <span
                        key={tag.id}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}
                        style={{
                          backgroundColor: `${tag.color}20`,
                          color: tag.color,
                        }}
                      >
                        {tag.name}
                      </span>
                    );
                  })}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {contact.lastInteraction
                  ? format(new Date(contact.lastInteraction), 'd MMM yyyy', {
                      locale: tr,
                    })
                  : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};