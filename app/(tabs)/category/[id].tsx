import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ArtworkCard } from '@/app/components/common/ArtworkCard';
import { ContactArtistModal } from '@/app/components/common/ContactArtistModal';
import { Artwork, ArtCategory, User } from '@/app/models/types';

// Импортируем данные из моковых данных
import { MOCK_ARTWORKS } from '@/app/data/artworks';
import { MOCK_CATEGORIES } from '@/app/data/categories';

// Моковые данные для категорий
const CATEGORIES: ArtCategory[] = [
  {
    id: '1',
    name: 'Живопись',
    description: 'Работы, выполненные маслом, акрилом и другими традиционными материалами.',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5',
    artworkCount: 28
  },
  {
    id: '2',
    name: 'Графика',
    description: 'Рисунки карандашом, тушью, углем и другими графическими материалами.',
    imageUrl: 'https://images.unsplash.com/photo-1569091791842-7cfb64e04797',
    artworkCount: 25
  },
  {
    id: '3',
    name: 'Цифровое искусство',
    description: 'Работы, созданные с использованием цифровых технологий.',
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42',
    artworkCount: 33
  },
  {
    id: '4',
    name: 'Скульптура',
    description: 'Трехмерные произведения искусства, созданные путем лепки, резьбы или отливки.',
    imageUrl: 'https://images.unsplash.com/photo-1549887552-cb1071d3e5ca',
    artworkCount: 19
  }
];

export default function CategoryScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [category, setCategory] = useState<ArtCategory | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isContactModalVisible, setIsContactModalVisible] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<User | null>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  useEffect(() => {
    // Находим категорию по ID из параметров URL
    const foundCategory = CATEGORIES.find(cat => cat.id === id);
    if (foundCategory) {
      setCategory(foundCategory);
    }
    
    // Фильтруем работы по категории
    const categoryArtworks = MOCK_ARTWORKS.filter(
      artwork => artwork.categories.includes(foundCategory?.name || '')
    );
    setArtworks(categoryArtworks);
  }, [id]);

  // Если категория не найдена, используем первую категорию
  const currentCategory = category || MOCK_CATEGORIES[0];
  
  // Ограничиваем количество отображаемых работ, если не включен режим "Показать все"
  const displayedArtworks = showAll ? artworks : artworks.slice(0, 10);
  
  const handleBack = () => {
    router.back();
  };
  
  const toggleShowAll = () => {
    setLoading(true);
    
    // Имитация загрузки
    setTimeout(() => {
      setShowAll(!showAll);
      setLoading(false);
    }, 500);
  };

  const handleContactRequest = (artwork: Artwork) => {
    // Создаем объект художника из данных работы
    const artist: User = {
      id: artwork.artistId,
      username: artwork.artistName.toLowerCase().replace(/\s+/g, '_'),
      displayName: artwork.artistName,
      avatar: artwork.artistAvatar,
      bio: '',
      artStyles: [],
      followers: 0,
      following: 0,
      createdAt: '',
      socialLinks: {}
    };
    
    setSelectedArtist(artist);
    setSelectedArtwork(artwork);
    setIsContactModalVisible(true);
  };

  if (!category) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Загрузка категории...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Шапка с названием категории и кнопкой назад */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <FontAwesome name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <ThemedText style={styles.title}>{currentCategory.name}</ThemedText>
          <ThemedText style={styles.subtitle}>{artworks.length} работ</ThemedText>
        </View>
      </View>
      
      {/* Обложка категории */}
      <View style={styles.coverContainer}>
        <Image 
          source={{ uri: currentCategory?.imageUrl || 'https://via.placeholder.com/600x200' }} 
          style={styles.coverImage}
        />
        <View style={styles.overlay} />
        <ThemedText style={styles.coverTitle}>{currentCategory?.name || 'Категория'}</ThemedText>
        {currentCategory?.description && (
          <ThemedText style={styles.coverDescription}>{currentCategory.description}</ThemedText>
        )}
      </View>
      
      {/* Описание категории */}
      <ThemedView style={styles.descriptionContainer}>
        <ThemedText style={styles.description}>
          {currentCategory.longDescription || 
            `Исследуйте удивительные работы в категории "${currentCategory.name}". От признанных мастеров до восходящих талантов — здесь вы найдете разнообразные стили и техники.`
          }
        </ThemedText>
      </ThemedView>
      
      {/* Список работ */}
      <View style={styles.galleryContainer}>
        <ThemedText style={styles.galleryTitle}>
          Все работы в категории {currentCategory.name}
        </ThemedText>
        
        <FlatList
          data={displayedArtworks}
          renderItem={({ item }) => (
            <View style={styles.artworkContainer}>
              <ArtworkCard 
                artwork={item} 
                compact={false} 
                onContactRequest={handleContactRequest}
              />
            </View>
          )}
          keyExtractor={(item) => `category-${item.id}`}
          contentContainerStyle={styles.artworksContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>
                В этой категории пока нет работ
              </ThemedText>
            </View>
          }
        />
        
        {/* Кнопка "Посмотреть все" или "Свернуть" */}
        {artworks.length > 10 && (
          <TouchableOpacity 
            style={styles.showAllButton}
            onPress={toggleShowAll}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <ThemedText style={styles.showAllButtonText}>
                {showAll ? 'Свернуть' : 'Посмотреть все'}
              </ThemedText>
            )}
          </TouchableOpacity>
        )}
      </View>
      
      {selectedArtist && (
        <ContactArtistModal
          visible={isContactModalVisible}
          artist={selectedArtist}
          artwork={selectedArtwork}
          onClose={() => setIsContactModalVisible(false)}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    marginLeft: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  coverContainer: {
    height: 200,
    position: 'relative',
    justifyContent: 'flex-end',
    padding: 16,
  },
  coverImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  coverTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  coverDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  descriptionContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  galleryContainer: {
    flex: 1,
    padding: 16,
  },
  galleryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  artworksContainer: {
    paddingBottom: 80, // Добавляем отступ для кнопки "Показать все"
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  showAllButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  showAllButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  artworkContainer: {
    marginBottom: 20,
  },
}); 