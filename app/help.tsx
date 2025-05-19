import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { ChevronRight, HelpCircle, MessageCircle, Phone } from 'lucide-react-native';
import Colors from '@/constants/colors';

const FAQs = [
  {
    question: "How do I list an item?",
    answer: "To list an item, go to your profile and tap the 'Add Item' button. Fill in the item details including photos, description, and pricing."
  },
  {
    question: "How does the booking process work?",
    answer: "When you find an item you want to rent, select your desired dates and submit a booking request. The owner will review and either approve or decline your request."
  },
  {
    question: "What happens if an item is damaged?",
    answer: "All rentals are covered by our protection policy. If an item is damaged, report it immediately through the app and our support team will assist you."
  },
];

export default function HelpScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Support</Text>
        
        <TouchableOpacity style={styles.contactItem}>
          <View style={styles.contactIcon}>
            <MessageCircle size={24} color={Colors.primary} />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Chat with Us</Text>
            <Text style={styles.contactSubtitle}>Usually responds within an hour</Text>
          </View>
          <ChevronRight size={20} color={Colors.text.secondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.contactItem}>
          <View style={styles.contactIcon}>
            <Phone size={24} color={Colors.primary} />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Call Support</Text>
            <Text style={styles.contactSubtitle}>Available 9 AM - 5 PM</Text>
          </View>
          <ChevronRight size={20} color={Colors.text.secondary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        
        {FAQs.map((faq, index) => (
          <TouchableOpacity key={index} style={styles.faqItem}>
            <View style={styles.faqIcon}>
              <HelpCircle size={24} color={Colors.primary} />
            </View>
            <View style={styles.faqContent}>
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  section: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  contactSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  faqItem: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  faqIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  faqContent: {
    flex: 1,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
});