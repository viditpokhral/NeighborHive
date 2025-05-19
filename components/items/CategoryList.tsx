import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ItemCategory } from '@/types';
import CategoryPill from '@/components/ui/CategoryPill';
import categories from '@/mocks/categories';

interface CategoryListProps {
  selectedCategory: ItemCategory | null;
  onSelectCategory: (category: ItemCategory | null) => void;
}

export default function CategoryList({
  selectedCategory,
  onSelectCategory,
}: CategoryListProps) {
  const handleCategoryPress = (category: ItemCategory) => {
    if (selectedCategory === category) {
      onSelectCategory(null); // Deselect if already selected
    } else {
      onSelectCategory(category);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <CategoryPill
          label="All"
          icon="🔍"
          isSelected={selectedCategory === null}
          onPress={() => onSelectCategory(null)}
        />
        
        {categories.map((category) => (
          <CategoryPill
            key={category.id}
            label={category.name}
            icon={category.icon}
            isSelected={selectedCategory === category.id}
            onPress={() => handleCategoryPress(category.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});