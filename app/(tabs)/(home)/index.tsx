import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, MapPin } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useItemsStore } from '@/store/itemsStore';
import { useLocationStore } from '@/store/locationStore';
import { useUsersStore } from '@/store/usersStore';
import { ItemCategory } from '@/types';
import Colors from '@/constants/colors';
import SearchBar from '@/components/items/SearchBar';
import CategoryList from '@/components/items/CategoryList';
import ItemCard from '@/components/items/ItemCard';
import Button from '@/components/ui/Button';
import NearbyRentersList from '@/components/users/NearbyRentersList';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, fetchItems } = useItemsStore();
  const { location, address, neighborhood, getCurrentLocation } = useLocationStore();
  const { fetchUsers, getNearbyUsers } = useUsersStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | null>(null);
  
  useEffect(() => {
    fetchItems();
    fetchUsers();
    getCurrentLocation();
  }, []);
  
  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };
  
  const handleCategorySelect = (category: ItemCategory | null) => {
    setSelectedCategory(category);
  };
  
  const handleAddItem = () => {
    router.push('/add-item');
  };
  
  const filteredItems = items
    .filter(item => 
      (selectedCategory ? item.category === selectedCategory : true) &&
      (searchQuery ? 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) 
        : true
      )
    )
    .slice(0, 6); // Limit to 6 items for the home screen
  
  const nearbyItems = items
    .filter(item => item.owner.id !== user?.id)
    .slice(0, 4); // Limit to 4 nearby items
  
  const nearbyRenters = getNearbyUsers(10);
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.locationContainer}>
        <MapPin size={16} color={Colors.text.secondary} />
        <Text style={styles.locationText}>
          {neighborhood || address || 'Fetching location...'}
        </Text>
      </View>
      
      <SearchBar 
        value={searchQuery} 
        onChangeText={handleSearch} 
      />
      
      <CategoryList 
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recently Added</Text>
          <TouchableOpacity onPress={() => router.push('/explore')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.itemsContainer}
        >
          {filteredItems.map(item => (
            <View key={item.id} style={styles.itemCard}>
              <ItemCard item={item} />
            </View>
          ))}
          
          {filteredItems.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No items found</Text>
              <Button 
                title="Add an Item" 
                onPress={handleAddItem}
                size="small"
                style={styles.addButton}
              />
            </View>
          )}
        </ScrollView>
      </View>
      
      {nearbyRenters.length > 0 && (
        <NearbyRentersList 
          renters={nearbyRenters}
          title="Nearby Renters"
          showSeeAll={true}
          limit={5}
          horizontal={true}
        />
      )}
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby Items</Text>
          <TouchableOpacity onPress={() => router.push('/explore')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.itemsContainer}
        >
          {nearbyItems.map(item => (
            <View key={item.id} style={styles.itemCard}>
              <ItemCard item={item} />
            </View>
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.addItemContainer}>
        <Button
          title="Add an Item to Share"
          onPress={handleAddItem}
          style={styles.addItemButton}
          leftIcon={<Plus size={20} color={Colors.text.light} />}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  locationText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
  },
  itemsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  itemCard: {
    width: 220,
    marginRight: 16,
  },
  emptyContainer: {
    width: 220,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  addButton: {
    minWidth: 120,
  },
  addItemContainer: {
    padding: 16,
    marginBottom: 32,
  },
  addItemButton: {
    width: '100%',
  },
  addItemButtonText: {
    color: Colors.text.light,
    fontSize: 16,
    fontWeight: '600',
  },
});