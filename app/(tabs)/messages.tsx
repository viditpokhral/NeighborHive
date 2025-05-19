import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { useMessagesStore } from '@/store/messagesStore';
import Colors from '@/constants/colors';
import ConversationItem from '@/components/messages/ConversationItem';
import EmptyState from '@/components/ui/EmptyState';
import { MessageCircle } from 'lucide-react-native';
import { Conversation } from '@/types';

export default function MessagesScreen() {
  const { user } = useAuthStore();
  const { conversations, fetchConversations, isLoading } = useMessagesStore();
  
  useEffect(() => {
    if (user) {
      fetchConversations(user.id);
    }
  }, [user]);
  
  const renderItem = ({ item }: { item: Conversation }) => (
    <ConversationItem 
      conversation={item} 
      currentUserId={user?.id || ''}
    />
  );
  
  const renderEmptyComponent = () => (
    <EmptyState
      title="No Messages Yet"
      message="When you start conversations with other users, they'll appear here."
      icon={<MessageCircle size={48} color={Colors.text.secondary} />}
      style={styles.emptyState}
    />
  );
  
  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        onRefresh={() => user && fetchConversations(user.id)}
        refreshing={isLoading}
        ListEmptyComponent={renderEmptyComponent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
  },
});