import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Send } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface MessageInputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  onSend: (text: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export default function MessageInput({ 
  value, 
  onChangeText,
  onSend, 
  placeholder = 'Type a message...',
  isLoading = false
}: MessageInputProps) {
  const [text, setText] = useState('');
  
  // Use either controlled or uncontrolled input
  const inputText = value !== undefined ? value : text;
  const handleTextChange = (newText: string) => {
    if (onChangeText) {
      onChangeText(newText);
    } else {
      setText(newText);
    }
  };
  
  const handleSend = () => {
    if (inputText.trim()) {
      onSend(inputText.trim());
      if (!onChangeText) {
        setText('');
      }
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={handleTextChange}
            placeholder={placeholder}
            placeholderTextColor={Colors.text.secondary}
            multiline
            maxLength={500}
          />
          
          <TouchableOpacity 
            style={[
              styles.sendButton,
              (!inputText.trim() || isLoading) && styles.disabledButton
            ]} 
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.text.light} />
            ) : (
              <Send 
                size={20} 
                color={inputText.trim() ? Colors.text.light : Colors.inactive} 
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.card,
    padding: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: Colors.inactive,
  },
});