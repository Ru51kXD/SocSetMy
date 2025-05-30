import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Dimensions, Modal, FlatList, ActivityIndicator } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Artwork, User } from '@/app/models/types';
import { LinearGradient } from 'expo-linear-gradient';
import { useMessages } from '@/app/context/MessageContext';
import { MOCK_ARTWORKS } from '@/app/data/artworks';
import { useUserPreferences } from '@/app/context/UserPreferencesContext';

interface ArtworkCardProps {
  artwork: Artwork;
  artworkId?: string;
  compact?: boolean;
  onContactRequest?: (artwork: Artwork) => void;
}

const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 24; // Две карточки в ряду с учетом отступов

// Глобальный кэш неработающих URL изображений для предотвращения повторных попыток загрузки
const failedImageUrls = new Set();

export function ArtworkCard({ artwork, artworkId, compact = false, onContactRequest }: ArtworkCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { threads, shareArtwork, setActiveChat, hasThreadWithArtist, addMessage } = useMessages();
  const { isArtworkLiked, isArtworkSaved, likeArtwork, unlikeArtwork, saveArtwork, unsaveArtwork } = useUserPreferences();
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  // Получаем уникальных художников из существующих чатов
  const chatArtists = threads.map(thread => thread.artist);
  
  // Добавляем художника текущей работы, если его нет в списке
  const currentArtist = MOCK_ARTWORKS.find(a => a.artistId === artwork.artistId)?.artistId;
  if (currentArtist && !chatArtists.some(artist => artist.id === currentArtist)) {
    // Если это текущий автор работы, его не добавляем в список для отправки
  }

  // Проверяем статус лайка и сохранения при загрузке
  useEffect(() => {
    setLiked(isArtworkLiked(artwork.id));
    setSaved(isArtworkSaved(artwork.id));
  }, [artwork.id, isArtworkLiked, isArtworkSaved]);

  // Проверяем URL при инициализации, если он уже в списке ошибок
  useEffect(() => {
    if (artwork.thumbnailUrl && failedImageUrls.has(artwork.thumbnailUrl)) {
      setImageLoading(false);
      setImageError(true);
    }
  }, [artwork.thumbnailUrl]);

  // Функция для отображения запасного изображения
  const getBackupImageUrl = () => {
    // Проверка, что у работы есть название для использования в запасном изображении
    const safeTitle = artwork.title ? encodeURIComponent(artwork.title) : 'artwork';
    // Используем более надежный сервис для запасных изображений
    return `https://ui-avatars.com/api/?name=${safeTitle}&size=200&background=${getColorForArtwork()}&color=ffffff`;
  };

  // Функция для генерации цвета на основе ID работы
  const getColorForArtwork = () => {
    const colors = ['1a73e8', 'ff4151', '0a7ea4', '388e3c', '7b1fa2', 'fb8c00'];
    const id = parseInt(artwork.id.replace(/\D/g, '') || '1');
    return colors[id % colors.length];
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    // Добавляем URL в список неработающих, чтобы не пытаться загружать его снова
    if (artwork.thumbnailUrl) {
      failedImageUrls.add(artwork.thumbnailUrl);
    }
    
    // Логируем ошибку только если это не повторная попытка загрузки этого URL
    if (!imageError) {
      console.log(`Ошибка загрузки изображения: ${artwork.thumbnailUrl}`);
    }
    
    setImageLoading(false);
    setImageError(true);
  };

  const handlePress = () => {
    // Используем переданный artworkId, если он есть, иначе используем id из объекта artwork
    const id = artworkId || artwork.id;
    router.push(`/artwork/${id}`);
  };

  const handleArtistPress = (e: any) => {
    e.stopPropagation();
    router.push(`/profile/${artwork.artistId}`);
  };

  const handleContactRequest = () => {
    if (onContactRequest) {
      // Если передан внешний обработчик, используем его
      onContactRequest(artwork);
      return;
    }
    
    console.log('Обработка контакта с художником из ArtworkCard:', artwork.artistId, artwork.artistName);
    
    try {
      // Преобразуем ID художника в строку для правильного сравнения
      const artistIdStr = String(artwork.artistId);
      console.log('ID художника (строка):', artistIdStr);
      
      // Для Марины Ивановой (ID=1) используем максимально упрощенную логику
      if (artistIdStr === '1') {
        console.log('Особая обработка для Марины Ивановой (ID=1) в ArtworkCard');
        
        // Отправляем сообщение напрямую через существующий объект addMessage
        addMessage('1', {
          content: `Здравствуйте, Марина! Меня заинтересовала ваша работа "${artwork.title}"`,
          subject: 'Интерес к работе',
          sharedArtwork: artwork  // Прикрепляем работу к сообщению
        });
        
        // Устанавливаем активный чат
        if (setActiveChat) setActiveChat('1');
        
        // Используем значительную задержку
        console.log('Ожидаем перед переходом на экран сообщений...');
        setTimeout(() => {
          console.log('Переходим на экран сообщений');
          router.push('/(tabs)/messages');
        }, 1000);
        
        return;
      }
      
      // Для остальных художников используем стандартную логику
      // Проверяем, существует ли уже чат с этим художником
      const hasThread = hasThreadWithArtist ? hasThreadWithArtist(artistIdStr) : false;
      console.log('Существующий чат:', hasThread);
      
      if (hasThread) {
        // Если чат существует, просто активируем его и переходим к нему
        console.log('Активация существующего чата...');
        if (setActiveChat) setActiveChat(artistIdStr);
        
        // Задержка перед переходом
        setTimeout(() => {
          router.push('/(tabs)/messages');
        }, 200);
      } else {
        // Если чата нет, создаем новый
        console.log('Создание нового чата и отправка работы...');
        shareArtwork(artistIdStr, artwork);
        
        if (setActiveChat) setActiveChat(artistIdStr);
        
        // Задержка перед переходом
        setTimeout(() => {
          router.push('/(tabs)/messages');
        }, 500);
      }
    } catch (error) {
      console.error('Ошибка при обработке контакта:', error);
      
      // В случае ошибки просто перейдем к сообщениям
      router.push('/(tabs)/messages');
    }
  };

  const handleSharePress = (e: any) => {
    e.stopPropagation();
    setIsShareModalVisible(true);
  };

  const handleShareArtwork = (artistId: string) => {
    // Преобразуем ID художника в строку для правильного сравнения
    const artistIdStr = String(artistId);
    
    // Проверяем, существует ли уже чат с этим художником
    if (hasThreadWithArtist(artistIdStr)) {
      // Если чат существует, добавляем сообщение с работой
      shareArtwork(artistIdStr, artwork);
    } else {
      // Если чата еще нет, создаем новый и отправляем сообщение с работой
      shareArtwork(artistIdStr, artwork);
    }
    
    // Закрываем модальное окно
    setIsShareModalVisible(false);
    
    // Перенаправляем на экран сообщений с открытым чатом
    setActiveChat?.(artistIdStr);
    router.push('/(tabs)/messages');
  };

  const handleLikeToggle = async (e: any) => {
    e.stopPropagation();
    try {
      if (liked) {
        await unlikeArtwork(artwork.id);
        setLiked(false);
      } else {
        await likeArtwork(artwork);
        setLiked(true);
      }
    } catch (error) {
      console.error('Ошибка при обработке лайка:', error);
    }
  };

  const handleSaveToggle = async (e: any) => {
    e.stopPropagation();
    try {
      if (saved) {
        await unsaveArtwork(artwork.id);
        setSaved(false);
      } else {
        await saveArtwork(artwork);
        setSaved(true);
      }
    } catch (error) {
      console.error('Ошибка при сохранении в избранное:', error);
    }
  };

  const handleTagPress = (tag: string, e: any) => {
    e.stopPropagation();
    
    // Переходим на экран поиска с параметром тега
    router.push({
      pathname: '/(tabs)/explore',
      params: { tag }
    });
  };

  const renderArtistItem = ({ item }: { item: User }) => (
    <TouchableOpacity 
      style={styles.artistItem} 
      onPress={() => handleShareArtwork(item.id)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.avatar }} style={styles.artistAvatar} />
      <View style={styles.artistInfo}>
        <ThemedText style={styles.artistItemName}>{item.displayName}</ThemedText>
        <ThemedText style={styles.artistItemUsername}>@{item.username}</ThemedText>
      </View>
    </TouchableOpacity>
  );

  if (compact) {
    // Проверяем, есть ли URL изображения перед рендерингом
    const shouldUseBackupImage = imageError || !artwork.thumbnailUrl || artwork.thumbnailUrl.trim() === '' || failedImageUrls.has(artwork.thumbnailUrl);
    
    return (
      <TouchableOpacity style={styles.compactCard} onPress={handlePress}>
        <View style={styles.compactImageContainer}>
          {imageLoading && !shouldUseBackupImage && (
            <View style={[styles.compactImage, styles.imagePlaceholder]}>
              <ActivityIndicator size="small" color="#0a7ea4" />
            </View>
          )}
          <Image 
            source={{ uri: shouldUseBackupImage ? getBackupImageUrl() : artwork.thumbnailUrl }} 
            style={[styles.compactImage, imageLoading && !shouldUseBackupImage && styles.hiddenImage]} 
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          
          {/* Добавляем индикаторы лайков и сохранений в компактную карточку */}
          <View style={styles.compactOverlay}>
            <View style={styles.compactOverlayIcons}>
              {liked && <FontAwesome name="heart" size={12} color="#FF4151" style={styles.compactStatusIcon} />}
              {saved && <FontAwesome name="bookmark" size={12} color="#0a7ea4" style={styles.compactStatusIcon} />}
            </View>
          </View>
        </View>
        <ThemedText style={styles.compactTitle} numberOfLines={1}>{artwork.title}</ThemedText>
        
        {/* Отображаем теги для неком пактного режима */}
        {!compact && artwork.tags && artwork.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {artwork.tags.slice(0, 3).map((tag, index) => (
              <TouchableOpacity 
                key={`artwork-tag-${index}`} 
                style={styles.tag}
                onPress={(e) => handleTagPress(tag, e)}
              >
                <ThemedText style={styles.tagText}>#{tag}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  }

  // Проверяем, следует ли использовать запасное изображение
  const shouldUseBackupImage = imageError || !artwork.thumbnailUrl || artwork.thumbnailUrl.trim() === '' || failedImageUrls.has(artwork.thumbnailUrl);

  return (
    <>
      <TouchableOpacity 
        style={[styles.card, compact && styles.compactCard]} 
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={styles.imageContainer}>
          {imageLoading && !shouldUseBackupImage && (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <ActivityIndicator size="large" color="#0a7ea4" />
            </View>
          )}
          <Image 
            source={{ uri: shouldUseBackupImage ? getBackupImageUrl() : artwork.thumbnailUrl }} 
            style={[styles.image, imageLoading && !shouldUseBackupImage && styles.hiddenImage]} 
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </View>
        <ThemedView style={styles.cardContent}>
          <ThemedText style={styles.title} numberOfLines={2}>{artwork.title}</ThemedText>
          
          <TouchableOpacity style={styles.artistRow} onPress={handleArtistPress}>
            <Image source={{ uri: artwork.artistAvatar }} style={styles.avatar} />
            <ThemedText style={styles.artistName}>{artwork.artistName}</ThemedText>
          </TouchableOpacity>
          
          <View style={styles.statsRow}>
            <TouchableOpacity style={styles.stat} onPress={handleLikeToggle}>
              <FontAwesome 
                name={liked ? "heart" : "heart-o"} 
                size={14} 
                color={liked ? "#FF4151" : "#888"} 
              />
              <ThemedText style={styles.statText}>{artwork.likes + (liked ? 1 : 0)}</ThemedText>
            </TouchableOpacity>
            <View style={styles.stat}>
              <FontAwesome name="eye" size={14} color="#888" />
              <ThemedText style={styles.statText}>{artwork.views}</ThemedText>
            </View>
            <View style={styles.stat}>
              <FontAwesome name="comment" size={14} color="#888" />
              <ThemedText style={styles.statText}>{artwork.comments}</ThemedText>
            </View>
            
            <TouchableOpacity style={styles.stat} onPress={handleSaveToggle}>
              <FontAwesome 
                name={saved ? "bookmark" : "bookmark-o"} 
                size={14} 
                color={saved ? "#0a7ea4" : "#888"} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.shareButton} onPress={handleSharePress}>
              <FontAwesome name="share" size={14} color="#0a7ea4" />
            </TouchableOpacity>
            
            {artwork.isForSale && onContactRequest && (
              <TouchableOpacity style={styles.contactButton} onPress={handleContactRequest}>
                <FontAwesome name="envelope" size={12} color="#fff" />
                <ThemedText style={styles.contactText}>Связаться</ThemedText>
              </TouchableOpacity>
            )}
          </View>
          
          {artwork.isForSale && (
            <View style={styles.priceTag}>
              <ThemedText style={styles.priceText}>
                {artwork.price?.toLocaleString()} ₸
              </ThemedText>
            </View>
          )}
        </ThemedView>
        
        {/* Отображаем теги для неком пактного режима */}
        {!compact && artwork.tags && artwork.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {artwork.tags.slice(0, 3).map((tag, index) => (
              <TouchableOpacity 
                key={`artwork-tag-${index}`} 
                style={styles.tag}
                onPress={(e) => handleTagPress(tag, e)}
              >
                <ThemedText style={styles.tagText}>#{tag}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </TouchableOpacity>

      {/* Модальное окно для выбора, с кем поделиться */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isShareModalVisible}
        onRequestClose={() => setIsShareModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Поделиться работой</ThemedText>
              <TouchableOpacity 
                onPress={() => setIsShareModalVisible(false)}
                style={styles.closeButton}
              >
                <FontAwesome name="times" size={20} color="#555" />
              </TouchableOpacity>
            </View>
            
            <ThemedText style={styles.modalSubtitle}>
              Выберите контакт для отправки работы "{artwork.title}"
            </ThemedText>
            
            {chatArtists.length > 0 ? (
              <FlatList
                data={chatArtists}
                renderItem={renderArtistItem}
                keyExtractor={(item) => `share-modal-artist-${item.id}`}
                contentContainerStyle={styles.artistsList}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <FontAwesome name="users" size={40} color="#ccc" />
                <ThemedText style={styles.emptyText}>
                  У вас пока нет активных чатов
                </ThemedText>
                <ThemedText style={styles.emptySubtext}>
                  Начните общение с художником, чтобы отправить ему эту работу
                </ThemedText>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

export default ArtworkCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  hiddenImage: {
    opacity: 0,
  },
  cardContent: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  artistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  artistName: {
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    marginLeft: 4,
    color: '#888',
  },
  compactCard: {
    width: cardWidth,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  compactImageContainer: {
    position: 'relative',
    width: '100%',
    height: cardWidth,
    borderRadius: 8,
    overflow: 'hidden',
  },
  compactImage: {
    width: '100%',
    height: cardWidth,
    resizeMode: 'cover',
  },
  compactTitle: {
    fontSize: 12,
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  compactOverlay: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    padding: 4,
  },
  compactOverlayIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactStatusIcon: {
    marginLeft: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a7ea4',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  contactText: {
    color: '#fff',
    fontSize: 10,
    marginLeft: 4,
  },
  priceTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(10, 126, 164, 0.9)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  priceText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  shareButton: {
    padding: 5,
    marginLeft: 8,
  },
  
  // Стили для модального окна
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxHeight: '80%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  artistsList: {
    paddingVertical: 8,
  },
  artistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  artistAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  artistInfo: {
    marginLeft: 12,
  },
  artistItemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  artistItemUsername: {
    fontSize: 12,
    color: '#888',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#555',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  tag: {
    padding: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginRight: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
}); 