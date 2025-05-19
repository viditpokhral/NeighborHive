import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Check, X, Calendar, DollarSign, AlertCircle, Shield } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Button from '@/components/ui/Button';
import { Item } from '@/types';

interface BookingConfirmationProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  item: Item;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  isLoading?: boolean;
}

export default function BookingConfirmation({
  visible,
  onClose,
  onConfirm,
  item,
  startDate,
  endDate,
  totalPrice,
  isLoading = false,
}: BookingConfirmationProps) {
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalAmount = totalPrice + (item.deposit || 0);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Confirm Booking</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.text.secondary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.itemSection}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemOwner}>From {item.owner.name}</Text>
            </View>
            
            <View style={styles.detailSection}>
              <View style={styles.detailRow}>
                <Calendar size={20} color={Colors.text.secondary} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Booking Dates</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(startDate)} - {formatDate(endDate)}
                  </Text>
                  <Text style={styles.detailSubtext}>
                    {totalDays} day{totalDays > 1 ? 's' : ''}
                  </Text>
                </View>
              </View>
              
              <View style={styles.detailRow}>
                <DollarSign size={20} color={Colors.text.secondary} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Price Details</Text>
                  <Text style={styles.detailValue}>
                    {item.price > 0 
                      ? `₹${item.price.toFixed(2)} × ${totalDays} day${totalDays > 1 ? 's' : ''} = ₹${totalPrice.toFixed(2)}`
                      : 'Free loan'}
                  </Text>
                  {item.deposit !== undefined && item.deposit > 0 && (
                    <Text style={styles.detailSubtext}>
                      + ₹{item.deposit.toFixed(2)} refundable deposit
                    </Text>
                  )}
                </View>
              </View>
            </View>
            
            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{totalAmount.toFixed(2)}</Text>
            </View>
            
            <View style={styles.infoSection}>
              <AlertCircle size={20} color={Colors.text.secondary} />
              <Text style={styles.infoText}>
                Your booking request will be sent to the owner for approval. You'll be notified once they respond.
              </Text>
            </View>
            
            {/* Booking Protection */}
            <View style={styles.protectionSection}>
              <View style={styles.protectionHeader}>
                <Shield size={20} color={Colors.primary} />
                <Text style={styles.protectionTitle}>Booking Protection</Text>
              </View>
              <Text style={styles.protectionText}>
                Your booking includes protection against damages and cancellations. Learn more about our policies.
              </Text>
            </View>
            
            {/* Cancellation Policy */}
            <View style={styles.cancellationSection}>
              <Text style={styles.cancellationTitle}>Cancellation Policy</Text>
              <Text style={styles.cancellationText}>
                Free cancellation up to 24 hours before the booking starts. After that, a cancellation fee may apply.
              </Text>
            </View>
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <Button
              title="Cancel"
              onPress={onClose}
              variant="outline"
              style={styles.cancelButton}
            />
            <Button
              title="Confirm Booking"
              onPress={onConfirm}
              leftIcon={<Check size={20} color={Colors.text.light} />}
              style={styles.confirmButton}
              isLoading={isLoading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
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
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 16,
    maxHeight: '70%',
  },
  itemSection: {
    marginBottom: 20,
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  itemOwner: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailRow: {
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
  detailValue: {
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  detailSubtext: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  infoSection: {
    flexDirection: 'row',
    backgroundColor: `${Colors.primary}10`,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.primary,
    marginLeft: 8,
    flex: 1,
  },
  protectionSection: {
    backgroundColor: `${Colors.success}10`,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  protectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  protectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginLeft: 8,
  },
  protectionText: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  cancellationSection: {
    marginBottom: 16,
  },
  cancellationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  cancellationText: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  confirmButton: {
    flex: 2,
    marginLeft: 8,
  },
});