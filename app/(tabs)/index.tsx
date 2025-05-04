import React, { useState, useCallback } from 'react';
import { StyleSheet, FlatList, View, RefreshControl, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ArtworkCard } from '@/app/components/common/ArtworkCard';
import { CategoryList } from '@/app/components/common/CategoryList';
import { FeaturedArtists } from '@/app/components/common/FeaturedArtists';
import { WeeklyTopArtworks } from '@/app/components/common/WeeklyTopArtworks';
import { User, Artwork } from '@/app/models/types';
import { MOCK_CATEGORIES } from '@/app/data/categories';
import { MOCK_ARTWORKS } from '@/app/data/artworks';

// Моковые данные для демонстрации
const MOCK_FEATURED_ARTISTS: User[] = [
  {
    id: '1',
    username: 'marina_art',
    displayName: 'Марина Иванова',
    avatar: 'https://i.pravatar.cc/150?img=36',
    isVerified: true,
    followers: 12500,
    bio: 'Цифровой художник, специализирующийся на фэнтези',
    artStyles: ['Акварель', 'Иллюстрация'],
    skills: ['Иллюстрация', 'Концепт-арт'],
    location: 'Москва',
    socialLinks: {},
    following: 230,
    createdAt: '2022-03-15'
  },
  {
    id: '2',
    username: 'alex_create',
    displayName: 'Алексей Петров',
    avatar: 'https://i.pravatar.cc/150?img=12',
    isVerified: true,
    followers: 8300,
    bio: 'Скульптор и художник',
    artStyles: ['Скульптура', 'Живопись'],
    skills: ['Скульптура', 'Живопись маслом'],
    location: 'Санкт-Петербург',
    socialLinks: {},
    following: 145,
    createdAt: '2022-06-22'
  },
  {
    id: '3',
    username: 'elena_draws',
    displayName: 'Елена Смирнова',
    avatar: 'https://i.pravatar.cc/150?img=25',
    isVerified: false,
    followers: 5100,
    bio: 'Создаю иллюстрации и концепт-арт',
    artStyles: ['Концепт-арт', 'Диджитал'],
    skills: ['Цифровая иллюстрация', 'Скетчи'],
    location: 'Казань',
    socialLinks: {},
    following: 92,
    createdAt: '2023-01-10'
  },
];

// Используем фиксированные данные из импортированного MOCK_ARTWORKS
const MOCK_TRENDING_ARTWORKS: Artwork[] = [
  // Находим работу "Закат в горах" Марины Ивановой из MOCK_ARTWORKS
  MOCK_ARTWORKS.find(artwork => artwork.id === '1') || {
    id: '1',
    title: 'Закат в горах',
    description: 'Акварельная живопись вечернего заката в горах. Работа выполнена на бумаге высокого качества с использованием профессиональных акварельных красок.',
    images: ['https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&h=800&fit=crop'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&h=800&fit=crop',
    artistId: '1',
    artistName: 'Марина Иванова',
    artistAvatar: 'https://i.pravatar.cc/150?img=36',
    categories: ['Живопись'],
    tags: ['пейзаж', 'закат', 'горы'],
    medium: 'Акварель',
    dimensions: '40x30 см',
    createdYear: 2023,
    likes: 450,
    views: 1230,
    comments: 28,
    isForSale: true,
    price: 15000,
    currency: 'RUB',
    createdAt: '2023-05-12'
  },
  // Находим работу Алексея Петрова
  MOCK_ARTWORKS.find(artwork => artwork.artistId === '2') || {
    id: '2',
    title: 'Абстрактная композиция #5',
    description: 'Абстрактная композиция с использованием акриловых красок',
    images: ['https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&h=800&fit=crop'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&h=800&fit=crop',
    artistId: '2',
    artistName: 'Алексей Петров',
    artistAvatar: 'https://i.pravatar.cc/150?img=12',
    categories: ['Живопись'],
    tags: ['абстракция', 'современное искусство'],
    medium: 'Акрил',
    likes: 320,
    views: 980,
    comments: 15,
    isForSale: false,
    createdAt: '2023-06-21'
  },
  // Находим работу Елены Смирновой
  MOCK_ARTWORKS.find(artwork => artwork.artistId === '3') || {
    id: '3',
    title: 'Портрет незнакомки',
    description: 'Портрет девушки, выполненный маслом на холсте',
    images: ['https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=800&h=800&fit=crop'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=800&h=800&fit=crop',
    artistId: '3',
    artistName: 'Елена Смирнова',
    artistAvatar: 'https://i.pravatar.cc/150?img=25',
    categories: ['Живопись'],
    tags: ['портрет', 'масло', 'классика'],
    medium: 'Масло',
    likes: 280,
    views: 650,
    comments: 32,
    isForSale: true,
    price: 25000,
    currency: 'RUB',
    createdAt: '2023-04-05'
  },
];

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Имитация загрузки данных
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0a7ea4']}
            tintColor={'#0a7ea4'}
          />
        }
      >
        <View style={styles.header}>
          <ThemedText style={styles.greeting}>Добро пожаловать в</ThemedText>
          <ThemedText style={styles.title}>Арт Сообщество</ThemedText>
          <ThemedText style={styles.subtitle}>
            Место, где художники делятся своими работами и идеями
          </ThemedText>
        </View>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Категории</ThemedText>
        </ThemedView>
        
        <CategoryList categories={MOCK_CATEGORIES} horizontal={true} />
        
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Популярные художники</ThemedText>
        </ThemedView>
        
        <FeaturedArtists artists={MOCK_FEATURED_ARTISTS} />
        
        {/* Используем новый компонент для отображения лучших работ недели */}
        <WeeklyTopArtworks artworks={MOCK_TRENDING_ARTWORKS} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  header: {
    padding: 16,
    paddingTop: 24,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    lineHeight: 22,
  },
  section: {
    padding: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
