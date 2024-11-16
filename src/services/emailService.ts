import { EmailConfig } from '../stores/emailStore';

export class EmailService {
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
  }

  async testConnection(): Promise<boolean> {
    // Simüle edilmiş bağlantı testi
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!this.config.smtpHost || !this.config.smtpPort) {
      throw new Error('SMTP ayarları eksik');
    }
    
    return true;
  }

  async sendTestEmail(recipientEmail?: string): Promise<void> {
    // Simüle edilmiş e-posta gönderimi
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (!this.isValidEmail(recipientEmail || this.config.smtpUser)) {
      throw new Error('Geçersiz e-posta adresi');
    }
    
    console.log('Test e-postası gönderildi:', {
      to: recipientEmail || this.config.smtpUser,
      from: `${this.config.senderName} <${this.config.senderEmail}>`,
      subject: 'vMarketing - Test E-postası',
    });
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}