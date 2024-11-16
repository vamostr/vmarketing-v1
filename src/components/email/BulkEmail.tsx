import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, Users, Loader2, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useContactStore } from '../../stores/contactStore';
import { RichTextEditor } from './RichTextEditor';

const emailSchema = z.object({
  subject: z.string().min(1, 'Konu boş bırakılamaz'),
});

type EmailForm = z.infer<typeof emailSchema>;

// Örnek şablonlar
const emailTemplates = [
  {
    id: '1',
    name: 'Hoş Geldin E-postası',
    subject: 'Aramıza Hoş Geldiniz! 👋',
    content: `<h2>Merhaba {isim},</h2>
    <p>Ailemize hoş geldiniz! Size daha iyi hizmet verebilmek için buradayız.</p>
    <p>Herhangi bir sorunuz olursa bize ulaşmaktan çekinmeyin.</p>
    <p><br></p>
    <p>Saygılarımızla,<br>{şirket_adı}</p>`
  },
  {
    id: '2',
    name: 'Özel Teklif',
    subject: 'Size Özel İndirim Fırsatı! 🎉',
    content: `<h2>Değerli {isim},</h2>
    <p>Size özel hazırladığımız kampanyamızı kaçırmayın!</p>
    <p>{teklif_detay}</p>
    <p>Bu fırsat {son_tarih} tarihine kadar geçerlidir.</p>
    <p><br></p>
    <p>Saygılarımızla,<br>{şirket_adı}</p>`
  }
];

export const BulkEmail: React.FC = () => {
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showContactSelector, setShowContactSelector] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { contacts, groups, tags } = useContactStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema)
  });

  const handleTemplateSelect = (template: any) => {
    setValue('subject', template.subject);
    setContent(template.content);
    setShowTemplateSelector(false);
  };

  const getSelectedContactsCount = () => {
    const uniqueContacts = new Set([
      ...selectedContacts,
      ...contacts
        .filter(c => c.groups.some(g => selectedGroups.includes(g)))
        .map(c => c.id),
      ...contacts
        .filter(c => c.tags.some(t => selectedTags.includes(t)))
        .map(c => c.id)
    ]);

    return uniqueContacts.size;
  };

  const onSubmit = async (data: EmailForm) => {
    if (!content.trim()) {
      toast.error('E-posta içeriği boş olamaz');
      return;
    }

    const totalRecipients = getSelectedContactsCount();
    if (totalRecipients === 0) {
      toast.error('En az bir alıcı seçmelisiniz');
      return;
    }

    setIsSending(true);
    try {
      // API entegrasyonu burada yapılacak
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simülasyon
      
      toast.success(`${totalRecipients} kişiye e-posta gönderimi başlatıldı`);
      reset();
      setContent('');
      setSelectedContacts([]);
      setSelectedGroups([]);
      setSelectedTags([]);
    } catch (error) {
      toast.error('E-posta gönderilemedi');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Alıcı Seçimi */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Alıcılar
            </label>
            <button
              type="button"
              onClick={() => setShowContactSelector(!showContactSelector)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {showContactSelector ? 'Gizle' : 'Seç'}
            </button>
          </div>

          {showContactSelector && (
            <div className="border rounded-lg p-4 space-y-4 mb-4">
              {/* Gruplar */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Gruplar</h4>
                <div className="flex flex-wrap gap-2">
                  {groups.map(group => (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => setSelectedGroups(prev =>
                        prev.includes(group.id)
                          ? prev.filter(id => id !== group.id)
                          : [...prev, group.id]
                      )}
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
                </div>
              </div>

              {/* Etiketler */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Etiketler</h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => setSelectedTags(prev =>
                        prev.includes(tag.id)
                          ? prev.filter(id => id !== tag.id)
                          : [...prev, tag.id]
                      )}
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

              {/* Kişi Listesi */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Kişiler</h4>
                <div className="max-h-48 overflow-y-auto border rounded-lg divide-y">
                  {contacts.map(contact => (
                    <div
                      key={contact.id}
                      className={`p-2 flex items-center justify-between hover:bg-gray-50 cursor-pointer ${
                        selectedContacts.includes(contact.id) ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedContacts(prev =>
                        prev.includes(contact.id)
                          ? prev.filter(id => id !== contact.id)
                          : [...prev, contact.id]
                      )}
                    >
                      <div>
                        <p className="text-sm font-medium">{contact.name}</p>
                        <p className="text-xs text-gray-500">{contact.email}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => {}}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Seçili Alıcı Özeti */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2" />
              <span>
                {getSelectedContactsCount()} kişi seçildi
              </span>
            </div>
          </div>
        </div>

        {/* Konu ve Şablon */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Konu
            </label>
            <button
              type="button"
              onClick={() => setShowTemplateSelector(!showTemplateSelector)}
              className="text-sm text-blue-600 hover:text-blue-700 inline-flex items-center"
            >
              <FileText className="h-4 w-4 mr-1" />
              Şablon Kullan
            </button>
          </div>

          <input
            type="text"
            {...register('subject')}
            className="input"
            placeholder="E-posta konusu"
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
          )}

          {/* Şablon Seçici */}
          {showTemplateSelector && (
            <div className="mt-2 border rounded-lg divide-y">
              {emailTemplates.map(template => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => handleTemplateSelect(template)}
                  className="w-full text-left p-3 hover:bg-gray-50"
                >
                  <p className="font-medium">{template.name}</p>
                  <p className="text-sm text-gray-500">{template.subject}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* İçerik */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            İçerik
          </label>
          <div className="min-h-[300px]">
            <RichTextEditor content={content} onChange={setContent} />
          </div>

          {/* Değişken Yardımı */}
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">
              Kullanılabilir Değişkenler
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>{'{isim}'} - Alıcının adı</li>
              <li>{'{şirket_adı}'} - Şirketinizin adı</li>
              <li>{'{teklif_detay}'} - Teklif detayları</li>
              <li>{'{son_tarih}'} - Son geçerlilik tarihi</li>
            </ul>
          </div>
        </div>

        {/* Gönder Butonu */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSending}
            className="btn btn-primary inline-flex items-center"
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Gönderiliyor...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Gönder
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};