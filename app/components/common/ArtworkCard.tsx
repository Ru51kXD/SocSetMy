import React, { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Dimensions, Modal, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Artwork, User } from '@/app/models/types';
import { LinearGradient } from 'expo-linear-gradient';
import { useMessages } from '@/app/context/MessageContext';
import { MOCK_ARTWORKS } from '@/app/data/artworks';

interface ArtworkCardProps {
  artwork: Artwork;
  compact?: boolean;
  onContactRequest?: (artwork: Artwork) => void;
}

const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 24; // Две карточки в ряду с учетом отступов

export function ArtworkCard({ artwork, compact = false, onContactRequest }: ArtworkCardProps) {
  const router = useRouter();
  const { threads, shareArtwork } = useMessages();
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);

  // Получаем уникальных художников из существующих чатов
  const chatArtists = threads.map(thread => thread.artist);
  
  // Добавляем художника текущей работы, если его нет в списке
  const currentArtist = MOCK_ARTWORKS.find(a => a.artistId === artwork.artistId)?.artistId;
  if (currentArtist && !chatArtists.some(artist => artist.id === currentArtist)) {
    // Если это текущий автор работы, его не добавляем в список для отправки
  }

  const handlePress = () => {
    router.push(`/artwork/${artwork.id}`);
  };

  const handleArtistPress = (e: any) => {
    e.stopPropagation();
    router.push(`/profile/${artwork.artistId}`);
  };

  const handleContactPress = (e: any) => {
    e.stopPropagation();
    if (onContactRequest) {
      onContactRequest(artwork);
    }
  };

  const handleSharePress = (e: any) => {
    e.stopPropagation();
    setIsShareModalVisible(true);
  };

  const handleShareToArtist = (artist: User) => {
    shareArtwork(artist.id, artwork);
    setIsShareModalVisible(false);
    
    // Показываем уведомление пользователю
    alert(`Работа "${artwork.title}" отправлена ${artist.displayName}`);
    
    // Переходим в чат с этим художником
    router.push(`/chat/${artist.id}`);
  };

  const renderArtistItem = ({ item }: { item: User }) => (
    <TouchableOpacity 
      style={styles.artistItem} 
      onPress={() => handleShareToArtist(item)}
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
    return (
      <TouchableOpacity style={styles.compactCard} onPress={handlePress}>
        <Image source={{ uri: artwork.thumbnailUrl }} style={styles.compactImage} />
        <ThemedText style={styles.compactTitle} numberOfLines={1}>{artwork.title}</ThemedText>
      </TouchableOpacity>
    );
  }

  return (
    <>
      <TouchableOpacity style={styles.card} onPress={handlePress}>
        <Image source={{ uri: artwork.thumbnailUrl }} style={styles.image} />
        <ThemedView style={styles.cardContent}>
          <ThemedText style={styles.title} numberOfLines={2}>{artwork.title}</ThemedText>
          
          <TouchableOpacity style={styles.artistRow} onPress={handleArtistPress}>
            <Image source={{ uri: artwork.artistAvatar }} style={styles.avatar} />
            <ThemedText style={styles.artistName}>{artwork.artistName}</ThemedText>
          </TouchableOpacity>
          
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <FontAwesome name="heart" size={14} color="#FF4151" />
              <ThemedText style={styles.statText}>{artwork.likes}</ThemedText>
            </View>
            <View style={styles.stat}>
              <FontAwesome name="eye" size={14} color="#888" />
              <ThemedText style={styles.statText}>{artwork.views}</ThemedText>
            </View>
            <View style={styles.stat}>
              <FontAwesome name="comment" size={14} color="#888" />
              <ThemedText style={styles.statText}>{artwork.comments}</ThemedText>
            </View>
            
            <TouchableOpacity style={styles.shareButton} onPress={handleSharePress}>
              <FontAwesome name="share" size={14} color="#0a7ea4" />
            </TouchableOpacity>
            
            {artwork.isForSale && onContactRequest && (
              <TouchableOpacity style={styles.contactButton} onPress={handleContactPress}>
                <FontAwesome name="envelope" size={12} color="#fff" />
                <ThemedText style={styles.contactText}>Связаться</ThemedText>
              </TouchableOpacity>
            )}
          </View>
          
          {artwork.isForSale && (
            <View style={styles.priceTag}>
              <ThemedText style={styles.priceText}>
                {artwork.price?.toLocaleString()} {artwork.currency}
              </ThemedText>
            </View>
          )}
        </ThemedView>
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
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
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
  },
  compactImage: {
    width: '100%',
    height: cardWidth,
    resizeMode: 'cover',
  },
  compactTitle: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
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
}); 