import React, { useState, useCallback } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ArtworkCard } from '@/app/components/common/ArtworkCard';
import { CategoryList } from '@/app/components/common/CategoryList';
import { User, Artwork, ArtCategory } from '@/app/models/types';
import { useRouter } from 'expo-router';

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
    username: 'marina_art',
    displayName: 'Марина Иванова',
    bio: 'Цифровой художник, специализирующийся на фэнтези',
    avatar: 'https://i.pravatar.cc/150?img=36',
    artStyles: ['Акварель', 'Иллюстрация'],
    skills: ['Иллюстрация', 'Концепт-арт'],
    location: 'Москва',
    socialLinks: {},
    isVerified: true,
    followers: 12500,
    following: 230,
    createdAt: '2022-03-15'
  },
  {
    id: '2',
    username: 'alex_create',
    displayName: 'Алексей Петров',
    bio: 'Скульптор и художник',
    avatar: 'https://i.pravatar.cc/150?img=12',
    artStyles: ['Скульптура', 'Живопись'],
    skills: ['Скульптура', 'Живопись маслом'],
    location: 'Санкт-Петербург',
    socialLinks: {},
    isVerified: true,
    followers: 8300,
    following: 145,
    createdAt: '2022-06-22'
  },
  {
    id: '3',
    username: 'elena_draws',
    displayName: 'Елена Смирнова',
    bio: 'Создаю иллюстрации и концепт-арт',
    avatar: 'https://i.pravatar.cc/150?img=25',
    artStyles: ['Концепт-арт', 'Диджитал'],
    skills: ['Цифровая иллюстрация', 'Скетчи'],
    location: 'Казань',
    socialLinks: {},
    isVerified: false,
    followers: 5100,
    following: 92,
    createdAt: '2023-01-10'
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

// Моковые популярные теги
const POPULAR_TAGS = ['живопись', 'акварель', 'скетчинг', 'портрет', 'пейзаж', 'диджитал'];

type SearchTab = 'artworks' | 'artists' | 'tags';

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('artworks');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  // Имитация поиска с загрузкой
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length > 0) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 800); // Имитация задержки сети
    }
  }, []);
  
  const renderArtistItem = ({ item }: { item: User }) => (
    <TouchableOpacity 
      style={styles.artistCard}
      onPress={() => router.push(`/profile/${item.id}`)}
    >
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
      <TouchableOpacity 
        style={styles.followButton}
        onPress={(e) => {
          e.stopPropagation(); // Предотвращаем распространение события нажатия
        }}
      >
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

  const renderPopularTagItem = ({ item }: { item: string }) => (
    <TouchableOpacity style={styles.tag}>
      <ThemedText style={styles.tagLabel}>#{item}</ThemedText>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }: { item: ArtCategory }) => (
    <TouchableOpacity 
      style={styles.categoryItem}
      onPress={() => {/* Навигация на страницу категории */}}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.categoryImage} />
      <ThemedView style={styles.categoryInfo}>
        <ThemedText style={styles.categoryName}>{item.name}</ThemedText>
        <ThemedText style={styles.categoryCount}>{item.artworkCount} работ</ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );

  const renderEmptyContent = () => (
    <>
      <FlatList
        horizontal
        data={MOCK_CATEGORIES}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalListContent}
        style={styles.horizontalList}
      />
      
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Популярные теги</ThemedText>
        <FlatList
          data={POPULAR_TAGS}
          renderItem={renderPopularTagItem}
          keyExtractor={(item) => item}
          numColumns={3}
          contentContainerStyle={styles.tagsGridContent}
          scrollEnabled={false}
        />
      </ThemedView>
      
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Рекомендуемые работы</ThemedText>
        {MOCK_ARTWORKS.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} compact={false} />
        ))}
      </ThemedView>
    </>
  );

  const renderSearchResults = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0a7ea4" />
          <ThemedText style={styles.loadingText}>Поиск...</ThemedText>
        </View>
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
          data={POPULAR_TAGS}
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
            onChangeText={handleSearch}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
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
      
      {searchQuery.trim() === '' ? (
        <FlatList
          data={[]} // Пустой массив, так как мы используем только ListHeaderComponent
          renderItem={() => null}
          ListHeaderComponent={renderEmptyContent}
          contentContainerStyle={styles.contentContainer}
        />
      ) : (
        renderSearchResults()
      )}
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
  horizontalList: {
    marginTop: 16,
  },
  horizontalListContent: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    width: 150,
    height: 120,
    marginRight: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  categoryInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  categoryName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  categoryCount: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  tagsGridContent: {
    marginBottom: 10,
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
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
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
    borderWidth: 1,
    borderColor: '#eee',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
  },
});
