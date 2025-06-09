import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GalleryGrid } from '@/app/components/gallery/GalleryGrid';
import { Artwork, Gallery } from '@/app/models/types';

// Моковые данные галерей
const MOCK_GALLERIES: Gallery[] = [
  {
    id: '1',
    title: 'Избранные работы',
    description: 'Лучшие работы из моей коллекции',
    coverImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f',
    ownerId: '1',
    ownerName: 'Михаил Лебедев',
    isPublic: true,
    artworkCount: 8,
    featuredArtworks: ['1', '4', '5'],
    createdAt: '2023-05-20',
    updatedAt: '2023-12-10'
  },
  {
    id: '2',
    title: 'Городские пейзажи',
    description: 'Коллекция городских пейзажей',
    coverImage: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a',
    ownerId: '1',
    ownerName: 'Михаил Лебедев',
    isPublic: true,
    artworkCount: 12,
    featuredArtworks: ['1'],
    createdAt: '2023-06-15',
    updatedAt: '2023-11-05'
  },
  {
    id: '3',
    title: 'Акварельные работы',
    description: 'Все мои акварельные работы',
    coverImage: 'https://images.unsplash.com/photo-1564769625905-42a042a2d458',
    ownerId: '1',
    ownerName: 'Михаил Лебедев',
    isPublic: true,
    artworkCount: 15,
    featuredArtworks: ['4'],
    createdAt: '2023-04-10',
    updatedAt: '2023-12-05'
  }
];

// Моковые данные работ
const USER_ARTWORKS: Artwork[] = [
  {
    id: '1',
    title: 'Городской пейзаж на закате',
    description: 'Городской пейзаж, написанный маслом, изображающий город на закате.',
    images: ['https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a',
    artistId: '1',
    artistName: 'Михаил Лебедев',
    artistAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    categories: ['Живопись'],
    tags: ['пейзаж', 'город', 'масло'],
    medium: 'Масло',
    likes: 245,
    views: 1203,
    comments: 48,
    isForSale: true,
    price: 12000,
    currency: 'KZT',
    createdAt: '2023-09-15'
  },
  {
    id: '4',
    title: 'Акварельный скетч Петербурга',
    description: 'Быстрый акварельный скетч исторического центра Санкт-Петербурга.',
    images: ['https://images.unsplash.com/photo-1564769625905-42a042a2d458'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1564769625905-42a042a2d458',
    artistId: '1',
    artistName: 'Михаил Лебедев',
    artistAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    categories: ['Живопись', 'Скетч'],
    tags: ['акварель', 'Петербург', 'скетч'],
    medium: 'Акварель',
    dimensions: '30x20 см',
    likes: 189,
    views: 870,
    comments: 32,
    isForSale: true,
    price: 8000,
    currency: 'KZT',
    createdAt: '2023-10-22'
  },
  {
    id: '5',
    title: 'Портрет незнакомки',
    description: 'Портрет девушки в технике сухая кисть.',
    images: ['https://images.unsplash.com/photo-1621784563330-caee0b138a00'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1621784563330-caee0b138a00',
    artistId: '1',
    artistName: 'Михаил Лебедев',
    artistAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    categories: ['Портрет'],
    tags: ['портрет', 'девушка', 'сухая кисть'],
    medium: 'Сухая кисть',
    dimensions: '40x60 см',
    likes: 312,
    views: 1420,
    comments: 56,
    isForSale: false,
    createdAt: '2023-11-05'
  },
  {
    id: '6',
    title: 'Эскиз для книжной иллюстрации',
    description: 'Эскиз для детской книги "Волшебный лес".',
    images: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
    artistId: '1',
    artistName: 'Михаил Лебедев',
    artistAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    categories: ['Иллюстрация'],
    tags: ['детская книга', 'иллюстрация', 'эскиз'],
    medium: 'Смешанная техника',
    likes: 175,
    views: 690,
    comments: 28,
    isForSale: false,
    createdAt: '2023-12-01'
  }
];

type GalleryViewMode = 'collections' | 'all';

export default function GalleryScreen() {
  const [viewMode, setViewMode] = useState<GalleryViewMode>('collections');

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Мои галереи</ThemedText>
        
        <ThemedView style={styles.viewToggle}>
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'collections' && styles.activeToggle]}
            onPress={() => setViewMode('collections')}
          >
            <FontAwesome 
              name="folder" 
              size={16} 
              color={viewMode === 'collections' ? '#0a7ea4' : '#888'} 
            />
            <ThemedText style={[
              styles.toggleText, 
              viewMode === 'collections' && styles.activeToggleText
            ]}>
              Коллекции
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'all' && styles.activeToggle]}
            onPress={() => setViewMode('all')}
          >
            <FontAwesome 
              name="th" 
              size={16} 
              color={viewMode === 'all' ? '#0a7ea4' : '#888'} 
            />
            <ThemedText style={[
              styles.toggleText, 
              viewMode === 'all' && styles.activeToggleText
            ]}>
              Все работы
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
      
      {viewMode === 'collections' ? (
        <ScrollView style={styles.collectionsList}>
          {MOCK_GALLERIES.map((gallery) => (
            <TouchableOpacity key={gallery.id} style={styles.collectionCard}>
              <View style={styles.collectionImageContainer}>
                {gallery.coverImage ? (
                  <View style={styles.collectionImage} />
                ) : (
                  <View style={styles.collectionImagePlaceholder} />
                )}
                <View style={styles.collectionInfo}>
                  <ThemedText style={styles.collectionTitle}>
                    {gallery?.title || 'Галерея'}
                  </ThemedText>
                  <ThemedText style={styles.collectionCount}>
                    {gallery?.artworkCount || 0} работ
                  </ThemedText>
                </View>
              </View>
              <ThemedText style={styles.collectionDescription} numberOfLines={2}>
                {gallery?.description || 'Нет описания'}
              </ThemedText>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={styles.createCollectionButton}>
            <FontAwesome name="plus" size={16} color="#0a7ea4" />
            <ThemedText style={styles.createCollectionText}>
              Создать новую коллекцию
            </ThemedText>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <GalleryGrid artworks={USER_ARTWORKS} compact={true} />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  viewToggle: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    flex: 1,
  },
  activeToggle: {
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
  },
  toggleText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#888',
  },
  activeToggleText: {
    color: '#0a7ea4',
    fontWeight: 'bold',
  },
  collectionsList: {
    flex: 1,
    padding: 16,
  },
  collectionCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    padding: 12,
  },
  collectionImageContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  collectionImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#ddd',
    marginRight: 12,
  },
  collectionInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  collectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  collectionCount: {
    fontSize: 12,
    color: '#888',
  },
  collectionDescription: {
    fontSize: 14,
    color: '#666',
  },
  createCollectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0a7ea4',
    borderStyle: 'dashed',
    marginTop: 8,
    marginBottom: 32,
  },
  createCollectionText: {
    marginLeft: 8,
    color: '#0a7ea4',
    fontWeight: 'bold',
  },
  collectionImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#ddd',
    marginRight: 12,
  },
}); 