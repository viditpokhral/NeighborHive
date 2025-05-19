import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import Colors from '@/constants/colors';

interface CategoryPillProps {
  label: string;
  icon?: string;
  isSelected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function CategoryPill({ 
  label, 
  icon, 
  isSelected = false, 
  onPress, 
  style, 
  textStyle 
}: CategoryPillProps) {
  return (
    <TouchableOpacity
      style={[
        styles.pill,
        isSelected ? styles.selectedPill : styles.unselectedPill,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text 
        style={[
          styles.label,
          isSelected ? styles.selectedLabel : styles.unselectedLabel,
          textStyle,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  selectedPill: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  unselectedPill: {
    backgroundColor: Colors.card,
    borderColor: Colors.border,
  },
  icon: {
    marginRight: 6,
    fontSize: 16,
  },
  label: {
    fontWeight: '500',
    fontSize: 14,
  },
  selectedLabel: {
    color: Colors.text.light,
  },
  unselectedLabel: {
    color: Colors.text.primary,
  },
});