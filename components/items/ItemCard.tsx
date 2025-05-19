import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import { Item } from '@/types';
import Colors from '@/constants/colors';
import Card from '@/components/ui/Card';
import Rating from '@/components/ui/Rating';
import Badge from '@/components/ui/Badge';

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  const router = useRouter();
  
  const handlePress = () => {
    router.push(`/item/${item.id}`);
  };
  
  const rentalTypeLabel = () => {
    switch (item.rentalType) {
      case 'loan':
        return 'Borrow for Free';
      case 'rent':
        return `₹${item.price}/day`;
      case 'swap':
        return 'Available for Swap';
      default:
        return '';
    }
  };
  
  const rentalTypeBadge = () => {
    switch (item.rentalType) {
      case 'loan':
        return <Badge label="Free" variant="success" />;
      case 'rent':
        return <Badge label={`₹${item.price}/day`} variant="primary" />;
      case 'swap':
        return <Badge label="Swap" variant="secondary" />;
      default:
        return null;
    }
  };
  
  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <Card style={styles.card}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: item.images[0] }} 
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.badgeContainer}>
            {rentalTypeBadge()}
          </View>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          
          <View style={styles.locationContainer}>
            <MapPin size={14} color={Colors.text.secondary} />
            <Text style={styles.location} numberOfLines={1}>
              {item.location.neighborhood}
            </Text>
          </View>
          
          <View style={styles.footer}>
            <Rating 
              value={item.rating} 
              size="small" 
              reviewCount={item.reviewCount}
            />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});