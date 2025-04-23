import React, { useState } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CategoryList } from '@/app/components/common/CategoryList';
import { FeaturedArtists } from '@/app/components/common/FeaturedArtists';
import { TrendingArtworks } from '@/app/components/common/TrendingArtworks';
import { User, Artwork, ArtCategory } from '@/app/models/types';

// Моковые данные для демонстрации
const MOCK_CATEGORIES: ArtCategory[] = [
  {
    id: '1',
    name: 'Живопись',
    description: 'Традиционная живопись',
    imageUrl: 'https://images.unsplash.com/photo-1579965342575-16428a7c8881',
    artworkCount: 1250
  },
  {
    id: '2',
    name: 'Графика',
    description: 'Рисунки и графические работы',
    imageUrl: 'https://images.unsplash.com/photo-1452802447250-470a88ac82bc',
    artworkCount: 982
  },
  {
    id: '3',
    name: 'Цифровое искусство',
    description: 'Цифровые иллюстрации',
    imageUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d',
    artworkCount: 1563
  },
  {
    id: '4',
    name: 'Скульптура',
    description: 'Скульптурные произведения',
    imageUrl: 'https://images.unsplash.com/photo-1544413164-5f1b295eb435',
    artworkCount: 458
  }
];

const MOCK_ARTISTS: User[] = [
  {
    id: '1',
    username: 'artmaster',
    displayName: 'Михаил Лебедев',
    bio: 'Художник-иллюстратор из Санкт-Петербурга',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    artStyles: ['Акварель', 'Скетчинг'],
    skills: ['Портрет', 'Пейзаж'],
    location: 'Санкт-Петербург',
    isVerified: true,
    followers: 1250,
    following: 145,
    createdAt: '2023-01-15'
  },
  {
    id: '2',
    username: 'colorexpert',
    displayName: 'Анна Соколова',
    bio: 'Цифровой художник',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    artStyles: ['Диджитал Арт'],
    skills: ['Концепт-арт', 'Персонажный дизайн'],
    isVerified: true,
    followers: 3400,
    following: 210,
    createdAt: '2022-08-22'
  },
  {
    id: '3',
    username: 'sculptor',
    displayName: 'Алексей Иванов',
    bio: 'Скульптор, работаю с глиной и металлом',
    avatar: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3',
    artStyles: ['Скульптура'],
    skills: ['Керамика', 'Металл'],
    location: 'Москва',
    isVerified: false,
    followers: 890,
    following: 132,
    createdAt: '2021-11-05'
  },
  {
    id: '4',
    username: 'streetartist',
    displayName: 'Мария Волкова',
    bio: 'Уличный художник',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04',
    artStyles: ['Граффити', 'Стрит-арт'],
    skills: ['Мурал', 'Спрей-арт'],
    isVerified: false,
    followers: 1830,
    following: 75,
    createdAt: '2022-03-17'
  }
];

const MOCK_ARTWORKS: Artwork[] = [
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
    currency: 'RUB',
    createdAt: '2023-09-15'
  },
  {
    id: '2',
    title: 'Цифровой портрет',
    description: 'Портрет в неоновых тонах, созданный в Procreate.',
    images: ['https://images.unsplash.com/photo-1602085234609-f1a0f5b73e8c'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1602085234609-f1a0f5b73e8c',
    artistId: '2',
    artistName: 'Анна Соколова',
    artistAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    categories: ['Цифровое искусство'],
    tags: ['портрет', 'неон', 'цифровое'],
    medium: 'Цифровая иллюстрация',
    likes: 578,
    views: 3120,
    comments: 92,
    isForSale: false,
    createdAt: '2023-11-27'
  },
  {
    id: '3',
    title: 'Скульптура "Свобода"',
    description: 'Абстрактная скульптура из металла, символизирующая свободу.',
    images: ['https://images.unsplash.com/photo-1561839561-b13ccb8802a7'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1561839561-b13ccb8802a7',
    artistId: '3',
    artistName: 'Алексей Иванов',
    artistAvatar: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3',
    categories: ['Скульптура'],
    tags: ['металл', 'абстракция', 'свобода'],
    medium: 'Металл',
    dimensions: '120x45x30 см',
    likes: 142,
    views: 780,
    comments: 36,
    isForSale: true,
    price: 75000,
    currency: 'RUB',
    createdAt: '2023-08-05'
  }
];

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // В реальном приложении здесь был бы запрос к API
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>АртСеть</ThemedText>
        <ThemedText style={styles.headerSubtitle}>Социальная сеть для художников</ThemedText>
      </ThemedView>
      
      <CategoryList categories={MOCK_CATEGORIES} />
      <FeaturedArtists artists={MOCK_ARTISTS} />
      <TrendingArtworks artworks={MOCK_ARTWORKS} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 4,
  },
});
