import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useUsersStore } from '@/store/usersStore';
import { useItemsStore } from '@/store/itemsStore';
import ItemGrid from '@/components/items/ItemGrid';
import EmptyState from '@/components/ui/EmptyState';
import { PackageOpen } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function UserItemsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getUserById } = useUsersStore();
  const { items, fetchItems, isLoading } = useItemsStore();
  
  const user = getUserById(id);
  const userItems = items.filter(item => item.owner.id === id);
  
  const handleRefresh = () => {
    fetchItems();
  };
  
  if (!user) {
    return (
      <EmptyState
        title="User Not Found"
        message="The user you're looking for doesn't exist or has been removed."
      />
    );
  }
  
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `${user.name.split(' ')[0]}'s Items` }} />
      
      <ItemGrid
        items={userItems}
        onRefresh={handleRefresh}
        refreshing={isLoading}
        emptyTitle="No Items Listed"
        emptyMessage={`${user.name.split(' ')[0]} hasn't listed any items yet.`}
        emptyButtonTitle="Refresh"
        onEmptyButtonPress={handleRefresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});