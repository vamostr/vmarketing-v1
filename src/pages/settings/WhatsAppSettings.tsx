import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useWhatsAppStore } from '../../stores/whatsappStore';
import toast from 'react-hot-toast';
import { Key, Eye, EyeOff, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import QRCode from 'qrcode.react';

const whatsappSchema = z.object({
  phoneNumberId: z.string().min(1, 'Phone Number ID gerekli'),
  businessAccountId: z.string().min(1, 'Business Account ID gerekli'),
});

type WhatsAppForm = z.infer<typeof whatsappSchema>;

export const WhatsAppSettings: React.FC = () => {
  const { initializeBusinessAPI, credentials, setCredentials, activeSession } = useWhatsAppStore();
  const [accessToken, setAccessToken] = useState(credentials?.accessToken || '');
  const [showAccessToken, setShowAccessToken] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<WhatsAppForm>({
    resolver: zodResolver(whatsappSchema),
    defaultValues: {
      phoneNumberId: credentials?.phoneNumberId || '',
      businessAccountId: credentials?.businessAccountId || ''
    }
  });

  useEffect(() => {
    // QR kod oluşturma simülasyonu
    const generateQR = () => {
      const qrData = `whatsapp-web-${Date.now()}`;
      setQrCode(qrData);
    };
    generateQR();
  }, []);

  const handleRefreshQR = () => {
    const qrData = `whatsapp-web-${Date.now()}`;
    setQrCode(qrData);
    toast.success('QR kod yenilendi');
  };

  const onSubmit = async (data: WhatsAppForm) => {
    if (!accessToken) {
      toast.error('Lütfen access token giriniz');
      return;
    }

    try {
      const credentials = {
        accessToken,
        phoneNumberId: data.phoneNumberId,
        businessAccountId: data.businessAccountId,
      };

      await initializeBusinessAPI(credentials);
      setCredentials(credentials);
      toast.success('WhatsApp ayarları başarıyla kaydedildi');
    } catch (error: any) {
      toast.error(error.message || 'WhatsApp ayarları kaydedilemedi');
    }
  };

  return (
    <div className="space-y-6">
      {/* WhatsApp Web QR Kod */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">WhatsApp Web QR Kod</h2>
        <div className="flex flex-col items-center space-y-4">
          {qrCode && (
            <div className="p-4 bg-white border rounded-lg shadow-sm">
              <QRCode value={qrCode} size={200} />
            </div>
          )}
          <button
            onClick={handleRefreshQR}
            className="btn btn-secondary inline-flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            QR Kodu Yenile
          </button>
          <p className="text-sm text-gray-500 text-center">
            WhatsApp Web'i kullanmak için QR kodu WhatsApp uygulamanızdan okutun
          </p>
        </div>
      </div>

      {/* WhatsApp Business API Ayarları */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">WhatsApp Business API Ayarları</h2>
        
        {/* Oturum Durumu */}
        <div className="bg-gray-50 border rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Oturum Durumu</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-2.5 h-2.5 rounded-full mr-2 ${
                  activeSession?.type === 'business-api' && activeSession?.status === 'active'
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`} />
                <span className="text-sm font-medium">WhatsApp Business API</span>
              </div>
              <div className="flex items-center">
                {activeSession?.type === 'business-api' ? (
                  activeSession.status === 'active' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Aktif
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Bağlantı Hatası
                    </span>
                  )
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <XCircle className="w-3 h-3 mr-1" />
                    Bağlı Değil
                  </span>
                )}
              </div>
            </div>

            {activeSession?.type === 'business-api' && activeSession?.status === 'active' && (
              <div className="text-sm text-gray-600 pl-4 space-y-1">
                <p>Phone Number ID: {activeSession.phoneNumberId}</p>
                <p>Business Account ID: {activeSession.businessAccountId}</p>
                {activeSession.expiresAt && (
                  <p>Token Geçerlilik: {new Date(activeSession.expiresAt).toLocaleString('tr-TR')}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* API Ayarları Formu */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="flex items-center text-sm font-medium text-blue-800 mb-2">
              <Key className="h-4 w-4 mr-2" />
              Access Token
            </h3>
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type={showAccessToken ? 'text' : 'password'}
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    placeholder="Meta Business Manager'dan alınan access token"
                    className="input pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAccessToken(!showAccessToken)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showAccessToken ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number ID
              </label>
              <input
                type="text"
                {...register('phoneNumberId')}
                className="input"
                placeholder="Meta Business Manager'dan alınan Phone Number ID"
              />
              {errors.phoneNumberId && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumberId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Business Account ID
              </label>
              <input
                type="text"
                {...register('businessAccountId')}
                className="input"
                placeholder="Meta Business Manager'dan alınan Business Account ID"
              />
              {errors.businessAccountId && (
                <p className="mt-1 text-sm text-red-600">{errors.businessAccountId.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !accessToken}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};