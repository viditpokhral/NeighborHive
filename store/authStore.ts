import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';
import users from '@/mocks/users';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
          
          if (!user) {
            throw new Error('Invalid email or password');
          }
          
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An error occurred';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },
      
      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
          
          if (existingUser) {
            throw new Error('Email already in use');
          }
          
          const newUser: User = {
            id: `user_${Date.now()}`,
            name,
            email,
            avatar: undefined,
            rating: 0,
            reviewCount: 0,
            verified: false,
            createdAt: new Date().toISOString(),
          };
          
          set({ user: newUser, isAuthenticated: true, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An error occurred';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      updateProfile: async (userData: Partial<User>) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const currentUser = get().user;
          
          if (!currentUser) {
            throw new Error('User not authenticated');
          }
          
          const updatedUser = { ...currentUser, ...userData };
          
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An error occurred';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },
    }),
    {
      name: 'sharespot-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);