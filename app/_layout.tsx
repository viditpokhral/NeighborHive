import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, LogBox } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/lib/trpc";

import { ErrorBoundary } from "./error-boundary";

// Ignore specific warnings that might be causing issues
LogBox.ignoreLogs([
  'Failed to download remote update',
  'Possible Unhandled Promise Rejection',
  'Non-serializable values were found in the navigation state',
  'java.io.IOException: failed to download remote update', // Add this specific error
]);

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Create a client
const queryClient = new QueryClient();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error("Font loading error:", error);
      // Don't throw the error as it might crash the app
      // Instead, continue with default fonts
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      try {
        SplashScreen.hideAsync();
      } catch (e) {
        console.warn("Error hiding splash screen:", e);
      }
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <RootLayoutNav />
        </QueryClientProvider>
      </trpc.Provider>
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="add-item" options={{ headerShown: false }} />
      <Stack.Screen 
        name="item/[id]" 
        options={{ 
          title: "Item Details",
          presentation: 'card',
        }} 
      />
      <Stack.Screen 
        name="messages/[id]" 
        options={{ 
          title: "Messages",
          presentation: 'card',
        }} 
      />
      <Stack.Screen 
        name="bookings/[id]" 
        options={{ 
          title: "Booking Details",
          presentation: 'card',
        }} 
      />
    </Stack>
  );
}