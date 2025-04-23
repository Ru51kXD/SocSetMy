import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ArtworkCard } from '@/app/components/common/ArtworkCard';
import { CategoryList } from '@/app/components/common/CategoryList';
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
  }
];

type SearchTab = 'artworks' | 'artists' | 'tags';

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('artworks');
  
  const renderArtistItem = ({ item }: { item: User }) => (
    <TouchableOpacity style={styles.artistCard}>
      <Image source={{ uri: item.avatar }} style={styles.artistAvatar} />
      <View style={styles.artistInfo}>
        <View style={styles.artistNameRow}>
          <ThemedText style={styles.artistName}>{item.displayName}</ThemedText>
          {item.isVerified && (
            <FontAwesome name="check-circle" size={14} color="#1DA1F2" style={styles.verifiedIcon} />
          )}
        </View>
        <ThemedText style={styles.artistUsername}>@{item.username}</ThemedText>
        <ThemedText style={styles.artistBio} numberOfLines={1}>{item.bio}</ThemedText>
        <View style={styles.artistStats}>
          <ThemedText style={styles.artistFollowers}>{item.followers} подписчиков</ThemedText>
          {item.location && (
            <>
              <View style={styles.bulletPoint} />
              <ThemedText style={styles.artistLocation}>{item.location}</ThemedText>
            </>
          )}
        </View>
      </View>
      <TouchableOpacity style={styles.followButton}>
        <ThemedText style={styles.followButtonText}>Подписаться</ThemedText>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderTagItem = ({ item }: { item: string }) => (
    <TouchableOpacity style={styles.tagItem}>
      <FontAwesome name="hashtag" size={14} color="#0a7ea4" />
      <ThemedText style={styles.tagText}>{item}</ThemedText>
      <ThemedText style={styles.tagCount}>1,245 работ</ThemedText>
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (searchQuery.trim() === '') {
      return (
        <>
          <CategoryList categories={MOCK_CATEGORIES} />
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Популярные теги</ThemedText>
            <View style={styles.tagsContainer}>
              {['живопись', 'акварель', 'скетчинг', 'портрет', 'пейзаж', 'диджитал'].map((tag, index) => (
                <TouchableOpacity key={index} style={styles.tag}>
                  <ThemedText style={styles.tagLabel}>#{tag}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </ThemedView>
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Рекомендуемые работы</ThemedText>
            {MOCK_ARTWORKS.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} compact={false} />
            ))}
          </ThemedView>
        </>
      );
    }

    if (activeTab === 'artworks') {
      return (
        <FlatList
          data={MOCK_ARTWORKS}
          renderItem={({ item }) => <ArtworkCard artwork={item} compact={false} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.searchResults}
        />
      );
    }

    if (activeTab === 'artists') {
      return (
        <FlatList
          data={MOCK_ARTISTS}
          renderItem={renderArtistItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.searchResults}
        />
      );
    }

    if (activeTab === 'tags') {
      return (
        <FlatList
          data={['пейзаж', 'портрет', 'скетч', 'масло', 'акварель', 'диджитал']}
          renderItem={renderTagItem}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.searchResults}
        />
      );
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <View style={styles.searchContainer}>
          <FontAwesome name="search" size={16} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск художников, работ, тегов..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <FontAwesome name="times-circle" size={16} color="#888" />
            </TouchableOpacity>
          )}
        </View>
        
        {searchQuery.length > 0 && (
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'artworks' && styles.activeTab]}
              onPress={() => setActiveTab('artworks')}
            >
              <ThemedText style={[styles.tabText, activeTab === 'artworks' && styles.activeTabText]}>
                Работы
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'artists' && styles.activeTab]}
              onPress={() => setActiveTab('artists')}
            >
              <ThemedText style={[styles.tabText, activeTab === 'artists' && styles.activeTabText]}>
                Художники
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'tags' && styles.activeTab]}
              onPress={() => setActiveTab('tags')}
            >
              <ThemedText style={[styles.tabText, activeTab === 'tags' && styles.activeTabText]}>
                Теги
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </ThemedView>
      
      {renderContent()}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#0a7ea4',
  },
  tabText: {
    color: '#888',
  },
  activeTabText: {
    color: '#0a7ea4',
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagLabel: {
    color: '#0a7ea4',
    fontSize: 14,
  },
  searchResults: {
    padding: 16,
  },
  artistCard: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  artistAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  artistInfo: {
    flex: 1,
    marginLeft: 12,
  },
  artistNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  artistName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  artistUsername: {
    color: '#888',
    fontSize: 14,
    marginBottom: 4,
  },
  artistBio: {
    fontSize: 14,
    marginBottom: 4,
  },
  artistStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  artistFollowers: {
    fontSize: 12,
    color: '#666',
  },
  bulletPoint: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#888',
    marginHorizontal: 6,
  },
  artistLocation: {
    fontSize: 12,
    color: '#666',
  },
  followButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginLeft: 8,
  },
  followButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tagText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0a7ea4',
    marginLeft: 8,
  },
  tagCount: {
    fontSize: 14,
    color: '#888',
    marginLeft: 'auto',
  },
});
