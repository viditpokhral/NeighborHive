import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DollarSign, Clock, BarChart } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Card from '@/components/ui/Card';

interface LenderStatsProps {
  totalEarnings: number;
  responseRate: number;
  averageResponseTime: number;
  totalListings: number;
  activeListings: number;
}

export default function LenderStats({
  totalEarnings,
  responseRate,
  averageResponseTime,
  totalListings,
  activeListings
}: LenderStatsProps) {
  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Lender Statistics</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <DollarSign size={20} color={Colors.primary} />
          <Text style={styles.statValue}>₹{totalEarnings.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Total Earnings</Text>
        </View>
        
        <View style={styles.statItem}>
          <Clock size={20} color={Colors.primary} />
          <Text style={styles.statValue}>{averageResponseTime}h</Text>
          <Text style={styles.statLabel}>Avg. Response</Text>
        </View>
        
        <View style={styles.statItem}>
          <BarChart size={20} color={Colors.primary} />
          <Text style={styles.statValue}>{responseRate}%</Text>
          <Text style={styles.statLabel}>Response Rate</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{activeListings}/{totalListings}</Text>
          <Text style={styles.statLabel}>Active Listings</Text>
        </View>
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
});