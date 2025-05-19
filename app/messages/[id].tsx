import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  TouchableOpacity
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useMessagesStore } from '@/store/messagesStore';
import { Message } from '@/types';
import Colors from '@/constants/colors';
import MessageBubble from '@/components/messages/MessageBubble';
import MessageInput from '@/components/messages/MessageInput';
import Avatar from '@/components/ui/Avatar';
import { formatDistanceToNow } from '@/utils/dateUtils';

export default function ConversationScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    conversations, 
    messages, 
    sendMessage, 
    markAsRead,
    fetchMessages,
    isLoading 
  } = useMessagesStore();
  
  const [currentMessage, setCurrentMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);
  
  const currentConversation = conversations.find(c => c.id === id);
  const conversationMessages = messages.filter(m => m.conversationId === id);
  
  // Get the other participant (not the current user)
  const otherParticipant = currentConversation?.participants.find(
    p => p.id !== user?.id
  );
  
  useEffect(() => {
    if (id) {
      fetchMessages(id as string);
      
      // Mark messages as read when opening the conversation
      if (currentConversation && (currentConversation.unreadCount ?? 0) > 0) {
        markAsRead(id as string);
      }
    }
  }, [id]);
  
  const handleSend = async () => {
    if (!currentMessage.trim() || !user || !id || !otherParticipant) return;
    
    await sendMessage({
      conversationId: id as string,
      text: currentMessage,
      receiverId: otherParticipant.id,
      senderId: user.id,
    });
    
    setCurrentMessage('');
    
    // Scroll to bottom after sending
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };
  
  const renderItem = ({ item }: { item: Message }) => {
    const isCurrentUser = item.senderId === user?.id;
    
    return (
      <MessageBubble
        message={item}
        isCurrentUser={isCurrentUser}
      />
    );
  };
  
  const renderHeader = () => {
    if (!currentConversation) return null;
    
    return (
      <View style={styles.headerContent}>
        {currentConversation.itemId && (
          <View style={styles.itemPreview}>
            <Text style={styles.aboutItemText}>
              About: {currentConversation.itemTitle || 'Item'}
            </Text>
            <TouchableOpacity 
              onPress={() => router.push(`/item/${currentConversation.itemId}`)}
              style={styles.viewItemButton}
            >
              <Text style={styles.viewItemText}>View Item</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };
  
  // Set up the header in the navigation
  return (
    <>
      <Stack.Screen
        options={{
          title: otherParticipant?.name || 'Conversation',
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => {
                // In a real app, navigate to user profile
                alert(`View ${otherParticipant?.name}'s profile`);
              }}
            >
              <Avatar 
                name={otherParticipant?.name || ''} 
                source={otherParticipant?.avatar}
                size={32}
              />
            </TouchableOpacity>
          ),
        }}
      />
      
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={conversationMessages}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesContainer}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No messages yet. Start the conversation!
              </Text>
            </View>
          }
          onLayout={() => {
            flatListRef.current?.scrollToEnd({ animated: false });
          }}
        />
        
        <MessageInput
          value={currentMessage}
          onChangeText={setCurrentMessage}
          onSend={handleSend}
          isLoading={isLoading}
        />
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  headerContent: {
    marginBottom: 16,
  },
  itemPreview: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  aboutItemText: {
    fontSize: 14,
    color: Colors.text.primary,
    flex: 1,
  },
  viewItemButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  viewItemText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    color: Colors.text.secondary,
    fontSize: 16,
    textAlign: 'center',
  },
});