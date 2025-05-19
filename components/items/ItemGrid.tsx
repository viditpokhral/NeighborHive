import React from 'react';
import { FlatList, StyleSheet, View, Dimensions } from 'react-native';
import { Item } from '@/types';
import ItemCard from './ItemCard';
import EmptyState from '@/components/ui/EmptyState';
import { PackageOpen } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface ItemGridProps {
  items: Item[];
  numColumns?: number;
  onRefresh?: () => void;
  refreshing?: boolean;
  ListHeaderComponent?: React.ReactElement;
  ListFooterComponent?: React.ReactElement;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyButtonTitle?: string;
  onEmptyButtonPress?: () => void;
}

const { width } = Dimensions.get('window');

export default function ItemGrid({
  items,
  numColumns = 2,
  onRefresh,
  refreshing = false,
  ListHeaderComponent,
  ListFooterComponent,
  emptyTitle = "No items found",
  emptyMessage = "There are no items available at the moment.",
  emptyButtonTitle,
  onEmptyButtonPress,
}: ItemGridProps) {
  const renderItem = ({ item }: { item: Item }) => (
    <View style={[styles.itemContainer, { width: width / numColumns - 24 }]}>
      <ItemCard item={item} />
    </View>
  );

  const renderEmptyComponent = () => (
    <EmptyState
      title={emptyTitle}
      message={emptyMessage}
      icon={<PackageOpen size={48} color={Colors.text.secondary} />}
      buttonTitle={emptyButtonTitle}
      onButtonPress={onEmptyButtonPress}
      style={styles.emptyState}
    />
  );

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      contentContainerStyle={styles.container}
      columnWrapperStyle={styles.columnWrapper}
      onRefresh={onRefresh}
      refreshing={refreshing}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      ListEmptyComponent={renderEmptyComponent}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  itemContainer: {
    marginBottom: 16,
  },
  emptyState: {
    paddingTop: 60,
  },
});