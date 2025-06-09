import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/app/models/types';
import { useAuth } from './AuthContext';

// Ключи для хранения данных подписок
const FOLLOWING_KEY = 'art_community_following';
const FOLLOWERS_KEY = 'art_community_followers';

// Интерфейс для контекста подписок
interface FollowContextType {
  following: string[]; // ID пользователей, на которых подписан текущий пользователь
  followers: string[]; // ID пользователей, подписанных на текущего пользователя
  isLoading: boolean;
  followUser: (userId: string) => Promise<void>;
  unfollowUser: (userId: string) => Promise<void>;
  isFollowing: (userId: string) => boolean;
  getFollowersCount: (userId: string) => Promise<number>;
  getFollowingCount: (userId: string) => Promise<number>;
  clearFollowData: () => Promise<void>;
}

// Создаем контекст
const FollowContext = createContext<FollowContextType | null>(null);

// Хук для использования контекста
export const useFollow = () => {
  const context = useContext(FollowContext);
  if (!context) {
    throw new Error('useFollow must be used within a FollowProvider');
  }
  return context;
};

// Провайдер контекста
export const FollowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [following, setFollowing] = useState<string[]>([]);
  const [followers, setFollowers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Загружаем данные при инициализации или смене пользователя
  useEffect(() => {
    if (user) {
      loadFollowData();
    } else {
      // Если пользователь вышел из системы, очищаем данные
      setFollowing([]);
      setFollowers([]);
      setIsLoading(false);
    }
  }, [user]);

  // Загрузка данных из хранилища
  const loadFollowData = async () => {
    try {
      setIsLoading(true);
      if (!user) return;

      const userId = user.id;
      const followingKey = `${FOLLOWING_KEY}_${userId}`;
      const followersKey = `${FOLLOWERS_KEY}_${userId}`;

      const [followingData, followersData] = await Promise.all([
        AsyncStorage.getItem(followingKey),
        AsyncStorage.getItem(followersKey)
      ]);

      if (followingData) {
        setFollowing(JSON.parse(followingData));
      }

      if (followersData) {
        setFollowers(JSON.parse(followersData));
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных подписок:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Сохранение данных о подписках
  const saveFollowingData = async (followingList: string[]) => {
    try {
      if (!user) return;
      const userId = user.id;
      const key = `${FOLLOWING_KEY}_${userId}`;
      await AsyncStorage.setItem(key, JSON.stringify(followingList));
    } catch (error) {
      console.error('Ошибка при сохранении данных о подписках:', error);
      throw error;
    }
  };

  // Сохранение данных о подписчиках
  const saveFollowersData = async (followersList: string[]) => {
    try {
      if (!user) return;
      const userId = user.id;
      const key = `${FOLLOWERS_KEY}_${userId}`;
      await AsyncStorage.setItem(key, JSON.stringify(followersList));
    } catch (error) {
      console.error('Ошибка при сохранении данных о подписчиках:', error);
      throw error;
    }
  };

  // Добавление пользователя в подписки текущего пользователя
  // и добавление текущего пользователя в подписчики целевого пользователя
  const followUser = async (targetUserId: string) => {
    try {
      if (!user) return;
      if (isFollowing(targetUserId)) return;

      // Добавляем целевого пользователя в подписки текущего
      const updatedFollowing = [...following, targetUserId];
      setFollowing(updatedFollowing);
      await saveFollowingData(updatedFollowing);

      // Добавляем текущего пользователя в подписчики целевого
      const targetFollowersKey = `${FOLLOWERS_KEY}_${targetUserId}`;
      const targetFollowersData = await AsyncStorage.getItem(targetFollowersKey);
      let targetFollowers: string[] = [];
      
      if (targetFollowersData) {
        targetFollowers = JSON.parse(targetFollowersData);
      }

      if (!targetFollowers.includes(user.id)) {
        targetFollowers.push(user.id);
        await AsyncStorage.setItem(targetFollowersKey, JSON.stringify(targetFollowers));
      }
    } catch (error) {
      console.error('Ошибка при подписке на пользователя:', error);
      throw error;
    }
  };

  // Удаление пользователя из подписок текущего пользователя
  // и удаление текущего пользователя из подписчиков целевого пользователя
  const unfollowUser = async (targetUserId: string) => {
    try {
      if (!user) return;

      // Удаляем целевого пользователя из подписок текущего
      const updatedFollowing = following.filter(id => id !== targetUserId);
      setFollowing(updatedFollowing);
      await saveFollowingData(updatedFollowing);

      // Удаляем текущего пользователя из подписчиков целевого
      const targetFollowersKey = `${FOLLOWERS_KEY}_${targetUserId}`;
      const targetFollowersData = await AsyncStorage.getItem(targetFollowersKey);
      
      if (targetFollowersData) {
        let targetFollowers = JSON.parse(targetFollowersData);
        targetFollowers = targetFollowers.filter((id: string) => id !== user.id);
        await AsyncStorage.setItem(targetFollowersKey, JSON.stringify(targetFollowers));
      }
    } catch (error) {
      console.error('Ошибка при отписке от пользователя:', error);
      throw error;
    }
  };

  // Проверка, подписан ли текущий пользователь на указанного пользователя
  const isFollowing = (userId: string): boolean => {
    return following.includes(userId);
  };

  // Получение количества подписчиков для указанного пользователя
  const getFollowersCount = async (userId: string): Promise<number> => {
    try {
      const followersKey = `${FOLLOWERS_KEY}_${userId}`;
      const followersData = await AsyncStorage.getItem(followersKey);
      
      if (followersData) {
        const followersList = JSON.parse(followersData);
        return followersList.length;
      }
      
      return 0;
    } catch (error) {
      console.error('Ошибка при получении количества подписчиков:', error);
      return 0;
    }
  };

  // Получение количества подписок для указанного пользователя
  const getFollowingCount = async (userId: string): Promise<number> => {
    try {
      const followingKey = `${FOLLOWING_KEY}_${userId}`;
      const followingData = await AsyncStorage.getItem(followingKey);
      
      if (followingData) {
        const followingList = JSON.parse(followingData);
        return followingList.length;
      }
      
      return 0;
    } catch (error) {
      console.error('Ошибка при получении количества подписок:', error);
      return 0;
    }
  };

  // Очистка всех данных о подписках текущего пользователя
  const clearFollowData = async () => {
    try {
      if (!user) return;
      const userId = user.id;
      const followingKey = `${FOLLOWING_KEY}_${userId}`;
      const followersKey = `${FOLLOWERS_KEY}_${userId}`;

      await Promise.all([
        AsyncStorage.removeItem(followingKey),
        AsyncStorage.removeItem(followersKey)
      ]);

      setFollowing([]);
      setFollowers([]);
    } catch (error) {
      console.error('Ошибка при очистке данных о подписках:', error);
      throw error;
    }
  };

  const contextValue: FollowContextType = {
    following,
    followers,
    isLoading,
    followUser,
    unfollowUser,
    isFollowing,
    getFollowersCount,
    getFollowingCount,
    clearFollowData
  };

  return (
    <FollowContext.Provider value={contextValue}>
      {children}
    </FollowContext.Provider>
  );
};

export default FollowContext; 