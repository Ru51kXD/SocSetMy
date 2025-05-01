import React from 'react';
import { StyleSheet, View, FlatList, Dimensions } from 'react-native';
import { ArtworkCard } from '@/app/components/common/ArtworkCard';
import { Artwork } from '@/app/models/types';

interface GalleryGridProps {
  artworks: Artwork[];
  numColumns?: number;
  compact?: boolean;
  onEndReached?: () => void;
}

const { width } = Dimensions.get('window');

export function GalleryGrid({ 
  artworks, 
  numColumns = 2,
  compact = true,
  onEndReached 
}: GalleryGridProps) {
  const renderItem = ({ item }: { item: Artwork }) => (
    <View style={styles.itemContainer}>
      <ArtworkCard artwork={item} compact={compact} />
    </View>
  );

  return (
    <FlatList
      data={artworks}
      renderItem={renderItem}
      keyExtractor={(item) => `gallery-grid-${item.id}`}
      numColumns={numColumns}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      columnWrapperStyle={styles.columnWrapper}
    />
  );
}

export default GalleryGrid;

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemContainer: {
    width: (width - 32) / 2, // 2 колонки с отступами
    marginBottom: 16,
  },
}); 