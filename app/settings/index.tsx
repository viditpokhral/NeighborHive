import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Globe, Moon, Shield, Smartphone } from 'lucide-react-native';
import Colors from '@/constants/colors';
import SettingItem from '@/components/settings/SettingItem';

export default function SettingsScreen() {
  const router = useRouter();
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <SettingItem
          icon={<Bell size={24} color={Colors.text.primary} />}
          title="Notifications"
          subtitle="Manage your notification preferences"
          onPress={() => {}}
        />
        
        <SettingItem
          icon={<Globe size={24} color={Colors.text.primary} />}
          title="Language"
          subtitle="Change app language"
          value="English"
          onPress={() => {}}
        />
        
        <SettingItem
          icon={<Moon size={24} color={Colors.text.primary} />}
          title="Dark Mode"
          subtitle="Toggle dark mode"
          isSwitch
          value={false}
          onValueChange={() => {}}
        />
      </View>
      
      <View style={styles.section}>
        <SettingItem
          icon={<Smartphone size={24} color={Colors.text.primary} />}
          title="App Version"
          subtitle="Current version of the app"
          value="1.0.0"
          disabled
        />
        
        <SettingItem
          icon={<Shield size={24} color={Colors.text.primary} />}
          title="Privacy Settings"
          subtitle="Manage your privacy preferences"
          onPress={() => router.push('/privacy-terms')}
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
  section: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});