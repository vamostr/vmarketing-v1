import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EmailService } from '../services/emailService';

export interface EmailConfig {
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
  senderName: string;
  senderEmail: string;
}

interface EmailStore {
  config: EmailConfig | null;
  isConfigured: boolean;
  isTesting: boolean;
  error: string | null;

  setConfig: (config: EmailConfig) => void;
  testConnection: () => Promise<void>;
  sendTestEmail: (recipientEmail?: string) => Promise<void>;
  clearError: () => void;
}

export const useEmailStore = create<EmailStore>()(
  persist(
    (set, get) => ({
      config: null,
      isConfigured: false,
      isTesting: false,
      error: null,

      setConfig: (config: EmailConfig) => {
        set({ config, isConfigured: true, error: null });
      },

      testConnection: async () => {
        const { config } = get();
        if (!config) {
          set({ error: 'E-posta ayarları bulunamadı' });
          return;
        }

        set({ isTesting: true, error: null });
        try {
          const emailService = new EmailService(config);
          await emailService.testConnection();
          set({ isConfigured: true });
        } catch (error: any) {
          set({ error: error.message || 'Bağlantı testi başarısız' });
          throw error;
        } finally {
          set({ isTesting: false });
        }
      },

      sendTestEmail: async (recipientEmail?: string) => {
        const { config } = get();
        if (!config) {
          set({ error: 'E-posta ayarları bulunamadı' });
          return;
        }

        set({ isTesting: true, error: null });
        try {
          const emailService = new EmailService(config);
          await emailService.sendTestEmail(recipientEmail);
        } catch (error: any) {
          set({ error: error.message || 'Test e-postası gönderilemedi' });
          throw error;
        } finally {
          set({ isTesting: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'email-store',
      partialize: (state) => ({
        config: state.config,
        isConfigured: state.isConfigured,
      }),
    }
  )
);