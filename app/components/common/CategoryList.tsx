import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Image, View, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ArtCategory } from '@/app/models/types';
import { useRouter } from 'expo-router';

interface CategoryListProps {
  categories: ArtCategory[];
  horizontal?: boolean;
  props?: any;
}

export function CategoryList({ categories, horizontal, props }: CategoryListProps) {
  const router = useRouter();
  
  const renderItem = ({ item }: { item: ArtCategory }) => (
    <TouchableOpacity 
      style={styles.categoryItem}
      onPress={() => router.push(`/category/${item.id}`)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.categoryImage} />
      <View style={styles.categoryOverlay}>
        <ThemedText style={styles.categoryName}>{item.name}</ThemedText>
        <ThemedText style={styles.categoryCount}>{item.artworkCount} работ</ThemedText>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderItem}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => `category-list-${item.id}`}
        contentContainerStyle={[
          styles.listContent,
          horizontal && styles.horizontalListContent
        ]}
        {...props}
      />
    </ThemedView>
  );
}

// Добавляем экспорт по умолчанию
export default CategoryList;

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.7;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    width: ITEM_WIDTH,
    height: 120,
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
    padding: 12,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  categoryCount: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  horizontalListContent: {
    paddingHorizontal: 0,
  },
}); 