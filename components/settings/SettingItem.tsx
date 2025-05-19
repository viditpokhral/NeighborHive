import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value?: string | boolean;
  isSwitch?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  onValueChange?: (value: boolean) => void;
}

export default function SettingItem({
  icon,
  title,
  subtitle,
  value,
  isSwitch,
  disabled,
  onPress,
  onValueChange,
}: SettingItemProps) {
  const Container = disabled ? View : TouchableOpacity;
  
  return (
    <Container
      style={[
        styles.container,
        disabled && styles.disabled
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.iconContainer}>{icon}</View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      
      {isSwitch ? (
        <Switch
          value={value as boolean}
          onValueChange={onValueChange}
          trackColor={{ false: Colors.border, true: Colors.primary }}
        />
      ) : value ? (
        <Text style={styles.value}>{value}</Text>
      ) : (
        <ChevronRight size={20} color={Colors.text.secondary} />
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  disabled: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  value: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
});