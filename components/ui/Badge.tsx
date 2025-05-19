import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Colors from '@/constants/colors';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'error' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Badge({ 
  label, 
  variant = 'primary', 
  style, 
  textStyle 
}: BadgeProps) {
  return (
    <View style={[styles.badge, styles[`${variant}Badge`], style]}>
      <Text style={[styles.text, styles[`${variant}Text`], textStyle]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Variants
  primaryBadge: {
    backgroundColor: `${Colors.primary}20`, // 20% opacity
  },
  primaryText: {
    color: Colors.primary,
  },
  
  secondaryBadge: {
    backgroundColor: `${Colors.secondary}20`,
  },
  secondaryText: {
    color: Colors.secondary,
  },
  
  successBadge: {
    backgroundColor: `${Colors.success}20`,
  },
  successText: {
    color: Colors.success,
  },
  
  errorBadge: {
    backgroundColor: `${Colors.error}20`,
  },
  errorText: {
    color: Colors.error,
  },
  
  neutralBadge: {
    backgroundColor: `${Colors.text.secondary}20`,
  },
  neutralText: {
    color: Colors.text.secondary,
  },
});