import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { User } from '@/types';
import RenterCard from './RenterCard';
import Colors from '@/constants/colors';

interface NearbyRentersListProps {
  renters: Array<{
    user: User;
    distance: number;
    itemCount: number;
  }>;
  title?: string;
  showSeeAll?: boolean;
  limit?: number;
  horizontal?: boolean;
}

export default function NearbyRentersList({
  renters,
  title = "Nearby Renters",
  showSeeAll = true,
  limit = 5,
  horizontal = true,
}: NearbyRentersListProps) {
  const router = useRouter();
  const displayRenters = renters.slice(0, limit);

  const handleSeeAll = () => {
    router.push('/nearby-renters');
  };

  if (renters.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {showSeeAll && (
          <TouchableOpacity onPress={handleSeeAll}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        )}
      </View>

      {horizontal ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {displayRenters.map((item) => (
            <View key={item.user.id} style={styles.horizontalCard}>
              <RenterCard
                renter={item.user}
                distance={item.distance}
                itemCount={item.itemCount}
              />
            </View>
          ))}
        </ScrollView>
      ) : (
        <View>
          {displayRenters.map((item) => (
            <RenterCard
              key={item.user.id}
              renter={item.user}
              distance={item.distance}
              itemCount={item.itemCount}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
  },
  scrollContent: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  horizontalCard: {
    width: 280,
    marginRight: 12,
  },
});