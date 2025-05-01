import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Image, View } from 'react-native';
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

  const renderArtistItem = ({ item }: { item: User }) => (
    <TouchableOpacity 
      style={styles.artistItem}
      onPress={() => handleArtistPress(item.id)}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.isVerified && (
          <View style={styles.verifiedBadge} />
        )}
      </View>
      <ThemedText style={styles.artistName} numberOfLines={1}>{item.displayName}</ThemedText>
      <ThemedText style={styles.artistStats}>{item.followers} подписчиков</ThemedText>
      
      <View style={styles.tagContainer}>
        {item.artStyles && item.artStyles.slice(0, 1).map((style, index) => (
          <View key={index} style={styles.tag}>
            <ThemedText style={styles.tagText}>{style}</ThemedText>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.sectionTitle}>Популярные художники</ThemedText>
      
      <FlatList
        horizontal
        data={artists}
        renderItem={renderArtistItem}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
      />
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
    paddingBottom: 4,
  },
  artistItem: {
    width: 120,
    alignItems: 'center',
    marginHorizontal: 8,
    padding: 8,
    borderRadius: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#f0f0f0',
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