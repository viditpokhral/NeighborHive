import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LogOut, Settings, Heart, HelpCircle, Shield, Plus, User } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useItemsStore } from '@/store/itemsStore';
import { useUserRoleStore } from '@/store/userRoleStore';
import Colors from '@/constants/colors';
import ProfileHeader from '@/components/profile/ProfileHeader';
import LenderStats from '@/components/profile/LenderStats';
import BorrowerStats from '@/components/profile/BorrowerStats';
import ItemCard from '@/components/items/ItemCard';
import Button from '@/components/ui/Button';
import { BorrowerData, LenderData } from '@/types/users';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { items, fetchItems } = useItemsStore();
  const [activeTab, setActiveTab] = useState<'lender' | 'borrower'>('lender');
  
  useEffect(() => {
    if (user) {
      const roleStore = useUserRoleStore.getState();
      roleStore.fetchLenderData(user.id);
      roleStore.fetchBorrowerData(user.id);
      fetchItems();
    }
  }, [user]);
  
  const handleEditProfile = () => {
    router.push('/profile/edit');
  };
  
  const handleLogout = () => {
    logout();
    router.replace('/(auth)');
  };
  
  const handleAddItem = () => {
    router.push('/explore');
  };
  
  const userItems = items.filter(item => item.owner.id === user?.id);
  
  let lenderData: LenderData | undefined;
  let borrowerData: BorrowerData | undefined;
  
  try {
    if (user) {
      const roleStore = useUserRoleStore.getState();
      
      lenderData = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        phone: user.phone,
        bio: user.bio,
        listedItems: roleStore.listedItems,
        activeListings: roleStore.listedItems.filter(item => 
          item.availableDates.some(date => new Date(date.end) > new Date())
        ),
        lendingHistory: roleStore.lendingHistory,
        receivedReviews: roleStore.receivedReviews,
        totalEarnings: roleStore.totalEarnings,
        responseRate: roleStore.responseRate,
        averageResponseTime: roleStore.averageResponseTime,
      };
      
      borrowerData = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        phone: user.phone,
        bio: user.bio,
        borrowingHistory: roleStore.borrowingHistory,
        activeBookings: roleStore.borrowingHistory.filter(booking => 
          ['pending', 'approved', 'active'].includes(booking.status)
        ),
        savedItems: roleStore.savedItems,
        submittedReviews: roleStore.submittedReviews,
        totalSpent: roleStore.totalSpent,
        preferredCategories: roleStore.preferredCategories,
        searchRadius: roleStore.searchRadius,
      };
    }
  } catch (error) {
    console.log('User not authenticated for role data');
  }
  
  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <ProfileHeader 
        user={user} 
        isCurrentUser={true}
        onEditProfile={handleEditProfile}
      />
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'lender' && styles.activeTab
          ]}
          onPress={() => setActiveTab('lender')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'lender' && styles.activeTabText
          ]}>
            As Lender
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'borrower' && styles.activeTab
          ]}
          onPress={() => setActiveTab('borrower')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'borrower' && styles.activeTabText
          ]}>
            As Borrower
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'lender' ? (
        <>
          <LenderStats
            totalEarnings={lenderData?.totalEarnings || 0}
            responseRate={lenderData?.responseRate || 0}
            averageResponseTime={lenderData?.averageResponseTime || 0}
            totalListings={userItems.length}
            activeListings={userItems.filter(item => 
              item.availableDates.some(date => new Date(date.end) > new Date())
            ).length}
          />
          
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Items</Text>
              <TouchableOpacity onPress={handleAddItem}>
                <Text style={styles.addItemText}>Add Item</Text>
              </TouchableOpacity>
            </View>
            
            {userItems.length > 0 ? (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.itemsContainer}
              >
                {userItems.map(item => (
                  <View key={item.id} style={styles.itemCard}>
                    <ItemCard item={item} />
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.emptyItemsContainer}>
                <Text style={styles.emptyText}>
                  You haven't added any items yet
                </Text>
                <Button
                  title="Add an Item"
                  onPress={handleAddItem}
                  leftIcon={<Plus size={18} color={Colors.text.light} />}
                  style={styles.addButton}
                  size="small"
                />
              </View>
            )}
          </View>
        </>
      ) : (
        <>
          <BorrowerStats
            totalSpent={borrowerData?.totalSpent || 0}
            activeBookings={borrowerData?.activeBookings?.length || 0}
            completedBookings={(borrowerData?.borrowingHistory?.filter(b => b.status === 'completed').length) || 0}
            savedItems={borrowerData?.savedItems?.length || 0}
            reviewsGiven={borrowerData?.submittedReviews?.length || 0}
          />
          
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Saved Items</Text>
            </View>
            
            {(borrowerData?.savedItems?.length || 0) > 0 ? (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.itemsContainer}
              >
                {items
                  .filter(item => borrowerData?.savedItems?.includes(item.id))
                  .map(item => (
                    <View key={item.id} style={styles.itemCard}>
                      <ItemCard item={item} />
                    </View>
                  ))
                }
              </ScrollView>
            ) : (
              <View style={styles.emptyItemsContainer}>
                <Text style={styles.emptyText}>
                  You haven't saved any items yet
                </Text>
                <Button
                  title="Explore Items"
                  onPress={() => router.push('/explore')}
                  style={styles.addButton}
                  size="small"
                />
              </View>
            )}
          </View>
        </>
      )}
      
      <View style={styles.menuSection}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/profile/edit')}
        >
          <User size={20} color={Colors.text.primary} />
          <Text style={styles.menuText}>Edit Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/settings')}
        >
          <Settings size={20} color={Colors.text.primary} />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/saved-items')}
        >
          <Heart size={20} color={Colors.text.primary} />
          <Text style={styles.menuText}>Saved Items</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/help')}
        >
          <HelpCircle size={20} color={Colors.text.primary} />
          <Text style={styles.menuText}>Help & Support</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/privacy-terms')}
        >
          <Shield size={20} color={Colors.text.primary} />
          <Text style={styles.menuText}>Privacy & Terms</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.menuItem, styles.logoutItem]}
          onPress={handleLogout}
        >
          <LogOut size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>ShareSpot v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.card,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  section: {
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  addItemText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  itemsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  itemCard: {
    width: 220,
    marginRight: 16,
  },
  emptyItemsContainer: {
    margin: 16,
    padding: 24,
    backgroundColor: Colors.card,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  addButton: {
    minWidth: 150,
  },
  menuSection: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    margin: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuText: {
    fontSize: 16,
    color: Colors.text.primary,
    marginLeft: 12,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    fontSize: 16,
    color: Colors.error,
    marginLeft: 12,
  },
  versionContainer: {
    alignItems: 'center',
    padding: 16,
    marginBottom: 32,
  },
  versionText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
});