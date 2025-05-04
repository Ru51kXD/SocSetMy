import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Text, Alert, ActivityIndicator, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ProfileHeader } from '@/app/components/common/ProfileHeader';
import { GalleryGrid } from '@/app/components/gallery/GalleryGrid';
import { EditProfileModal } from '@/app/components/common/EditProfileModal';
import { ArtworkCard } from '@/app/components/common/ArtworkCard';
import { User, Artwork } from '@/app/models/types';
import { useAuth } from '@/app/context/AuthContext';
import { useArtworks } from '@/app/context/ArtworkContext';
import { LinearGradient } from 'expo-linear-gradient';
import { UploadArtworkModal } from '@/app/components/artwork/UploadArtworkModal';
import { useUserPreferences } from '@/app/context/UserPreferencesContext';

// Моковые данные для сохраненных и понравившихся работ - эти данные будут использоваться только для демо
const SAVED_ARTWORKS: Artwork[] = [
  {
    id: '8',
    title: 'Фантастический мир',
    description: 'Цифровая иллюстрация фантастического мира с летающими островами.',
    images: ['https://images.unsplash.com/photo-1484589065579-248aad0d8b13?w=800&h=800&fit=crop'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1484589065579-248aad0d8b13?w=800&h=800&fit=crop',
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
    images: ['https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=800&h=800&fit=crop'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=800&h=800&fit=crop',
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

const LIKED_ARTWORKS: Artwork[] = [
  {
    id: '3',
    title: 'Портрет незнакомки',
    description: 'Портрет девушки, выполненный маслом на холсте.',
    images: ['https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&h=800&fit=crop'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&h=800&fit=crop',
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
    images: ['https://images.unsplash.com/photo-1484589065579-248aad0d8b13?w=800&h=800&fit=crop'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1484589065579-248aad0d8b13?w=800&h=800&fit=crop',
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

// Компонент для отображения пустого состояния
function EmptyState({ activeTab, onUpload }: { activeTab: TabType, onUpload?: () => void }) {
  let icon = 'image';
  let title = 'У вас пока нет работ';
  let message = 'Добавьте свои художественные работы, чтобы они отображались здесь.';
  
  if (activeTab === 'saved') {
    icon = 'bookmark';
    title = 'Нет сохраненных работ';
    message = 'Сохраняйте интересные работы, нажимая на значок закладки.';
  } else if (activeTab === 'liked') {
    icon = 'heart';
    title = 'Нет понравившихся работ';
    message = 'Отмечайте понравившиеся работы, нажимая на значок сердца.';
  }
  
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <FontAwesome name={icon} size={40} color="#ccc" />
      </View>
      <ThemedText style={styles.emptyTitle}>{title}</ThemedText>
      <ThemedText style={styles.emptyMessage}>{message}</ThemedText>
      
      {activeTab === 'works' && onUpload && (
        <TouchableOpacity style={styles.addButton} onPress={onUpload}>
          <LinearGradient
            colors={['#0a7ea4', '#0a6ea4']}
            style={styles.addButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.addButtonContent}>
              <FontAwesome name="plus" size={16} color="#fff" style={styles.addButtonIcon} />
              <ThemedText style={styles.addButtonText}>Загрузить работу</ThemedText>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}

// Обновляем тип для вкладок профиля
type TabType = 'works' | 'liked' | 'saved';

export default function ProfileScreen() {
  const { user, logout } = useAuth(); // Получаем пользователя и функцию выхода из AuthContext
  const { userArtworks, isLoading: isLoadingArtworks } = useArtworks(); // Получаем работы пользователя из ArtworkContext
  const { likedArtworks, savedArtworks, isLoading: isLoadingPreferences } = useUserPreferences(); // Получаем лайкнутые и сохраненные работы
  
  const [activeTab, setActiveTab] = useState<TabType>('works');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  
  // Определяем, является ли пользователь новым (только что зарегистрированным)
  const isNewUser = !!(user && user.id.startsWith('user-'));

  // Устанавливаем пользователя из AuthContext при инициализации
  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user]);

  // Обработчик редактирования профиля
  const handleEditProfile = () => {
    setIsEditModalVisible(true);
  };

  // Обработчик выхода из аккаунта
  const handleLogout = () => {
    Alert.alert(
      'Выход из аккаунта',
      'Вы уверены, что хотите выйти?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Выйти', 
          onPress: async () => {
            try {
              await logout();
              // После выхода пользователь будет автоматически перенаправлен на экран авторизации
              // благодаря логике AuthenticationGuard в _layout.tsx
            } catch (error) {
              console.error('Ошибка при выходе из аккаунта:', error);
              Alert.alert('Ошибка', 'Не удалось выйти из аккаунта. Пожалуйста, попробуйте еще раз.');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  // Обработчик сохранения изменений профиля
  const handleSaveProfile = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    // Здесь можно добавить логику для сохранения обновленных данных в API или AuthContext
  };

  // Обработчик открытия модального окна загрузки работы
  const handleOpenUploadModal = () => {
    setIsUploadModalVisible(true);
  };

  // Обработчик успешной загрузки работы
  const handleUploadSuccess = () => {
    // При необходимости здесь можно добавить дополнительную логику
  };

  // Функция для отображения произведений в зависимости от активной вкладки
  const getActiveTabArtworks = () => {
    switch (activeTab) {
      case 'works':
        return userArtworks;
      case 'liked':
        return likedArtworks;
      case 'saved':
        return savedArtworks;
      default:
        return userArtworks;
    }
  };

  // Функция получения текста для пустого экрана
  const getEmptyTabText = () => {
    switch (activeTab) {
      case 'works':
        return 'У вас пока нет загруженных работ';
      case 'liked':
        return 'У вас пока нет работ, которые вам понравились';
      case 'saved':
        return 'У вас пока нет сохраненных работ';
      default:
        return 'Нет данных для отображения';
    }
  };

  // Если данные загружаются, показываем индикатор загрузки
  if (isLoadingArtworks || isLoadingPreferences) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0a7ea4" />
        <ThemedText style={styles.loadingText}>Загрузка работ...</ThemedText>
      </View>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader 
          user={currentUser}
          isCurrentUser={true}
          onEditProfile={handleEditProfile}
        />
        
        {/* Кнопка выхода из аккаунта */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <FontAwesome name="sign-out" size={18} color="#e74c3c" style={styles.logoutIcon} />
          <ThemedText style={styles.logoutText}>Выйти из аккаунта</ThemedText>
        </TouchableOpacity>
        
        {/* Вкладки профиля */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'works' && styles.activeTab]}
            onPress={() => setActiveTab('works')}
          >
            <ThemedText style={[styles.tabText, activeTab === 'works' && styles.activeTabText]}>
              Работы
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'liked' && styles.activeTab]}
            onPress={() => setActiveTab('liked')}
          >
            <ThemedText style={[styles.tabText, activeTab === 'liked' && styles.activeTabText]}>
              Понравившиеся
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
            onPress={() => setActiveTab('saved')}
          >
            <ThemedText style={[styles.tabText, activeTab === 'saved' && styles.activeTabText]}>
              Сохраненные
            </ThemedText>
          </TouchableOpacity>
        </View>
        
        {/* Отображение работ выбранной вкладки */}
        <View style={styles.contentContainer}>
          {getActiveTabArtworks().length > 0 ? (
            <View style={styles.artworksGrid}>
              {getActiveTabArtworks().map(item => (
                <View 
                  key={`${activeTab}-artwork-${item.id}`}
                  style={styles.artworkItem}
                >
                  <ArtworkCard artwork={item} compact />
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <FontAwesome name="image" size={64} color="#ccc" />
              <ThemedText style={styles.emptyStateText}>{getEmptyTabText()}</ThemedText>
              {activeTab === 'works' && (
                <TouchableOpacity 
                  style={styles.addButton} 
                  onPress={() => setIsUploadModalVisible(true)}
                >
                  <ThemedText style={styles.addButtonText}>Загрузить работу</ThemedText>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Плавающая кнопка для добавления работы */}
      {activeTab === 'works' && (
        <TouchableOpacity 
          style={styles.floatingButton}
          onPress={handleOpenUploadModal}
        >
          <LinearGradient
            colors={['#0a7ea4', '#0a6ea4']}
            style={styles.floatingButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <FontAwesome name="plus" size={22} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      )}
      
      {/* Модальное окно редактирования профиля */}
      {isEditModalVisible && currentUser && (
        <EditProfileModal
          visible={isEditModalVisible}
          user={currentUser}
          onSave={handleSaveProfile}
          onClose={() => setIsEditModalVisible(false)}
        />
      )}
      
      {/* Модальное окно загрузки работы */}
      <UploadArtworkModal 
        visible={isUploadModalVisible}
        onClose={() => setIsUploadModalVisible(false)}
        onSuccess={handleUploadSuccess}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
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
    fontWeight: '500',
  },
  activeTabText: {
    color: '#0a7ea4',
    fontWeight: '600',
  },
  contentContainer: {
    paddingVertical: 16,
    flex: 1,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    maxWidth: 270,
    lineHeight: 20,
  },
  addButton: {
    marginTop: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  addButtonGradient: {
    padding: 12,
    borderRadius: 8,
  },
  addButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonIcon: {
    marginRight: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  floatingButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e74c3c',
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#e74c3c',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
    color: '#888',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    maxWidth: 270,
    lineHeight: 20,
  },
  artworksGrid: {
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  artworkItem: {
    width: '48%',
    marginBottom: 16,
  },
});