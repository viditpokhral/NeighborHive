import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RentalType } from '@/types';
import CategoryPill from '@/components/ui/CategoryPill';

interface RentalTypeFilterProps {
  selectedType: RentalType | null;
  onSelectType: (type: RentalType | null) => void;
}

export default function RentalTypeFilter({
  selectedType,
  onSelectType,
}: RentalTypeFilterProps) {
  const handleTypePress = (type: RentalType) => {
    if (selectedType === type) {
      onSelectType(null); // Deselect if already selected
    } else {
      onSelectType(type);
    }
  };

  return (
    <View style={styles.container}>
      <CategoryPill
        label="All Types"
        isSelected={selectedType === null}
        onPress={() => onSelectType(null)}
      />
      
      <CategoryPill
        label="Free to Borrow"
        icon="🎁"
        isSelected={selectedType === 'loan'}
        onPress={() => handleTypePress('loan')}
      />
      
      <CategoryPill
        label="For Rent"
        icon="💰"
        isSelected={selectedType === 'rent'}
        onPress={() => handleTypePress('rent')}
      />
      
      <CategoryPill
        label="For Swap"
        icon="🔄"
        isSelected={selectedType === 'swap'}
        onPress={() => handleTypePress('swap')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
});