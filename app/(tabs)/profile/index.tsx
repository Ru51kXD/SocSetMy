import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Text, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ProfileHeader } from '@/app/components/common/ProfileHeader';
import { GalleryGrid } from '@/app/components/gallery/GalleryGrid';
import { EditProfileModal } from '@/app/components/common/EditProfileModal';
import { User, Artwork } from '@/app/models/types';
import { useAuth } from '@/app/context/AuthContext';
import { useArtworks } from '@/app/context/ArtworkContext';
import { LinearGradient } from 'expo-linear-gradient';
import { UploadArtworkModal } from '@/app/components/artwork/UploadArtworkModal';

// Моковые данные для сохраненных и понравившихся работ - эти данные будут использоваться только для демо
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

type TabType = 'works' | 'saved' | 'liked';

export default function ProfileScreen() {
  const { user, logout } = useAuth(); // Получаем пользователя и функцию выхода из AuthContext
  const { userArtworks, isLoading: isLoadingArtworks } = useArtworks(); // Получаем работы пользователя из ArtworkContext
  
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

  // Отображение содержимого активной вкладки
  const renderTabContent = () => {
    // Для вкладки работ используем данные из контекста
    if (activeTab === 'works') {
      // Проверяем, есть ли у пользователя работы
      if (userArtworks.length === 0) {
        return (
          <EmptyState 
            activeTab={activeTab} 
            onUpload={handleOpenUploadModal} 
          />
        );
      }
      
      return <GalleryGrid artworks={userArtworks} compact={true} />;
    }
    
    // Для демо аккаунтов показываем моковые данные, для новых пользователей - пустое состояние
    if (isNewUser) {
      return <EmptyState activeTab={activeTab} />;
    }
    
    switch (activeTab) {
      case 'saved':
        return <GalleryGrid artworks={SAVED_ARTWORKS} compact={true} />;
      case 'liked':
        return <GalleryGrid artworks={LIKED_ARTWORKS} compact={true} />;
      default:
        return null;
    }
  };

  // Если данные загружаются, показываем индикатор загрузки
  if (isLoadingArtworks) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ThemedText>Загрузка...</ThemedText>
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
        
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'works' && styles.activeTab]}
            onPress={() => setActiveTab('works')}
          >
            <FontAwesome 
              name="image" 
              size={22}
              color={activeTab === 'works' ? '#0a7ea4' : '#888'} 
            />
            <ThemedText 
              style={[styles.tabText, activeTab === 'works' && styles.activeTabText]}
            >
              Работы
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'saved' && styles.activeTab]}
            onPress={() => setActiveTab('saved')}
          >
            <FontAwesome 
              name="bookmark" 
              size={22} 
              color={activeTab === 'saved' ? '#0a7ea4' : '#888'} 
            />
            <ThemedText 
              style={[styles.tabText, activeTab === 'saved' && styles.activeTabText]}
            >
              Сохраненные
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'liked' && styles.activeTab]}
            onPress={() => setActiveTab('liked')}
          >
            <FontAwesome 
              name="heart" 
              size={22} 
              color={activeTab === 'liked' ? '#0a7ea4' : '#888'} 
            />
            <ThemedText 
              style={[styles.tabText, activeTab === 'liked' && styles.activeTabText]}
            >
              Понравившиеся
            </ThemedText>
          </TouchableOpacity>
        </View>
        
        <View style={styles.contentContainer}>
          {renderTabContent()}
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
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 14,
    marginLeft: 6,
    color: '#888',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#0a7ea4',
  },
  activeTabText: {
    color: '#0a7ea4',
    fontWeight: '500',
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
});