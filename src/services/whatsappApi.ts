import axios from 'axios';
import { WhatsAppMessage, WhatsAppTemplate } from '../types/whatsapp';

const WHATSAPP_API_VERSION = 'v17.0';
const BASE_URL = `https://graph.facebook.com/${WHATSAPP_API_VERSION}`;

export class WhatsAppAPI {
  private accessToken: string;
  private phoneNumberId: string;
  private businessAccountId: string;

  constructor(accessToken: string, phoneNumberId: string, businessAccountId: string) {
    if (!accessToken) throw new Error('WhatsApp API token gerekli');
    if (!phoneNumberId) throw new Error('WhatsApp telefon numarası ID gerekli');
    if (!businessAccountId) throw new Error('Business Account ID gerekli');
    
    this.accessToken = accessToken;
    this.phoneNumberId = phoneNumberId;
    this.businessAccountId = businessAccountId;
  }

  private async request(method: string, endpoint: string, data?: any) {
    try {
      const url = `${BASE_URL}/${endpoint}`;
      
      const response = await axios({
        method,
        url,
        data,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data?.error;
      if (apiError) {
        switch (apiError.code) {
          case 190:
            throw new Error('Access token geçersiz veya süresi dolmuş');
          case 100:
            throw new Error('API izinleri yetersiz veya eksik');
          case 10:
            throw new Error('API izinleri yetersiz. Lütfen Meta Business Manager\'dan gerekli izinleri kontrol edin');
          case 803:
            throw new Error('Phone Number ID geçersiz veya bu hesaba ait değil');
          default:
            throw new Error(apiError.message || 'WhatsApp API isteği başarısız');
        }
      }
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.request('GET', `${this.phoneNumberId}`);
      return true;
    } catch (error) {
      throw new Error('WhatsApp Business API bağlantı testi başarısız. Lütfen bilgilerinizi kontrol edin.');
    }
  }

  async sendTextMessage(to: string, text: string): Promise<any> {
    // Telefon numarasını formatlama
    const formattedPhone = to.startsWith('+') ? to.substring(1) : to;

    return this.request('POST', `${this.phoneNumberId}/messages`, {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: formattedPhone,
      type: 'text',
      text: { body: text }
    });
  }

  async sendTemplateMessage(
    to: string,
    templateName: string,
    language: string,
    components: any[]
  ): Promise<any> {
    // Telefon numarasını formatlama
    const formattedPhone = to.startsWith('+') ? to.substring(1) : to;

    return this.request('POST', `${this.phoneNumberId}/messages`, {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: formattedPhone,
      type: 'template',
      template: {
        name: templateName,
        language: { code: language },
        components
      }
    });
  }

  async getTemplates(): Promise<WhatsAppTemplate[]> {
    const response = await this.request(
      'GET',
      `${this.businessAccountId}/message_templates`
    );
    return response.data || [];
  }

  async checkMessageStatus(messageId: string): Promise<any> {
    return this.request('GET', `${messageId}`);
  }
}