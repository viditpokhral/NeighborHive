import React from 'react';
import { FlatList, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Booking } from '@/types';
import BookingCard from './BookingCard';
import EmptyState from '@/components/ui/EmptyState';
import { Calendar, Filter } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface BookingListProps {
  bookings: Booking[];
  isOwner: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyButtonTitle?: string;
  onEmptyButtonPress?: () => void;
}

export default function BookingList({
  bookings,
  isOwner,
  onRefresh,
  refreshing = false,
  emptyTitle = "No bookings found",
  emptyMessage = "You don't have any bookings yet.",
  emptyButtonTitle,
  onEmptyButtonPress,
}: BookingListProps) {
  const router = useRouter();
  const [filterStatus, setFilterStatus] = React.useState<string | null>(null);
  
  const filteredBookings = React.useMemo(() => {
    if (!filterStatus) return bookings;
    return bookings.filter(booking => booking.status === filterStatus);
  }, [bookings, filterStatus]);
  
  const renderItem = ({ item }: { item: Booking }) => (
    <BookingCard booking={item} isOwner={isOwner} />
  );

  const renderEmptyComponent = () => (
    <EmptyState
      title={emptyTitle}
      message={emptyMessage}
      icon={<Calendar size={48} color={Colors.text.secondary} />}
      buttonTitle={emptyButtonTitle}
      onButtonPress={onEmptyButtonPress}
      style={styles.emptyState}
    />
  );
  
  const renderHeader = () => {
    if (bookings.length === 0) return null;
    
    return (
      <View style={styles.filterContainer}>
        <View style={styles.filterHeader}>
          <Text style={styles.filterTitle}>Filter by Status</Text>
          <TouchableOpacity 
            onPress={() => setFilterStatus(null)}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterOptions}
        >
          <TouchableOpacity
            style={[
              styles.filterOption,
              filterStatus === 'pending' && styles.activeFilter
            ]}
            onPress={() => setFilterStatus('pending')}
          >
            <Text style={[
              styles.filterText,
              filterStatus === 'pending' && styles.activeFilterText
            ]}>Pending</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterOption,
              filterStatus === 'approved' && styles.activeFilter
            ]}
            onPress={() => setFilterStatus('approved')}
          >
            <Text style={[
              styles.filterText,
              filterStatus === 'approved' && styles.activeFilterText
            ]}>Approved</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterOption,
              filterStatus === 'active' && styles.activeFilter
            ]}
            onPress={() => setFilterStatus('active')}
          >
            <Text style={[
              styles.filterText,
              filterStatus === 'active' && styles.activeFilterText
            ]}>Active</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterOption,
              filterStatus === 'completed' && styles.activeFilter
            ]}
            onPress={() => setFilterStatus('completed')}
          >
            <Text style={[
              styles.filterText,
              filterStatus === 'completed' && styles.activeFilterText
            ]}>Completed</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterOption,
              (filterStatus === 'cancelled' || filterStatus === 'rejected') && styles.activeFilter
            ]}
            onPress={() => setFilterStatus('cancelled')}
          >
            <Text style={[
              styles.filterText,
              (filterStatus === 'cancelled' || filterStatus === 'rejected') && styles.activeFilterText
            ]}>Cancelled</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  return (
    <FlatList
      data={filteredBookings}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      onRefresh={onRefresh}
      refreshing={refreshing}
      ListEmptyComponent={renderEmptyComponent}
      ListHeaderComponent={renderHeader}
    />
  );
}

import { ScrollView } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 8,
  },
  emptyState: {
    paddingTop: 60,
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    fontSize: 14,
    color: Colors.primary,
  },
  filterOptions: {
    paddingVertical: 4,
  },
  filterOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
    backgroundColor: Colors.background,
  },
  activeFilter: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  activeFilterText: {
    color: Colors.text.light,
    fontWeight: '500',
  },
});