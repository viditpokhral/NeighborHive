import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Star } from 'lucide-react-native';
import Avatar from '@/components/ui/Avatar';
import Card from '@/components/ui/Card';
import Colors from '@/constants/colors';
import { User } from '@/types';
import { formatDistance } from '@/utils/locationUtils';

interface RenterCardProps {
  renter: User;
  distance?: number; // in kilometers
  itemCount?: number;
}

export default function RenterCard({ renter, distance, itemCount = 0 }: RenterCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/user/${renter.id}`);
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Avatar 
            source={renter.avatar} 
            name={renter.name} 
            size={50}
            showBorder
          />
          <View style={styles.userInfo}>
            <Text style={styles.name}>{renter.name}</Text>
            <View style={styles.ratingContainer}>
              <Star size={14} color={Colors.primary} fill={Colors.primary} />
              <Text style={styles.rating}>
                {renter.rating.toFixed(1)} ({renter.reviewCount})
              </Text>
            </View>
          </View>
        </View>

        {distance !== undefined && (
          <View style={styles.locationContainer}>
            <MapPin size={14} color={Colors.text.secondary} />
            <Text style={styles.locationText}>{formatDistance(distance)}</Text>
          </View>
        )}

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{itemCount}</Text>
            <Text style={styles.statLabel}>Items</Text>
          </View>
          
          {renter.verified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
        </View>

        {renter.bio && (
          <Text style={styles.bio} numberOfLines={2}>
            {renter.bio}
          </Text>
        )}
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginRight: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  verifiedBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    color: Colors.text.light,
    fontSize: 12,
    fontWeight: '500',
  },
  bio: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
});