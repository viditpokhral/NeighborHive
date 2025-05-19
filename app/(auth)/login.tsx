import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Colors from '@/constants/colors';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setEmailError('');
    setPasswordError('');
    
    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    }
    
    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }
    
    return isValid;
  };
  
  const handleLogin = async () => {
    if (validateForm()) {
      try {
        await login(email, password);
        router.replace('/(tabs)');
      } catch (error) {
        // Error is handled by the store
      }
    }
  };
  
  const handleBack = () => {
    router.back();
  };
  
  const handleSignUp = () => {
    router.push('/(auth)/signup');
  };
  
  // For demo purposes, let's add a quick login function
  const handleQuickLogin = async () => {
    try {
      await login('alex.johnson@example.com', 'password');
      router.replace('/(tabs)');
    } catch (error) {
      // Error is handled by the store
    }
  };
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={handleBack}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <ArrowLeft size={24} color={Colors.text.primary} />
      </TouchableOpacity>
      
      <View style={styles.header}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Log in to your ShareSpot account</Text>
      </View>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      <View style={styles.form}>
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          error={emailError}
        />
        
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          isPassword
          error={passwordError}
        />
        
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>
        
        <Button
          title="Log In"
          onPress={handleLogin}
          isLoading={isLoading}
          style={styles.loginButton}
          size="large"
        />
        
        {/* Quick login for demo purposes */}
        <TouchableOpacity 
          style={styles.quickLogin}
          onPress={handleQuickLogin}
        >
          <Text style={styles.quickLoginText}>Quick Login (Demo)</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={handleSignUp}>
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 24,
    left: 24,
    zIndex: 10,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  errorContainer: {
    backgroundColor: `${Colors.error}20`,
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
  },
  form: {
    marginBottom: 24,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: Colors.primary,
    fontSize: 14,
  },
  loginButton: {
    marginBottom: 16,
  },
  quickLogin: {
    alignSelf: 'center',
    padding: 8,
  },
  quickLoginText: {
    color: Colors.text.secondary,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  footerText: {
    color: Colors.text.secondary,
    fontSize: 14,
  },
  signUpText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});