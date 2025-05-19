import { create } from 'zustand';
import { User } from '@/types';
import users from '@/mocks/users';
import { useLocationStore } from './locationStore';
import { getDistanceBetweenLocations } from '@/utils/locationUtils';
import { useItemsStore } from './itemsStore';

interface UsersState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  
  fetchUsers: () => Promise<void>;
  getUserById: (id: string) => User | undefined;
  getNearbyUsers: (maxDistance?: number) => Array<{
    user: User;
    distance: number;
    itemCount: number;
  }>;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  
  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({ users, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch users', 
        isLoading: false 
      });
    }
  },
  
  getUserById: (id: string) => {
    return get().users.find(user => user.id === id);
  },
  
  getNearbyUsers: (maxDistance = 10) => {
    const { location } = useLocationStore.getState();
    const { items } = useItemsStore.getState();
    const { users } = get();
    
    if (!location) {
      return [];
    }
    
    // Calculate distance for each user and filter by maxDistance
    return users
      .filter(user => user.location) // Only users with location data
      .map(user => {
        const distance = getDistanceBetweenLocations(location, user.location);
        const userItems = items.filter(item => item.owner.id === user.id);
        
        return {
          user,
          distance: distance || Infinity,
          itemCount: userItems.length,
        };
      })
      .filter(({ distance }) => distance !== null && distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance);
  },
}));