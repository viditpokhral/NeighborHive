import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DollarSign, Calendar, Heart, Star } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Card from '@/components/ui/Card';

interface BorrowerStatsProps {
  totalSpent: number;
  activeBookings: number;
  completedBookings: number;
  savedItems: number;
  reviewsGiven: number;
}

export default function BorrowerStats({
  totalSpent,
  activeBookings,
  completedBookings,
  savedItems,
  reviewsGiven
}: BorrowerStatsProps) {
  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Borrower Statistics</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <DollarSign size={20} color={Colors.secondary} />
          <Text style={styles.statValue}>₹{totalSpent.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Total Spent</Text>
        </View>
        
        <View style={styles.statItem}>
          <Calendar size={20} color={Colors.secondary} />
          <Text style={styles.statValue}>{activeBookings}</Text>
          <Text style={styles.statLabel}>Active Bookings</Text>
        </View>
        
        <View style={styles.statItem}>
          <Heart size={20} color={Colors.secondary} />
          <Text style={styles.statValue}>{savedItems}</Text>
          <Text style={styles.statLabel}>Saved Items</Text>
        </View>
        
        <View style={styles.statItem}>
          <Star size={20} color={Colors.secondary} />
          <Text style={styles.statValue}>{reviewsGiven}</Text>
          <Text style={styles.statLabel}>Reviews Given</Text>
        </View>
      </View>
      
      <View style={styles.totalBookings}>
        <Text style={styles.totalBookingsText}>
          Total Bookings: {activeBookings + completedBookings}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  totalBookings: {
    alignItems: 'center',
    marginTop: 8,
  },
  totalBookingsText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
});