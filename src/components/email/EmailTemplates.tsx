import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FileText, Plus, Edit2, Trash2, Copy, Save, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { RichTextEditor } from './RichTextEditor';

const templateSchema = z.object({
  name: z.string().min(1, 'Şablon adı gerekli'),
  subject: z.string().min(1, 'Konu boş bırakılamaz'),
  description: z.string().optional(),
});

type TemplateForm = z.infer<typeof templateSchema>;

// Örnek şablonlar
const defaultTemplates = [
  {
    id: '1',
    name: 'Hoş Geldin E-postası',
    subject: 'Aramıza Hoş Geldiniz! 👋',
    description: 'Yeni müşterilere gönderilen karşılama e-postası',
    content: `<h2>Merhaba {isim},</h2>
    <p>Ailemize hoş geldiniz! Size daha iyi hizmet verebilmek için buradayız.</p>
    <p>Herhangi bir sorunuz olursa bize ulaşmaktan çekinmeyin.</p>
    <p><br></p>
    <p>Saygılarımızla,<br>{şirket_adı}</p>`,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15'),
  },
  {
    id: '2',
    name: 'Özel Teklif',
    subject: 'Size Özel İndirim Fırsatı! 🎉',
    description: 'Kampanya ve indirim duyuruları için',
    content: `<h2>Değerli {isim},</h2>
    <p>Size özel hazırladığımız kampanyamızı kaçırmayın!</p>
    <p>{teklif_detay}</p>
    <p>Bu fırsat {son_tarih} tarihine kadar geçerlidir.</p>
    <p><br></p>
    <p>Saygılarımızla,<br>{şirket_adı}</p>`,
    createdAt: new Date('2024-03-16'),
    updatedAt: new Date('2024-03-16'),
  },
];

export const EmailTemplates: React.FC = () => {
  const [templates, setTemplates] = useState(defaultTemplates);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [templateContent, setTemplateContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TemplateForm>({
    resolver: zodResolver(templateSchema),
  });

  const handleAddTemplate = async (data: TemplateForm) => {
    if (!templateContent.trim()) {
      toast.error('Şablon içeriği boş olamaz');
      return;
    }

    setIsLoading(true);
    try {
      const newTemplate = {
        id: crypto.randomUUID(),
        ...data,
        content: templateContent,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setTemplates([...templates, newTemplate]);
      toast.success('Şablon başarıyla oluşturuldu');
      handleCloseModal();
    } catch (error) {
      toast.error('Şablon oluşturulamadı');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTemplate = async (data: TemplateForm) => {
    if (!templateContent.trim()) {
      toast.error('Şablon içeriği boş olamaz');
      return;
    }

    setIsLoading(true);
    try {
      const updatedTemplates = templates.map(template =>
        template.id === editingTemplate.id
          ? {
              ...template,
              ...data,
              content: templateContent,
              updatedAt: new Date(),
            }
          : template
      );

      setTemplates(updatedTemplates);
      toast.success('Şablon başarıyla güncellendi');
      handleCloseModal();
    } catch (error) {
      toast.error('Şablon güncellenemedi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!window.confirm('Bu şablonu silmek istediğinize emin misiniz?')) return;

    try {
      setTemplates(templates.filter(template => template.id !== id));
      toast.success('Şablon başarıyla silindi');
    } catch (error) {
      toast.error('Şablon silinemedi');
    }
  };

  const handleDuplicateTemplate = (template: any) => {
    const duplicatedTemplate = {
      ...template,
      id: crypto.randomUUID(),
      name: `${template.name} (Kopya)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTemplates([...templates, duplicatedTemplate]);
    toast.success('Şablon kopyalandı');
  };

  const handleEditTemplate = (template: any) => {
    setEditingTemplate(template);
    setValue('name', template.name);
    setValue('subject', template.subject);
    setValue('description', template.description || '');
    setTemplateContent(template.content);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingTemplate(null);
    setTemplateContent('');
    reset();
  };

  return (
    <div className="space-y-6">
      {/* Başlık ve Ekle Butonu */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-900">E-posta Şablonları</h2>
          <p className="text-sm text-gray-500">
            Sık kullandığınız e-posta şablonlarını yönetin
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Yeni Şablon
        </button>
      </div>

      {/* Şablon Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map(template => (
          <div
            key={template.id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                <p className="text-sm text-gray-500">{template.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDuplicateTemplate(template)}
                  className="text-gray-400 hover:text-gray-600"
                  title="Kopyala"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleEditTemplate(template)}
                  className="text-gray-400 hover:text-blue-600"
                  title="Düzenle"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="text-gray-400 hover:text-red-600"
                  title="Sil"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-3">
              <strong>Konu:</strong> {template.subject}
            </div>

            <div className="text-xs text-gray-500">
              Son güncelleme: {new Date(template.updatedAt).toLocaleDateString('tr-TR')}
            </div>
          </div>
        ))}
      </div>

      {/* Şablon Ekleme/Düzenleme Modalı */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">
                {editingTemplate ? 'Şablonu Düzenle' : 'Yeni Şablon Oluştur'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(editingTemplate ? handleUpdateTemplate : handleAddTemplate)}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Şablon Adı
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="input"
                  placeholder="örn: Hoş Geldin E-postası"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta Konusu
                </label>
                <input
                  type="text"
                  {...register('subject')}
                  className="input"
                  placeholder="örn: Aramıza Hoş Geldiniz!"
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Açıklama
                </label>
                <input
                  type="text"
                  {...register('description')}
                  className="input"
                  placeholder="örn: Yeni müşterilere gönderilen karşılama e-postası"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şablon İçeriği
                </label>
                <div className="h-96 mb-4">
                  <RichTextEditor
                    content={templateContent}
                    onChange={setTemplateContent}
                  />
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
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

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn btn-secondary"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary inline-flex items-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Kaydediliyor...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Kaydet
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};