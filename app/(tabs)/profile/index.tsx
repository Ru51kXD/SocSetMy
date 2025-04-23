import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ProfileHeader } from '@/app/components/common/ProfileHeader';
import { GalleryGrid } from '@/app/components/gallery/GalleryGrid';
import { User, Artwork } from '@/app/models/types';

// Моковые данные для текущего пользователя
const CURRENT_USER: User = {
  id: '1',
  username: 'artmaster',
  displayName: 'Михаил Лебедев',
  bio: 'Художник-иллюстратор из Санкт-Петербурга. Специализируюсь на акварельной живописи и скетчах городских пейзажей. Открыт для заказов и сотрудничества.',
  avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
  coverImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176',
  artStyles: ['Акварель', 'Скетчинг', 'Городской пейзаж'],
  skills: ['Портрет', 'Пейзаж', 'Книжная иллюстрация'],
  location: 'Санкт-Петербург',
  websiteUrl: 'www.mikhailart.ru',
  socialLinks: {
    instagram: 'mikhart',
    behance: 'mikhaillebedey',
    artstation: 'mikhailart'
  },
  isVerified: true,
  followers: 1250,
  following: 145,
  createdAt: '2023-01-15'
};

// Моковые данные работ пользователя
const USER_ARTWORKS: Artwork[] = [
  {
    id: '1',
    title: 'Городской пейзаж на закате',
    description: 'Городской пейзаж, написанный маслом, изображающий город на закате.',
    images: ['https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a',
    artistId: '1',
    artistName: 'Михаил Лебедев',
    artistAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    categories: ['Живопись'],
    tags: ['пейзаж', 'город', 'масло'],
    medium: 'Масло',
    likes: 245,
    views: 1203,
    comments: 48,
    isForSale: true,
    price: 12000,
    currency: 'RUB',
    createdAt: '2023-09-15'
  },
  {
    id: '4',
    title: 'Акварельный скетч Петербурга',
    description: 'Быстрый акварельный скетч исторического центра Санкт-Петербурга.',
    images: ['https://images.unsplash.com/photo-1564769625905-42a042a2d458'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1564769625905-42a042a2d458',
    artistId: '1',
    artistName: 'Михаил Лебедев',
    artistAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    categories: ['Живопись', 'Скетч'],
    tags: ['акварель', 'Петербург', 'скетч'],
    medium: 'Акварель',
    dimensions: '30x20 см',
    likes: 189,
    views: 870,
    comments: 32,
    isForSale: true,
    price: 8000,
    currency: 'RUB',
    createdAt: '2023-10-22'
  },
  {
    id: '5',
    title: 'Портрет незнакомки',
    description: 'Портрет девушки в технике сухая кисть.',
    images: ['https://images.unsplash.com/photo-1621784563330-caee0b138a00'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1621784563330-caee0b138a00',
    artistId: '1',
    artistName: 'Михаил Лебедев',
    artistAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    categories: ['Портрет'],
    tags: ['портрет', 'девушка', 'сухая кисть'],
    medium: 'Сухая кисть',
    dimensions: '40x60 см',
    likes: 312,
    views: 1420,
    comments: 56,
    isForSale: false,
    createdAt: '2023-11-05'
  },
  {
    id: '6',
    title: 'Эскиз для книжной иллюстрации',
    description: 'Эскиз для детской книги "Волшебный лес".',
    images: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
    artistId: '1',
    artistName: 'Михаил Лебедев',
    artistAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    categories: ['Иллюстрация'],
    tags: ['детская книга', 'иллюстрация', 'эскиз'],
    medium: 'Смешанная техника',
    likes: 175,
    views: 690,
    comments: 28,
    isForSale: false,
    createdAt: '2023-12-01'
  }
];

export default function ProfileScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerSection}>
        <ProfileHeader user={CURRENT_USER} isCurrentUser={true} />
        
        <ThemedView style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <FontAwesome name="th" size={18} color="#0a7ea4" />
            <ThemedText style={styles.activeTabText}>Работы</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <FontAwesome name="bookmark" size={18} color="#888" />
            <ThemedText style={styles.tabText}>Сохраненные</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <FontAwesome name="heart" size={18} color="#888" />
            <ThemedText style={styles.tabText}>Понравившиеся</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </View>
      
      <GalleryGrid artworks={USER_ARTWORKS} compact={true} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    paddingBottom: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#0a7ea4',
  },
  tabText: {
    marginLeft: 8,
    color: '#888',
  },
  activeTabText: {
    marginLeft: 8,
    color: '#0a7ea4',
    fontWeight: 'bold',
  },
  galleryContainer: {
    flex: 1,
    paddingTop: 16,
  },
});