import { create } from 'zustand';
import { Conversation, Message } from '@/types';
import mockConversations from '@/mocks/conversations';
import mockMessages from '@/mocks/messages';

interface MessagesState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  
  fetchConversations: (userId: string) => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (message: Omit<Message, 'id' | 'createdAt' | 'read'>) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
  startNewConversation: (participants: Conversation['participants'], itemId?: string, itemTitle?: string) => Promise<string>;
}

export const useMessagesStore = create<MessagesState>((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  error: null,
  
  fetchConversations: async (userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter conversations where user is a participant
      const userConversations = mockConversations.filter(
        conversation => conversation.participants.some(p => p.id === userId)
      );
      
      set({ conversations: userConversations, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch conversations', 
        isLoading: false 
      });
    }
  },
  
  fetchMessages: async (conversationId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find conversation
      const conversation = mockConversations.find(c => c.id === conversationId);
      
      if (!conversation) {
        throw new Error('Conversation not found');
      }
      
      // Filter messages for this conversation
      const conversationMessages = mockMessages.filter(
        message => message.conversationId === conversationId
      );
      
      // Sort messages by date
      const sortedMessages = [...conversationMessages].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      
      set({ 
        currentConversation: conversation, 
        messages: sortedMessages, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch messages', 
        isLoading: false 
      });
    }
  },
  
  sendMessage: async (message) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newMessage: Message = {
        ...message,
        id: `${Date.now()}`,
        read: false,
        createdAt: new Date().toISOString(),
      };
      
      set(state => {
        // Add message to list
        const updatedMessages = [...state.messages, newMessage];
        
        // Update conversation with last message
        const updatedConversations = state.conversations.map(conversation => 
          conversation.id === message.conversationId
            ? {
                ...conversation,
                lastMessage: {
                  text: newMessage.text,
                  createdAt: newMessage.createdAt,
                  senderId: newMessage.senderId,
                },
                unreadCount: conversation.unreadCount + 1,
              }
            : conversation
        );
        
        return {
          messages: updatedMessages,
          conversations: updatedConversations,
          isLoading: false,
        };
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to send message', 
        isLoading: false 
      });
    }
  },
  
  markAsRead: async (conversationId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set(state => {
        // Mark all messages in conversation as read
        const updatedMessages = state.messages.map(message => 
          message.conversationId === conversationId
            ? { ...message, read: true }
            : message
        );
        
        // Update unread count in conversation
        const updatedConversations = state.conversations.map(conversation => 
          conversation.id === conversationId
            ? { ...conversation, unreadCount: 0 }
            : conversation
        );
        
        return {
          messages: updatedMessages,
          conversations: updatedConversations,
          isLoading: false,
        };
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to mark messages as read', 
        isLoading: false 
      });
    }
  },
  
  startNewConversation: async (participants, itemId, itemTitle) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newConversationId = `conv_${Date.now()}`;
      
      const newConversation: Conversation = {
        id: newConversationId,
        participants,
        unreadCount: 0,
        itemId,
        itemTitle,
      };
      
      set(state => ({
        conversations: [newConversation, ...state.conversations],
        currentConversation: newConversation,
        messages: [],
        isLoading: false,
      }));
      
      return newConversationId;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to start conversation', 
        isLoading: false 
      });
      return '';
    }
  },
}));