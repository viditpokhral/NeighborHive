import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { Calendar, ChevronDown, Clock, DollarSign, AlertCircle } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '@/constants/colors';
import Button from '@/components/ui/Button';
import { Item } from '@/types';

interface BookingFormProps {
  item: Item;
  onSubmit: (startDate: Date, endDate: Date, totalPrice: number) => void;
}

export default function BookingForm({ item, onSubmit }: BookingFormProps) {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date(Date.now() + 24 * 60 * 60 * 1000)); // Tomorrow
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [totalDays, setTotalDays] = useState(1);
  const [totalPrice, setTotalPrice] = useState(item.price);
  const [error, setError] = useState<string | null>(null);
  const [availabilityStatus, setAvailabilityStatus] = useState<'available' | 'unavailable' | 'checking'>('checking');

  // Quick duration options
  const durationOptions = [
    { label: '1 Day', days: 1 },
    { label: '2 Days', days: 2 },
    { label: 'Weekend', days: 3 },
    { label: '1 Week', days: 7 },
  ];

  // Calculate total days and price when dates change
  useEffect(() => {
    const days = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    setTotalDays(days);
    setTotalPrice(days * item.price);
    
    // Validate dates
    if (endDate < startDate) {
      setError("End date cannot be before start date");
      setAvailabilityStatus('unavailable');
    } else if (days > 30) {
      setError("Maximum booking duration is 30 days");
      setAvailabilityStatus('unavailable');
    } else {
      setError(null);
      
      // Check if dates are within available ranges
      const isAvailable = checkAvailability(startDate, endDate);
      setAvailabilityStatus(isAvailable ? 'available' : 'unavailable');
      
      if (!isAvailable) {
        setError("Selected dates are not available for this item");
      }
    }
  }, [startDate, endDate, item.price]);

  // Check if dates are within available ranges
  const checkAvailability = (start: Date, end: Date): boolean => {
    if (!item.availableDates || item.availableDates.length === 0) {
      return false;
    }

    return item.availableDates.some(dateRange => {
      const rangeStart = new Date(dateRange.start);
      const rangeEnd = new Date(dateRange.end);
      return start >= rangeStart && end <= rangeEnd;
    });
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate);
      
      // If end date is before new start date, update end date
      if (endDate < selectedDate) {
        const newEndDate = new Date(selectedDate);
        newEndDate.setDate(selectedDate.getDate() + 1);
        setEndDate(newEndDate);
      }
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const handleSubmit = () => {
    if (error) return;
    onSubmit(startDate, endDate, totalPrice);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleQuickDuration = (days: number) => {
    // If selecting weekend, set to next Friday-Sunday
    if (days === 3) {
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
      
      // Calculate days until next Friday
      const daysUntilFriday = (dayOfWeek <= 5) ? 5 - dayOfWeek : 5 + 7 - dayOfWeek;
      
      const nextFriday = new Date(today);
      nextFriday.setDate(today.getDate() + daysUntilFriday);
      
      const nextSunday = new Date(nextFriday);
      nextSunday.setDate(nextFriday.getDate() + 2);
      
      setStartDate(nextFriday);
      setEndDate(nextSunday);
    } else {
      // For other durations, start from tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const endDay = new Date(tomorrow);
      endDay.setDate(tomorrow.getDate() + days - 1);
      
      setStartDate(tomorrow);
      setEndDate(endDay);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Book this item</Text>
      
      {/* Quick Duration Selection */}
      <View style={styles.quickDurationContainer}>
        <Text style={styles.sectionLabel}>Quick Duration</Text>
        <View style={styles.durationOptions}>
          {durationOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.durationOption,
                totalDays === option.days && styles.selectedDuration
              ]}
              onPress={() => handleQuickDuration(option.days)}
            >
              <Text style={[
                styles.durationText,
                totalDays === option.days && styles.selectedDurationText
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {/* Date Selection */}
      <View style={styles.dateContainer}>
        <Text style={styles.sectionLabel}>Custom Dates</Text>
        
        <View style={styles.dateRow}>
          <TouchableOpacity 
            style={styles.dateSelector}
            onPress={() => setShowStartPicker(true)}
          >
            <Calendar size={18} color={Colors.text.secondary} />
            <Text style={styles.dateText}>{formatDate(startDate)}</Text>
            <ChevronDown size={18} color={Colors.text.secondary} />
          </TouchableOpacity>
          
          <Text style={styles.dateArrow}>→</Text>
          
          <TouchableOpacity 
            style={styles.dateSelector}
            onPress={() => setShowEndPicker(true)}
          >
            <Calendar size={18} color={Colors.text.secondary} />
            <Text style={styles.dateText}>{formatDate(endDate)}</Text>
            <ChevronDown size={18} color={Colors.text.secondary} />
          </TouchableOpacity>
        </View>
        
        {/* Date Pickers */}
        {(showStartPicker || showEndPicker) && Platform.OS === 'android' && (
          <DateTimePicker
            value={showStartPicker ? startDate : endDate}
            mode="date"
            display="default"
            onChange={showStartPicker ? handleStartDateChange : handleEndDateChange}
            minimumDate={showStartPicker ? new Date() : startDate}
          />
        )}
        
        {Platform.OS === 'ios' && (
          <>
            {showStartPicker && (
              <View style={styles.iosPickerContainer}>
                <View style={styles.iosPickerHeader}>
                  <TouchableOpacity onPress={() => setShowStartPicker(false)}>
                    <Text style={styles.iosPickerCancel}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowStartPicker(false)}>
                    <Text style={styles.iosPickerDone}>Done</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="spinner"
                  onChange={handleStartDateChange}
                  minimumDate={new Date()}
                  style={styles.iosPicker}
                />
              </View>
            )}
            
            {showEndPicker && (
              <View style={styles.iosPickerContainer}>
                <View style={styles.iosPickerHeader}>
                  <TouchableOpacity onPress={() => setShowEndPicker(false)}>
                    <Text style={styles.iosPickerCancel}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowEndPicker(false)}>
                    <Text style={styles.iosPickerDone}>Done</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display="spinner"
                  onChange={handleEndDateChange}
                  minimumDate={startDate}
                  style={styles.iosPicker}
                />
              </View>
            )}
          </>
        )}
        
        {/* Availability Status */}
        <View style={[
          styles.availabilityContainer,
          availabilityStatus === 'available' ? styles.availableStatus : 
          availabilityStatus === 'unavailable' ? styles.unavailableStatus : 
          styles.checkingStatus
        ]}>
          {availabilityStatus === 'available' ? (
            <>
              <View style={styles.availabilityDot} />
              <Text style={styles.availabilityText}>Available for selected dates</Text>
            </>
          ) : availabilityStatus === 'unavailable' ? (
            <>
              <AlertCircle size={16} color={Colors.error} />
              <Text style={styles.unavailabilityText}>
                {error || "Not available for selected dates"}
              </Text>
            </>
          ) : (
            <Text style={styles.checkingText}>Checking availability...</Text>
          )}
        </View>
      </View>
      
      {/* Duration Summary */}
      <View style={styles.durationSummary}>
        <View style={styles.durationRow}>
          <Clock size={18} color={Colors.text.secondary} />
          <Text style={styles.durationSummaryText}>
            {totalDays} day{totalDays > 1 ? 's' : ''}
          </Text>
        </View>
      </View>
      
      {/* Pricing Summary */}
      <View style={styles.pricingContainer}>
        <Text style={styles.sectionLabel}>Price Details</Text>
        
        <View style={styles.pricingRow}>
          <Text style={styles.pricingLabel}>
            {item.price > 0 ? `₹${item.price} × ${totalDays} day${totalDays > 1 ? 's' : ''}` : 'Free loan'}
          </Text>
          <Text style={styles.pricingValue}>
            {item.price > 0 ? `₹${totalPrice.toFixed(2)}` : '₹0.00'}
          </Text>
        </View>
        
        {item.deposit !== undefined && item.deposit > 0 && (
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Security deposit (refundable)</Text>
            <Text style={styles.pricingValue}>₹{item.deposit.toFixed(2)}</Text>
          </View>
        )}
        
        <View style={[styles.pricingRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            ₹{((item.deposit || 0) + totalPrice).toFixed(2)}
          </Text>
        </View>
      </View>
      
      {/* Submit Button */}
      <Button
        title={item.rentalType === 'loan' ? 'Request to Borrow' : 'Book Now'}
        onPress={handleSubmit}
        disabled={availabilityStatus !== 'available'}
        style={styles.submitButton}
      />
      
      {/* Terms */}
      <Text style={styles.termsText}>
        By booking, you agree to the rental terms and conditions for this item.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  quickDurationContainer: {
    marginBottom: 16,
  },
  durationOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  durationOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  selectedDuration: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  durationText: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  selectedDurationText: {
    color: Colors.text.light,
    fontWeight: '500',
  },
  dateContainer: {
    marginBottom: 16,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    flex: 1,
  },
  dateText: {
    flex: 1,
    marginHorizontal: 8,
    color: Colors.text.primary,
  },
  dateArrow: {
    marginHorizontal: 8,
    color: Colors.text.secondary,
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
    marginTop: 8,
  },
  availableStatus: {
    backgroundColor: `${Colors.success}20`,
  },
  unavailableStatus: {
    backgroundColor: `${Colors.error}20`,
  },
  checkingStatus: {
    backgroundColor: `${Colors.primary}10`,
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
  durationSummary: {
    marginBottom: 16,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationSummaryText: {
    fontSize: 16,
    color: Colors.text.primary,
    marginLeft: 8,
  },
  pricingContainer: {
    marginBottom: 16,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pricingLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  pricingValue: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  submitButton: {
    marginBottom: 16,
  },
  termsText: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});