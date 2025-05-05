import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Artwork, User } from '@/app/models/types';
import { MOCK_ARTWORKS } from '@/app/data/artworks';
import { ContactArtistModal } from '@/app/components/common/ContactArtistModal';
import { useMessages } from '@/app/context/MessageContext';
import { useUserPreferences } from '@/app/context/UserPreferencesContext';
import { CommentsSection } from '@/app/components/common/CommentsSection';
import { useArtworks } from '@/app/context/ArtworkContext';

const { width } = Dimensions.get('window');

export default function ArtworkDetailScreen() {
  const { id } = useLocalSearchParams();
  const artworkId = typeof id === 'string' ? id : '';
  const router = useRouter();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [isContactModalVisible, setIsContactModalVisible] = useState(false);
  const [artist, setArtist] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const { setActiveChat, hasThreadWithArtist, shareArtwork, addMessage } = useMessages();
  const { 
    isArtworkLiked, 
    isArtworkSaved, 
    likeArtwork, 
    unlikeArtwork, 
    saveArtwork, 
    unsaveArtwork 
  } = useUserPreferences();
  const { allArtworks } = useArtworks();
  
  // Состояние лайка и сохранения
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Функция для обработки ошибок загрузки изображений
  const handleImageError = () => {
    console.log(`Ошибка загрузки изображения для работы ${artworkId}`);
    setImageError(true);
    setIsImageLoading(false);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  // Функция для получения запасного изображения
  const getBackupImageUrl = () => {
    if (!artwork) return '';
    const safeTitle = artwork.title ? encodeURIComponent(artwork.title) : 'artwork';
    // Генерируем цвет на основе ID работы
    const colors = ['1a73e8', 'ff4151', '0a7ea4', '388e3c', '7b1fa2', 'fb8c00'];
    const numId = parseInt(artwork.id.replace(/\D/g, '') || '1');
    const color = colors[numId % colors.length];
    return `https://via.placeholder.com/800x800/${color}/ffffff?text=${safeTitle}`;
  };

  useEffect(() => {
    setIsLoading(true);
    setImageError(false);
    setIsImageLoading(true);
    
    try {
      // Сначала ищем в пользовательских работах (из контекста)
      let foundArtwork = allArtworks.find(item => item.id === artworkId);
      
      // Если не найдено в пользовательских, ищем в моковых данных
      if (!foundArtwork) {
        foundArtwork = MOCK_ARTWORKS.find(item => item.id === artworkId);
      }
      
      if (foundArtwork) {
        console.log(`Найдена работа: ${foundArtwork.title}`);
        setArtwork(foundArtwork);
        
        // Создаем объект художника из данных работы
        setArtist({
          id: foundArtwork.artistId,
          username: foundArtwork.artistName.toLowerCase().replace(/\s+/g, '_'),
          displayName: foundArtwork.artistName,
          avatar: foundArtwork.artistAvatar,
          bio: '',
          artStyles: [],
          followers: 0,
          following: 0,
          createdAt: '',
          socialLinks: {}
        });
        
        // Проверяем статус лайка и сохранения
        if (foundArtwork.id) {
          setIsLiked(isArtworkLiked(foundArtwork.id));
          setIsSaved(isArtworkSaved(foundArtwork.id));
        }
      } else {
        console.error(`Работа с ID ${artworkId} не найдена`);
        Alert.alert('Ошибка', 'Не удалось найти работу', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    } catch (error) {
      console.error('Ошибка при загрузке работы:', error);
    } finally {
      setIsLoading(false);
    }
  }, [artworkId, isArtworkLiked, isArtworkSaved, allArtworks]);

  const handleArtistPress = () => {
    if (artwork) {
      router.push(`/profile/${artwork.artistId}`);
    }
  };

  const handleLikeToggle = async () => {
    if (!artwork) return;
    
    try {
      if (isLiked) {
        await unlikeArtwork(artwork.id);
        setIsLiked(false);
      } else {
        await likeArtwork(artwork);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Ошибка при обработке лайка:', error);
    }
  };

  const handleSaveToggle = async () => {
    if (!artwork) return;
    
    try {
      if (isSaved) {
        await unsaveArtwork(artwork.id);
        setIsSaved(false);
      } else {
        await saveArtwork(artwork);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Ошибка при сохранении в избранное:', error);
    }
  };

  const handleContactArtist = () => {
    if (artist) {
      console.log('Нажата кнопка связаться с продавцом, ID художника:', artist.id);
      
      try {
        // Преобразуем ID художника в строку для правильного сравнения
        const artistIdStr = String(artist.id);
        console.log('ID художника (строка):', artistIdStr);
        
        // Для Марины Ивановой (ID=1) используем максимально упрощенную логику
        if (artistIdStr === '1') {
          console.log('Особая обработка для Марины Ивановой (ID=1)');
          
          // Отправляем простое сообщение без проверок и сложной логики
          addMessage('1', {
            content: `Здравствуйте, Марина! Меня заинтересовала ваша работа "${artwork?.title}"`,
            subject: 'Вопрос о работе'
          });
          
          console.log('Сообщение отправлено, устанавливаем активный чат: 1');
          
          // Устанавливаем активный чат
          if (setActiveChat) setActiveChat('1');
          
          // Используем значительную задержку
          console.log('Ожидаем перед переходом к экрану сообщений...');
          setTimeout(() => {
            console.log('Переходим к экрану сообщений');
            router.push('/(tabs)/messages');
          }, 1000);
          
          return;
        }
        
        // Для других художников - стандартная логика
        // Проверяем существование чата без опционального вызова
        const hasThread = hasThreadWithArtist ? hasThreadWithArtist(artistIdStr) : false;
        console.log('Существующий чат:', hasThread);
        
        if (hasThread) {
          // Если чат существует, просто активируем его
          console.log('Активируем существующий чат с ID:', artistIdStr);
          if (setActiveChat) setActiveChat(artistIdStr);
          
          // Небольшая задержка перед переходом для уверенности, что активный чат установлен
          setTimeout(() => {
            router.push('/(tabs)/messages');
          }, 200);
        } else {
          // Если чата нет, создаем новый
          console.log('Создаем новый чат с ID:', artistIdStr);
          if (shareArtwork && artwork) {
            shareArtwork(artistIdStr, artwork);
            console.log('Отправляем работу в чат:', artwork.id);
          } else {
            console.error('Функция shareArtwork не доступна или artwork не определен');
          }
          
          // Устанавливаем активный чат
          if (setActiveChat) setActiveChat(artistIdStr);
          
          // Задержка перед переходом чтобы данные успели обновиться
          setTimeout(() => {
            router.push('/(tabs)/messages');
          }, 500);
        }
      } catch (error) {
        console.error('Ошибка при создании чата:', error);
        // Запасной вариант - просто перейти к сообщениям
        router.push('/(tabs)/messages');
      }
    } else {
      console.error('Художник не определен');
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0a7ea4" />
        <ThemedText style={styles.loadingText}>Загрузка работы...</ThemedText>
      </ThemedView>
    );
  }

  if (!artwork) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Работа не найдена</ThemedText>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ThemedText style={styles.backButtonText}>Вернуться назад</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.mainContent}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
          <View style={styles.imageContainer}>
            {isImageLoading && (
              <View style={styles.imagePlaceholder}>
                <ActivityIndicator size="large" color="#0a7ea4" />
              </View>
            )}
            <Image 
              source={{ uri: imageError ? getBackupImageUrl() : artwork.images[0] }}
              style={styles.image}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </View>

          <View style={styles.contentContainer}>
            <ThemedText style={styles.title}>{artwork.title}</ThemedText>
            
            <TouchableOpacity style={styles.artistRow} onPress={handleArtistPress}>
              <Image source={{ uri: artwork.artistAvatar }} style={styles.avatar} />
              <ThemedText style={styles.artistName}>{artwork.artistName}</ThemedText>
            </TouchableOpacity>
            
            <View style={styles.statsRow}>
              <TouchableOpacity style={styles.stat} onPress={handleLikeToggle}>
                <FontAwesome 
                  name={isLiked ? "heart" : "heart-o"} 
                  size={18} 
                  color={isLiked ? "#FF4151" : "#666"} 
                />
                <ThemedText style={styles.statText}>{artwork.likes + (isLiked ? 1 : 0)}</ThemedText>
              </TouchableOpacity>
              <View style={styles.stat}>
                <FontAwesome name="eye" size={18} color="#666" />
                <ThemedText style={styles.statText}>{artwork.views}</ThemedText>
              </View>
              <View style={styles.stat}>
                <FontAwesome name="comment-o" size={18} color="#666" />
                <ThemedText style={styles.statText}>{artwork.comments}</ThemedText>
              </View>
              <TouchableOpacity style={styles.stat} onPress={handleSaveToggle}>
                <FontAwesome 
                  name={isSaved ? "bookmark" : "bookmark-o"} 
                  size={18} 
                  color={isSaved ? "#0a7ea4" : "#666"} 
                />
                <ThemedText style={styles.statText}>Сохранить</ThemedText>
              </TouchableOpacity>
            </View>
            
            <ThemedText style={styles.description}>{artwork.description}</ThemedText>
            
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Категория:</ThemedText>
                <ThemedText style={styles.detailValue}>{artwork.categories.join(', ')}</ThemedText>
              </View>
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Техника:</ThemedText>
                <ThemedText style={styles.detailValue}>{artwork.medium}</ThemedText>
              </View>
              {artwork.dimensions && (
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>Размеры:</ThemedText>
                  <ThemedText style={styles.detailValue}>{artwork.dimensions}</ThemedText>
                </View>
              )}
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Дата создания:</ThemedText>
                <ThemedText style={styles.detailValue}>{artwork.createdAt}</ThemedText>
              </View>
            </View>
            
            {artwork.tags && artwork.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {artwork.tags.map((tag, index) => (
                  <View key={`tag-${index}`} style={styles.tag}>
                    <ThemedText style={styles.tagText}>#{tag}</ThemedText>
                  </View>
                ))}
              </View>
            )}
          </View>
          
          <CommentsSection artworkId={artwork.id} />
        </ScrollView>
      </View>
      
      {artwork.isForSale && (
        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <ThemedText style={styles.priceLabel}>Цена:</ThemedText>
            <ThemedText style={styles.priceValue}>{artwork.price?.toLocaleString()} {artwork.currency}</ThemedText>
          </View>
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={handleContactArtist}
          >
            <FontAwesome name="envelope" size={16} color="#fff" style={styles.contactIcon} />
            <ThemedText style={styles.contactText}>Связаться с продавцом</ThemedText>
          </TouchableOpacity>
        </View>
      )}
      
      <ContactArtistModal
        visible={isContactModalVisible}
        onClose={() => setIsContactModalVisible(false)}
        artist={artist}
        artwork={artwork}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
  },
  imagePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  artistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  artistName: {
    fontSize: 16,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    marginLeft: 6,
    color: '#666',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  detailsContainer: {
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    width: 120,
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  priceValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0a7ea4',
  },
  contactButton: {
    backgroundColor: '#0a7ea4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
  },
  contactIcon: {
    marginRight: 8,
  },
  contactText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 