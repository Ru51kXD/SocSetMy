import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Artwork, User } from '@/app/models/types';
import { MOCK_ARTWORKS } from '@/app/data/artworks';
import { ContactArtistModal } from '@/app/components/common/ContactArtistModal';

const { width } = Dimensions.get('window');

export default function ArtworkDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isContactModalVisible, setIsContactModalVisible] = useState(false);
  const [artist, setArtist] = useState<User | null>(null);

  useEffect(() => {
    // Находим работу по ID из параметров URL
    const foundArtwork = MOCK_ARTWORKS.find(item => item.id === id);
    if (foundArtwork) {
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
    }
  }, [id]);

  const handleArtistPress = () => {
    if (artwork) {
      router.push(`/profile/${artwork.artistId}`);
    }
  };

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
  };

  const handleSaveToggle = () => {
    setIsSaved(!isSaved);
  };

  const handleContactArtist = () => {
    setIsContactModalVisible(true);
  };

  if (!artwork) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Загрузка...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: artwork.images[0] }} style={styles.image} />

        <View style={styles.contentContainer}>
          <ThemedText style={styles.title}>{artwork.title}</ThemedText>
          
          <TouchableOpacity style={styles.artistRow} onPress={handleArtistPress}>
            <Image source={{ uri: artwork.artistAvatar }} style={styles.avatar} />
            <ThemedText style={styles.artistName}>{artwork.artistName}</ThemedText>
          </TouchableOpacity>
          
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <FontAwesome 
                name={isLiked ? "heart" : "heart-o"} 
                size={18} 
                color={isLiked ? "#FF4151" : "#666"} 
                onPress={handleLikeToggle}
              />
              <ThemedText style={styles.statText}>{artwork.likes + (isLiked ? 1 : 0)}</ThemedText>
            </View>
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
                <View key={index} style={styles.tag}>
                  <ThemedText style={styles.tagText}>#{tag}</ThemedText>
                </View>
              ))}
            </View>
          )}
          
          {artwork.isForSale && (
            <View style={styles.priceSection}>
              <View style={styles.priceContainer}>
                <ThemedText style={styles.priceLabel}>Цена:</ThemedText>
                <ThemedText style={styles.price}>
                  {artwork.price?.toLocaleString()} {artwork.currency}
                </ThemedText>
              </View>
              
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={handleContactArtist}
              >
                <FontAwesome name="envelope" size={16} color="#fff" style={styles.buttonIcon} />
                <ThemedText style={styles.contactButtonText}>Связаться с продавцом</ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      
      {artist && (
        <ContactArtistModal 
          visible={isContactModalVisible}
          artist={artist}
          artwork={artwork}
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
  image: {
    width: width,
    height: width,
    resizeMode: 'contain',
    backgroundColor: '#f0f0f0',
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
  priceSection: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
    marginBottom: 24,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  price: {
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
  buttonIcon: {
    marginRight: 8,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 