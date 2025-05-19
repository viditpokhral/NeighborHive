import { create } from 'zustand';
import { Platform } from 'react-native';
import * as Location from 'expo-location';

interface LocationState {
  location: {
    latitude: number;
    longitude: number;
  } | null;
  address: string | null;
  neighborhood: string | null;
  isLoading: boolean;
  error: string | null;
  
  requestLocationPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<void>;
  setManualLocation: (latitude: number, longitude: number) => Promise<void>;
}

export const useLocationStore = create<LocationState>((set) => ({
  location: null,
  address: null,
  neighborhood: null,
  isLoading: false,
  error: null,
  
  requestLocationPermission: async () => {
    set({ isLoading: true, error: null });
    
    try {
      if (Platform.OS === 'web') {
        // For web, we'll use the browser's geolocation API
        return true;
      }
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      const hasPermission = status === 'granted';
      
      if (!hasPermission) {
        set({ 
          error: 'Permission to access location was denied', 
          isLoading: false 
        });
      }
      
      return hasPermission;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to request location permission', 
        isLoading: false 
      });
      return false;
    }
  },
  
  getCurrentLocation: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Request permission first
      const hasPermission = await Location.requestForegroundPermissionsAsync()
        .then(result => result.status === 'granted');
      
      if (!hasPermission) {
        throw new Error('Location permission not granted');
      }
      
      // Get current position
      let locationResult;
      
      if (Platform.OS === 'web') {
        // For web, use browser's geolocation API
        locationResult = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
          });
        }).then(position => ({
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          },
          timestamp: position.timestamp,
        }));
      } else {
        // For native, use Expo Location
        locationResult = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
      }
      
      const { latitude, longitude } = locationResult.coords;
      
      // Reverse geocode to get address
      let geocodeResult;
      
      if (Platform.OS !== 'web') {
        geocodeResult = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
      } else {
        // Mock geocode result for web
        geocodeResult = [{
          city: 'San Francisco',
          district: 'Mission District',
          street: 'Valencia St',
          streetNumber: '123',
          region: 'CA',
          country: 'United States',
        }];
      }
      
      const addressInfo = geocodeResult[0];
      const formattedAddress = addressInfo 
        ? `${addressInfo.streetNumber || ''} ${addressInfo.street || ''}, ${addressInfo.city || ''}, ${addressInfo.region || ''}`
        : null;
      
      set({
        location: { latitude, longitude },
        address: formattedAddress,
        neighborhood: addressInfo?.district || addressInfo?.region || null,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to get current location', 
        isLoading: false 
      });
    }
  },
  
  setManualLocation: async (latitude: number, longitude: number) => {
    set({ isLoading: true, error: null });
    
    try {
      // Reverse geocode to get address
      let geocodeResult;
      
      if (Platform.OS !== 'web') {
        geocodeResult = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
      } else {
        // Mock geocode result for web
        geocodeResult = [{
          city: 'San Francisco',
          district: 'Mission District',
          street: 'Valencia St',
          streetNumber: '123',
          region: 'CA',
          country: 'United States',
        }];
      }
      
      const addressInfo = geocodeResult[0];
      const formattedAddress = addressInfo 
        ? `${addressInfo.streetNumber || ''} ${addressInfo.street || ''}, ${addressInfo.city || ''}, ${addressInfo.region || ''}`
        : null;
      
      set({
        location: { latitude, longitude },
        address: formattedAddress,
        neighborhood: addressInfo?.district || addressInfo?.region || null,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to set manual location', 
        isLoading: false 
      });
    }
  },
}));