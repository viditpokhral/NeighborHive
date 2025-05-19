import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User } from '@/types';
import Avatar from '@/components/ui/Avatar';
import Rating from '@/components/ui/Rating';
import { MapPin, Edit2 } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface ProfileHeaderProps {
  user: User;
  isCurrentUser?: boolean;
  onEditProfile?: () => void;
}

export default function ProfileHeader({ 
  user, 
  isCurrentUser = false,
  onEditProfile,
}: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar 
          source={user.avatar} 
          name={user.name} 
          size={100}
          showBorder
        />
        
        {isCurrentUser && onEditProfile && (
          <TouchableOpacity 
            style={styles.editButton}
            onPress={onEditProfile}
          >
            <Edit2 size={16} color={Colors.text.light} />
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={styles.name}>{user.name}</Text>
      
      <View style={styles.ratingContainer}>
        <Rating 
          value={user.rating} 
          size="medium" 
          reviewCount={user.reviewCount}
        />
      </View>
      
      {user.location?.neighborhood && (
        <View style={styles.locationContainer}>
          <MapPin size={16} color={Colors.text.secondary} />
          <Text style={styles.location}>{user.location.neighborhood}</Text>
        </View>
      )}
      
      {user.bio && (
        <Text style={styles.bio}>{user.bio}</Text>
      )}
      
      {isCurrentUser && onEditProfile && (
        <TouchableOpacity 
          style={styles.editProfileButton}
          onPress={onEditProfile}
        >
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.card,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  ratingContainer: {
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  location: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  bio: {
    fontSize: 16,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  editProfileButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 20,
  },
  editProfileText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});