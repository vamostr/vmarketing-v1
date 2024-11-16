import React, { useState } from 'react';
import { Settings, Mail, Key, Save, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

const settingsSchema = z.object({
  smtpHost: z.string().min(1, 'SMTP host gerekli'),
  smtpPort: z.string().min(1, 'SMTP port gerekli'),
  smtpUser: z.string().email('Geçerli bir e-posta adresi giriniz'),
  smtpPassword: z.string().min(1, 'SMTP şifre gerekli'),
  senderName: z.string().min(1, 'Gönderen adı gerekli'),
  senderEmail: z.string().email('Geçerli bir e-posta adresi giriniz'),
  apiKey: z.string().min(1, 'API anahtarı gerekli'),
  webhookSecret: z.string().min(1, 'Webhook secret gerekli'),
});

type SettingsForm = z.infer<typeof settingsSchema>;

export const AdminSettings: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingSMTP, setIsTestingSMTP] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: '587',
      smtpUser: 'noreply@vmarketing.com',
      smtpPassword: '••••••••',
      senderName: 'vMarketing',
      senderEmail: 'noreply@vmarketing.com',
      apiKey: '••••••••',
      webhookSecret: '••••••••',
    },
  });

  const onSubmit = async (data: SettingsForm) => {
    setIsSaving(true);
    try {
      // API çağrısı burada yapılacak
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Ayarlar başarıyla kaydedildi');
    } catch (error) {
      toast.error('Ayarlar kaydedilemedi');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestSMTP = async () => {
    setIsTestingSMTP(true);
    try {
      // SMTP test çağrısı burada yapılacak
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('SMTP bağlantısı başarılı');
    } catch (error) {
      toast.error('SMTP bağlantı testi başarısız');
    } finally {
      setIsTestingSMTP(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center">
          <Settings className="h-6 w-6 text-blue-500 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">Sistem Ayarları</h1>
        </div>
      </div>

      {/* Ayar Formları */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* E-posta Ayarları */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center mb-6">
            <Mail className="h-5 w-5 text-blue-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">E-posta Ayarları</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                SMTP Host
              </label>
              <input
                type="text"
                {...register('smtpHost')}
                className="mt-1 input"
              />
              {errors.smtpHost && (
                <p className="mt-1 text-sm text-red-600">{errors.smtpHost.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                SMTP Port
              </label>
              <input
                type="text"
                {...register('smtpPort')}
                className="mt-1 input"
              />
              {errors.smtpPort && (
                <p className="mt-1 text-sm text-red-600">{errors.smtpPort.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                SMTP Kullanıcı
              </label>
              <input
                type="email"
                {...register('smtpUser')}
                className="mt-1 input"
              />
              {errors.smtpUser && (
                <p className="mt-1 text-sm text-red-600">{errors.smtpUser.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                SMTP Şifre
              </label>
              <input
                type="password"
                {...register('smtpPassword')}
                className="mt-1 input"
              />
              {errors.smtpPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.smtpPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gönderen Adı
              </label>
              <input
                type="text"
                {...register('senderName')}
                className="mt-1 input"
              />
              {errors.senderName && (
                <p className="mt-1 text-sm text-red-600">{errors.senderName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font ication text-gray-700">
                Gönderen E-posta
              </label>
              <input
                type="email"
                {...register('senderEmail')}
                className="mt-1 input"
              />
              {errors.senderEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.senderEmail.message}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleTestSMTP}
              disabled={isTestingSMTP}
              className="btn btn-secondary inline-flex items-center"
            >
              {isTestingSMTP ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Test Ediliyor...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  SMTP Bağlantısını Test Et
                </>
              )}
            </button>
          </div>
        </div>

        {/* API Ayarları */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center mb-6">
            <Key className="h-5 w-5 text-blue-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">API Ayarları</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                API Anahtarı
              </label>
              <input
                type="password"
                {...register('apiKey')}
                className="mt-1 input"
              />
              {errors.apiKey && (
                <p className="mt-1 text-sm text-red-600">{errors.apiKey.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Webhook Secret
              </label>
              <input
                type="password"
                {...register('webhookSecret')}
                className="mt-1 input"
              />
              {errors.webhookSecret && (
                <p className="mt-1 text-sm text-red-600">{errors.webhookSecret.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Kaydet Butonu */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="btn btn-primary inline-flex items-center"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Ayarları Kaydet
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};