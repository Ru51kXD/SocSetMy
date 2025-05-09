import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ArtworkCard } from '@/app/components/common/ArtworkCard';
import { CategoryList } from '@/app/components/common/CategoryList';
import { User, Artwork, ArtCategory } from '@/app/models/types';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MOCK_CATEGORIES } from '@/app/data/categories';
import { useArtworks } from '@/app/context/ArtworkContext';
import { MOCK_ARTWORKS } from '@/app/data/artworks';

// Моковые данные для демонстрации
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

// Добавим дополнительные работы с тегом "акварель"
const WATERCOLOR_ARTWORKS: Artwork[] = [
  {
    id: 'watercolor-1',
    title: 'Акварельный пейзаж',
    description: 'Пейзаж, написанный акварелью на холсте высокого качества',
    images: ['https://images.pexels.com/photos/3308588/pexels-photo-3308588.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=1'],
    thumbnailUrl: 'https://images.pexels.com/photos/3308588/pexels-photo-3308588.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=1',
    artistId: '2',
    artistName: 'Алексей Петров',
    artistAvatar: 'https://i.pravatar.cc/150?img=12',
    categories: ['Живопись'],
    tags: ['акварель', 'пейзаж', 'природа'],
    medium: 'Акварель',
    likes: 325,
    views: 1520,
    comments: 42,
    isForSale: true,
    price: 18000,
    currency: 'RUB',
    createdAt: '2023-08-12'
  },
  {
    id: 'watercolor-2',
    title: 'Акварельный натюрморт с цветами',
    description: 'Натюрморт с весенними цветами, выполненный акварелью',
    images: ['https://images.pexels.com/photos/6331040/pexels-photo-6331040.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=1'],
    thumbnailUrl: 'https://images.pexels.com/photos/6331040/pexels-photo-6331040.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=1',
    artistId: '3',
    artistName: 'Елена Смирнова',
    artistAvatar: 'https://i.pravatar.cc/150?img=25',
    categories: ['Живопись'],
    tags: ['акварель', 'натюрморт', 'цветы'],
    medium: 'Акварель',
    likes: 290,
    views: 1350,
    comments: 38,
    isForSale: true,
    price: 15000,
    currency: 'RUB',
    createdAt: '2023-09-05'
  },
  {
    id: 'watercolor-3',
    title: 'Акварельный портрет',
    description: 'Портрет девушки, выполненный акварелью в мягком стиле',
    images: ['https://images.pexels.com/photos/1212487/pexels-photo-1212487.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=1'],
    thumbnailUrl: 'https://images.pexels.com/photos/1212487/pexels-photo-1212487.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=1',
    artistId: '1',
    artistName: 'Марина Иванова',
    artistAvatar: 'https://i.pravatar.cc/150?img=36',
    categories: ['Живопись', 'Портрет'],
    tags: ['акварель', 'портрет', 'лицо'],
    medium: 'Акварель',
    likes: 410,
    views: 1890,
    comments: 57,
    isForSale: true,
    price: 25000,
    currency: 'RUB',
    createdAt: '2023-07-19'
  }
];

// Объединим все доступные работы
const ALL_AVAILABLE_ARTWORKS = [...MOCK_ARTWORKS, ...WATERCOLOR_ARTWORKS];

// Моковые популярные теги
const POPULAR_TAGS = ['акварель', 'живопись', 'скетчинг', 'портрет', 'пейзаж', 'диджитал'];

type SearchTab = 'artworks' | 'artists' | 'tags';

export default function ExploreScreen() {
  const { tag } = useLocalSearchParams(); // Получаем тег из параметров URL
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('artworks');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<{ artworks: Artwork[], artists: User[], tags: string[] }>({
    artworks: [],
    artists: [],
    tags: []
  });
  const router = useRouter();
  const { searchArtworks, searchByTag, allArtworks } = useArtworks(); // Используем функцию поиска из контекста
  
  // Применяем параметр тега при загрузке компонента
  useEffect(() => {
    if (tag && typeof tag === 'string') {
      handleSearch(tag);
      setActiveTab('artworks'); // Устанавливаем активную вкладку "Работы"
    }
  }, [tag]);
  
  // Модифицированная функция поиска, которая использует объединенные данные
  const customSearchArtworks = (query: string): Artwork[] => {
    if (!query.trim()) return ALL_AVAILABLE_ARTWORKS;
    
    const lowerQuery = query.toLowerCase();
    // Проверяем, является ли запрос тегом (без #)
    const isTagSearch = POPULAR_TAGS.some(tag => tag.toLowerCase() === lowerQuery);
    
    // Если это поиск по тегу, приоритезируем поиск по тегам
    if (isTagSearch) {
      console.log(`Поиск по тегу: ${lowerQuery}`);
      
      // Сначала ищем в контексте через функцию searchByTag
      let results = searchByTag(lowerQuery);
      
      // Если результатов мало, добавляем из моковых данных
      if (results.length < 3) {
        const mockResults = ALL_AVAILABLE_ARTWORKS.filter(artwork => 
          artwork.tags.some(tag => tag.toLowerCase() === lowerQuery)
        );
        
        // Объединяем результаты, удаляя дубликаты по ID
        const combinedResults = [...results];
        mockResults.forEach(mockArtwork => {
          if (!combinedResults.some(art => art.id === mockArtwork.id)) {
            combinedResults.push(mockArtwork);
          }
        });
        
        results = combinedResults;
      }
      
      return results;
    }
    
    // Для обычного поиска используем стандартную функцию
    let results = searchArtworks(query);
    
    // Если результатов нет или их мало, добавляем результаты из моковых данных
    if (results.length < 5) {
      const mockResults = ALL_AVAILABLE_ARTWORKS.filter(artwork => 
        artwork.title.toLowerCase().includes(lowerQuery) ||
        artwork.description.toLowerCase().includes(lowerQuery) ||
        artwork.artistName.toLowerCase().includes(lowerQuery) ||
        artwork.medium?.toLowerCase().includes(lowerQuery) ||
        artwork.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        artwork.categories.some(category => category.toLowerCase().includes(lowerQuery))
      );
      
      // Объединяем результаты, удаляя дубликаты по ID
      const combinedResults = [...results];
      mockResults.forEach(mockArtwork => {
        if (!combinedResults.some(art => art.id === mockArtwork.id)) {
          combinedResults.push(mockArtwork);
        }
      });
      
      results = combinedResults;
    }
    
    return results;
  };
  
  // Функция поиска пользователей, учитывающая теги в artStyles и skills
  const searchArtistsByTag = (query: string): User[] => {
    if (!query.trim()) return MOCK_ARTISTS;
    
    const lowerQuery = query.toLowerCase();
    return MOCK_ARTISTS.filter(artist => 
      artist.displayName.toLowerCase().includes(lowerQuery) ||
      artist.username.toLowerCase().includes(lowerQuery) ||
      artist.bio.toLowerCase().includes(lowerQuery) ||
      artist.artStyles.some(style => style.toLowerCase().includes(lowerQuery)) ||
      (artist.skills && artist.skills.some(skill => skill.toLowerCase().includes(lowerQuery)))
    );
  };
  
  // Имитация поиска с загрузкой
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length > 0) {
      setIsLoading(true);
      
      // Используем модифицированную функцию поиска работ
      const artworksResults = customSearchArtworks(query);
      
      // Используем модифицированную функцию поиска художников с учетом тегов
      const artistsResults = searchArtistsByTag(query);
      
      // Фильтруем теги по запросу (имитация) и добавляем приоритетные теги
      let tagsResults = POPULAR_TAGS.filter(tag => 
        tag.toLowerCase().includes(query.toLowerCase())
      );
      
      // Если запрос включает "аква", добавляем "акварель" в результаты тегов
      if (query.toLowerCase().includes('аква') && !tagsResults.includes('акварель')) {
        tagsResults = ['акварель', ...tagsResults];
      }
      
      // Добавляем теги из найденных работ
      const tagsFromArtworks = new Set<string>();
      artworksResults.forEach(artwork => {
        artwork.tags.forEach(tag => {
          if (tag.toLowerCase().includes(query.toLowerCase())) {
            tagsFromArtworks.add(tag);
          }
        });
      });
      
      // Добавляем теги из найденных художников (artStyles и skills)
      const tagsFromArtists = new Set<string>();
      artistsResults.forEach(artist => {
        artist.artStyles.forEach(style => {
          if (style.toLowerCase().includes(query.toLowerCase())) {
            tagsFromArtists.add(style);
          }
        });
        if (artist.skills) {
          artist.skills.forEach(skill => {
            if (skill.toLowerCase().includes(query.toLowerCase())) {
              tagsFromArtists.add(skill);
            }
          });
        }
      });
      
      // Объединяем все теги
      tagsResults = [...new Set([...tagsResults, ...tagsFromArtworks, ...tagsFromArtists])];
      
      setTimeout(() => {
        // Устанавливаем активную вкладку в зависимости от результатов поиска
        if (artworksResults.length > 0) {
          setActiveTab('artworks');
        } else if (artistsResults.length > 0) {
          setActiveTab('artists');
        } else if (tagsResults.length > 0) {
          setActiveTab('tags');
        }
        
        setSearchResults({
          artworks: artworksResults,
          artists: artistsResults,
          tags: tagsResults
        });
        setIsLoading(false);
      }, 500); // Небольшая имитация задержки сети
    } else {
      setSearchResults({ artworks: [], artists: [], tags: [] });
    }
  }, [searchArtworks, searchByTag, allArtworks]);
  
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
        
        {/* Показываем теги художника */}
        {item.artStyles && item.artStyles.length > 0 && (
          <View style={styles.artistTagsContainer}>
            {item.artStyles.slice(0, 2).map((style, index) => (
              <TouchableOpacity 
                key={`${item.id}-style-${index}`}
                style={styles.artistTag}
                onPress={(e) => {
                  e.stopPropagation();
                  handleSearch(style);
                }}
              >
                <ThemedText style={styles.artistTagText}>{style}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
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

  const renderTagItem = ({ item }: { item: string }) => {
    // Считаем количество художников с таким тегом (в artStyles или skills)
    const artistsCount = MOCK_ARTISTS.filter(artist => 
      artist.artStyles.some(style => style.toLowerCase() === item.toLowerCase()) ||
      (artist.skills && artist.skills.some(skill => skill.toLowerCase() === item.toLowerCase()))
    ).length;
    
    // Считаем количество работ с таким тегом
    const artworksCount = ALL_AVAILABLE_ARTWORKS.filter(art => 
      art.tags.some(tag => tag.toLowerCase() === item.toLowerCase())
    ).length;
    
    return (
      <TouchableOpacity 
        style={styles.tagItem}
        onPress={() => {
          // При нажатии на тег выполняем поиск по нему и переключаемся на вкладку "Работы"
          handleSearch(item);
          // Определяем, на какую вкладку переключиться в зависимости от наличия результатов
          if (artworksCount > 0) {
            setActiveTab('artworks');
          } else if (artistsCount > 0) {
            setActiveTab('artists');
          }
        }} 
      >
        <FontAwesome name="hashtag" size={14} color="#0a7ea4" />
        <ThemedText style={styles.tagText}>{item}</ThemedText>
        <View style={styles.tagCounts}>
          {artworksCount > 0 && (
            <ThemedText style={styles.tagCount}>{artworksCount} работ</ThemedText>
          )}
          {artistsCount > 0 && (
            <ThemedText style={styles.tagArtistCount}>{artistsCount} художников</ThemedText>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderPopularTagItem = ({ item }: { item: string }) => (
    <TouchableOpacity 
      style={styles.tag}
      onPress={() => {
        // При нажатии на популярный тег выполняем поиск по нему и переключаемся на вкладку "Работы"
        handleSearch(item);
        setActiveTab('artworks');
      }}
    >
      <FontAwesome name="hashtag" size={14} color="#0a7ea4" style={styles.tagIcon} />
      <ThemedText style={styles.tagLabel}>#{item}</ThemedText>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }: { item: ArtCategory }) => (
    <TouchableOpacity 
      style={styles.categoryItem}
      onPress={() => router.push(`/category/${item.id}`)}
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
        keyExtractor={(item) => `explore-category-${item.id}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
      />
      
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Популярные теги</ThemedText>
        <FlatList
          data={POPULAR_TAGS}
          renderItem={renderPopularTagItem}
          keyExtractor={(item) => `explore-tag-${item}`}
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
          data={searchResults.artworks}
          renderItem={({ item }) => <ArtworkCard artwork={item} compact={false} />}
          keyExtractor={(item) => `explore-painting-${item.id}`}
          contentContainerStyle={styles.searchResults}
          ListEmptyComponent={
            <View style={styles.emptyResults}>
              <FontAwesome name="search" size={48} color="#ddd" />
              <ThemedText style={styles.emptyResultsText}>Нет результатов для "{searchQuery}"</ThemedText>
              <TouchableOpacity 
                style={styles.suggestButton}
                onPress={() => {
                  if (searchResults.tags.length > 0) {
                    // Если есть теги, переключаемся на вкладку тегов
                    setActiveTab('tags');
                  } else if (searchResults.artists.length > 0) {
                    // Если есть художники, переключаемся на вкладку художников
                    setActiveTab('artists');
                  }
                }}
              >
                <ThemedText style={styles.suggestButtonText}>
                  {searchResults.tags.length > 0 
                    ? "Посмотреть похожие теги" 
                    : searchResults.artists.length > 0 
                      ? "Посмотреть художников" 
                      : ""}
                </ThemedText>
              </TouchableOpacity>
            </View>
          }
        />
      );
    }

    if (activeTab === 'artists') {
      return (
        <FlatList
          data={searchResults.artists}
          renderItem={renderArtistItem}
          keyExtractor={(item) => `explore-artist-${item.id}`}
          contentContainerStyle={styles.searchResults}
          ListEmptyComponent={
            <View style={styles.emptyResults}>
              <FontAwesome name="user" size={48} color="#ddd" />
              <ThemedText style={styles.emptyResultsText}>Нет художников для "{searchQuery}"</ThemedText>
            </View>
          }
        />
      );
    }

    if (activeTab === 'tags') {
      return (
        <FlatList
          data={searchResults.tags}
          renderItem={renderTagItem}
          keyExtractor={(item) => `explore-tag-${item}`}
          contentContainerStyle={styles.searchResults}
          ListEmptyComponent={
            <View style={styles.emptyResults}>
              <FontAwesome name="hashtag" size={48} color="#ddd" />
              <ThemedText style={styles.emptyResultsText}>Нет тегов для "{searchQuery}"</ThemedText>
            </View>
          }
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
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(10, 126, 164, 0.2)',
  },
  tagIcon: {
    marginRight: 4,
  },
  tagLabel: {
    color: '#0a7ea4',
    fontSize: 14,
    fontWeight: '500',
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
    borderRadius: 8,
    backgroundColor: 'rgba(10, 126, 164, 0.05)',
    marginBottom: 4,
  },
  tagText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0a7ea4',
    marginLeft: 8,
    flex: 1,
  },
  tagCount: {
    fontSize: 12,
    color: '#888',
    backgroundColor: 'rgba(10, 126, 164, 0.1)', 
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 4,
  },
  tagCounts: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  tagArtistCount: {
    fontSize: 12,
    color: '#888',
    backgroundColor: 'rgba(221, 160, 221, 0.2)', 
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
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
  categoriesList: {
    paddingHorizontal: 16,
  },
  tagsList: {
    paddingHorizontal: 16,
  },
  artworksList: {
    paddingHorizontal: 16,
  },
  emptyResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyResultsText: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  suggestButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginTop: 10,
  },
  suggestButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  artistTagsContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  artistTag: {
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 4,
  },
  artistTagText: {
    color: '#0a7ea4',
    fontSize: 12,
  },
});
