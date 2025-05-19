import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useItemsStore } from '@/store/itemsStore';
import { ItemCategory, RentalType } from '@/types';
import Colors from '@/constants/colors';
import SearchBar from '@/components/items/SearchBar';
import CategoryList from '@/components/items/CategoryList';
import RentalTypeFilter from '@/components/items/RentalTypeFilter';
import ItemGrid from '@/components/items/ItemGrid';

export default function ExploreScreen() {
  const { 
    items, 
    fetchItems, 
    isLoading,
    setCategoryFilter,
    setRentalTypeFilter,
    setSearchQuery,
    applyFilters,
    resetFilters,
    filteredItems,
  } = useItemsStore();
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ItemCategory | null>(null);
  const [rentalType, setRentalType] = useState<RentalType | null>(null);
  
  useEffect(() => {
    fetchItems();
  }, []);
  
  useEffect(() => {
    // Apply filters when any filter changes
    setCategoryFilter(category);
    setRentalTypeFilter(rentalType);
    setSearchQuery(search);
    applyFilters();
  }, [category, rentalType, search]);
  
  const handleRefresh = () => {
    fetchItems();
  };
  
  const handleResetFilters = () => {
    setSearch('');
    setCategory(null);
    setRentalType(null);
    resetFilters();
  };
  
  return (
    <View style={styles.container}>
      <SearchBar 
        value={search} 
        onChangeText={setSearch} 
        placeholder="Search for items..."
      />
      
      <CategoryList 
        selectedCategory={category}
        onSelectCategory={setCategory}
      />
      
      <RentalTypeFilter 
        selectedType={rentalType}
        onSelectType={setRentalType}
      />
      
      <ItemGrid 
        items={filteredItems}
        onRefresh={handleRefresh}
        refreshing={isLoading}
        emptyButtonTitle="Reset Filters"
        onEmptyButtonPress={handleResetFilters}
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