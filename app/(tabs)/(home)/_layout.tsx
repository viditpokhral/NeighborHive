import { Stack } from 'expo-router';
import Colors from '@/constants/colors';

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.card,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'ShareSpot',
          headerLargeTitle: true,
          headerLargeTitleStyle: {
            fontSize: 28,
            fontWeight: 'bold',
          },
        }}
      />
    </Stack>
  );
}