import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Image, View, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ArtCategory } from '@/app/models/types';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

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
      activeOpacity={0.85}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.categoryImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.categoryOverlay}
      >
        <ThemedText style={styles.categoryName}>{item.name}</ThemedText>
        <ThemedText style={styles.categoryCount}>{item.artworkCount} работ</ThemedText>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderItem}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => `category-list-${item.id}`}
        contentContainerStyle={[
          styles.listContent,
          horizontal ? styles.horizontalListContent : { flexGrow: 1 }
        ]}
        decelerationRate="fast"
        snapToAlignment="start"
        {...(horizontal ? { snapToInterval: ITEM_WIDTH + 12 } : {})}
        {...props}
      />
    </ThemedView>
  );
}

// Добавляем экспорт по умолчанию
export default CategoryList;

const { width } = Dimensions.get('window');
// Адаптируем размер в зависимости от ширины экрана
const ITEM_WIDTH = width < 360 ? width * 0.8 : width * 0.7;
const ITEM_HEIGHT = width < 360 ? 100 : 120;

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
    paddingVertical: 8,
  },
  horizontalListContent: {
    paddingLeft: 16,
    paddingRight: 6,
  },
  categoryItem: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 12,
    marginRight: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
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
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  categoryCount: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
}); 