import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { formatDistanceToNow } from '@/utils/dateUtils';
import { Conversation } from '@/types';
import Avatar from '@/components/ui/Avatar';
import Colors from '@/constants/colors';

interface ConversationItemProps {
  conversation: Conversation;
  currentUserId: string;
}

export default function ConversationItem({ 
  conversation, 
  currentUserId 
}: ConversationItemProps) {
  const router = useRouter();
  
  // Find the other participant (not the current user)
  const otherParticipant = conversation.participants.find(
    p => p.id !== currentUserId
  );
  
  const handlePress = () => {
    router.push(`/messages/${conversation.id}`);
  };
  
  if (!otherParticipant) return null;
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Avatar 
        source={otherParticipant.avatar} 
        name={otherParticipant.name} 
        size={50}
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {otherParticipant.name}
          </Text>
          
          {conversation.lastMessage && (
            <Text style={styles.time}>
              {formatDistanceToNow(new Date(conversation.lastMessage.createdAt))}
            </Text>
          )}
        </View>
        
        <View style={styles.messageContainer}>
          {conversation.itemTitle && (
            <Text style={styles.itemTitle} numberOfLines={1}>
              Re: {conversation.itemTitle}
            </Text>
          )}
          
          {conversation.lastMessage ? (
            <Text 
              style={[
                styles.message,
                conversation.unreadCount > 0 && 
                conversation.lastMessage.senderId !== currentUserId && 
                styles.unreadMessage
              ]} 
              numberOfLines={1}
            >
              {conversation.lastMessage.text}
            </Text>
          ) : (
            <Text style={styles.message} numberOfLines={1}>
              Start a conversation...
            </Text>
          )}
          
          {conversation.unreadCount > 0 && 
           conversation.lastMessage?.senderId !== currentUserId && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {conversation.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.card,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
  },
  time: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 14,
    color: Colors.primary,
    marginRight: 4,
  },
  message: {
    fontSize: 14,
    color: Colors.text.secondary,
    flex: 1,
  },
  unreadMessage: {
    fontWeight: '600',
    color: Colors.text.primary,
  },
  badge: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  badgeText: {
    color: Colors.text.light,
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 6,
  },
});