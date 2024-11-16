export interface WhatsAppSession {
  id: string;
  type: 'business-api';
  status: 'active' | 'expired' | 'pending';
  expiresAt?: Date;
  apiKey?: string;
  phoneNumberId: string;
  businessAccountId: string;
  webhookUrl?: string;
  webhookSecret?: string;
}

export interface WhatsAppMessage {
  id: string;
  sessionId: string;
  recipientPhone: string;
  content: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: Date;
  type: 'text' | 'template' | 'media';
  templateName?: string;
  mediaUrl?: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  language: string;
  components: {
    type: 'header' | 'body' | 'footer';
    text: string;
    parameters?: Array<{
      type: 'text' | 'currency' | 'date_time' | 'image' | 'document';
      value: string;
    }>;
  }[];
  status: 'approved' | 'pending' | 'rejected';
}

export interface WhatsAppChat {
  id: string;
  sessionId: string;
  contactPhone: string;
  contactName: string;
  lastMessage?: WhatsAppMessage;
  unreadCount: number;
  lastActivity: Date;
  status: 'active' | 'expired';
}