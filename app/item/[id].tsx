import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  MessageCircle, 
  ChevronLeft, 
  ChevronRight,
  Star,
  Heart,
  Share2,
  Shield,
  Clock
} from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useItemsStore } from '@/store/itemsStore';
import { useMessagesStore } from '@/store/messagesStore';
import { useBookingsStore } from '@/store/bookingsStore';
import { useUserRoleStore } from '@/store/userRoleStore';
import { Item } from '@/types';
import Colors from '@/constants/colors';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Rating from '@/components/ui/Rating';
import BookingForm from '@/components/bookings/BookingForm';
import BookingConfirmation from '@/components/bookings/BookingConfirmation';

const { width } = Dimensions.get('window');

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { fetchItemById } = useItemsStore();
  const { startNewConversation } = useMessagesStore();
  const { createBooking, isLoading: isBookingLoading } = useBookingsStore();
  const userRoleStore = useUserRoleStore();
  
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<{
    startDate: Date;
    endDate: Date;
    totalPrice: number;
  } | null>(null);
  
  // Get borrower functionality if user is authenticated
  const [borrower, setBorrower] = useState<any | null>(null);
  
  useEffect(() => {
    if (user) {
      try {
        // In a real app, this would be a proper hook
        setBorrower({
          saveItem: async (itemId: string) => {
            userRoleStore.addSavedItem(itemId);
            return true;
          },
          unsaveItem: async (itemId: string) => {
            userRoleStore.removeSavedItem(itemId);
            return true;
          }
        });
      } catch (error) {
        console.log('User not authenticated for borrower role');
      }
    }
  }, [user]);
  
  useEffect(() => {
    const loadItem = async () => {
      if (id) {
        setLoading(true);
        const fetchedItem = await fetchItemById(id as string);
        if (fetchedItem) {
          setItem(fetchedItem);
        }
        setLoading(false);
      }
    };
    
    loadItem();
  }, [id]);
  
  // Check if item is saved
  useEffect(() => {
    if (user && item) {
      const savedItems = userRoleStore.savedItems;
      setIsSaved(savedItems.includes(item.id));
    }
  }, [user, item, userRoleStore.savedItems]);
  
  const handleNextImage = () => {
    if (item && currentImageIndex < item.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };
  
  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };
  
  const handleContactOwner = async () => {
    if (!user || !item) return;
    
    // Start a new conversation with the item owner
    const conversationId = await startNewConversation(
      [
        {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        },
        {
          id: item.owner.id,
          name: item.owner.name,
          avatar: item.owner.avatar,
        }
      ],
      item.id,
      item.title
    );
    
    if (conversationId) {
      router.push(`/messages/${conversationId}`);
    }
  };
  
  const handleBookNow = () => {
    if (!user) {
      // Redirect to login if not authenticated
      router.push('/(auth)/login');
      return;
    }
    
    setShowBookingForm(!showBookingForm);
  };
  
  const handleToggleSave = async () => {
    if (!user || !item || !borrower) return;
    
    try {
      if (isSaved) {
        await borrower.unsaveItem(item.id);
      } else {
        await borrower.saveItem(item.id);
      }
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error toggling save status:', error);
    }
  };
  
  const handleShare = () => {
    // Share functionality would go here
    Alert.alert('Share', 'Share this item with friends', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Share',
        onPress: () => {
          // In a real app, this would use the Share API
          Alert.alert('Shared!', 'Item shared successfully');
        },
      },
    ]);
  };
  
  const handleBookingSubmit = (startDate: Date, endDate: Date, totalPrice: number) => {
    setBookingDetails({ startDate, endDate, totalPrice });
    setShowConfirmation(true);
  };
  
  const handleConfirmBooking = async () => {
    if (!user || !item || !bookingDetails) return;
    
    try {
      const newBooking = await createBooking({
        itemId: item.id,
        itemTitle: item.title,
        itemImage: item.images[0],
        ownerId: item.owner.id,
        ownerName: item.owner.name,
        borrowerId: user.id,
        borrowerName: user.name,
        startDate: bookingDetails.startDate.toISOString().split('T')[0],
        endDate: bookingDetails.endDate.toISOString().split('T')[0],
        totalPrice: bookingDetails.totalPrice,
        deposit: item.deposit,
      });
      
      // Close modals
      setShowConfirmation(false);
      setShowBookingForm(false);
      
      // Show success message
      Alert.alert(
        "Booking Requested",
        "Your booking request has been sent to the owner. You'll be notified once they respond.",
        [
          {
            text: "View Booking",
            onPress: () => router.push(`/bookings/${newBooking.id}`),
          },
          {
            text: "OK",
            onPress: () => router.push('/(tabs)/bookings'),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Booking Failed",
        error instanceof Error ? error.message : "Failed to create booking. Please try again."
      );
    }
  };
  
  const getRentalTypeLabel = () => {
    if (!item) return '';
    
    switch (item.rentalType) {
      case 'loan':
        return 'Free to Borrow';
      case 'rent':
        return `₹${item.price}/day`;
      case 'swap':
        return 'Available for Swap';
      default:
        return '';
    }
  };
  
  const getAvailabilityLabel = () => {
    if (!item || !item.availableDates || item.availableDates.length === 0) {
      return 'Not Available';
    }
    
    const now = new Date();
    const isAvailableNow = item.availableDates.some(dateRange => {
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      return now >= start && now <= end;
    });
    
    if (isAvailableNow) {
      return 'Available Now';
    }
    
    // Find the next available date
    const futureRanges = item.availableDates
      .filter(dateRange => new Date(dateRange.start) > now)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    
    if (futureRanges.length > 0) {
      const nextAvailable = new Date(futureRanges[0].start);
      return `Available from ${nextAvailable.toLocaleDateString()}`;
    }
    
    return 'Not Available';
  };
  
  if (loading || !item) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading item details...</Text>
      </View>
    );
  }
  
  const isOwner = user?.id === item.owner.id;
  
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: item.images[currentImageIndex] }} 
            style={styles.image}
            resizeMode="cover"
          />
          
          {item.images.length > 1 && (
            <>
              <TouchableOpacity 
                style={[styles.imageNavButton, styles.prevButton]}
                onPress={handlePrevImage}
                disabled={currentImageIndex === 0}
              >
                <ChevronLeft 
                  size={24} 
                  color={currentImageIndex === 0 ? Colors.inactive : Colors.text.light} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.imageNavButton, styles.nextButton]}
                onPress={handleNextImage}
                disabled={currentImageIndex === item.images.length - 1}
              >
                <ChevronRight 
                  size={24} 
                  color={currentImageIndex === item.images.length - 1 ? Colors.inactive : Colors.text.light} 
                />
              </TouchableOpacity>
              
              <View style={styles.pagination}>
                {item.images.map((_, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.paginationDot,
                      index === currentImageIndex && styles.activeDot
                    ]} 
                  />
                ))}
              </View>
            </>
          )}
          
          {!isOwner && user && (
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleToggleSave}
              >
                <Heart 
                  size={20} 
                  color={Colors.text.light}
                  fill={isSaved ? Colors.error : 'transparent'}
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleShare}
              >
                <Share2 size={20} color={Colors.text.light} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{item.title}</Text>
            <Badge 
              label={getRentalTypeLabel()} 
              variant={item.rentalType === 'loan' ? 'success' : 'primary'} 
            />
          </View>
          
          <View style={styles.locationContainer}>
            <MapPin size={16} color={Colors.text.secondary} />
            <Text style={styles.location}>{item.location.neighborhood}</Text>
          </View>
          
          <View style={styles.ownerContainer}>
            <Avatar 
              source={item.owner.avatar} 
              name={item.owner.name} 
              size={40}
            />
            <View style={styles.ownerInfo}>
              <Text style={styles.ownerName}>{item.owner.name}</Text>
              <Rating value={item.owner.rating} size="small" />
            </View>
          </View>
          
          <View style={styles.divider} />
          
          {/* Availability Card */}
          <View style={styles.availabilityCard}>
            <View style={styles.availabilityHeader}>
              <Clock size={20} color={Colors.text.primary} />
              <Text style={styles.availabilityTitle}>Availability</Text>
            </View>
            <Text style={styles.availabilityText}>{getAvailabilityLabel()}</Text>
            
            {item.availableDates && item.availableDates.length > 0 && (
              <View style={styles.availableDates}>
                {item.availableDates.slice(0, 3).map((dateRange, index) => (
                  <View key={index} style={styles.dateRange}>
                    <Calendar size={14} color={Colors.text.secondary} />
                    <Text style={styles.dateRangeText}>
                      {new Date(dateRange.start).toLocaleDateString()} - {new Date(dateRange.end).toLocaleDateString()}
                    </Text>
                  </View>
                ))}
                {item.availableDates.length > 3 && (
                  <Text style={styles.moreDatesText}>+{item.availableDates.length - 3} more date ranges</Text>
                )}
              </View>
            )}
          </View>
          
          <Text style={styles.sectionTitle}>About this item</Text>
          <Text style={styles.description}>{item.description}</Text>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Star size={20} color={Colors.text.secondary} />
              <Text style={styles.detailText}>
                Condition: {item.condition.replace('_', ' ')}
              </Text>
            </View>
            
            {item.deposit !== undefined && item.deposit > 0 && (
              <View style={styles.detailItem}>
                <DollarSign size={20} color={Colors.text.secondary} />
                <Text style={styles.detailText}>
                  Security Deposit: ₹{item.deposit}
                </Text>
              </View>
            )}
            
            <View style={styles.detailItem}>
              <Shield size={20} color={Colors.text.secondary} />
              <Text style={styles.detailText}>
                Booking Protection Included
              </Text>
            </View>
          </View>
          
          {/* Rental Terms */}
          <View style={styles.termsSection}>
            <Text style={styles.sectionTitle}>Rental Terms</Text>
            <View style={styles.termItem}>
              <Text style={styles.termTitle}>Cancellation Policy</Text>
              <Text style={styles.termText}>
                Free cancellation up to 24 hours before the booking starts. After that, a cancellation fee may apply.
              </Text>
            </View>
            <View style={styles.termItem}>
              <Text style={styles.termTitle}>Damage Policy</Text>
              <Text style={styles.termText}>
                Borrowers are responsible for any damage beyond normal wear and tear. Security deposit may be used to cover damages.
              </Text>
            </View>
          </View>
          
          {/* Booking Form */}
          {!isOwner && showBookingForm && (
            <BookingForm 
              item={item} 
              onSubmit={handleBookingSubmit} 
            />
          )}
        </View>
      </ScrollView>
      
      {!isOwner && (
        <View style={styles.footer}>
          <Button
            title="Contact Owner"
            onPress={handleContactOwner}
            variant="outline"
            leftIcon={<MessageCircle size={20} color={Colors.primary} />}
            style={styles.contactButton}
          />
          
          <Button
            title={showBookingForm ? "Hide Booking Form" : (item.rentalType === 'loan' ? 'Borrow Now' : 'Book Now')}
            onPress={handleBookNow}
            style={styles.bookButton}
          />
        </View>
      )}
      
      {/* Booking Confirmation Modal */}
      {showConfirmation && bookingDetails && (
        <BookingConfirmation
          visible={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleConfirmBooking}
          item={item}
          startDate={bookingDetails.startDate}
          endDate={bookingDetails.endDate}
          totalPrice={bookingDetails.totalPrice}
          isLoading={isBookingLoading}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageNavButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prevButton: {
    left: 16,
  },
  nextButton: {
    right: 16,
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.text.light,
  },
  actionButtons: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    flex: 1,
    marginRight: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  location: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  ownerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ownerInfo: {
    marginLeft: 12,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
  availabilityCard: {
    backgroundColor: `${Colors.primary}10`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  availabilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  availabilityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginLeft: 8,
  },
  availabilityText: {
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 12,
  },
  availableDates: {
    marginTop: 8,
  },
  dateRange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dateRangeText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  moreDatesText: {
    fontSize: 14,
    color: Colors.primary,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 24,
    marginBottom: 16,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: Colors.text.primary,
    marginLeft: 8,
  },
  termsSection: {
    marginBottom: 16,
  },
  termItem: {
    marginBottom: 12,
  },
  termTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  termText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.card,
  },
  contactButton: {
    flex: 1,
    marginRight: 8,
  },
  bookButton: {
    flex: 1,
    marginLeft: 8,
  },
});