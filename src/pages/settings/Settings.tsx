import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../stores/authStore';
import { useEmailStore } from '../../stores/emailStore';
import { WhatsAppSettings } from './WhatsAppSettings';
import toast from 'react-hot-toast';
import {
  Settings as SettingsIcon,
  MessageCircle,
  Mail,
  User,
  Send,
  Loader2,
} from 'lucide-react';

const emailSchema = z.object({
  smtpHost: z.string().min(1, 'SMTP host gerekli'),
  smtpPort: z.string().min(1, 'SMTP port gerekli'),
  smtpUser: z.string().email('Geçerli bir e-posta adresi giriniz'),
  smtpPassword: z.string().min(1, 'SMTP şifre gerekli'),
  senderName: z.string().min(1, 'Gönderen adı gerekli'),
  senderEmail: z.string().email('Geçerli bir e-posta adresi giriniz'),
});

const profileSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  companyName: z.string().min(2, 'Şirket adı en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  newPassword: z.string().min(6, 'Şifre en az 6 karakter olmalıdır').optional().or(z.literal('')),
});

type EmailForm = z.infer<typeof emailSchema>;
type ProfileForm = z.infer<typeof profileSchema>;

export const Settings: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const { config: emailConfig, setConfig, testConnection, sendTestEmail, isTesting } = useEmailStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [testEmailRecipient, setTestEmailRecipient] = useState('');
  const [showTestEmailInput, setShowTestEmailInput] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: emailConfig || undefined,
  });

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      companyName: user?.companyName || '',
      newPassword: '',
    },
  });

  const onSubmitEmail = async (data: EmailForm) => {
    try {
      setConfig(data);
      await testConnection();
      toast.success('E-posta ayarları güncellendi');
    } catch (error: any) {
      toast.error('E-posta ayarları güncellenemedi: ' + error.message);
    }
  };

  const onSubmitProfile = async (data: ProfileForm) => {
    try {
      setIsUpdating(true);
      await updateProfile({
        name: data.name,
        email: data.email,
        companyName: data.companyName,
        ...(data.newPassword ? { password: data.newPassword } : {})
      });
      toast.success('Profil güncellendi');
    } catch (error: any) {
      toast.error('Profil güncellenemedi: ' + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTestEmail = async () => {
    try {
      await sendTestEmail(testEmailRecipient || undefined);
      toast.success(`Test e-postası ${testEmailRecipient || emailConfig?.smtpUser} adresine gönderildi`);
      setShowTestEmailInput(false);
      setTestEmailRecipient('');
    } catch (error: any) {
      toast.error('Test e-postası gönderilemedi: ' + error.message);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profil', icon: User },
    { id: 'whatsapp', name: 'WhatsApp API', icon: MessageCircle },
    { id: 'email', name: 'E-posta', icon: Mail },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center space-x-2">
          <SettingsIcon className="h-6 w-6 text-gray-600" />
          <h1 className="text-2xl font-bold text-gray-900">Ayarlar</h1>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    {...registerProfile('name')}
                    className="input"
                  />
                  {profileErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Şirket Adı
                  </label>
                  <input
                    type="text"
                    {...registerProfile('companyName')}
                    className="input"
                  />
                  {profileErrors.companyName && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.companyName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    E-posta
                  </label>
                  <input
                    type="email"
                    {...registerProfile('email')}
                    className="input"
                  />
                  {profileErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Yeni Şifre (İsteğe bağlı)
                  </label>
                  <input
                    type="password"
                    {...registerProfile('newPassword')}
                    className="input"
                    placeholder="Değiştirmek istemiyorsanız boş bırakın"
                  />
                  {profileErrors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.newPassword.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn btn-primary"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Güncelleniyor...
                    </>
                  ) : (
                    'Profili Güncelle'
                  )}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'whatsapp' && <WhatsAppSettings />}

          {activeTab === 'email' && (
            <form onSubmit={handleSubmitEmail(onSubmitEmail)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    SMTP Sunucu (Host)
                  </label>
                  <input
                    type="text"
                    {...registerEmail('smtpHost')}
                    placeholder="örn: smtp.gmail.com"
                    className="input"
                  />
                  {emailErrors.smtpHost && (
                    <p className="mt-1 text-sm text-red-600">{emailErrors.smtpHost.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    SMTP Port
                  </label>
                  <input
                    type="text"
                    {...registerEmail('smtpPort')}
                    placeholder="örn: 587"
                    className="input"
                  />
                  {emailErrors.smtpPort && (
                    <p className="mt-1 text-sm text-red-600">{emailErrors.smtpPort.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    SMTP Kullanıcı Adı
                  </label>
                  <input
                    type="email"
                    {...registerEmail('smtpUser')}
                    className="input"
                  />
                  {emailErrors.smtpUser && (
                    <p className="mt-1 text-sm text-red-600">{emailErrors.smtpUser.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    SMTP Şifre
                  </label>
                  <input
                    type="password"
                    {...registerEmail('smtpPassword')}
                    className="input"
                  />
                  {emailErrors.smtpPassword && (
                    <p className="mt-1 text-sm text-red-600">{emailErrors.smtpPassword.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Gönderen Adı
                  </label>
                  <input
                    type="text"
                    {...registerEmail('senderName')}
                    placeholder="örn: Şirket Adı"
                    className="input"
                  />
                  {emailErrors.senderName && (
                    <p className="mt-1 text-sm text-red-600">{emailErrors.senderName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Gönderen E-posta
                  </label>
                  <input
                    type="email"
                    {...registerEmail('senderEmail')}
                    placeholder="örn: info@sirketiniz.com"
                    className="input"
                  />
                  {emailErrors.senderEmail && (
                    <p className="mt-1 text-sm text-red-600">{emailErrors.senderEmail.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowTestEmailInput(!showTestEmailInput)}
                    className="btn btn-secondary"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Test E-postası Gönder
                  </button>

                  {showTestEmailInput && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="email"
                        value={testEmailRecipient}
                        onChange={(e) => setTestEmailRecipient(e.target.value)}
                        placeholder="Test e-posta adresi (opsiyonel)"
                        className="input max-w-xs"
                      />
                      <button
                        type="button"
                        onClick={handleTestEmail}
                        disabled={isTesting}
                        className="btn btn-primary"
                      >
                        {isTesting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Gönder'
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isTesting}
                  className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTesting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Kaydediliyor...
                    </>
                  ) : (
                    'E-posta Ayarlarını Kaydet'
                  )}
                </button>
              </div>

              {/* E-posta Ayarları Yardım */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Gmail SMTP Ayarları
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>SMTP Host: smtp.gmail.com</li>
                  <li>SMTP Port: 587</li>
                  <li>Güvenlik: TLS</li>
                  <li>Gmail hesabınızda "Uygulama Şifreleri" oluşturmanız gerekebilir</li>
                </ul>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};