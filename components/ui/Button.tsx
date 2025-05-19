import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps
} from 'react-native';
import Colors from '@/constants/colors';

interface ButtonProps extends TouchableOpacityProps {
  children?: React.ReactNode;
  title?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Button({
  children,
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  ...rest
}: ButtonProps) {
  const buttonStyles = [
    styles.button,
    styles[`${variant}Button`],
    styles[`${size}Button`],
    disabled && styles.disabledButton,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  const renderContent = () => {
    if (isLoading) {
      return (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' || variant === 'secondary' ? Colors.text.light : Colors.primary} 
        />
      );
    }
    
    // Render content based on what's provided
    return (
      <>
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        
        {/* If title prop is provided, use it */}
        {title && <Text style={textStyles}>{title}</Text>}
        
        {/* If children is a string, render it as text */}
        {typeof children === 'string' && !title && (
          <Text style={textStyles}>{children}</Text>
        )}
        
        {/* If children is not a string and not undefined, render it directly */}
        {typeof children !== 'string' && children !== undefined && !title && children}
        
        {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
      </>
    );
  };

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={isLoading || disabled}
      activeOpacity={0.8}
      {...rest}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    gap: 8,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Variants
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  primaryText: {
    color: Colors.text.light,
  },
  
  secondaryButton: {
    backgroundColor: Colors.secondary,
  },
  secondaryText: {
    color: Colors.text.light,
  },
  
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  outlineText: {
    color: Colors.primary,
  },
  
  ghostButton: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: Colors.primary,
  },
  
  // Sizes
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  smallText: {
    fontSize: 14,
  },
  
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  mediumText: {
    fontSize: 16,
  },
  
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  largeText: {
    fontSize: 18,
  },
  
  // States
  disabledButton: {
    backgroundColor: Colors.inactive,
    borderColor: Colors.inactive,
  },
  disabledText: {
    color: Colors.text.secondary,
  },
  
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

// Add View to the imports at the top
import { View } from 'react-native';