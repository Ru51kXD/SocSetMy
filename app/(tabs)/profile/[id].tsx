import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ArtworkCard } from '@/app/components/common/ArtworkCard';
import { ProfileHeader } from '@/app/components/common/ProfileHeader';
import { GalleryGrid } from '@/app/components/gallery/GalleryGrid';
import { ContactArtistModal } from '@/app/components/common/ContactArtistModal';
import { User, Artwork } from '@/app/models/types';
import { MOCK_ARTWORKS } from '@/app/data/artworks';
import { useMessages } from '@/app/context/MessageContext';
import { useFollow } from '@/app/context/FollowContext';
import { useAuth } from '@/app/context/AuthContext';

// Моковые данные художников
const MOCK_ARTISTS: User[] = [
  {
    id: '1',
    username: 'marina_art',
    displayName: 'Марина Иванова',
    bio: 'Цифровой художник, специализирующийся на фэнтези. Создаю иллюстрации для книг и игр. Более 5 лет опыта в диджитал арте и традиционных техниках.',
    avatar: 'https://i.pravatar.cc/150?img=36',
    coverImage: 'https://images.unsplash.com/photo-1579547621113-e4bb2a19bdd6',
    artStyles: ['Акварель', 'Иллюстрация'],
    skills: ['Иллюстрация', 'Концепт-арт'],
    location: 'Москва',
    socialLinks: {
      instagram: 'marina_art',
      behance: 'marina_ivanova'
    },
    isVerified: true,
    followers: 12500,
    following: 230,
    createdAt: '2022-03-15'
  },
  {
    id: '2',
    username: 'alex_create',
    displayName: 'Алексей Петров',
    bio: 'Скульптор и художник. Работаю с разными материалами - от мрамора до дерева. Преподаю в художественной школе и создаю работы на заказ.',
    avatar: 'https://i.pravatar.cc/150?img=12',
    coverImage: 'https://images.unsplash.com/photo-1558618666-89916e930fdd',
    artStyles: ['Скульптура', 'Живопись'],
    skills: ['Скульптура', 'Живопись маслом'],
    location: 'Санкт-Петербург',
    socialLinks: {
      instagram: 'alex_sculptor',
      behance: 'alex_petrov'
    },
    isVerified: true,
    followers: 8300,
    following: 145,
    createdAt: '2022-06-22'
  },
  {
    id: '3',
    username: 'elena_draws',
    displayName: 'Елена Смирнова',
    bio: 'Создаю иллюстрации и концепт-арт. Специализируюсь на персонажном дизайне и фэнтези-иллюстрациях. Открыта для коммерческих проектов.',
    avatar: 'https://i.pravatar.cc/150?img=25',
    coverImage: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d',
    artStyles: ['Концепт-арт', 'Диджитал'],
    skills: ['Цифровая иллюстрация', 'Скетчи'],
    location: 'Казань',
    socialLinks: {
      instagram: 'elena_artwork',
      artstation: 'elena_smirnova'
    },
    isVerified: false,
    followers: 5100,
    following: 92,
    createdAt: '2023-01-10'
  },
  {
    id: '4',
    username: 'artmaster',
    displayName: 'Михаил Лебедев',
    bio: 'Художник-иллюстратор из Санкт-Петербурга. Специализируюсь на акварельных пейзажах и цифровых иллюстрациях. Выпускник Академии Художеств, участник международных выставок.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    coverImage: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d',
    artStyles: ['Акварель', 'Скетчинг'],
    skills: ['Портрет', 'Пейзаж'],
    location: 'Санкт-Петербург',
    socialLinks: {
      instagram: 'artmaster',
      behance: 'mikhail_lebedev'
    },
    isVerified: true,
    followers: 1250,
    following: 145,
    createdAt: '2023-01-15'
  },
  {
    id: '5',
    username: 'colorexpert',
    displayName: 'Анна Соколова',
    bio: 'Цифровой художник и иллюстратор. Создаю концепт-арты для игр и анимационных проектов. Обожаю экспериментировать с цветом и формой.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    coverImage: 'https://images.unsplash.com/photo-1579547621113-e4bb2a19bdd6',
    artStyles: ['Диджитал Арт'],
    skills: ['Концепт-арт', 'Персонажный дизайн'],
    location: 'Москва',
    socialLinks: {
      instagram: 'anna_digital',
      artstation: 'anna_sokolova'
    },
    isVerified: true,
    followers: 3400,
    following: 210,
    createdAt: '2022-08-22'
  },
  {
    id: '6',
    username: 'sculptor',
    displayName: 'Алексей Иванов',
    bio: 'Скульптор, работаю с глиной и металлом. Создаю как монументальные работы, так и миниатюры. Преподаю скульптуру в художественной школе.',
    avatar: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3',
    coverImage: 'https://images.unsplash.com/photo-1558618666-89916e930fdd',
    artStyles: ['Скульптура'],
    skills: ['Керамика', 'Металл'],
    location: 'Москва',
    socialLinks: {
      instagram: 'alex_sculptor',
      behance: 'alexey_ivanov'
    },
    isVerified: false,
    followers: 890,
    following: 132,
    createdAt: '2021-11-05'
  }
];

// Моковые данные работ для профиля (оставляем для обратной совместимости)
const PROFILE_MOCK_ARTWORKS: Artwork[] = [
  {
    id: '1',
    title: 'Закат в горах',
    description: 'Акварельная живопись вечернего заката в горах. Работа выполнена на бумаге высокого качества с использованием профессиональных акварельных красок.',
    images: ['https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&h=800&fit=crop'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&h=800&fit=crop',
    artistId: '1',
    artistName: 'Марина Иванова',
    artistAvatar: 'https://i.pravatar.cc/150?img=36',
    categories: ['Живопись'],
    tags: ['пейзаж', 'закат', 'горы'],
    medium: 'Акварель',
    dimensions: '40x30 см',
    createdYear: 2023,
    likes: 450,
    views: 1230,
    comments: 28,
    isForSale: true,
    price: 15000,
    currency: 'KZT',
    createdAt: '2023-05-12'
  },
  {
    id: '2',
    title: 'Абстрактная композиция #5',
    description: 'Абстрактная композиция с использованием акриловых красок. Исследование баланса форм и цветов в современном искусстве.',
    images: ['https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&h=800&fit=crop'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&h=800&fit=crop',
    artistId: '2',
    artistName: 'Алексей Петров',
    artistAvatar: 'https://i.pravatar.cc/150?img=12',
    categories: ['Живопись'],
    tags: ['абстракция', 'современное искусство'],
    medium: 'Акрил',
    dimensions: '60x80 см',
    createdYear: 2023,
    likes: 320,
    views: 980,
    comments: 15,
    isForSale: false,
    createdAt: '2023-06-21'
  },
  {
    id: '3',
    title: 'Портрет незнакомки',
    description: 'Портрет девушки, выполненный маслом на холсте. Работа в классическом стиле с современным подходом к цветовой гамме.',
    images: ['https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&h=800&fit=crop'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&h=800&fit=crop',
    artistId: '3',
    artistName: 'Елена Смирнова',
    artistAvatar: 'https://i.pravatar.cc/150?img=25',
    categories: ['Живопись'],
    tags: ['портрет', 'масло', 'классика'],
    medium: 'Масло',
    dimensions: '50x70 см',
    createdYear: 2023,
    likes: 280,
    views: 650,
    comments: 32,
    isForSale: true,
    price: 25000,
    currency: 'KZT',
    createdAt: '2023-04-05'
  },
  {
    id: '4',
    title: 'Городской пейзаж на закате',
    description: 'Городской пейзаж, написанный маслом, изображающий город на закате.',
    images: ['https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=800&h=800&fit=crop'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=800&h=800&fit=crop',
    artistId: '4',
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
    currency: 'KZT',
    createdAt: '2023-09-15'
  },
  {
    id: '5',
    title: 'Цифровой портрет',
    description: 'Портрет в неоновых тонах, созданный в Procreate.',
    images: ['https://images.unsplash.com/photo-1484589065579-248aad0d8b13?w=800&h=800&fit=crop'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1484589065579-248aad0d8b13?w=800&h=800&fit=crop',
    artistId: '5',
    artistName: 'Анна Соколова',
    artistAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    categories: ['Цифровое искусство'],
    tags: ['портрет', 'неон', 'цифровое'],
    medium: 'Цифровая иллюстрация',
    likes: 578,
    views: 3120,
    comments: 92,
    isForSale: false,
    createdAt: '2023-11-27'
  },
  {
    id: '6',
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
    currency: 'KZT',
    createdAt: '2023-07-03'
  },
  {
    id: '7',
    title: 'Акварельный пейзаж "Утренний туман"',
    description: 'Пейзаж, выполненный акварелью, изображающий озеро в утреннем тумане.',
    images: ['https://images.unsplash.com/photo-1508669232496-137b159c1cdb'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1508669232496-137b159c1cdb',
    artistId: '4',
    artistName: 'Михаил Лебедев',
    artistAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    categories: ['Живопись'],
    tags: ['пейзаж', 'акварель', 'природа'],
    medium: 'Акварель',
    likes: 312,
    views: 1560,
    comments: 56,
    isForSale: true,
    price: 8500,
    currency: 'KZT',
    createdAt: '2023-08-12'
  },
  {
    id: '8',
    title: 'Фантастический мир',
    description: 'Цифровая иллюстрация фантастического мира с летающими островами и необычными существами.',
    images: ['https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a',
    artistId: '1',
    artistName: 'Марина Иванова',
    artistAvatar: 'https://i.pravatar.cc/150?img=36',
    categories: ['Цифровое искусство'],
    tags: ['фэнтези', 'иллюстрация', 'цифровое'],
    medium: 'Цифровая иллюстрация',
    dimensions: '4000x2500 px',
    createdYear: 2023,
    likes: 520,
    views: 1800,
    comments: 43,
    isForSale: true,
    price: 20000,
    currency: 'KZT',
    createdAt: '2023-07-18'
  }
];

type TabType = 'portfolio' | 'about' | 'collections';

export default function ArtistProfileScreen() {
  const { id: artistId } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addMessage, hasThreadWithArtist, setActiveChat, shareArtwork } = useMessages();
  const { isFollowing: checkIsFollowing, followUser, unfollowUser, getFollowersCount, getFollowingCount } = useFollow();
  
  const [artist, setArtist] = useState<User | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('portfolio');
  const [isContactModalVisible, setIsContactModalVisible] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  
  useEffect(() => {
    const loadArtistData = async () => {
      try {
        setIsLoading(true);
        // Находим художника по ID из параметров URL
        const artistData = MOCK_ARTISTS.find(a => a.id === artistId);
        
        if (artistData) {
          setArtist(artistData);
        } else {
          // Если художник не найден в локальных данных, ищем в импортированных из artworks.ts
          // Находим работы художника и берем данные из первой работы
          const artistWorks = MOCK_ARTWORKS.filter(artwork => artwork.artistId === artistId);
          if (artistWorks.length > 0) {
            const firstWork = artistWorks[0];
            // Создаем минимальный объект художника из данных его работы
            const minimalArtist: User = {
              id: firstWork.artistId,
              username: firstWork.artistName.toLowerCase().replace(/\s+/g, '_'),
              displayName: firstWork.artistName,
              avatar: firstWork.artistAvatar,
              coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5', // Дефолтное изображение
              bio: `Художник ${firstWork.artistName}`,
              artStyles: [],
              skills: [],
              location: 'Россия',
              socialLinks: {},
              isVerified: false,
              followers: Math.floor(Math.random() * 1000) + 100,
              following: Math.floor(Math.random() * 200) + 20,
              createdAt: '2023-01-01'
            };
            setArtist(minimalArtist);
          } else {
            // Если совсем ничего не нашли, создаем заглушку художника
            console.warn(`Художник с ID ${artistId} не найден`);
            const fallbackArtist: User = {
              id: 'unknown',
              username: 'unknown_artist',
              displayName: 'Неизвестный художник',
              avatar: 'https://via.placeholder.com/150',
              coverImage: 'https://via.placeholder.com/600x200',
              bio: 'Информация о художнике отсутствует',
              artStyles: [],
              skills: [],
              location: '',
              socialLinks: {},
              isVerified: false,
              followers: 0,
              following: 0,
              createdAt: new Date().toISOString().split('T')[0]
            };
            setArtist(fallbackArtist);
          }
        }
        
        // Ищем работы художника сначала в локальных данных, потом в импортированных
        const localArtworks = PROFILE_MOCK_ARTWORKS.filter(artwork => artwork.artistId === artistId);
        const importedArtworks = MOCK_ARTWORKS.filter(artwork => artwork.artistId === artistId);
        
        // Объединяем найденные работы, убираем дубликаты по ID
        const allArtworks = [...localArtworks];
        importedArtworks.forEach(artwork => {
          if (!allArtworks.some(a => a.id === artwork.id)) {
            allArtworks.push(artwork);
          }
        });
        
        setArtworks(allArtworks);
        
        // Проверяем, подписан ли текущий пользователь на этого художника
        if (user && artistId) {
          const isUserFollowing = checkIsFollowing(String(artistId));
          setIsFollowing(isUserFollowing);
          
          // Загружаем количество подписчиков и подписок
          const followers = await getFollowersCount(String(artistId));
          const following = await getFollowingCount(String(artistId));
          
          setFollowersCount(followers);
          setFollowingCount(following);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных художника:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadArtistData();
  }, [artistId, user, checkIsFollowing, getFollowersCount, getFollowingCount]);
  
  const handleFollowToggle = async () => {
    if (!user || !artistId) return;
    
    try {
      if (isFollowing) {
        await unfollowUser(String(artistId));
        setFollowersCount(prev => Math.max(0, prev - 1));
      } else {
        await followUser(String(artistId));
        setFollowersCount(prev => prev + 1);
      }
      
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Ошибка при изменении подписки:', error);
    }
  };

  const handleMessage = () => {
    if (artist) {
      // Проверяем, существует ли уже чат с этим художником
      if (hasThreadWithArtist?.(String(artist.id))) {
        // Если чат существует, просто активируем его и переходим к нему
        setActiveChat?.(String(artist.id));
        router.push('/(tabs)/messages');
      } else {
        // Если чата еще нет, создаем новый чат с этим художником
        // Берем первую работу художника, если есть, или просто инициируем чат без работы
        if (artworks.length > 0) {
          shareArtwork?.(String(artist.id), artworks[0]);
        } else {
          // Создаем обычное сообщение без прикрепленной работы
          addMessage?.(String(artist.id), {
            content: `Здравствуйте, ${artist.displayName}! Хотел бы обсудить с вами сотрудничество.`,
            subject: 'Сотрудничество'
          });
        }
        setActiveChat?.(String(artist.id));
        router.push('/(tabs)/messages');
      }
    }
  };
  
  const renderArtworkItem = ({ item }: { item: Artwork }) => (
    <View style={styles.artworkItem}>
      <ArtworkCard 
        artwork={item} 
        compact={false} 
        onContactRequest={(artwork) => setIsContactModalVisible(true)}
      />
    </View>
  );
  
  const renderPortfolioTab = () => (
    <View style={styles.portfolioContainer}>
      {artworks.length === 0 ? (
        <ThemedView style={styles.emptyState}>
          <ThemedText style={styles.emptyStateText}>У художника пока нет работ</ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={artworks}
          renderItem={renderArtworkItem}
          numColumns={2}
          keyExtractor={(item) => `profile-artwork-${item.id}`}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.artworksContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
  
  const renderAboutTab = () => (
    <ThemedView style={styles.aboutContainer}>
      <ThemedText style={styles.bioText}>{artist?.bio}</ThemedText>
      
      {artist?.skills.length > 0 && (
        <View style={styles.infoSection}>
          <ThemedText style={styles.infoTitle}>Специализация</ThemedText>
          <View style={styles.tagsContainer}>
            {artist?.skills.map((skill, index) => (
              <View key={index} style={styles.tag}>
                <ThemedText style={styles.tagText}>{skill}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      )}
      
      {artist?.artStyles.length > 0 && (
        <View style={styles.infoSection}>
          <ThemedText style={styles.infoTitle}>Стили</ThemedText>
          <View style={styles.tagsContainer}>
            {artist?.artStyles.map((style, index) => (
              <View key={index} style={styles.tag}>
                <ThemedText style={styles.tagText}>{style}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      )}
      
      <View style={styles.infoSection}>
        <ThemedText style={styles.infoTitle}>Информация</ThemedText>
        <View style={styles.infoRow}>
          <FontAwesome name="map-marker" size={16} color="#666" />
          <ThemedText style={styles.infoText}>{artist?.location || 'Не указано'}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <FontAwesome name="calendar" size={16} color="#666" />
          <ThemedText style={styles.infoText}>На платформе с {new Date(artist?.createdAt || '').toLocaleDateString()}</ThemedText>
        </View>
      </View>
      
      {artist?.socialLinks && Object.values(artist.socialLinks).some(link => link) && (
        <View style={styles.infoSection}>
          <ThemedText style={styles.infoTitle}>Социальные сети</ThemedText>
          <View style={styles.socialLinks}>
            {artist.socialLinks.instagram && (
              <TouchableOpacity style={styles.socialButton} onPress={() => router.push(`https://instagram.com/${artist.socialLinks.instagram}`)}>
                <FontAwesome name="instagram" size={18} color="#C13584" />
                <ThemedText style={styles.socialButtonText}>Instagram</ThemedText>
              </TouchableOpacity>
            )}
            {artist.socialLinks.behance && (
              <TouchableOpacity style={styles.socialButton} onPress={() => router.push(`https://behance.net/${artist.socialLinks.behance}`)}>
                <FontAwesome name="behance" size={18} color="#1769FF" />
                <ThemedText style={styles.socialButtonText}>Behance</ThemedText>
              </TouchableOpacity>
            )}
            {artist.socialLinks.artstation && (
              <TouchableOpacity style={styles.socialButton} onPress={() => router.push(`https://artstation.com/artwork/${artist.socialLinks.artstation}`)}>
                <FontAwesome name="paint-brush" size={18} color="#13AFF0" />
                <ThemedText style={styles.socialButtonText}>ArtStation</ThemedText>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </ThemedView>
  );
  
  const renderCollectionsTab = () => (
    <ThemedView style={styles.collectionsContainer}>
      <ThemedText style={styles.emptyStateText}>У художника пока нет коллекций</ThemedText>
    </ThemedView>
  );

  const renderHeaderContent = () => (
    artist ? (
      <ProfileHeader
        user={artist}
        isCurrentUser={false}
        isFollowing={isFollowing}
        onFollow={handleFollowToggle}
        onMessage={handleMessage}
        followersCount={followersCount}
        followingCount={followingCount}
      />
    ) : null
  );

  return (
    <ThemedView style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0a7ea4" />
          <ThemedText style={styles.loadingText}>Загрузка профиля...</ThemedText>
        </View>
      ) : (
        <>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {renderHeaderContent()}
            
            {/* Вкладки */}
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'portfolio' && styles.activeTab]}
                onPress={() => setActiveTab('portfolio')}
              >
                <ThemedText style={[styles.tabText, activeTab === 'portfolio' && styles.activeTabText]}>
                  Портфолио
                </ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.tab, activeTab === 'about' && styles.activeTab]}
                onPress={() => setActiveTab('about')}
              >
                <ThemedText style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>
                  О художнике
                </ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.tab, activeTab === 'collections' && styles.activeTab]}
                onPress={() => setActiveTab('collections')}
              >
                <ThemedText style={[styles.tabText, activeTab === 'collections' && styles.activeTabText]}>
                  Коллекции
                </ThemedText>
              </TouchableOpacity>
            </View>
            
            {/* Контент вкладки */}
            <View style={styles.tabContent}>
              {activeTab === 'portfolio' && renderPortfolioTab()}
              {activeTab === 'about' && renderAboutTab()}
              {activeTab === 'collections' && renderCollectionsTab()}
            </View>
          </ScrollView>
          
          <ContactArtistModal
            visible={isContactModalVisible}
            artist={artist}
            onClose={() => setIsContactModalVisible(false)}
          />
        </>
      )}
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
  coverContainer: {
    height: 200,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  placeholderCover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0a7ea4',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 0,
    paddingHorizontal: 16,
    paddingBottom: 16,
    marginTop: -50,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#1DA1F2',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statDivider: {
    height: 24,
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  followButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 16,
  },
  followButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0a7ea4',
  },
  followingButtonText: {
    color: '#0a7ea4',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#0a7ea4',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#0a7ea4',
  },
  tabContent: {
    flex: 1,
  },
  portfolioContainer: {
    padding: 16,
  },
  aboutContainer: {
    padding: 16,
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  infoSection: {
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#0a7ea4',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 8,
  },
  socialLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  socialButtonText: {
    fontSize: 14,
    marginLeft: 6,
  },
  collectionsContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  artworksContainer: {
    padding: 16,
  },
  artworkItem: {
    flex: 1,
    padding: 4,
    width: '48%',
    marginBottom: 12,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
}); 