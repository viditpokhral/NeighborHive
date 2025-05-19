import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatTime } from '@/utils/dateUtils';
import { Message } from '@/types';
import Colors from '@/constants/colors';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

export default function MessageBubble({ 
  message, 
  isCurrentUser 
}: MessageBubbleProps) {
  return (
    <View style={[
      styles.container,
      isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer
    ]}>
      <View style={[
        styles.bubble,
        isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
      ]}>
        <Text style={[
          styles.text,
          isCurrentUser ? styles.currentUserText : styles.otherUserText
        ]}>
          {message.text}
        </Text>
      </View>
      
      <Text style={styles.time}>
        {formatTime(new Date(message.createdAt))}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  currentUserContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherUserContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  currentUserBubble: {
    backgroundColor: Colors.primary,
  },
  otherUserBubble: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  text: {
    fontSize: 16,
  },
  currentUserText: {
    color: Colors.text.light,
  },
  otherUserText: {
    color: Colors.text.primary,
  },
  time: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 4,
  },
});