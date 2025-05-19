import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Plus, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { useItemsStore } from '@/store/itemsStore';
import { useAuthStore } from '@/store/authStore';
import { ItemCategory, RentalType } from '@/types';
import Colors from '@/constants/colors';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import CategoryList from '@/components/items/CategoryList';
import RentalTypeFilter from '@/components/items/RentalTypeFilter';

export default function AddItemScreen() {
  const router = useRouter();
  const { addItem, isLoading } = useItemsStore();
  const { user } = useAuthStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [category, setCategory] = useState<ItemCategory>('other');
  const [condition, setCondition] = useState<'new' | 'like_new' | 'good' | 'fair' | 'worn'>('good');
  const [rentalType, setRentalType] = useState<RentalType>('rent');
  const [price, setPrice] = useState('');
  const [deposit, setDeposit] = useState('');
  
  const handleAddImage = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets[0] && result.assets[0].uri) {
        setImages(prev => [...prev, result.assets[0].uri]);
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert('Error', 'Failed to add image. Please try again.');
    }
  }, []);
  
  const handleRemoveImage = useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  }, []);
  
  const handleSubmit = useCallback(async () => {
    if (!user || !user.id) {
      Alert.alert('Error', 'You must be logged in to add items');
      return;
    }

    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    if (images.length === 0) {
      Alert.alert('Error', 'Please add at least one image');
      return;
    }
    
    try {
      await addItem({
        title: title.trim(),
        description: description.trim(),
        images,
        category,
        condition,
        rentalType,
        price: Number(price) || 0,
        deposit: Number(deposit) || 0,
        location: {
          latitude: 0, // TODO: Get actual location
          longitude: 0,
          neighborhood: 'Test Location',
        },
        availableDates: [{
          start: new Date().toISOString(),
          end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        }],
        rating: 0,
        reviewCount: 0,
        owner: {
          id: user.id,
          name: user.name || "Unknown User",
          avatar: user.avatar,
          rating: user.rating || 0,
        },
      });
      
      Alert.alert('Success', 'Item added successfully');
      router.back();
    } catch (error) {
      console.error("Add item error:", error);
      Alert.alert('Error', 'Failed to add item. Please try again.');
    }
  }, [title, description, images, category, condition, rentalType, price, deposit, user, addItem, router]);
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Add New Item',
          headerShown: true,
        }}
      />
      
      <ScrollView style={styles.container}>
        <View style={styles.imagesContainer}>
          {images.map((uri, index) => (
            <View key={`image-${index}`} style={styles.imageWrapper}>
              <Button
                onPress={() => handleRemoveImage(index)}
                variant="secondary"
                size="small"
                style={styles.removeButton}
              >
                <X size={16} color={Colors.text.primary} />
              </Button>
              <Image
                source={{ uri }}
                style={styles.image}
                contentFit="cover"
              />
            </View>
          ))}
          
          {images.length < 5 && (
            <Button
              onPress={handleAddImage}
              variant="secondary"
              style={styles.addImageButton}
            >
              <Plus size={24} color={Colors.text.secondary} />
              <Text style={styles.addImageText}>Add Image</Text>
            </Button>
          )}
        </View>
        
        <View style={styles.form}>
          <Input
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="Enter item title"
            isRequired
          />
          
          <Input
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your item"
            multiline
            numberOfLines={4}
            isRequired
          />
          
          <Text style={styles.label}>Category</Text>
          <CategoryList
            selectedCategory={category}
            onSelectCategory={(cat) => setCategory(cat || 'other')}
          />
          
          <Text style={styles.label}>Condition</Text>
          <View style={styles.conditionButtons}>
            {[
              { value: 'new', label: 'NEW' },
              { value: 'like_new', label: 'LIKE NEW' },
              { value: 'good', label: 'GOOD' },
              { value: 'fair', label: 'FAIR' },
              { value: 'worn', label: 'WORN' }
            ].map((cond) => (
              <Button
                key={cond.value}
                onPress={() => setCondition(cond.value as typeof condition)}
                variant={condition === cond.value ? 'primary' : 'secondary'}
                size="small"
                style={styles.conditionButton}
              >
                {cond.label}
              </Button>
            ))}
          </View>
          
          <Text style={styles.label}>Rental Type</Text>
          <RentalTypeFilter
            selectedType={rentalType}
            onSelectType={(type) => setRentalType(type || 'rent')}
          />
          
          <Input
            label="Price per Day"
            value={price}
            onChangeText={setPrice}
            placeholder="0.00"
            keyboardType="decimal-pad"
            leftIcon={<Text style={styles.currency}>$</Text>}
          />
          
          <Input
            label="Security Deposit"
            value={deposit}
            onChangeText={setDeposit}
            placeholder="0.00"
            keyboardType="decimal-pad"
            leftIcon={<Text style={styles.currency}>$</Text>}
          />
        </View>
        
        <View style={styles.footer}>
          <Button
            title="Add Item"
            onPress={handleSubmit}
            isLoading={isLoading}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 16,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    zIndex: 1,
    width: 24,
    height: 24,
    padding: 0,
    borderRadius: 12,
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.card,
  },
  addImageText: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  form: {
    padding: 16,
    gap: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  conditionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  conditionButton: {
    flex: 1,
    minWidth: 80,
  },
  buttonText: {
    color: Colors.text.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  activeButtonText: {
    color: Colors.text.light,
    fontSize: 12,
    fontWeight: '600',
  },
  currency: {
    fontSize: 16,
    color: Colors.text.primary,
    marginRight: 8,
  },
  footer: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  submitButton: {
    width: '100%',
  },
  submitButtonText: {
    color: Colors.text.light,
    fontSize: 16,
    fontWeight: '600',
  },
});