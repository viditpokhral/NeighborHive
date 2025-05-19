import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface RatingProps {
  value: number;
  size?: 'small' | 'medium' | 'large';
  showValue?: boolean;
  reviewCount?: number;
}

export default function Rating({ 
  value, 
  size = 'medium', 
  showValue = true,
  reviewCount
}: RatingProps) {
  const starSize = size === 'small' ? 14 : size === 'medium' ? 18 : 24;
  const textSize = size === 'small' ? 12 : size === 'medium' ? 14 : 16;
  
  return (
    <View style={styles.container}>
      <Star
        size={starSize}
        fill={Colors.rating}
        color={Colors.rating}
      />
      
      {showValue && (
        <Text style={[styles.value, { fontSize: textSize }]}>
          {value.toFixed(1)}
          {reviewCount !== undefined && (
            <Text style={styles.reviewCount}> ({reviewCount})</Text>
          )}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  value: {
    color: Colors.text.primary,
    fontWeight: '600',
  },
  reviewCount: {
    color: Colors.text.secondary,
    fontWeight: 'normal',
  },
});