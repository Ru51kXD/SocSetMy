import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Artwork } from '@/app/models/types';
import { ArtworkCard } from '@/app/components/common/ArtworkCard';

interface WeeklyTopArtworksProps {
  artworks: Artwork[];
}

export function WeeklyTopArtworks({ artworks }: WeeklyTopArtworksProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.sectionTitle}>Лучшие работы недели</ThemedText>
      
      <View style={styles.listContainer}>
        {artworks.map(artwork => (
          <View 
            key={`weekly-top-${artwork.id}`} 
            style={styles.artworkItemContainer}
          >
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
  listContainer: {
    paddingHorizontal: 16,
  },
  artworkItemContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
}); 