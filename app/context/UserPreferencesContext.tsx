import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Artwork, User } from '@/app/models/types';
import { useAuth } from './AuthContext';

// Ключи для хранения данных лайков и избранного
const LIKED_ARTWORKS_KEY = 'art_community_liked_artworks';
const SAVED_ARTWORKS_KEY = 'art_community_saved_artworks';

// Интерфейс для контекста предпочтений пользователя
interface UserPreferencesContextType {
  likedArtworks: Artwork[];
  savedArtworks: Artwork[];
  isLoading: boolean;
  likeArtwork: (artwork: Artwork) => Promise<void>;
  unlikeArtwork: (artworkId: string) => Promise<void>;
  saveArtwork: (artwork: Artwork) => Promise<void>;
  unsaveArtwork: (artworkId: string) => Promise<void>;
  isArtworkLiked: (artworkId: string) => boolean;
  isArtworkSaved: (artworkId: string) => boolean;
  clearUserPreferences: () => Promise<void>;
}

// Создаем контекст
const UserPreferencesContext = createContext<UserPreferencesContextType | null>(null);

// Хук для использования контекста
export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};

// Провайдер контекста
export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [likedArtworks, setLikedArtworks] = useState<Artwork[]>([]);
  const [savedArtworks, setSavedArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Загружаем данные при инициализации или смене пользователя
  useEffect(() => {
    if (user) {
      loadUserPreferences();
    } else {
      // Если пользователь вышел из системы, очищаем данные
      setLikedArtworks([]);
      setSavedArtworks([]);
      setIsLoading(false);
    }
  }, [user]);

  // Загрузка данных из хранилища
  const loadUserPreferences = async () => {
    try {
      setIsLoading(true);
      if (!user) return;

      const userId = user.id;
      const likedKey = `${LIKED_ARTWORKS_KEY}_${userId}`;
      const savedKey = `${SAVED_ARTWORKS_KEY}_${userId}`;

      const [likedData, savedData] = await Promise.all([
        AsyncStorage.getItem(likedKey),
        AsyncStorage.getItem(savedKey)
      ]);

      if (likedData) {
        setLikedArtworks(JSON.parse(likedData));
      }

      if (savedData) {
        setSavedArtworks(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Ошибка при загрузке предпочтений пользователя:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Сохранение лайкнутых работ
  const saveLikedArtworks = async (artworks: Artwork[]) => {
    try {
      if (!user) return;
      const userId = user.id;
      const key = `${LIKED_ARTWORKS_KEY}_${userId}`;
      await AsyncStorage.setItem(key, JSON.stringify(artworks));
    } catch (error) {
      console.error('Ошибка при сохранении лайкнутых работ:', error);
      throw error;
    }
  };

  // Сохранение избранных работ
  const saveSavedArtworks = async (artworks: Artwork[]) => {
    try {
      if (!user) return;
      const userId = user.id;
      const key = `${SAVED_ARTWORKS_KEY}_${userId}`;
      await AsyncStorage.setItem(key, JSON.stringify(artworks));
    } catch (error) {
      console.error('Ошибка при сохранении избранных работ:', error);
      throw error;
    }
  };

  // Поставить лайк работе
  const likeArtwork = async (artwork: Artwork) => {
    try {
      if (!user) return;
      // Проверяем, не лайкнута ли уже работа
      if (isArtworkLiked(artwork.id)) return;

      const updatedLikes = [...likedArtworks, artwork];
      setLikedArtworks(updatedLikes);
      await saveLikedArtworks(updatedLikes);
    } catch (error) {
      console.error('Ошибка при лайке работы:', error);
      throw error;
    }
  };

  // Убрать лайк с работы
  const unlikeArtwork = async (artworkId: string) => {
    try {
      if (!user) return;
      const updatedLikes = likedArtworks.filter(artwork => artwork.id !== artworkId);
      setLikedArtworks(updatedLikes);
      await saveLikedArtworks(updatedLikes);
    } catch (error) {
      console.error('Ошибка при удалении лайка работы:', error);
      throw error;
    }
  };

  // Сохранить работу в избранное
  const saveArtwork = async (artwork: Artwork) => {
    try {
      if (!user) return;
      // Проверяем, не сохранена ли уже работа
      if (isArtworkSaved(artwork.id)) return;

      const updatedSaved = [...savedArtworks, artwork];
      setSavedArtworks(updatedSaved);
      await saveSavedArtworks(updatedSaved);
    } catch (error) {
      console.error('Ошибка при сохранении работы в избранное:', error);
      throw error;
    }
  };

  // Удалить работу из избранного
  const unsaveArtwork = async (artworkId: string) => {
    try {
      if (!user) return;
      const updatedSaved = savedArtworks.filter(artwork => artwork.id !== artworkId);
      setSavedArtworks(updatedSaved);
      await saveSavedArtworks(updatedSaved);
    } catch (error) {
      console.error('Ошибка при удалении работы из избранного:', error);
      throw error;
    }
  };

  // Проверить, лайкнута ли работа пользователем
  const isArtworkLiked = (artworkId: string): boolean => {
    return likedArtworks.some(artwork => artwork.id === artworkId);
  };

  // Проверить, сохранена ли работа в избранное
  const isArtworkSaved = (artworkId: string): boolean => {
    return savedArtworks.some(artwork => artwork.id === artworkId);
  };

  // Очистить все предпочтения пользователя
  const clearUserPreferences = async () => {
    try {
      if (!user) return;
      const userId = user.id;
      const likedKey = `${LIKED_ARTWORKS_KEY}_${userId}`;
      const savedKey = `${SAVED_ARTWORKS_KEY}_${userId}`;

      await Promise.all([
        AsyncStorage.removeItem(likedKey),
        AsyncStorage.removeItem(savedKey)
      ]);

      setLikedArtworks([]);
      setSavedArtworks([]);
    } catch (error) {
      console.error('Ошибка при очистке предпочтений пользователя:', error);
      throw error;
    }
  };

  const contextValue: UserPreferencesContextType = {
    likedArtworks,
    savedArtworks,
    isLoading,
    likeArtwork,
    unlikeArtwork,
    saveArtwork,
    unsaveArtwork,
    isArtworkLiked,
    isArtworkSaved,
    clearUserPreferences
  };

  return (
    <UserPreferencesContext.Provider value={contextValue}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export default UserPreferencesContext; 