import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from './authStore';

interface UserRoleState {
  // Borrower data
  savedItems: string[];
  borrowingHistory: string[];
  
  // Lender data
  listedItems: string[];
  lendingHistory: string[];
  earnings: number;
  
  // Actions
  addSavedItem: (itemId: string) => void;
  removeSavedItem: (itemId: string) => void;
  addBorrowingHistory: (bookingId: string) => void;
  addListedItem: (itemId: string) => void;
  removeListedItem: (itemId: string) => void;
  addLendingHistory: (bookingId: string) => void;
  addEarnings: (amount: number) => void;
  
  // Reset
  resetUserData: () => void;
}

export const useUserRoleStore = create<UserRoleState>()(
  persist(
    (set) => ({
      // Initial state
      savedItems: [],
      borrowingHistory: [],
      listedItems: [],
      lendingHistory: [],
      earnings: 0,
      
      // Actions
      addSavedItem: (itemId: string) => set((state) => ({
        savedItems: [...state.savedItems, itemId]
      })),
      
      removeSavedItem: (itemId: string) => set((state) => ({
        savedItems: state.savedItems.filter(id => id !== itemId)
      })),
      
      addBorrowingHistory: (bookingId: string) => set((state) => ({
        borrowingHistory: [...state.borrowingHistory, bookingId]
      })),
      
      addListedItem: (itemId: string) => set((state) => ({
        listedItems: [...state.listedItems, itemId]
      })),
      
      removeListedItem: (itemId: string) => set((state) => ({
        listedItems: state.listedItems.filter(id => id !== itemId)
      })),
      
      addLendingHistory: (bookingId: string) => set((state) => ({
        lendingHistory: [...state.lendingHistory, bookingId]
      })),
      
      addEarnings: (amount: number) => set((state) => ({
        earnings: state.earnings + amount
      })),
      
      resetUserData: () => set({
        savedItems: [],
        borrowingHistory: [],
        listedItems: [],
        lendingHistory: [],
        earnings: 0
      }),
    }),
    {
      name: 'user-role-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Custom hook for borrower functionality
export function useBorrower() {
  const { user } = useAuthStore();
  const userRoleStore = useUserRoleStore();
  
  if (!user) {
    throw new Error('User must be authenticated to use borrower functionality');
  }
  
  return {
    // Data
    savedItems: userRoleStore.savedItems,
    borrowingHistory: userRoleStore.borrowingHistory,
    
    // Methods
    saveItem: async (itemId: string): Promise<boolean> => {
      userRoleStore.addSavedItem(itemId);
      return true;
    },
    
    unsaveItem: async (itemId: string): Promise<boolean> => {
      userRoleStore.removeSavedItem(itemId);
      return true;
    },
    
    addToBorrowingHistory: (bookingId: string): void => {
      userRoleStore.addBorrowingHistory(bookingId);
    },
  };
}

// Custom hook for lender functionality
export function useLender() {
  const { user } = useAuthStore();
  const userRoleStore = useUserRoleStore();
  
  if (!user) {
    throw new Error('User must be authenticated to use lender functionality');
  }
  
  return {
    // Data
    listedItems: userRoleStore.listedItems,
    lendingHistory: userRoleStore.lendingHistory,
    earnings: userRoleStore.earnings,
    
    // Methods
    addListedItem: (itemId: string): void => {
      userRoleStore.addListedItem(itemId);
    },
    
    removeListedItem: (itemId: string): void => {
      userRoleStore.removeListedItem(itemId);
    },
    
    addToLendingHistory: (bookingId: string): void => {
      userRoleStore.addLendingHistory(bookingId);
    },
    
    addEarnings: (amount: number): void => {
      userRoleStore.addEarnings(amount);
    },
  };
}