import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ProfileHeader } from '@/app/components/common/ProfileHeader';
import { GalleryGrid } from '@/app/components/gallery/GalleryGrid';
import { EditProfileModal } from '@/app/components/common/EditProfileModal';
import { User, Artwork } from '@/app/models/types';

// Моковые данные для текущего пользователя
const INITIAL_USER: User = {
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

// Моковые данные для сохраненных работ
const SAVED_ARTWORKS: Artwork[] = [
  {
    id: '8',
    title: 'Фантастический мир',
    description: 'Цифровая иллюстрация фантастического мира с летающими островами.',
    images: ['https://picsum.photos/id/63/800/800'],
    thumbnailUrl: 'https://picsum.photos/id/63/800/800',
    artistId: '2',
    artistName: 'Марина Иванова',
    artistAvatar: 'https://i.pravatar.cc/150?img=36',
    categories: ['Цифровое искусство'],
    tags: ['фэнтези', 'иллюстрация', 'цифровое'],
    medium: 'Цифровая иллюстрация',
    dimensions: '4000x2500 px',
    likes: 520,
    views: 1800,
    comments: 43,
    isForSale: true,
    price: 20000,
    currency: 'RUB',
    createdAt: '2023-07-18'
  },
  {
    id: '9',
    title: 'Портрет в неоновых тонах',
    description: 'Стилизованный портрет с использованием неоновой цветовой гаммы.',
    images: ['https://images.unsplash.com/photo-1602085234609-f1a0f5b73e8c'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1602085234609-f1a0f5b73e8c',
    artistId: '3',
    artistName: 'Елена Смирнова',
    artistAvatar: 'https://i.pravatar.cc/150?img=25',
    categories: ['Цифровое искусство'],
    tags: ['портрет', 'неон', 'цифровое'],
    medium: 'Цифровая иллюстрация',
    likes: 578,
    views: 3120,
    comments: 92,
    isForSale: false,
    createdAt: '2023-11-27'
  }
];

// Моковые данные для понравившихся работ
const LIKED_ARTWORKS: Artwork[] = [
  {
    id: '3',
    title: 'Портрет незнакомки',
    description: 'Портрет девушки, выполненный маслом на холсте.',
    images: ['https://picsum.photos/id/24/800/800'],
    thumbnailUrl: 'https://picsum.photos/id/24/800/800',
    artistId: '3',
    artistName: 'Елена Смирнова',
    artistAvatar: 'https://i.pravatar.cc/150?img=25',
    categories: ['Живопись'],
    tags: ['портрет', 'масло', 'классика'],
    medium: 'Масло',
    dimensions: '50x70 см',
    likes: 280,
    views: 650,
    comments: 32,
    isForSale: true,
    price: 25000,
    currency: 'RUB',
    createdAt: '2023-04-05'
  },
  {
    id: '7',
    title: 'Скульптура "Движение"',
    description: 'Скульптура из металла, символизирующая движение времени.',
    images: ['https://images.unsplash.com/photo-1549887552-cb1071d3e5ca'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1549887552-cb1071d3e5ca',
    artistId: '6',
    artistName: 'Алексей Иванов',
    artistAvatar: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3',
    categories: ['Скульптура'],
    tags: ['металл', 'абстракция', 'движение'],
    medium: 'Металл',
    likes: 132,
    views: 745,
    comments: 23,
    isForSale: true,
    price: 75000,
    currency: 'RUB',
    createdAt: '2023-07-03'
  },
  {
    id: '10',
    title: 'Закат в горах',
    description: 'Акварельная живопись вечернего заката в горах.',
    images: ['https://picsum.photos/id/111/800/800'],
    thumbnailUrl: 'https://picsum.photos/id/111/800/800',
    artistId: '1',
    artistName: 'Марина Иванова',
    artistAvatar: 'https://i.pravatar.cc/150?img=36',
    categories: ['Живопись'],
    tags: ['пейзаж', 'закат', 'горы'],
    medium: 'Акварель',
    dimensions: '40x30 см',
    likes: 450,
    views: 1230,
    comments: 28,
    isForSale: true,
    price: 15000,
    currency: 'RUB',
    createdAt: '2023-05-12'
  }
];

type TabType = 'works' | 'saved' | 'liked';

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('works');
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const handleEditProfile = () => {
    setIsEditModalVisible(true);
  };

  const handleSaveProfile = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'works':
        return <GalleryGrid artworks={USER_ARTWORKS} compact={true} />;
      case 'saved':
        return <GalleryGrid artworks={SAVED_ARTWORKS} compact={true} />;
      case 'liked':
        return <GalleryGrid artworks={LIKED_ARTWORKS} compact={true} />;
      default:
        return null;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerSection}>
        <ProfileHeader 
          user={user} 
          isCurrentUser={true} 
          onEditProfile={handleEditProfile}
        />
        
        <ThemedView style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'works' && styles.activeTab]}
            onPress={() => setActiveTab('works')}
          >
            <FontAwesome name="th" size={18} color={activeTab === 'works' ? "#0a7ea4" : "#888"} />
            <ThemedText style={activeTab === 'works' ? styles.activeTabText : styles.tabText}>
              Работы
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
            onPress={() => setActiveTab('saved')}
          >
            <FontAwesome name="bookmark" size={18} color={activeTab === 'saved' ? "#0a7ea4" : "#888"} />
            <ThemedText style={activeTab === 'saved' ? styles.activeTabText : styles.tabText}>
              Сохраненные
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'liked' && styles.activeTab]}
            onPress={() => setActiveTab('liked')}
          >
            <FontAwesome name="heart" size={18} color={activeTab === 'liked' ? "#0a7ea4" : "#888"} />
            <ThemedText style={activeTab === 'liked' ? styles.activeTabText : styles.tabText}>
              Понравившиеся
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </View>
      
      <View style={styles.contentContainer}>
        {renderTabContent()}
      </View>

      <EditProfileModal 
        visible={isEditModalVisible}
        user={user}
        onClose={() => setIsEditModalVisible(false)}
        onSave={handleSaveProfile}
      />
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
  contentContainer: {
    flex: 1,
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
});