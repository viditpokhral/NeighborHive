import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Button from './Button';
import Colors from '@/constants/colors';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  buttonTitle?: string;
  onButtonPress?: () => void;
  style?: ViewStyle;
}

export default function EmptyState({
  title,
  message,
  icon,
  buttonTitle,
  onButtonPress,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      
      {buttonTitle && onButtonPress && (
        <Button
          title={buttonTitle}
          onPress={onButtonPress}
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    minWidth: 150,
  },
});