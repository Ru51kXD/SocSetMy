import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Artwork } from '@/app/models/types';
import { ArtworkCard } from './ArtworkCard';

interface TrendingArtworksProps {
  artworks: Artwork[];
}

export function TrendingArtworks({ artworks }: TrendingArtworksProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.sectionTitle}>В тренде сейчас</ThemedText>
      
      <View style={styles.artworksContainer}>
        {artworks.map((artwork) => (
          <View key={artwork.id} style={styles.artworkItem}>
            <ArtworkCard artwork={artwork} compact={false} />
          </View>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  artworksContainer: {
    paddingHorizontal: 16,
  },
  artworkItem: {
    marginBottom: 16,
  },
}); 