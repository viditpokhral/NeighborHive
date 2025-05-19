import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking } from '@/types';
import mockBookings from '@/mocks/bookings';

interface BookingsState {
  bookings: Booking[];
  userBookings: Booking[]; // Bookings where user is the borrower
  userListings: Booking[]; // Bookings where user is the owner
  isLoading: boolean;
  error: string | null;
  
  fetchBookings: (userId: string) => Promise<void>;
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => Promise<Booking>;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
  extendBooking: (bookingId: string, newEndDate: string) => Promise<void>;
  checkItemAvailability: (itemId: string, startDate: string, endDate: string) => Promise<boolean>;
  getBookingById: (bookingId: string) => Booking | undefined;
}

export const useBookingsStore = create<BookingsState>()(
  persist(
    (set, get) => ({
      bookings: [],
      userBookings: [],
      userListings: [],
      isLoading: false,
      error: null,
      
      fetchBookings: async (userId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Use mock data
          const allBookings = mockBookings;
          
          // Filter bookings where user is borrower
          const userBookings = allBookings.filter(booking => booking.borrowerId === userId);
          
          // Filter bookings where user is owner
          const userListings = allBookings.filter(booking => booking.ownerId === userId);
          
          set({ 
            bookings: allBookings, 
            userBookings, 
            userListings, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch bookings', 
            isLoading: false 
          });
        }
      },
      
      getBookingById: (bookingId: string) => {
        return get().bookings.find(booking => booking.id === bookingId);
      },
      
      createBooking: async (booking) => {
        set({ isLoading: true, error: null });
        
        try {
          // Check availability first
          const isAvailable = await get().checkItemAvailability(
            booking.itemId,
            booking.startDate,
            booking.endDate
          );
          
          if (!isAvailable) {
            throw new Error('Item is not available for the selected dates');
          }
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newBooking: Booking = {
            ...booking,
            id: `booking_${Date.now()}`,
            status: 'pending',
            createdAt: new Date().toISOString(),
          };
          
          set(state => {
            const updatedBookings = [newBooking, ...state.bookings];
            
            // Update user bookings if current user is the borrower
            const updatedUserBookings = booking.borrowerId === state.userBookings[0]?.borrowerId
              ? [newBooking, ...state.userBookings]
              : state.userBookings;
            
            // Update user listings if current user is the owner
            const updatedUserListings = booking.ownerId === state.userListings[0]?.ownerId
              ? [newBooking, ...state.userListings]
              : state.userListings;
            
            return {
              bookings: updatedBookings,
              userBookings: updatedUserBookings,
              userListings: updatedUserListings,
              isLoading: false
            };
          });
          
          return newBooking;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create booking', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      updateBookingStatus: async (bookingId, status) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => {
            // Update booking in all lists
            const updateBookingInList = (list: Booking[]) =>
              list.map(booking => 
                booking.id === bookingId 
                  ? { ...booking, status } 
                  : booking
              );
            
            return {
              bookings: updateBookingInList(state.bookings),
              userBookings: updateBookingInList(state.userBookings),
              userListings: updateBookingInList(state.userListings),
              isLoading: false
            };
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update booking status', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      cancelBooking: async (bookingId) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Just update the status to cancelled
          await get().updateBookingStatus(bookingId, 'cancelled');
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to cancel booking', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      extendBooking: async (bookingId, newEndDate) => {
        set({ isLoading: true, error: null });
        
        try {
          // Get the booking
          const booking = get().bookings.find(b => b.id === bookingId);
          if (!booking) {
            throw new Error('Booking not found');
          }
          
          // Check if the item is available for the extended period
          const isAvailable = await get().checkItemAvailability(
            booking.itemId,
            booking.startDate,
            newEndDate
          );
          
          if (!isAvailable) {
            throw new Error('Item is not available for the extended period');
          }
          
          // Calculate new total price
          const startDate = new Date(booking.startDate);
          const endDate = new Date(newEndDate);
          const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
          
          // Assuming price per day is totalPrice / original days
          const originalDays = Math.ceil(
            (new Date(booking.endDate).getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          const pricePerDay = booking.totalPrice / originalDays;
          const newTotalPrice = pricePerDay * days;
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => {
            // Update booking in all lists
            const updateBookingInList = (list: Booking[]) =>
              list.map(b => 
                b.id === bookingId 
                  ? { 
                      ...b, 
                      endDate: newEndDate,
                      totalPrice: newTotalPrice
                    } 
                  : b
              );
            
            return {
              bookings: updateBookingInList(state.bookings),
              userBookings: updateBookingInList(state.userBookings),
              userListings: updateBookingInList(state.userListings),
              isLoading: false
            };
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to extend booking', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      checkItemAvailability: async (itemId, startDate, endDate) => {
        try {
          // In a real app, this would make an API call to check availability
          // For now, we'll simulate by checking existing bookings
          
          // Convert dates to Date objects for comparison
          const start = new Date(startDate);
          const end = new Date(endDate);
          
          // Get all bookings for this item that are not cancelled or rejected
          const itemBookings = get().bookings.filter(
            booking => 
              booking.itemId === itemId && 
              !['cancelled', 'rejected'].includes(booking.status)
          );
          
          // Check if any booking overlaps with the requested dates
          const hasOverlap = itemBookings.some(booking => {
            const bookingStart = new Date(booking.startDate);
            const bookingEnd = new Date(booking.endDate);
            
            // Check for overlap
            return (
              (start <= bookingEnd && start >= bookingStart) || // Start date is within an existing booking
              (end <= bookingEnd && end >= bookingStart) || // End date is within an existing booking
              (start <= bookingStart && end >= bookingEnd) // Booking is completely within the requested dates
            );
          });
          
          return !hasOverlap;
        } catch (error) {
          console.error('Error checking availability:', error);
          return false;
        }
      },
    }),
    {
      name: 'bookings-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        bookings: state.bookings,
        userBookings: state.userBookings,
        userListings: state.userListings,
      }),
    }
  )
);