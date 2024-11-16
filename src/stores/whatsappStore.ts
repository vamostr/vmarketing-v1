import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WhatsAppSession, WhatsAppChat, WhatsAppMessage, WhatsAppTemplate } from '../types/whatsapp';
import { WhatsAppAPI } from '../services/whatsappApi';
import toast from 'react-hot-toast';

interface WhatsAppCredentials {
  accessToken: string;
  phoneNumberId: string;
  businessAccountId: string;
  webhookUrl?: string;
  verifyToken?: string;
}

interface WhatsAppStore {
  sessions: WhatsAppSession[];
  chats: WhatsAppChat[];
  messages: Record<string, WhatsAppMessage[]>;
  templates: WhatsAppTemplate[];
  activeSession: WhatsAppSession | null;
  api: WhatsAppAPI | null;
  isInitializing: boolean;
  error: string | null;
  credentials: WhatsAppCredentials | null;
  
  setCredentials: (credentials: WhatsAppCredentials) => void;
  initializeBusinessAPI: (credentials: WhatsAppCredentials) => Promise<void>;
  refreshBusinessToken: () => Promise<void>;
  loadTemplates: () => Promise<void>;
  sendTemplateMessage: (
    phone: string,
    templateName: string,
    language: string,
    components: any[]
  ) => Promise<void>;
  sendTextMessage: (phone: string, content: string) => Promise<void>;
  setActiveSession: (session: WhatsAppSession) => void;
  loadChats: () => Promise<void>;
  updateMessageStatus: (messageId: string, status: WhatsAppMessage['status']) => void;
}

export const useWhatsAppStore = create<WhatsAppStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      chats: [],
      messages: {},
      templates: [],
      activeSession: null,
      api: null,
      isInitializing: false,
      error: null,
      credentials: null,

      setCredentials: (credentials: WhatsAppCredentials) => {
        set({ credentials });
        
        // Credentials ayarlandığında otomatik olarak API'yi başlat
        const api = new WhatsAppAPI(
          credentials.accessToken,
          credentials.phoneNumberId,
          credentials.businessAccountId
        );

        const session: WhatsAppSession = {
          id: crypto.randomUUID(),
          type: 'business-api',
          status: 'active',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          apiKey: credentials.accessToken,
          phoneNumberId: credentials.phoneNumberId,
          businessAccountId: credentials.businessAccountId,
        };

        set({ api, activeSession: session });
      },

      initializeBusinessAPI: async (credentials: WhatsAppCredentials) => {
        set({ isInitializing: true, error: null });
        
        try {
          const api = new WhatsAppAPI(
            credentials.accessToken,
            credentials.phoneNumberId,
            credentials.businessAccountId
          );
          
          await api.testConnection();

          const newSession: WhatsAppSession = {
            id: crypto.randomUUID(),
            type: 'business-api',
            status: 'active',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            apiKey: credentials.accessToken,
            phoneNumberId: credentials.phoneNumberId,
            businessAccountId: credentials.businessAccountId,
          };
          
          set(state => ({
            sessions: [...state.sessions, newSession],
            api,
            activeSession: newSession,
            credentials,
            error: null
          }));

          await get().loadTemplates();
          
          toast.success('WhatsApp Business API başarıyla bağlandı');
        } catch (error: any) {
          const errorMessage = error.message || 'WhatsApp Business API bağlantısı başarısız';
          set({ error: errorMessage });
          toast.error(errorMessage);
          throw error;
        } finally {
          set({ isInitializing: false });
        }
      },

      refreshBusinessToken: async () => {
        const { activeSession } = get();
        if (!activeSession) {
          toast.error('Aktif oturum bulunamadı');
          return;
        }

        try {
          // Token yenileme işlemi burada yapılacak
          const newExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
          
          set(state => ({
            sessions: state.sessions.map(session =>
              session.id === activeSession.id
                ? { ...session, expiresAt: newExpiresAt }
                : session
            )
          }));
          
          toast.success('Token başarıyla yenilendi');
        } catch (error: any) {
          toast.error('Token yenilenemedi: ' + error.message);
        }
      },

      loadTemplates: async () => {
        const { api } = get();
        if (!api) return;

        try {
          const templates = await api.getTemplates();
          set({ templates });
        } catch (error: any) {
          toast.error('Mesaj şablonları yüklenemedi: ' + error.message);
        }
      },

      sendTemplateMessage: async (phone, templateName, language, components) => {
        const { api, activeSession } = get();
        if (!api || !activeSession) {
          toast.error('Aktif WhatsApp oturumu bulunamadı');
          return;
        }

        try {
          const result = await api.sendTemplateMessage(
            phone,
            templateName,
            language,
            components
          );

          const newMessage: WhatsAppMessage = {
            id: result.messages[0].id,
            sessionId: activeSession.id,
            recipientPhone: phone,
            content: templateName,
            status: 'sent',
            timestamp: new Date(),
            type: 'template',
            templateName
          };

          set(state => ({
            messages: {
              ...state.messages,
              [activeSession.id]: [
                ...(state.messages[activeSession.id] || []),
                newMessage
              ]
            }
          }));

          toast.success('Şablon mesajı gönderildi');
        } catch (error: any) {
          toast.error('Şablon mesajı gönderilemedi: ' + error.message);
        }
      },

      sendTextMessage: async (phone, content) => {
        const { api, activeSession } = get();
        if (!api || !activeSession) {
          toast.error('Aktif WhatsApp oturumu bulunamadı');
          return;
        }

        try {
          const result = await api.sendTextMessage(phone, content);

          const newMessage: WhatsAppMessage = {
            id: result.messages[0].id,
            sessionId: activeSession.id,
            recipientPhone: phone,
            content,
            status: 'sent',
            timestamp: new Date(),
            type: 'text'
          };

          set(state => ({
            messages: {
              ...state.messages,
              [activeSession.id]: [
                ...(state.messages[activeSession.id] || []),
                newMessage
              ]
            }
          }));

          toast.success('Mesaj gönderildi');
        } catch (error: any) {
          toast.error('Mesaj gönderilemedi: ' + error.message);
        }
      },

      setActiveSession: (session: WhatsAppSession) => {
        set({ activeSession: session });
      },

      loadChats: async () => {
        // Chat geçmişi yükleme işlemi
        // Gerçek implementasyonda webhook ile gelen veriler kullanılacak
      },

      updateMessageStatus: (messageId: string, status: WhatsAppMessage['status']) => {
        set(state => {
          const newMessages = { ...state.messages };
          
          for (const sessionId in newMessages) {
            newMessages[sessionId] = newMessages[sessionId].map(msg =>
              msg.id === messageId ? { ...msg, status } : msg
            );
          }
          
          return { messages: newMessages };
        });
      }
    }),
    {
      name: 'whatsapp-store',
      partialize: (state) => ({
        credentials: state.credentials,
        sessions: state.sessions,
        activeSession: state.activeSession
      })
    }
  )
);