import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar } from 'lucide-react-native';
import { Booking } from '@/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import { formatDateRange } from '@/utils/dateUtils';
import Colors from '@/constants/colors';

interface BookingCardProps {
  booking: Booking;
  isOwner: boolean;
}

export default function BookingCard({ booking, isOwner }: BookingCardProps) {
  const router = useRouter();
  
  const handlePress = () => {
    router.push(`/bookings/${booking.id}`);
  };
  
  const getStatusBadge = () => {
    switch (booking.status) {
      case 'pending':
        return <Badge label="Pending" variant="neutral" />;
      case 'approved':
        return <Badge label="Approved" variant="primary" />;
      case 'active':
        return <Badge label="Active" variant="secondary" />;
      case 'completed':
        return <Badge label="Completed" variant="success" />;
      case 'cancelled':
        return <Badge label="Cancelled" variant="error" />;
      case 'rejected':
        return <Badge label="Rejected" variant="error" />;
      default:
        return null;
    }
  };
  
  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: booking.itemImage }} 
              style={styles.image}
              resizeMode="cover"
            />
          </View>
          
          <View style={styles.headerContent}>
            <Text style={styles.title} numberOfLines={2}>
              {booking.itemTitle}
            </Text>
            
            <View style={styles.userInfo}>
              <Avatar 
                source={undefined} 
                name={isOwner ? booking.borrowerName : booking.ownerName} 
                size={24}
              />
              <Text style={styles.userName}>
                {isOwner ? booking.borrowerName : booking.ownerName}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.details}>
          <View style={styles.dateContainer}>
            <Calendar size={16} color={Colors.text.secondary} />
            <Text style={styles.date}>
              {formatDateRange(new Date(booking.startDate), new Date(booking.endDate))}
            </Text>
          </View>
          
          <View style={styles.footer}>
            {getStatusBadge()}
            
            <Text style={styles.price}>
              {booking.totalPrice > 0 
                ? `₹${booking.totalPrice.toFixed(2)}` 
                : 'Free'}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  headerContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  details: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  date: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
});