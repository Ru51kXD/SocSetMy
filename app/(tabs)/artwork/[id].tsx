import React, { useState } from 'react';
import { StyleSheet, View, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Artwork } from '@/app/models/types';

// Моковые данные работ
const MOCK_ARTWORKS: Artwork[] = [
  {
    id: '1',
    title: 'Закат в горах',
    description: 'Акварельная живопись вечернего заката в горах. Работа выполнена на бумаге высокого качества с использованием профессиональных акварельных красок.',
    images: ['https://picsum.photos/id/111/800/800'],
    thumbnailUrl: 'https://picsum.photos/id/111/800/800',
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
  {
    id: '2',
    title: 'Абстрактная композиция #5',
    description: 'Абстрактная композиция с использованием акриловых красок. Исследование баланса форм и цветов в современном искусстве.',
    images: ['https://picsum.photos/id/13/800/800'],
    thumbnailUrl: 'https://picsum.photos/id/13/800/800',
    artistId: '2',
    artistName: 'Алексей Петров',
    artistAvatar: 'https://i.pravatar.cc/150?img=12',
    categories: ['Живопись'],
    tags: ['абстракция', 'современное искусство'],
    medium: 'Акрил',
    dimensions: '60x80 см',
    createdYear: 2023,
    likes: 320,
    views: 980,
    comments: 15,
    isForSale: false,
    createdAt: '2023-06-21'
  },
  {
    id: '3',
    title: 'Портрет незнакомки',
    description: 'Портрет девушки, выполненный маслом на холсте. Работа в классическом стиле с современным подходом к цветовой гамме.',
    images: ['https://picsum.photos/id/24/800/800'],
    thumbnailUrl: 'https://picsum.photos/id/24/800/800',
    artistId: '3',
    artistName: 'Елена Смирнова',
    artistAvatar: 'https://i.pravatar.cc/150?img=25',
    categories: ['Живопись'],
    tags: ['портрет', 'масло', 'классика'],
    medium: 'Масло',
    dimensions: '50x70 см',
    createdYear: 2023,
    likes: 280,
    views: 650,
    comments: 32,
    isForSale: true,
    price: 25000,
    currency: 'RUB',
    createdAt: '2023-04-05'
  },
  {
    id: '4',
    title: 'Городской пейзаж на закате',
    description: 'Городской пейзаж, написанный маслом, изображающий город на закате. Работа выполнена в теплых тонах с использованием техники импасто для создания текстуры городских зданий.',
    images: ['https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a',
    artistId: '4',
    artistName: 'Михаил Лебедев',
    artistAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    categories: ['Живопись'],
    tags: ['пейзаж', 'город', 'масло'],
    medium: 'Масло',
    dimensions: '60x80 см',
    createdYear: 2023,
    likes: 245,
    views: 1203,
    comments: 48,
    isForSale: true,
    price: 12000,
    currency: 'RUB',
    createdAt: '2023-09-15'
  },
  {
    id: '5',
    title: 'Цифровой портрет',
    description: 'Портрет в неоновых тонах, созданный в Procreate. Эксперимент с цветовыми контрастами и световыми эффектами для передачи футуристического настроения.',
    images: ['https://images.unsplash.com/photo-1602085234609-f1a0f5b73e8c'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1602085234609-f1a0f5b73e8c',
    artistId: '5',
    artistName: 'Анна Соколова',
    artistAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    categories: ['Цифровое искусство'],
    tags: ['портрет', 'неон', 'цифровое'],
    medium: 'Цифровая иллюстрация',
    dimensions: '4000x5000 px',
    createdYear: 2023,
    likes: 578,
    views: 3120,
    comments: 92,
    isForSale: false,
    createdAt: '2023-11-27'
  },
  {
    id: '6',
    title: 'Скульптура "Движение"',
    description: 'Скульптура из металла, символизирующая движение времени и изменчивость бытия. Каждый изгиб металла отражает течение жизни и постоянное преобразование мира вокруг нас.',
    images: ['https://images.unsplash.com/photo-1549887552-cb1071d3e5ca'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1549887552-cb1071d3e5ca',
    artistId: '6',
    artistName: 'Алексей Иванов',
    artistAvatar: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3',
    categories: ['Скульптура'],
    tags: ['металл', 'абстракция', 'движение'],
    medium: 'Металл',
    dimensions: '45x30x20 см',
    createdYear: 2022,
    likes: 132,
    views: 745,
    comments: 23,
    isForSale: true,
    price: 75000,
    currency: 'RUB',
    createdAt: '2023-07-03'
  },
  {
    id: '8',
    title: 'Фантастический мир',
    description: 'Цифровая иллюстрация фантастического мира с летающими островами и необычными существами.',
    images: ['https://picsum.photos/id/63/800/800'],
    thumbnailUrl: 'https://picsum.photos/id/63/800/800',
    artistId: '1',
    artistName: 'Марина Иванова',
    artistAvatar: 'https://i.pravatar.cc/150?img=36',
    categories: ['Цифровое искусство'],
    tags: ['фэнтези', 'иллюстрация', 'цифровое'],
    medium: 'Цифровая иллюстрация',
    dimensions: '4000x2500 px',
    createdYear: 2023,
    likes: 520,
    views: 1800,
    comments: 43,
    isForSale: true,
    price: 20000,
    currency: 'RUB',
    createdAt: '2023-07-18'
  }
];

export default function ArtworkDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  
  // Находим работу по ID
  const artwork = MOCK_ARTWORKS.find(artwork => artwork.id === id) || MOCK_ARTWORKS[0];
  
  const handleGoBack = () => {
    router.back();
  };
  
  const handleArtistProfile = () => {
    router.push(`/profile/${artwork.artistId}`);
  };
  
  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
  };
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Изображение работы */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: artwork.images[0] }} 
          style={styles.image}
          resizeMode="cover"
        />
        
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <FontAwesome name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {/* Информация о работе */}
      <ThemedView style={styles.contentContainer}>
        <ThemedText style={styles.title}>{artwork.title}</ThemedText>
        
        {/* Художник */}
        <TouchableOpacity style={styles.artistRow} onPress={handleArtistProfile}>
          <Image source={{ uri: artwork.artistAvatar }} style={styles.artistAvatar} />
          <View>
            <ThemedText style={styles.artistName}>{artwork.artistName}</ThemedText>
            <ThemedText style={styles.artistLink}>Посмотреть профиль</ThemedText>
          </View>
        </TouchableOpacity>
        
        {/* Статистика работы */}
        <View style={styles.statsRow}>
          <TouchableOpacity style={styles.stat} onPress={handleLikeToggle}>
            <FontAwesome 
              name={isLiked ? "heart" : "heart-o"} 
              size={18} 
              color={isLiked ? "#FF4151" : "#666"} 
            />
            <ThemedText style={styles.statText}>
              {isLiked ? artwork.likes + 1 : artwork.likes}
            </ThemedText>
          </TouchableOpacity>
          <View style={styles.stat}>
            <FontAwesome name="eye" size={18} color="#666" />
            <ThemedText style={styles.statText}>{artwork.views}</ThemedText>
          </View>
          <View style={styles.stat}>
            <FontAwesome name="comment-o" size={18} color="#666" />
            <ThemedText style={styles.statText}>{artwork.comments}</ThemedText>
          </View>
        </View>
        
        {/* Описание работы */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Описание</ThemedText>
          <ThemedText style={styles.description}>{artwork.description}</ThemedText>
        </View>
        
        {/* Детали работы */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Детали</ThemedText>
          
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <ThemedText style={styles.detailLabel}>Техника</ThemedText>
              <ThemedText style={styles.detailValue}>{artwork.medium}</ThemedText>
            </View>
            
            {artwork.dimensions && (
              <View style={styles.detailItem}>
                <ThemedText style={styles.detailLabel}>Размер</ThemedText>
                <ThemedText style={styles.detailValue}>{artwork.dimensions}</ThemedText>
              </View>
            )}
            
            {artwork.createdYear && (
              <View style={styles.detailItem}>
                <ThemedText style={styles.detailLabel}>Год создания</ThemedText>
                <ThemedText style={styles.detailValue}>{artwork.createdYear}</ThemedText>
              </View>
            )}
            
            <View style={styles.detailItem}>
              <ThemedText style={styles.detailLabel}>Категория</ThemedText>
              <ThemedText style={styles.detailValue}>
                {artwork.categories.join(', ')}
              </ThemedText>
            </View>
          </View>
        </View>
        
        {/* Теги */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Теги</ThemedText>
          
          <View style={styles.tagsContainer}>
            {artwork.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <ThemedText style={styles.tagText}>#{tag}</ThemedText>
              </View>
            ))}
          </View>
        </View>
        
        {/* Информация о продаже */}
        {artwork.isForSale && (
          <View style={styles.saleContainer}>
            <View style={styles.priceRow}>
              <ThemedText style={styles.priceLabel}>Цена</ThemedText>
              <ThemedText style={styles.price}>
                {artwork.price?.toLocaleString()} {artwork.currency}
              </ThemedText>
            </View>
            
            <TouchableOpacity style={styles.buyButton}>
              <ThemedText style={styles.buyButtonText}>Связаться с художником</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </ThemedView>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    width: width,
    height: width,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  artistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  artistAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  artistName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  artistLink: {
    fontSize: 14,
    color: '#0a7ea4',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statText: {
    fontSize: 14,
    marginLeft: 6,
    color: '#666',
  },
  section: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    width: '50%',
    paddingVertical: 8,
    paddingRight: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#0a7ea4',
  },
  saleContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(10, 126, 164, 0.05)',
    borderRadius: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 16,
    color: '#666',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0a7ea4',
  },
  buyButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 