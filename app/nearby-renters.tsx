import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { MapPin, Filter } from 'lucide-react-native';
import { useUsersStore } from '@/store/usersStore';
import { useLocationStore } from '@/store/locationStore';
import RenterCard from '@/components/users/RenterCard';
import EmptyState from '@/components/ui/EmptyState';
import Colors from '@/constants/colors';

export default function NearbyRentersScreen() {
  const router = useRouter();
  const { getNearbyUsers, fetchUsers } = useUsersStore();
  const { location, address, neighborhood, getCurrentLocation } = useLocationStore();
  
  const [maxDistance, setMaxDistance] = useState(10); // Default 10km
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  useEffect(() => {
    fetchUsers();
    if (!location) {
      getCurrentLocation();
    }
  }, []);
  
  const nearbyRenters = getNearbyUsers(maxDistance);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchUsers(), getCurrentLocation()]);
    setIsRefreshing(false);
  };
  
  const handleFilterPress = () => {
    // In a real app, this would open a filter modal
    // For now, we'll just cycle through distance options
    const distances = [5, 10, 25, 50];
    const currentIndex = distances.indexOf(maxDistance);
    const nextIndex = (currentIndex + 1) % distances.length;
    setMaxDistance(distances[nextIndex]);
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Nearby Renters',
          headerRight: () => (
            <TouchableOpacity onPress={handleFilterPress} style={styles.filterButton}>
              <Filter size={20} color={Colors.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      {location && (
        <View style={styles.locationContainer}>
          <MapPin size={16} color={Colors.text.secondary} />
          <Text style={styles.locationText}>
            {neighborhood || address || 'Current location'} • {maxDistance} km radius
          </Text>
        </View>
      )}
      
      <FlatList
        data={nearbyRenters}
        keyExtractor={(item) => item.user.id}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <RenterCard
              renter={item.user}
              distance={item.distance}
              itemCount={item.itemCount}
            />
          </View>
        )}
        contentContainerStyle={styles.listContent}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
        ListEmptyComponent={
          <EmptyState
            title="No Renters Nearby"
            message={`There are no renters within ${maxDistance} km of your location. Try increasing the distance or check back later.`}
            icon={<MapPin size={48} color={Colors.text.secondary} />}
            buttonTitle="Refresh"
            onButtonPress={handleRefresh}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  locationText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  filterButton: {
    padding: 8,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  cardContainer: {
    marginBottom: 12,
  },
});