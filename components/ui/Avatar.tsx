import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

interface AvatarProps {
  source?: string;
  name?: string;
  size?: number;
  showBorder?: boolean;
}

export default function Avatar({ 
  source, 
  name = '', 
  size = 40,
  showBorder = false
}: AvatarProps) {
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  const styles = createStyles(size, showBorder);

  return (
    <View style={styles.container}>
      {source ? (
        <Image 
          source={{ uri: source }} 
          style={styles.image} 
          resizeMode="cover"
        />
      ) : (
        <View style={styles.initialsContainer}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
      )}
    </View>
  );
}

const createStyles = (size: number, showBorder: boolean) => StyleSheet.create({
  container: {
    width: size,
    height: size,
    borderRadius: size / 2,
    overflow: 'hidden',
    backgroundColor: Colors.primary,
    borderWidth: showBorder ? 2 : 0,
    borderColor: Colors.card,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initialsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: Colors.text.light,
    fontSize: size * 0.4,
    fontWeight: 'bold',
  },
});