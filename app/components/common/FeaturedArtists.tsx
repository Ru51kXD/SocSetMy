import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { User } from '@/app/models/types';

interface FeaturedArtistsProps {
  artists: User[];
}

export function FeaturedArtists({ artists }: FeaturedArtistsProps) {
  const router = useRouter();

  const handleArtistPress = (artistId: string) => {
    router.push(`/profile/${artistId}`);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.sectionTitle}>Популярные художники</ThemedText>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {artists.map((artist) => (
          <TouchableOpacity 
            key={artist.id} 
            style={styles.artistItem}
            onPress={() => handleArtistPress(artist.id)}
          >
            <View style={styles.avatarContainer}>
              <Image source={{ uri: artist.avatar }} style={styles.avatar} />
              {artist.isVerified && (
                <View style={styles.verifiedBadge} />
              )}
            </View>
            <ThemedText style={styles.artistName} numberOfLines={1}>{artist.displayName}</ThemedText>
            <ThemedText style={styles.artistStats}>{artist.followers} подписчиков</ThemedText>
            
            <View style={styles.tagContainer}>
              {artist.artStyles.slice(0, 1).map((style, index) => (
                <View key={index} style={styles.tag}>
                  <ThemedText style={styles.tagText}>{style}</ThemedText>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  scrollContent: {
    paddingHorizontal: 12,
  },
  artistItem: {
    width: 120,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  verifiedBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#1DA1F2',
    borderRadius: 10,
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  artistName: {
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  artistStats: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  tagContainer: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  tag: {
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 10,
    color: '#0a7ea4',
  },
}); 