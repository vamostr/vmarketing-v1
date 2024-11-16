import React, { useEffect, useState } from 'react';
import { useWhatsAppStore } from '../../stores/whatsappStore';
import { Copy, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export const WhatsAppWebhookSettings: React.FC = () => {
  const { activeSession } = useWhatsAppStore();
  const [webhookUrl, setWebhookUrl] = useState('');
  const [verifyToken, setVerifyToken] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateWebhookCredentials();
  }, []);

  const generateWebhookCredentials = async () => {
    setIsGenerating(true);
    try {
      // Webhook URL'yi oluştur
      const baseUrl = window.location.origin;
      const newWebhookUrl = `${baseUrl}/api/whatsapp/webhook/${activeSession?.id || 'default'}`;
      setWebhookUrl(newWebhookUrl);

      // Verify token oluştur (32 karakterlik rastgele string)
      const newVerifyToken = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      setVerifyToken(newVerifyToken);

    } catch (error) {
      toast.error('Webhook bilgileri oluşturulamadı');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} kopyalandı`);
    } catch (error) {
      toast.error('Kopyalama başarısız');
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div className="pb-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold">WhatsApp Webhook Ayarları</h2>
        <p className="mt-1 text-sm text-gray-500">
          Bu bilgileri Meta Business Manager'daki webhook ayarlarında kullanın
        </p>
      </div>

      <div className="space-y-6">
        {/* Webhook URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Webhook URL
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={webhookUrl}
              readOnly
              className="input bg-gray-50 flex-1"
            />
            <button
              onClick={() => copyToClipboard(webhookUrl, 'Webhook URL')}
              className="p-2 text-gray-500 hover:text-gray-700"
              title="Kopyala"
            >
              <Copy className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Meta Business Manager'da Webhook URL olarak bu adresi girin
          </p>
        </div>

        {/* Verify Token */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Verify Token
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={verifyToken}
              readOnly
              className="input bg-gray-50 flex-1"
            />
            <button
              onClick={() => copyToClipboard(verifyToken, 'Verify Token')}
              className="p-2 text-gray-500 hover:text-gray-700"
              title="Kopyala"
            >
              <Copy className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Meta Business Manager'da Verify Token olarak bu değeri girin
          </p>
        </div>

        {/* Yenile Butonu */}
        <div className="flex justify-end">
          <button
            onClick={generateWebhookCredentials}
            disabled={isGenerating}
            className="btn btn-primary inline-flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Yeni Değerler Oluştur</span>
          </button>
        </div>

        {/* Webhook Bilgileri */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            Webhook Ayarları Nasıl Yapılır?
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
            <li>Meta Business Manager'da WhatsApp Business API ayarlarına gidin</li>
            <li>Webhook bölümünü bulun</li>
            <li>Yukarıdaki Webhook URL'yi "Callback URL" alanına yapıştırın</li>
            <li>Yukarıdaki Verify Token'ı "Verify Token" alanına yapıştırın</li>
            <li>Aşağıdaki webhook olaylarını seçin:
              <ul className="ml-6 mt-1 list-disc text-blue-600">
                <li>messages</li>
                <li>message_status</li>
              </ul>
            </li>
            <li>"Verify and Save" butonuna tıklayın</li>
          </ol>
        </div>
      </div>
    </div>
  );
};