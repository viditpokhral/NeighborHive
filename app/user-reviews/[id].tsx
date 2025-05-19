import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Star } from 'lucide-react-native';
import { useUsersStore } from '@/store/usersStore';
import Avatar from '@/components/ui/Avatar';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import Colors from '@/constants/colors';
import reviews from '@/mocks/reviews';

export default function UserReviewsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getUserById } = useUsersStore();
  
  const user = getUserById(id);
  const userReviews = reviews.filter(review => review.userId === id);
  
  if (!user) {
    return (
      <EmptyState
        title="User Not Found"
        message="The user you're looking for doesn't exist or has been removed."
      />
    );
  }
  
  const renderReview = ({ item }) => (
    <Card style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Avatar 
          source={item.reviewerAvatar} 
          name={item.reviewerName} 
          size={40} 
        />
        <View style={styles.reviewerInfo}>
          <Text style={styles.reviewerName}>{item.reviewerName}</Text>
          <Text style={styles.reviewDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          <Star size={14} color={Colors.primary} fill={Colors.primary} />
        </View>
      </View>
      
      <Text style={styles.reviewComment}>{item.comment}</Text>
    </Card>
  );
  
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Reviews for ${user.name}` }} />
      
      <View style={styles.summaryCard}>
        <View style={styles.ratingOverview}>
          <Text style={styles.ratingLarge}>{user.rating.toFixed(1)}</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star}
                size={16} 
                color={Colors.primary}
                fill={star <= Math.round(user.rating) ? Colors.primary : 'transparent'}
              />
            ))}
          </View>
          <Text style={styles.reviewCount}>
            Based on {user.reviewCount} reviews
          </Text>
        </View>
      </View>
      
      <FlatList
        data={userReviews}
        renderItem={renderReview}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            title="No Reviews Yet"
            message={`${user.name} hasn't received any reviews yet.`}
            icon={<Star size={48} color={Colors.text.secondary} />}
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
  summaryCard: {
    backgroundColor: Colors.card,
    padding: 16,
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ratingOverview: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  ratingLarge: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewCount: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  reviewCard: {
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  reviewDate: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginRight: 4,
  },
  reviewComment: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
});