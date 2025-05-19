import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { MapPin, Star, MessageCircle, Calendar, Shield, ChevronRight } from 'lucide-react-native';
import { useUsersStore } from '@/store/usersStore';
import { useItemsStore } from '@/store/itemsStore';
import { useLocationStore } from '@/store/locationStore';
import { useAuthStore } from '@/store/authStore';
import { getDistanceBetweenLocations } from '@/utils/locationUtils';
import { formatDistance } from '@/utils/locationUtils';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ItemCard from '@/components/items/ItemCard';
import EmptyState from '@/components/ui/EmptyState';
import Colors from '@/constants/colors';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getUserById } = useUsersStore();
  const { items } = useItemsStore();
  const { location } = useLocationStore();
  const { user: currentUser } = useAuthStore();
  
  const [distance, setDistance] = useState<number | null>(null);
  
  const user = getUserById(id);
  const userItems = items.filter(item => item.owner.id === id);
  
  useEffect(() => {
    if (location && user?.location) {
      const calculatedDistance = getDistanceBetweenLocations(location, user.location);
      setDistance(calculatedDistance);
    }
  }, [location, user]);
  
  if (!user) {
    return (
      <EmptyState
        title="User Not Found"
        message="The user you're looking for doesn't exist or has been removed."
        buttonTitle="Go Back"
        onButtonPress={() => router.back()}
      />
    );
  }
  
  const handleMessage = () => {
    // In a real app, this would create or open a conversation
    router.push(`/messages/${user.id}`);
  };
  
  const isCurrentUser = currentUser?.id === user.id;
  
  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: user.name }} />
      
      <View style={styles.header}>
        <Avatar source={user.avatar} name={user.name} size={80} showBorder />
        
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user.name}</Text>
          
          <View style={styles.ratingContainer}>
            <Star size={16} color={Colors.primary} fill={Colors.primary} />
            <Text style={styles.rating}>
              {user.rating.toFixed(1)} ({user.reviewCount} reviews)
            </Text>
          </View>
          
          {user.verified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
        </View>
      </View>
      
      {!isCurrentUser && (
        <View style={styles.actionButtons}>
          <Button
            title="Message"
            onPress={handleMessage}
            style={styles.messageButton}
            leftIcon={<MessageCircle size={18} color={Colors.text.light} />}
          />
        </View>
      )}
      
      <Card style={styles.infoCard}>
        {user.location && distance !== null && (
          <View style={styles.infoRow}>
            <MapPin size={18} color={Colors.text.secondary} />
            <Text style={styles.infoText}>
              {formatDistance(distance)}
            </Text>
          </View>
        )}
        
        <View style={styles.infoRow}>
          <Calendar size={18} color={Colors.text.secondary} />
          <Text style={styles.infoText}>
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Shield size={18} color={Colors.text.secondary} />
          <Text style={styles.infoText}>
            {user.verified ? "Identity verified" : "Identity not verified"}
          </Text>
        </View>
      </Card>
      
      {user.bio && (
        <Card style={styles.bioCard}>
          <Text style={styles.bioTitle}>About</Text>
          <Text style={styles.bioText}>{user.bio}</Text>
        </Card>
      )}
      
      <View style={styles.itemsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{`${user.name.split(' ')[0]}'s Items`}</Text>
          {userItems.length > 0 && (
            <TouchableOpacity onPress={() => router.push(`/user-items/${user.id}`)}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {userItems.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.itemsContainer}
          >
            {userItems.slice(0, 5).map(item => (
              <View key={item.id} style={styles.itemCard}>
                <ItemCard item={item} />
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyItems}>
            <Text style={styles.emptyText}>
              {isCurrentUser 
                ? "You haven't listed any items yet." 
                : `${user.name.split(' ')[0]} hasn't listed any items yet.`}
            </Text>
            {isCurrentUser && (
              <Button
                title="Add an Item"
                onPress={() => router.push('/add-item')}
                size="small"
                style={styles.addButton}
              />
            )}
          </View>
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.reviewsButton}
        onPress={() => router.push(`/user-reviews/${user.id}`)}
      >
        <View style={styles.reviewsButtonContent}>
          <Text style={styles.reviewsButtonText}>Reviews</Text>
          <View style={styles.reviewsCount}>
            <Star size={14} color={Colors.primary} fill={Colors.primary} />
            <Text style={styles.reviewsCountText}>
              {user.rating.toFixed(1)} ({user.reviewCount})
            </Text>
          </View>
        </View>
        <ChevronRight size={20} color={Colors.text.secondary} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 24,
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  verifiedBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  verifiedText: {
    color: Colors.text.light,
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtons: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  messageButton: {
    width: '100%',
  },
  infoCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  bioCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  bioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  bioText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  itemsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
  },
  itemsContainer: {
    paddingHorizontal: 16,
  },
  itemCard: {
    width: 220,
    marginRight: 16,
  },
  emptyItems: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  addButton: {
    minWidth: 120,
  },
  reviewsButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  reviewsButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewsButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
    marginRight: 12,
  },
  reviewsCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewsCountText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
});