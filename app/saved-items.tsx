import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useItemsStore } from '@/store/itemsStore';
import { useAuthStore } from '@/store/authStore';
import Colors from '@/constants/colors';
import ItemCard from '@/components/items/ItemCard';
import EmptyState from '@/components/ui/EmptyState';
import { useRouter } from 'expo-router';

export default function SavedItemsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items } = useItemsStore();
  
  // In a real app, you would have a savedItems array in the user object
  // For now, we'll just show all items as an example
  const savedItems = items.slice(0, 5); // Show first 5 items as saved
  
  if (!savedItems.length) {
    return (
      <EmptyState
        title="No saved items"
        message="Items you save will appear here"
        buttonTitle="Browse Items"
        onButtonPress={() => router.push('/explore')}
      />
    );
  }
  
  return (
    <View style={styles.container}>
      <FlatList
        data={savedItems}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <ItemCard item={item} />
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  itemContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});