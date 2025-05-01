import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/app/models/types';

// Ключи для хранения данных пользователя
const USER_STORAGE_KEY = 'art_community_user';
const REGISTERED_USERS_KEY = 'art_community_registered_users';

// Интерфейс для данных логина
interface LoginData {
  username: string;
  password: string;
}

// Интерфейс для контекста аутентификации
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (loginData: LoginData) => Promise<void>;
  register: (userData: User, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

// Создаем контекст
const AuthContext = createContext<AuthContextType | null>(null);

// Хук для использования контекста
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Интерфейс для хранения учетных данных пользователя
interface UserCredentials {
  username: string;
  password: string;
  userId: string;
}

// Провайдер контекста
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Загружаем данные пользователя при инициализации
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных пользователя:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Получение списка зарегистрированных пользователей
  const getRegisteredUsers = async (): Promise<UserCredentials[]> => {
    try {
      const usersData = await AsyncStorage.getItem(REGISTERED_USERS_KEY);
      if (usersData) {
        return JSON.parse(usersData);
      }
      return [];
    } catch (error) {
      console.error('Ошибка при получении списка пользователей:', error);
      return [];
    }
  };

  // Сохранение списка зарегистрированных пользователей
  const saveRegisteredUsers = async (users: UserCredentials[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Ошибка при сохранении списка пользователей:', error);
      throw error;
    }
  };

  // Функция для входа
  const login = async (loginData: LoginData) => {
    try {
      setIsLoading(true);
      
      // Получаем список зарегистрированных пользователей
      const registeredUsers = await getRegisteredUsers();
      
      // Ищем пользователя по логину и паролю
      const foundUser = registeredUsers.find(
        u => u.username === loginData.username && u.password === loginData.password
      );
      
      if (!foundUser) {
        throw new Error('Пользователь не зарегистрирован или введены неверные данные');
      }
      
      // Получаем полные данные пользователя
      const usersData = await AsyncStorage.getItem(REGISTERED_USERS_KEY + '_data');
      if (usersData) {
        const users: User[] = JSON.parse(usersData);
        const userData = users.find(u => u.id === foundUser.userId);
        
        if (userData) {
          await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
          setUser(userData);
          setIsAuthenticated(true);
          return;
        }
      }
      
      throw new Error('Ошибка при загрузке данных пользователя');
    } catch (error) {
      console.error('Ошибка при входе:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для регистрации
  const register = async (userData: User, password: string) => {
    try {
      setIsLoading(true);
      
      // Получаем список зарегистрированных пользователей
      const registeredUsers = await getRegisteredUsers();
      
      // Проверяем, не занят ли уже логин
      if (registeredUsers.some(u => u.username === userData.username)) {
        throw new Error('Пользователь с таким логином уже существует');
      }
      
      // Сохраняем учетные данные пользователя
      const userCredentials: UserCredentials = {
        username: userData.username,
        password: password,
        userId: userData.id
      };
      
      await saveRegisteredUsers([...registeredUsers, userCredentials]);
      
      // Сохраняем полные данные пользователя
      const usersData = await AsyncStorage.getItem(REGISTERED_USERS_KEY + '_data');
      let users: User[] = [];
      
      if (usersData) {
        users = JSON.parse(usersData);
      }
      
      await AsyncStorage.setItem(
        REGISTERED_USERS_KEY + '_data', 
        JSON.stringify([...users, userData])
      );
      
      // Сохраняем текущего пользователя
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для выхода
  const logout = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Контекст для провайдера
  const contextValue: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 