import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { useBookingsStore } from '@/store/bookingsStore';
import Colors from '@/constants/colors';
import BookingList from '@/components/bookings/BookingList';

type BookingTab = 'borrowing' | 'lending';

export default function BookingsScreen() {
  const { user } = useAuthStore();
  const { userBookings, userListings, fetchBookings, isLoading } = useBookingsStore();
  
  const [activeTab, setActiveTab] = useState<BookingTab>('borrowing');
  
  useEffect(() => {
    if (user) {
      fetchBookings(user.id);
    }
  }, [user]);
  
  const handleRefresh = () => {
    if (user) {
      fetchBookings(user.id);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'borrowing' && styles.activeTab
          ]}
          onPress={() => setActiveTab('borrowing')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'borrowing' && styles.activeTabText
          ]}>
            Borrowing
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'lending' && styles.activeTab
          ]}
          onPress={() => setActiveTab('lending')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'lending' && styles.activeTabText
          ]}>
            Lending
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'borrowing' ? (
        <BookingList
          bookings={userBookings}
          isOwner={false}
          onRefresh={handleRefresh}
          refreshing={isLoading}
          emptyTitle="No Borrowings Yet"
          emptyMessage="Items you borrow from others will appear here."
          emptyButtonTitle="Find Items to Borrow"
        />
      ) : (
        <BookingList
          bookings={userListings}
          isOwner={true}
          onRefresh={handleRefresh}
          refreshing={isLoading}
          emptyTitle="No Lending Activity"
          emptyMessage="When others borrow your items, they'll appear here."
          emptyButtonTitle="Add an Item to Share"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.card,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '600',
  },
});