import { create } from 'zustand';
import { Item, ItemCategory, RentalType } from '@/types';
import mockItems from '@/mocks/items';

interface ItemsState {
  items: Item[];
  filteredItems: Item[];
  isLoading: boolean;
  error: string | null;
  
  // Filters
  categoryFilter: ItemCategory | null;
  rentalTypeFilter: RentalType | null;
  searchQuery: string;
  priceRange: [number, number];
  radiusFilter: number; // in miles
  
  // Actions
  fetchItems: () => Promise<void>;
  fetchItemById: (id: string) => Promise<Item | undefined>;
  addItem: (item: Omit<Item, 'id' | 'createdAt'>) => Promise<void>;
  updateItem: (id: string, updates: Partial<Item>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  
  // Filter actions
  setCategoryFilter: (category: ItemCategory | null) => void;
  setRentalTypeFilter: (type: RentalType | null) => void;
  setSearchQuery: (query: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setRadiusFilter: (radius: number) => void;
  applyFilters: () => void;
  resetFilters: () => void;
}

export const useItemsStore = create<ItemsState>((set, get) => ({
  items: [],
  filteredItems: [],
  isLoading: false,
  error: null,
  
  // Default filter values
  categoryFilter: null,
  rentalTypeFilter: null,
  searchQuery: '',
  priceRange: [0, 100],
  radiusFilter: 5, // 5 miles default
  
  fetchItems: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use mock data
      set({ items: mockItems, filteredItems: mockItems, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch items';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },
  
  fetchItemById: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Find item in mock data
      const item = mockItems.find(item => item.id === id);
      
      set({ isLoading: false });
      
      return item;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch item';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },
  
  addItem: async (item) => {
    set({ isLoading: true, error: null });
    
    try {
      // Validate required fields
      if (!item.title || !item.description || !item.images || item.images.length === 0) {
        throw new Error('Missing required fields');
      }
      
      // Validate owner
      if (!item.owner || !item.owner.id) {
        throw new Error('Owner information is required');
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newItem: Item = {
        ...item,
        id: `item_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      
      set(state => ({ 
        items: [newItem, ...state.items],
        filteredItems: [newItem, ...state.filteredItems],
        isLoading: false 
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add item';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },
  
  updateItem: async (id, updates) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set(state => {
        const updatedItems = state.items.map(item => 
          item.id === id ? { ...item, ...updates } : item
        );
        
        const updatedFilteredItems = state.filteredItems.map(item => 
          item.id === id ? { ...item, ...updates } : item
        );
        
        return { 
          items: updatedItems, 
          filteredItems: updatedFilteredItems,
          isLoading: false 
        };
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update item';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },
  
  deleteItem: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set(state => ({
        items: state.items.filter(item => item.id !== id),
        filteredItems: state.filteredItems.filter(item => item.id !== id),
        isLoading: false
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete item';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },
  
  setCategoryFilter: (category) => {
    set({ categoryFilter: category });
  },
  
  setRentalTypeFilter: (type) => {
    set({ rentalTypeFilter: type });
  },
  
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },
  
  setPriceRange: (range) => {
    set({ priceRange: range });
  },
  
  setRadiusFilter: (radius) => {
    set({ radiusFilter: radius });
  },
  
  applyFilters: () => {
    const { 
      items, 
      categoryFilter, 
      rentalTypeFilter, 
      searchQuery, 
      priceRange 
    } = get();
    
    let filtered = [...items];
    
    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }
    
    // Apply rental type filter
    if (rentalTypeFilter) {
      filtered = filtered.filter(item => item.rentalType === rentalTypeFilter);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        item => 
          item.title.toLowerCase().includes(query) || 
          item.description.toLowerCase().includes(query)
      );
    }
    
    // Apply price range
    filtered = filtered.filter(
      item => item.price >= priceRange[0] && item.price <= priceRange[1]
    );
    
    // In a real app, you would also filter by radius using geolocation
    
    set({ filteredItems: filtered });
  },
  
  resetFilters: () => {
    set({
      categoryFilter: null,
      rentalTypeFilter: null,
      searchQuery: '',
      priceRange: [0, 100],
      radiusFilter: 5,
      filteredItems: get().items
    });
  },
}));