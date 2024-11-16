import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, Loader2, Search, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { RichTextEditor } from './RichTextEditor';
import { useContactStore } from '../../stores/contactStore';

const emailSchema = z.object({
  subject: z.string().min(1, 'Konu boş bırakılamaz'),
});

type EmailForm = z.infer<typeof emailSchema>;

export const SingleEmail: React.FC = () => {
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { contacts } = useContactStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema)
  });

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = async (data: EmailForm) => {
    if (!content.trim()) {
      toast.error('E-posta içeriği boş olamaz');
      return;
    }

    if (!selectedContact?.email) {
      toast.error('Lütfen bir alıcı seçin');
      return;
    }

    setIsSending(true);
    try {
      // API entegrasyonu burada yapılacak
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simülasyon
      
      toast.success('E-posta başarıyla gönderildi');
      reset();
      setContent('');
      setSelectedContact(null);
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alıcı
          </label>
          <div className="relative">
            {selectedContact ? (
              <div className="flex items-center justify-between p-2 border rounded-lg">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{selectedContact.name}</p>
                    <p className="text-xs text-gray-500">{selectedContact.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedContact(null)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Kaldır
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowContactPicker(true)}
                className="w-full text-left px-4 py-2 border rounded-lg text-gray-500 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Kişi seçin...
              </button>
            )}
          </div>
        </div>

        {/* Kişi Seçici Modal */}
        {showContactPicker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Kişi Seç</h3>
                <button
                  type="button"
                  onClick={() => setShowContactPicker(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  &times;
                </button>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="İsim, e-posta veya telefon ile ara..."
                    className="w-full pl-10 input"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto">
                {filteredContacts.filter(contact => contact.email).map(contact => (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => {
                      setSelectedContact(contact);
                      setShowContactPicker(false);
                      setSearchTerm('');
                    }}
                    className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center space-x-3"
                  >
                    <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-gray-500">{contact.email}</p>
                    </div>
                  </button>
                ))}
                {filteredContacts.filter(contact => contact.email).length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    E-posta adresi olan kişi bulunamadı
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Konu
          </label>
          <input
            type="text"
            {...register('subject')}
            className="input"
            placeholder="E-posta konusu"
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            İçerik
          </label>
          <div className="min-h-[300px]">
            <RichTextEditor content={content} onChange={setContent} />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSending || !selectedContact}
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