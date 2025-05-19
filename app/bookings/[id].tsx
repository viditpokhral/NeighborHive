import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Alert,
  Modal,
  Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  MessageCircle, 
  ChevronDown,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit
} from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuthStore } from '@/store/authStore';
import { useBookingsStore } from '@/store/bookingsStore';
import { useMessagesStore } from '@/store/messagesStore';
import { Booking } from '@/types';
import Colors from '@/constants/colors';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import { formatDate } from '@/utils/dateUtils';

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    getBookingById, 
    updateBookingStatus, 
    cancelBooking, 
    extendBooking,
    checkItemAvailability,
    isLoading 
  } = useBookingsStore();
  const { startNewConversation } = useMessagesStore();
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [newEndDate, setNewEndDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [extensionError, setExtensionError] = useState<string | null>(null);
  const [isExtensionAvailable, setIsExtensionAvailable] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  
  useEffect(() => {
    if (id) {
      const foundBooking = getBookingById(id as string);
      if (foundBooking) {
        setBooking(foundBooking);
        
        // Initialize new end date for extension
        if (foundBooking.status === 'active' || foundBooking.status === 'approved') {
          const currentEndDate = new Date(foundBooking.endDate);
          const suggestedEndDate = new Date(currentEndDate);
          suggestedEndDate.setDate(currentEndDate.getDate() + 3); // Default to 3 day extension
          setNewEndDate(suggestedEndDate);
        }
      }
    }
  }, [id, getBookingById]);
  
  useEffect(() => {
    // Check availability when new end date changes
    const checkExtensionAvailability = async () => {
      if (booking && newEndDate) {
        setIsCheckingAvailability(true);
        setExtensionError(null);
        
        try {
          const isAvailable = await checkItemAvailability(
            booking.itemId,
            booking.startDate,
            newEndDate.toISOString().split('T')[0]
          );
          
          setIsExtensionAvailable(isAvailable);
          
          if (!isAvailable) {
            setExtensionError("Item is not available for the extended period");
          }
        } catch (error) {
          setExtensionError("Error checking availability");
          setIsExtensionAvailable(false);
        } finally {
          setIsCheckingAvailability(false);
        }
      }
    };
    
    checkExtensionAvailability();
  }, [booking, newEndDate, checkItemAvailability]);
  
  const isOwner = user?.id === booking?.ownerId;
  const otherPersonName = isOwner ? booking?.borrowerName : booking?.ownerName;
  const otherPersonId = isOwner ? booking?.borrowerId : booking?.ownerId;
  
  const handleApprove = async () => {
    if (booking) {
      try {
        await updateBookingStatus(booking.id, 'approved');
        setBooking({...booking, status: 'approved'});
        Alert.alert(
          "Booking Approved",
          "You've approved this booking request. The borrower will be notified."
        );
      } catch (error) {
        Alert.alert("Error", "Failed to approve booking. Please try again.");
      }
    }
  };
  
  const handleReject = async () => {
    if (booking) {
      Alert.alert(
        "Reject Booking",
        "Are you sure you want to reject this booking request?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Reject",
            style: "destructive",
            onPress: async () => {
              try {
                await updateBookingStatus(booking.id, 'rejected');
                setBooking({...booking, status: 'rejected'});
                Alert.alert(
                  "Booking Rejected",
                  "You've rejected this booking request. The borrower will be notified."
                );
              } catch (error) {
                Alert.alert("Error", "Failed to reject booking. Please try again.");
              }
            }
          }
        ]
      );
    }
  };
  
  const handleCancel = async () => {
    if (booking) {
      Alert.alert(
        "Cancel Booking",
        "Are you sure you want to cancel this booking?",
        [
          {
            text: "No",
            style: "cancel"
          },
          {
            text: "Yes, Cancel",
            style: "destructive",
            onPress: async () => {
              try {
                await cancelBooking(booking.id);
                setBooking({...booking, status: 'cancelled'});
                Alert.alert(
                  "Booking Cancelled",
                  "Your booking has been cancelled."
                );
              } catch (error) {
                Alert.alert("Error", "Failed to cancel booking. Please try again.");
              }
            }
          }
        ]
      );
    }
  };
  
  const handleComplete = async () => {
    if (booking) {
      Alert.alert(
        "Complete Booking",
        "Are you sure you want to mark this booking as completed?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Complete",
            onPress: async () => {
              try {
                await updateBookingStatus(booking.id, 'completed');
                setBooking({...booking, status: 'completed'});
                Alert.alert(
                  "Booking Completed",
                  "This booking has been marked as completed."
                );
              } catch (error) {
                Alert.alert("Error", "Failed to complete booking. Please try again.");
              }
            }
          }
        ]
      );
    }
  };
  
  const handleStartBooking = async () => {
    if (booking) {
      try {
        await updateBookingStatus(booking.id, 'active');
        setBooking({...booking, status: 'active'});
        Alert.alert(
          "Booking Started",
          "This booking is now active. The item has been handed over to the borrower."
        );
      } catch (error) {
        Alert.alert("Error", "Failed to start booking. Please try again.");
      }
    }
  };
  
  const handleMessage = async () => {
    if (!user || !booking || !otherPersonId || !otherPersonName) return;
    
    // Start a new conversation with the other person
    const conversationId = await startNewConversation(
      [
        {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        },
        {
          id: otherPersonId,
          name: otherPersonName,
        }
      ],
      booking.itemId,
      booking.itemTitle
    );
    
    if (conversationId) {
      router.push(`/messages/${conversationId}`);
    }
  };
  
  const handleExtendBooking = () => {
    setShowExtendModal(true);
  };
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setNewEndDate(selectedDate);
    }
  };
  
  const handleConfirmExtension = async () => {
    if (!booking || !newEndDate || !isExtensionAvailable) return;
    
    try {
      await extendBooking(
        booking.id, 
        newEndDate.toISOString().split('T')[0]
      );
      
      // Update local booking state
      setBooking({
        ...booking,
        endDate: newEndDate.toISOString().split('T')[0]
      });
      
      setShowExtendModal(false);
      
      Alert.alert(
        "Booking Extended",
        "Your booking has been successfully extended."
      );
    } catch (error) {
      Alert.alert(
        "Extension Failed",
        error instanceof Error ? error.message : "Failed to extend booking. Please try again."
      );
    }
  };
  
  const getStatusBadge = () => {
    if (!booking) return null;
    
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
  
  const getStatusIcon = () => {
    if (!booking) return null;
    
    switch (booking.status) {
      case 'pending':
        return <Clock size={24} color={Colors.text.secondary} />;
      case 'approved':
        return <CheckCircle size={24} color={Colors.primary} />;
      case 'active':
        return <CheckCircle size={24} color={Colors.secondary} />;
      case 'completed':
        return <CheckCircle size={24} color={Colors.success} />;
      case 'cancelled':
        return <XCircle size={24} color={Colors.error} />;
      case 'rejected':
        return <XCircle size={24} color={Colors.error} />;
      default:
        return null;
    }
  };
  
  const renderActionButtons = () => {
    if (!booking || isLoading) return null;
    
    if (isOwner) {
      // Owner actions
      switch (booking.status) {
        case 'pending':
          return (
            <View style={styles.actionButtons}>
              <Button
                title="Reject"
                onPress={handleReject}
                variant="outline"
                style={styles.rejectButton}
              />
              <Button
                title="Approve"
                onPress={handleApprove}
                style={styles.approveButton}
              />
            </View>
          );
        case 'approved':
          return (
            <Button
              title="Start Booking"
              onPress={handleStartBooking}
            />
          );
        case 'active':
          return (
            <Button
              title="Mark as Completed"
              onPress={handleComplete}
            />
          );
        default:
          return null;
      }
    } else {
      // Borrower actions
      switch (booking.status) {
        case 'pending':
        case 'approved':
          return (
            <Button
              title="Cancel Booking"
              onPress={handleCancel}
              variant="outline"
            />
          );
        case 'active':
          return (
            <View style={styles.actionButtons}>
              <Button
                title="Extend Booking"
                onPress={handleExtendBooking}
                variant="outline"
                leftIcon={<Edit size={20} color={Colors.primary} />}
                style={styles.extendButton}
              />
              <Button
                title="Return Item"
                onPress={handleMessage}
                style={styles.returnButton}
              />
            </View>
          );
        default:
          return null;
      }
    }
  };
  
  if (!booking) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading booking details...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.statusContainer}>
            <View style={styles.bookingIdContainer}>
              {getStatusIcon()}
              <Text style={styles.bookingId}>Booking #{booking.id}</Text>
            </View>
            {getStatusBadge()}
          </View>
          
          <View style={styles.itemContainer}>
            <Image 
              source={{ uri: booking.itemImage }} 
              style={styles.itemImage}
              resizeMode="cover"
            />
            <View style={styles.itemDetails}>
              <Text style={styles.itemTitle}>{booking.itemTitle}</Text>
              <TouchableOpacity onPress={() => router.push(`/item/${booking.itemId}`)}>
                <Text style={styles.viewItemLink}>View Item</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Details</Text>
          
          <View style={styles.detailItem}>
            <Calendar size={20} color={Colors.text.secondary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Dates</Text>
              <Text style={styles.detailText}>
                {formatDate(new Date(booking.startDate))} - {formatDate(new Date(booking.endDate))}
              </Text>
            </View>
          </View>
          
          <View style={styles.detailItem}>
            <Clock size={20} color={Colors.text.secondary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailText}>
                {Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
              </Text>
            </View>
          </View>
          
          <View style={styles.detailItem}>
            <DollarSign size={20} color={Colors.text.secondary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Total Price</Text>
              <Text style={styles.detailText}>
                {booking.totalPrice > 0 ? `₹${booking.totalPrice.toFixed(2)}` : 'Free'}
              </Text>
            </View>
          </View>
          
          {booking.deposit !== undefined && booking.deposit > 0 && (
            <View style={styles.detailItem}>
              <DollarSign size={20} color={Colors.text.secondary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Security Deposit</Text>
                <Text style={styles.detailText}>₹{booking.deposit.toFixed(2)}</Text>
              </View>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isOwner ? 'Borrower' : 'Owner'} Information
          </Text>
          
          <View style={styles.userContainer}>
            <Avatar 
              name={otherPersonName || ''} 
              size={50}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{otherPersonName}</Text>
              <TouchableOpacity 
                style={styles.messageButton}
                onPress={handleMessage}
              >
                <MessageCircle size={16} color={Colors.primary} />
                <Text style={styles.messageText}>Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        {booking.status === 'active' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Booking Timeline</Text>
            
            <View style={styles.timeline}>
              <View style={[styles.timelineItem, styles.timelineItemCompleted]}>
                <View style={styles.timelineDot}>
                  <CheckCircle size={16} color={Colors.success} />
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Booking Requested</Text>
                  <Text style={styles.timelineDate}>
                    {formatDate(new Date(booking.createdAt))}
                  </Text>
                </View>
              </View>
              
              <View style={[styles.timelineItem, styles.timelineItemCompleted]}>
                <View style={styles.timelineDot}>
                  <CheckCircle size={16} color={Colors.success} />
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Booking Approved</Text>
                  <Text style={styles.timelineDate}>
                    {/* In a real app, you would store these dates */}
                    {formatDate(new Date(new Date(booking.createdAt).getTime() + 24 * 60 * 60 * 1000))}
                  </Text>
                </View>
              </View>
              
              <View style={[styles.timelineItem, styles.timelineItemActive]}>
                <View style={styles.timelineDot}>
                  <CheckCircle size={16} color={Colors.secondary} />
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Item Handed Over</Text>
                  <Text style={styles.timelineDate}>
                    {formatDate(new Date(booking.startDate))}
                  </Text>
                </View>
              </View>
              
              <View style={[styles.timelineItem, styles.timelineItemPending]}>
                <View style={styles.timelineDot}>
                  <Clock size={16} color={Colors.text.secondary} />
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Return Due</Text>
                  <Text style={styles.timelineDate}>
                    {formatDate(new Date(booking.endDate))}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
        
        {booking.status === 'completed' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Booking Complete</Text>
            <Text style={styles.completedText}>
              This booking has been completed. Thank you for using ShareSpot!
            </Text>
            
            <TouchableOpacity 
              style={styles.leaveReviewButton}
              onPress={() => Alert.alert("Leave Review", "Review functionality would go here")}
            >
              <Text style={styles.leaveReviewText}>Leave a Review</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {(booking.status === 'cancelled' || booking.status === 'rejected') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Booking {booking.status === 'cancelled' ? 'Cancelled' : 'Rejected'}
            </Text>
            <Text style={styles.cancelledText}>
              This booking has been {booking.status === 'cancelled' ? 'cancelled' : 'rejected'}.
            </Text>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.footer}>
        {isLoading ? (
          <Button
            title="Processing..."
            isLoading={true}
            disabled={true}
            onPress={() => {}} // Adding empty onPress to satisfy TypeScript
          />
        ) : (
          renderActionButtons()
        )}
      </View>
      
      {/* Extension Modal */}
      <Modal
        visible={showExtendModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowExtendModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Extend Booking</Text>
              <TouchableOpacity onPress={() => setShowExtendModal(false)}>
                <Text style={styles.modalClose}>Cancel</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Current end date: {formatDate(new Date(booking.endDate))}
              </Text>
              
              <Text style={styles.modalLabel}>New end date:</Text>
              <TouchableOpacity 
                style={styles.dateSelector}
                onPress={() => setShowDatePicker(true)}
              >
                <Calendar size={18} color={Colors.text.secondary} />
                <Text style={styles.dateText}>
                  {newEndDate ? formatDate(newEndDate) : 'Select date'}
                </Text>
                <ChevronDown size={18} color={Colors.text.secondary} />
              </TouchableOpacity>
              
              {showDatePicker && Platform.OS === 'android' && (
                <DateTimePicker
                  value={newEndDate || new Date(booking.endDate)}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  minimumDate={new Date(booking.endDate)}
                />
              )}
              
              {Platform.OS === 'ios' && showDatePicker && (
                <View style={styles.iosPickerContainer}>
                  <View style={styles.iosPickerHeader}>
                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                      <Text style={styles.iosPickerCancel}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                      <Text style={styles.iosPickerDone}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={newEndDate || new Date(booking.endDate)}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    minimumDate={new Date(booking.endDate)}
                    style={styles.iosPicker}
                  />
                </View>
              )}
              
              {/* Availability Status */}
              {newEndDate && (
                <View style={[
                  styles.availabilityContainer,
                  isExtensionAvailable ? styles.availableStatus : styles.unavailableStatus
                ]}>
                  {isCheckingAvailability ? (
                    <Text style={styles.checkingText}>Checking availability...</Text>
                  ) : isExtensionAvailable ? (
                    <>
                      <View style={styles.availabilityDot} />
                      <Text style={styles.availabilityText}>Available for extension</Text>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={16} color={Colors.error} />
                      <Text style={styles.unavailabilityText}>
                        {extensionError || "Not available for extension"}
                      </Text>
                    </>
                  )}
                </View>
              )}
              
              {newEndDate && !isCheckingAvailability && isExtensionAvailable && (
                <View style={styles.extensionSummary}>
                  <Text style={styles.extensionLabel}>Extension Summary:</Text>
                  <View style={styles.extensionDetail}>
                    <Text style={styles.extensionText}>
                      Additional days: {Math.ceil((newEndDate.getTime() - new Date(booking.endDate).getTime()) / (1000 * 60 * 60 * 24))}
                    </Text>
                  </View>
                </View>
              )}
            </View>
            
            <View style={styles.modalFooter}>
              <Button
                title="Confirm Extension"
                onPress={handleConfirmExtension}
                disabled={!newEndDate || !isExtensionAvailable || isCheckingAvailability}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  header: {
    backgroundColor: Colors.card,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bookingIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookingId: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  itemContainer: {
    flexDirection: 'row',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    marginLeft: 16,
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  viewItemLink: {
    color: Colors.primary,
    fontSize: 14,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageText: {
    color: Colors.primary,
    marginLeft: 4,
    fontSize: 14,
  },
  timeline: {
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineItemCompleted: {
    opacity: 1,
  },
  timelineItemActive: {
    opacity: 1,
  },
  timelineItemPending: {
    opacity: 0.7,
  },
  timelineDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timelineContent: {
    marginLeft: 12,
    flex: 1,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  completedText: {
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  cancelledText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  leaveReviewButton: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    padding: 12,
    alignItems: 'center',
  },
  leaveReviewText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.card,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  rejectButton: {
    flex: 1,
    marginRight: 8,
  },
  approveButton: {
    flex: 1,
    marginLeft: 8,
  },
  extendButton: {
    flex: 1,
    marginRight: 8,
  },
  returnButton: {
    flex: 1,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  modalClose: {
    color: Colors.primary,
    fontSize: 16,
  },
  modalContent: {
    padding: 16,
  },
  modalText: {
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  dateText: {
    flex: 1,
    marginHorizontal: 8,
    color: Colors.text.primary,
  },
  iosPickerContainer: {
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  iosPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  iosPickerCancel: {
    color: Colors.text.secondary,
    fontSize: 16,
  },
  iosPickerDone: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  iosPicker: {
    height: 200,
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  availableStatus: {
    backgroundColor: `${Colors.success}20`,
  },
  unavailableStatus: {
    backgroundColor: `${Colors.error}20`,
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
    marginRight: 8,
  },
  availabilityText: {
    color: Colors.success,
    fontSize: 14,
  },
  unavailabilityText: {
    color: Colors.error,
    fontSize: 14,
    marginLeft: 8,
  },
  checkingText: {
    color: Colors.text.secondary,
    fontSize: 14,
  },
  extensionSummary: {
    marginBottom: 16,
  },
  extensionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  extensionDetail: {
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 8,
  },
  extensionText: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});