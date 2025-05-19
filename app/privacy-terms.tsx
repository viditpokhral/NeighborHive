import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import Colors from '@/constants/colors';

export default function PrivacyTermsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.lastUpdated}>Last updated: January 1, 2024</Text>
        
        <View style={styles.contentBlock}>
          <Text style={styles.heading}>Information We Collect</Text>
          <Text style={styles.text}>
            We collect information you provide directly to us, including your name, email address, 
            phone number, and any other information you choose to provide.
          </Text>
        </View>
        
        <View style={styles.contentBlock}>
          <Text style={styles.heading}>How We Use Your Information</Text>
          <Text style={styles.text}>
            We use the information we collect to:
          </Text>
          <Text style={styles.listItem}>• Provide and maintain our services</Text>
          <Text style={styles.listItem}>• Process your transactions</Text>
          <Text style={styles.listItem}>• Send you technical notices and support messages</Text>
          <Text style={styles.listItem}>• Communicate with you about products and services</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.title}>Terms of Service</Text>
        
        <View style={styles.contentBlock}>
          <Text style={styles.heading}>User Responsibilities</Text>
          <Text style={styles.text}>
            You are responsible for maintaining the confidentiality of your account and password. 
            You agree to accept responsibility for all activities that occur under your account.
          </Text>
        </View>
        
        <View style={styles.contentBlock}>
          <Text style={styles.heading}>Content Guidelines</Text>
          <Text style={styles.text}>
            You agree not to post content that:
          </Text>
          <Text style={styles.listItem}>• Is false, misleading, or deceptive</Text>
          <Text style={styles.listItem}>• Infringes on intellectual property rights</Text>
          <Text style={styles.listItem}>• Contains malware or malicious code</Text>
          <Text style={styles.listItem}>• Violates any applicable laws or regulations</Text>
        </View>
        
        <View style={styles.contentBlock}>
          <Text style={styles.heading}>Limitation of Liability</Text>
          <Text style={styles.text}>
            We shall not be liable for any indirect, incidental, special, consequential, or 
            punitive damages resulting from your use or inability to use the service.
          </Text>
        </View>
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
    padding: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 24,
  },
  contentBlock: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 24,
    marginBottom: 12,
  },
  listItem: {
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 24,
    marginLeft: 8,
    marginBottom: 8,
  },
});