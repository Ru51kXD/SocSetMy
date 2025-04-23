import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Artwork } from '@/app/models/types';

interface ArtworkCardProps {
  artwork: Artwork;
  compact?: boolean;
}

const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 24; // Две карточки в ряду с учетом отступов

export function ArtworkCard({ artwork, compact = false }: ArtworkCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/artwork/${artwork.id}`);
  };

  const handleArtistPress = (e: any) => {
    e.stopPropagation();
    router.push(`/profile/${artwork.artistId}`);
  };

  if (compact) {
    return (
      <TouchableOpacity style={styles.compactCard} onPress={handlePress}>
        <Image source={{ uri: artwork.thumbnailUrl }} style={styles.compactImage} />
        <ThemedText style={styles.compactTitle} numberOfLines={1}>{artwork.title}</ThemedText>
      </TouchableOpacity>
    );
  }

  return (
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
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}

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
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    marginLeft: 4,
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
}); 