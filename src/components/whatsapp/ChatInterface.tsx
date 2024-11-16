import React, { useState } from 'react';
import { Send, FileText, Search, Plus, User } from 'lucide-react';
import { useWhatsAppStore } from '../../stores/whatsappStore';
import { useContactStore } from '../../stores/contactStore';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { WhatsAppChat } from '../../types/whatsapp';

export const ChatInterface: React.FC = () => {
  const {
    messages,
    templates,
    sendTextMessage,
    sendTemplateMessage,
    activeSession,
    chats
  } = useWhatsAppStore();

  const { contacts } = useContactStore();

  const [newMessage, setNewMessage] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedChat, setSelectedChat] = useState<WhatsAppChat | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;
    
    try {
      await sendTextMessage(selectedChat.contactPhone, newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Mesaj gönderilemedi:', error);
    }
  };

  const handleSendTemplate = async (template: any) => {
    if (!selectedChat) return;
    
    try {
      await sendTemplateMessage(
        selectedChat.contactPhone,
        template.name,
        template.language,
        template.components
      );
      setShowTemplates(false);
    } catch (error) {
      console.error('Template mesajı gönderilemedi:', error);
    }
  };

  const handleSelectContact = (contact: any) => {
    const existingChat = chats.find(chat => chat.contactPhone === contact.phone);
    
    if (existingChat) {
      setSelectedChat(existingChat);
    } else {
      const newChat: WhatsAppChat = {
        id: crypto.randomUUID(),
        sessionId: activeSession?.id || '',
        contactPhone: contact.phone,
        contactName: contact.name,
        unreadCount: 0,
        lastActivity: new Date(),
        status: 'active'
      };
      setSelectedChat(newChat);
    }
    setShowContactPicker(false);
    setSearchTerm('');
  };

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredChats = chats.filter(chat => 
    chat.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.contactPhone.includes(searchQuery)
  );

  const sessionMessages = selectedChat 
    ? (messages[activeSession?.id || ''] || []).filter(
        msg => msg.recipientPhone === selectedChat.contactPhone
      )
    : [];

  return (
    <div className="flex h-[600px] bg-white rounded-lg shadow-lg">
      {/* Sol Sidebar - Sohbetler */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Sohbet ara..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedChat?.id === chat.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 font-medium">
                    {chat.contactName[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {chat.contactName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {chat.contactPhone}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {chat.lastMessage?.content || 'Yeni sohbet'}
                  </p>
                </div>
                {chat.unreadCount > 0 && (
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white text-xs">
                      {chat.unreadCount}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t">
          <button
            onClick={() => setShowContactPicker(true)}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Yeni Sohbet
          </button>
        </div>
      </div>

      {/* Sağ Taraf - Mesajlaşma */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Sohbet Başlığı */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 font-medium">
                    {selectedChat.contactName[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedChat.contactName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedChat.contactPhone}
                  </p>
                </div>
              </div>
            </div>

            {/* Mesaj Listesi */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {sessionMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.status === 'sent' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.status === 'sent'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-900'
                    }`}
                  >
                    <p>{message.content}</p>
                    <div className="flex items-center justify-end space-x-2 mt-1">
                      <span className="text-xs opacity-75">
                        {format(new Date(message.timestamp), 'HH:mm', { locale: tr })}
                      </span>
                      <span className="text-xs">
                        {message.status === 'sent' && '✓'}
                        {message.status === 'delivered' && '✓✓'}
                        {message.status === 'read' && '✓✓'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mesaj Gönderme */}
            <div className="p-4 border-t">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <button
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <FileText className="h-5 w-5" />
                  </button>
                </div>
                
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Mesajınızı yazın..."
                  className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sohbet seçilmedi
              </h3>
              <p className="text-gray-600">
                Mesajlaşmaya başlamak için bir sohbet seçin veya yeni bir sohbet başlatın
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Kişi Seçici Modal */}
      {showContactPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Kişi Seç</h3>
              <button
                onClick={() => setShowContactPicker(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                &times;
              </button>
            </div>

            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="İsim veya telefon ile ara..."
                  className="w-full pl-10 input"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto">
              {filteredContacts.filter(contact => contact.phone).map(contact => (
                <button
                  key={contact.id}
                  onClick={() => handleSelectContact(contact)}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center space-x-3"
                >
                  <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-gray-500">{contact.phone}</p>
                  </div>
                </button>
              ))}
              {filteredContacts.filter(contact => contact.phone).length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  Telefon numarası olan kişi bulunamadı
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Şablon Seçici */}
      {showTemplates && (
        <div className="absolute right-0 bottom-full mb-2 w-80 bg-white rounded-lg shadow-xl border p-4 max-h-80 overflow-y-auto">
          <h4 className="font-medium mb-2">Mesaj Şablonları</h4>
          <div className="space-y-2">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSendTemplate(template)}
                className="w-full text-left p-2 hover:bg-gray-50 rounded-md"
              >
                <p className="font-medium">{template.name}</p>
                <p className="text-sm text-gray-600">
                  {template.components.find(c => c.type === 'body')?.text}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};