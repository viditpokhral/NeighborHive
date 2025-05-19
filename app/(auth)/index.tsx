import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';
import Colors from '@/constants/colors';

export default function WelcomeScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  
  useEffect(() => {
    // If user is already authenticated, redirect to main app
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, router]);
  
  const handleLogin = () => {
    router.push('/(auth)/login');
  };
  
  const handleSignUp = () => {
    router.push('/(auth)/signup');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1000' }} 
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
        <Text style={styles.logo}>ShareSpot</Text>
        <Text style={styles.tagline}>Borrow, lend, share with your community</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to ShareSpot</Text>
        <Text style={styles.description}>
          Connect with your neighbors to share items, save money, and build a more sustainable community.
        </Text>
        
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>🔄</Text>
            <Text style={styles.featureText}>Borrow, lend, or swap items</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>📍</Text>
            <Text style={styles.featureText}>Find items in your neighborhood</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>💰</Text>
            <Text style={styles.featureText}>Save money on rarely used items</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>🌱</Text>
            <Text style={styles.featureText}>Reduce waste and consumption</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.buttonsContainer}>
        <Button
          title="Sign Up"
          onPress={handleSignUp}
          style={styles.signUpButton}
          size="large"
        />
        
        <Button
          title="Log In"
          onPress={handleLogin}
          variant="outline"
          style={styles.loginButton}
          size="large"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  logoContainer: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  logo: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.text.light,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: Colors.text.light,
  },
  content: {
    padding: 24,
    flex: 1, // This ensures content takes available space
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 24,
    lineHeight: 24,
  },
  features: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  buttonsContainer: {
    padding: 24,
    paddingBottom: 32, // Add more padding at the bottom
    gap: 16,
  },
  signUpButton: {
    width: '100%',
  },
  loginButton: {
    width: '100%',
  },
});