import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { trpc } from '@/lib/trpc';
import Button from '@/components/ui/Button';

export default function ExampleScreen() {
  const hello = trpc.example.hi.useQuery({ name: "Rork User" });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Backend Example" }} />
      
      <Text style={styles.title}>tRPC Example</Text>
      
      {hello.isLoading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : hello.error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>Error: {hello.error.message}</Text>
          <Button 
            onPress={() => hello.refetch()} 
            variant="primary"
            style={styles.retryButton}
          >
            <Text>Retry</Text>
          </Button>
        </View>
      ) : (
        <View style={styles.resultContainer}>
          <Text style={styles.result}>
            Response: Hello, {hello.data?.hello}!
          </Text>
          <Text style={styles.date}>
            Date: {hello.data?.date.toLocaleString()}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  loading: {
    fontSize: 18,
    textAlign: 'center',
  },
  errorContainer: {
    padding: 15,
    backgroundColor: '#ffeeee',
    borderRadius: 8,
    marginVertical: 10,
  },
  error: {
    color: '#d32f2f',
    marginBottom: 10,
  },
  retryButton: {
    marginTop: 10,
  },
  resultContainer: {
    padding: 15,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    marginVertical: 10,
  },
  result: {
    fontSize: 18,
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
});