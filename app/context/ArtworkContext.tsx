import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Artwork, User } from '@/app/models/types';
import { useAuth } from './AuthContext';

// Ключ для хранения работ пользователей
const ARTWORKS_STORAGE_KEY = 'art_community_artworks';

// Интерфейс для контекста работ
interface ArtworkContextType {
  userArtworks: Artwork[];
  allArtworks: Artwork[];
  isLoading: boolean;
  addArtwork: (artwork: Artwork) => Promise<void>;
  removeArtwork: (artworkId: string) => Promise<void>;
  getUserArtworks: (userId: string) => Artwork[];
  searchArtworks: (query: string) => Artwork[];
}

// Создаем контекст
const ArtworkContext = createContext<ArtworkContextType | null>(null);

// Хук для использования контекста
export const useArtworks = () => {
  const context = useContext(ArtworkContext);
  if (!context) {
    throw new Error('useArtworks must be used within an ArtworkProvider');
  }
  return context;
};

// Провайдер контекста
export const ArtworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [allArtworks, setAllArtworks] = useState<Artwork[]>([]);
  const [userArtworks, setUserArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Загружаем работы при инициализации
  useEffect(() => {
    loadArtworks();
  }, []);

  // Обновляем список работ текущего пользователя при изменении пользователя
  useEffect(() => {
    if (user) {
      const userWorks = allArtworks.filter(artwork => artwork.artistId === user.id);
      setUserArtworks(userWorks);
    } else {
      setUserArtworks([]);
    }
  }, [user, allArtworks]);

  // Загрузка работ из хранилища
  const loadArtworks = async () => {
    try {
      setIsLoading(true);
      const storedArtworks = await AsyncStorage.getItem(ARTWORKS_STORAGE_KEY);
      if (storedArtworks) {
        const parsedArtworks = JSON.parse(storedArtworks);
        setAllArtworks(parsedArtworks);
        
        if (user) {
          const userWorks = parsedArtworks.filter((artwork: Artwork) => artwork.artistId === user.id);
          setUserArtworks(userWorks);
        }
      }
    } catch (error) {
      console.error('Ошибка при загрузке работ:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Сохранение работ в хранилище
  const saveArtworks = async (artworks: Artwork[]) => {
    try {
      await AsyncStorage.setItem(ARTWORKS_STORAGE_KEY, JSON.stringify(artworks));
    } catch (error) {
      console.error('Ошибка при сохранении работ:', error);
      throw error;
    }
  };

  // Добавление новой работы
  const addArtwork = async (artwork: Artwork) => {
    try {
      const updatedArtworks = [...allArtworks, artwork];
      await saveArtworks(updatedArtworks);
      setAllArtworks(updatedArtworks);
      
      if (user && artwork.artistId === user.id) {
        setUserArtworks([...userArtworks, artwork]);
      }
    } catch (error) {
      console.error('Ошибка при добавлении работы:', error);
      throw error;
    }
  };

  // Удаление работы
  const removeArtwork = async (artworkId: string) => {
    try {
      const updatedArtworks = allArtworks.filter(artwork => artwork.id !== artworkId);
      await saveArtworks(updatedArtworks);
      setAllArtworks(updatedArtworks);
      
      if (user) {
        const updatedUserArtworks = userArtworks.filter(artwork => artwork.id !== artworkId);
        setUserArtworks(updatedUserArtworks);
      }
    } catch (error) {
      console.error('Ошибка при удалении работы:', error);
      throw error;
    }
  };

  // Получение работ пользователя по ID
  const getUserArtworks = (userId: string): Artwork[] => {
    return allArtworks.filter(artwork => artwork.artistId === userId);
  };

  // Поиск работ по запросу
  const searchArtworks = (query: string): Artwork[] => {
    if (!query.trim()) return allArtworks;
    
    const lowerQuery = query.toLowerCase();
    return allArtworks.filter(artwork => 
      artwork.title.toLowerCase().includes(lowerQuery) ||
      artwork.description.toLowerCase().includes(lowerQuery) ||
      artwork.artistName.toLowerCase().includes(lowerQuery) ||
      artwork.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      artwork.categories.some(category => category.toLowerCase().includes(lowerQuery))
    );
  };

  // Контекст для провайдера
  const contextValue: ArtworkContextType = {
    userArtworks,
    allArtworks,
    isLoading,
    addArtwork,
    removeArtwork,
    getUserArtworks,
    searchArtworks
  };

  return (
    <ArtworkContext.Provider value={contextValue}>
      {children}
    </ArtworkContext.Provider>
  );
};

export default ArtworkContext; 