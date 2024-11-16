import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Contact, ContactGroup, ContactTag } from '../types/contact';
import Papa from 'papaparse';
import toast from 'react-hot-toast';

interface ContactStore {
  contacts: Contact[];
  groups: ContactGroup[];
  tags: ContactTag[];
  isLoading: boolean;
  error: string | null;

  // Kişi işlemleri
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateContact: (id: string, data: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  deleteContacts: (ids: string[]) => void;

  // Grup işlemleri
  addGroup: (group: Omit<ContactGroup, 'id' | 'createdAt'>) => void;
  updateGroup: (id: string, data: Partial<ContactGroup>) => void;
  deleteGroup: (id: string) => void;

  // Etiket işlemleri
  addTag: (tag: Omit<ContactTag, 'id'>) => void;
  updateTag: (id: string, data: Partial<ContactTag>) => void;
  deleteTag: (id: string) => void;

  // Toplu işlemler
  importContacts: (file: File) => Promise<void>;
  exportContacts: (format: 'csv' | 'json') => void;
  assignGroupToContacts: (contactIds: string[], groupId: string) => void;
  assignTagToContacts: (contactIds: string[], tagId: string) => void;
  removeGroupFromContacts: (contactIds: string[], groupId: string) => void;
  removeTagFromContacts: (contactIds: string[], tagId: string) => void;
}

export const useContactStore = create<ContactStore>()(
  persist(
    (set, get) => ({
      contacts: [],
      groups: [],
      tags: [],
      isLoading: false,
      error: null,

      addContact: (contactData) => {
        const contact: Contact = {
          ...contactData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set(state => ({
          contacts: [...state.contacts, contact]
        }));
      },

      updateContact: (id, data) => {
        set(state => ({
          contacts: state.contacts.map(contact =>
            contact.id === id
              ? { ...contact, ...data, updatedAt: new Date() }
              : contact
          )
        }));
      },

      deleteContact: (id) => {
        set(state => ({
          contacts: state.contacts.filter(contact => contact.id !== id)
        }));
      },

      deleteContacts: (ids) => {
        set(state => ({
          contacts: state.contacts.filter(contact => !ids.includes(contact.id))
        }));
      },

      addGroup: (groupData) => {
        const group: ContactGroup = {
          ...groupData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        };

        set(state => ({
          groups: [...state.groups, group]
        }));
      },

      updateGroup: (id, data) => {
        set(state => ({
          groups: state.groups.map(group =>
            group.id === id ? { ...group, ...data } : group
          )
        }));
      },

      deleteGroup: (id) => {
        set(state => ({
          groups: state.groups.filter(group => group.id !== id),
          contacts: state.contacts.map(contact => ({
            ...contact,
            groups: contact.groups.filter(groupId => groupId !== id)
          }))
        }));
      },

      addTag: (tagData) => {
        const tag: ContactTag = {
          ...tagData,
          id: crypto.randomUUID(),
        };

        set(state => ({
          tags: [...state.tags, tag]
        }));
      },

      updateTag: (id, data) => {
        set(state => ({
          tags: state.tags.map(tag =>
            tag.id === id ? { ...tag, ...data } : tag
          )
        }));
      },

      deleteTag: (id) => {
        set(state => ({
          tags: state.tags.filter(tag => tag.id !== id),
          contacts: state.contacts.map(contact => ({
            ...contact,
            tags: contact.tags.filter(tagId => tagId !== id)
          }))
        }));
      },

      importContacts: async (file) => {
        set({ isLoading: true, error: null });

        try {
          const text = await file.text();
          
          Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              const newContacts: Contact[] = results.data
                .filter((row: any) => row['Ad Soyad'] && row['Telefon']) // Boş kayıtları filtrele
                .map((row: any) => ({
                  id: crypto.randomUUID(),
                  name: row['Ad Soyad'],
                  phone: row['Telefon'],
                  email: row['E-posta'] || undefined,
                  company: row['Şirket'] || undefined,
                  notes: row['Notlar'] || undefined,
                  groups: [],
                  tags: [],
                  source: 'import',
                  createdAt: new Date(),
                  updatedAt: new Date(),
                }));

              if (newContacts.length === 0) {
                throw new Error('Geçerli kişi kaydı bulunamadı. Lütfen şablonu kontrol edin.');
              }

              set(state => ({
                contacts: [...state.contacts, ...newContacts]
              }));

              toast.success(`${newContacts.length} kişi başarıyla içe aktarıldı`);
            },
            error: (error) => {
              throw new Error('CSV dosyası okunamadı: ' + error.message);
            }
          });
        } catch (error: any) {
          set({ error: error.message });
          toast.error('İçe aktarma başarısız: ' + error.message);
        } finally {
          set({ isLoading: false });
        }
      },

      exportContacts: (format) => {
        const { contacts } = get();
        
        try {
          let content: string;
          let fileName: string;
          
          if (format === 'csv') {
            // CSV için alan adlarını Türkçe yapalım
            const csvData = contacts.map(contact => ({
              'Ad Soyad': contact.name,
              'Telefon': contact.phone,
              'E-posta': contact.email || '',
              'Şirket': contact.company || '',
              'Notlar': contact.notes || ''
            }));
            
            content = Papa.unparse(csvData);
            fileName = 'kisiler.csv';
          } else {
            content = JSON.stringify(contacts, null, 2);
            fileName = 'kisiler.json';
          }

          const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          toast.success('Kişiler dışa aktarıldı');
        } catch (error: any) {
          toast.error('Dışa aktarma başarısız: ' + error.message);
        }
      },

      assignGroupToContacts: (contactIds, groupId) => {
        set(state => ({
          contacts: state.contacts.map(contact =>
            contactIds.includes(contact.id)
              ? {
                  ...contact,
                  groups: [...new Set([...contact.groups, groupId])],
                  updatedAt: new Date()
                }
              : contact
          )
        }));
      },

      assignTagToContacts: (contactIds, tagId) => {
        set(state => ({
          contacts: state.contacts.map(contact =>
            contactIds.includes(contact.id)
              ? {
                  ...contact,
                  tags: [...new Set([...contact.tags, tagId])],
                  updatedAt: new Date()
                }
              : contact
          )
        }));
      },

      removeGroupFromContacts: (contactIds, groupId) => {
        set(state => ({
          contacts: state.contacts.map(contact =>
            contactIds.includes(contact.id)
              ? {
                  ...contact,
                  groups: contact.groups.filter(id => id !== groupId),
                  updatedAt: new Date()
                }
              : contact
          )
        }));
      },

      removeTagFromContacts: (contactIds, tagId) => {
        set(state => ({
          contacts: state.contacts.map(contact =>
            contactIds.includes(contact.id)
              ? {
                  ...contact,
                  tags: contact.tags.filter(id => id !== tagId),
                  updatedAt: new Date()
                }
              : contact
          )
        }));
      },
    }),
    {
      name: 'contact-store',
    }
  )
);