import React, { createContext, useContext, useState, useEffect } from 'react';
import { Message, MessageThread, MessageStore, User, Artwork } from '@/app/models/types';
import { MOCK_ARTWORKS } from '@/app/data/artworks';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Создаем константу для ключа хранилища
const MESSAGES_STORAGE_KEY = 'art_community_messages';

// Начальные данные для чатов
const initialThreads: MessageThread[] = [
  {
    id: '1',
    artist: {
      id: '2',
      username: 'marina_art',
      displayName: 'Марина Иванова',
      avatar: 'https://i.pravatar.cc/150?img=36',
      bio: 'Современный художник, работающий в стиле абстрактного экспрессионизма.',
      artStyles: ['Абстракция'],
      followers: 2340,
      following: 128,
      createdAt: '2021-06-10',
      socialLinks: {}
    },
    messages: [
      {
        id: '1-1',
        senderId: 'current-user',
        receiverId: '2',
        content: 'Здравствуйте! Интересует ваша работа "Абстрактная композиция #5". Она все ещё доступна для покупки?',
        timestamp: '2023-07-15T12:30:00',
        isRead: true,
        subject: 'Вопрос о картине "Абстрактная композиция #5"'
      },
      {
        id: '1-2',
        senderId: '2',
        receiverId: 'current-user',
        content: 'Да, эта работа доступна для покупки. Могу предложить доставку по всей России.',
        timestamp: '2023-07-15T14:30:00',
        isRead: false
      }
    ],
    lastMessage: 'Да, эта работа доступна для покупки. Могу предложить доставку по всей России.',
    unread: true,
    date: '2023-07-15T14:30:00'
  },
  {
    id: '2',
    artist: {
      id: '3',
      username: 'elena_sketch',
      displayName: 'Елена Смирнова',
      avatar: 'https://i.pravatar.cc/150?img=25',
      bio: 'Художник-иллюстратор. Рисую для книг, журналов и рекламы.',
      artStyles: ['Иллюстрация'],
      followers: 1560,
      following: 312,
      createdAt: '2022-02-15',
      socialLinks: {}
    },
    messages: [
      {
        id: '2-1',
        senderId: 'current-user',
        receiverId: '3',
        content: 'Добрый день! Рассматриваю возможность заказа иллюстраций для детской книги. Какие у вас расценки?',
        timestamp: '2023-07-12T09:15:00',
        isRead: true,
        subject: 'Заказ иллюстраций для детской книги'
      },
      {
        id: '2-2',
        senderId: '3',
        receiverId: 'current-user',
        content: 'Спасибо за интерес к моим работам! Какие именно иллюстрации вас заинтересовали?',
        timestamp: '2023-07-12T10:15:00',
        isRead: true
      }
    ],
    lastMessage: 'Спасибо за интерес к моим работам! Какие именно иллюстрации вас заинтересовали?',
    unread: false,
    date: '2023-07-12T10:15:00'
  },
  {
    id: '3',
    artist: {
      id: '6',
      username: 'alex_art',
      displayName: 'Алексей Иванов',
      avatar: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3',
      bio: 'Скульптор, работаю с металлом и камнем.',
      artStyles: ['Скульптура'],
      followers: 980,
      following: 210,
      createdAt: '2022-04-15',
      socialLinks: {}
    },
    messages: [
      {
        id: '3-1',
        senderId: 'current-user',
        receiverId: '6',
        content: 'Здравствуйте! Мне очень понравилась ваша работа "Динамика". Возможно ли заказать что-то подобное, но меньшего размера?',
        timestamp: '2023-07-05T15:20:00',
        isRead: true,
        subject: 'Заказ скульптуры "Динамика"'
      },
      {
        id: '3-2',
        senderId: '6',
        receiverId: 'current-user',
        content: 'Возможно изготовление на заказ по вашим размерам. Для этого потребуется около 3 недель.',
        timestamp: '2023-07-05T18:45:00',
        isRead: true
      }
    ],
    lastMessage: 'Возможно изготовление на заказ по вашим размерам. Для этого потребуется около 3 недель.',
    unread: false,
    date: '2023-07-05T18:45:00'
  }
];

// Создаем контекст для сообщений
const MessageContext = createContext<MessageStore | null>(null);

// Хук для использования контекста
export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};

// Интерфейс для хранилища сообщений
export interface MessageStore {
  threads: MessageThread[];
  addMessage: (artistId: string, message: Partial<Message>) => void;
  markAsRead: (threadId: string) => void;
  getThreadByArtistId: (artistId: string) => MessageThread | undefined;
  shareArtwork: (artistId: string, artwork: Artwork) => void;
}

// Провайдер контекста
export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [threads, setThreads] = useState<MessageThread[]>(initialThreads);

  // Загружаем сообщения при инициализации
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const savedMessages = await AsyncStorage.getItem(MESSAGES_STORAGE_KEY);
        if (savedMessages) {
          setThreads(JSON.parse(savedMessages));
        }
      } catch (error) {
        console.error('Ошибка при загрузке сообщений:', error);
      }
    };

    loadMessages();
  }, []);

  // Сохраняем сообщения при изменении
  useEffect(() => {
    const saveMessages = async () => {
      try {
        await AsyncStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(threads));
      } catch (error) {
        console.error('Ошибка при сохранении сообщений:', error);
      }
    };

    saveMessages();
  }, [threads]);

  // Функция для добавления нового сообщения
  const addMessage = (artistId: string, messageData: Partial<Message>) => {
    const timestamp = new Date().toISOString();
    const newMessage: Message = {
      id: `message-${Date.now()}`,
      senderId: messageData.senderId || 'current-user',
      receiverId: messageData.receiverId || artistId,
      content: messageData.content || '',
      timestamp,
      isRead: false,
      subject: messageData.subject
    };

    setThreads(prevThreads => {
      // Ищем существующий поток сообщений с художником
      const existingThreadIndex = prevThreads.findIndex(thread => thread.artist.id === artistId);

      if (existingThreadIndex >= 0) {
        // Обновляем существующий поток
        const updatedThreads = [...prevThreads];
        const thread = { ...updatedThreads[existingThreadIndex] };
        
        thread.messages = [...thread.messages, newMessage];
        thread.lastMessage = newMessage.content;
        thread.date = timestamp;
        thread.unread = newMessage.senderId !== 'current-user';
        
        updatedThreads[existingThreadIndex] = thread;
        return updatedThreads;
      } else {
        // Создаем новый поток сообщений
        const artwork = MOCK_ARTWORKS.find(artwork => artwork.artistId === artistId);
        
        if (!artwork) {
          console.error(`Художник с ID ${artistId} не найден`);
          return prevThreads;
        }
        
        // Создаем объект художника из данных работы
        const artist: User = {
          id: artwork.artistId,
          username: artwork.artistName.toLowerCase().replace(/\s+/g, '_'),
          displayName: artwork.artistName,
          avatar: artwork.artistAvatar,
          bio: `Художник ${artwork.artistName}`,
          artStyles: [],
          followers: 0,
          following: 0,
          createdAt: new Date().toISOString().split('T')[0],
          socialLinks: {}
        };
        
        const newThread: MessageThread = {
          id: `thread-${Date.now()}`,
          artist,
          messages: [newMessage],
          lastMessage: newMessage.content,
          unread: newMessage.senderId !== 'current-user',
          date: timestamp
        };
        
        return [...prevThreads, newThread];
      }
    });
  };

  // Функция для отметки сообщений как прочитанных
  const markAsRead = (threadId: string) => {
    setThreads(prevThreads => {
      return prevThreads.map(thread => {
        if (thread.id === threadId) {
          const updatedMessages = thread.messages.map(message => ({
            ...message,
            isRead: true
          }));
          
          return {
            ...thread,
            messages: updatedMessages,
            unread: false
          };
        }
        return thread;
      });
    });
  };

  // Функция для получения потока сообщений по ID художника
  const getThreadByArtistId = (artistId: string) => {
    return threads.find(thread => thread.artist.id === artistId);
  };

  // Функция для отправки сообщения с постом
  const shareArtwork = (artistId: string, artwork: Artwork) => {
    const timestamp = new Date().toISOString();
    const newMessage: Message = {
      id: `message-${Date.now()}`,
      senderId: 'current-user',
      receiverId: artistId,
      content: `Я хочу поделиться с вами работой "${artwork.title}"`,
      timestamp,
      isRead: false,
      sharedArtwork: artwork
    };

    setThreads(prevThreads => {
      // Ищем существующий поток сообщений с художником
      const existingThreadIndex = prevThreads.findIndex(thread => thread.artist.id === artistId);

      if (existingThreadIndex >= 0) {
        // Обновляем существующий поток
        const updatedThreads = [...prevThreads];
        const thread = { ...updatedThreads[existingThreadIndex] };
        
        thread.messages = [...thread.messages, newMessage];
        thread.lastMessage = `Работа: ${artwork.title} • ${artwork.artistName}`;
        thread.date = timestamp;
        thread.unread = false;
        
        updatedThreads[existingThreadIndex] = thread;
        return updatedThreads;
      } else {
        // Создаем новый поток сообщений
        const artistData = MOCK_ARTWORKS.find(a => a.artistId === artistId);
        
        if (!artistData) {
          console.error(`Художник с ID ${artistId} не найден`);
          return prevThreads;
        }
        
        // Создаем объект художника из данных работы
        const artistUser: User = {
          id: artistData.artistId,
          username: artistData.artistName.toLowerCase().replace(/\s+/g, '_'),
          displayName: artistData.artistName,
          avatar: artistData.artistAvatar,
          bio: `Художник ${artistData.artistName}`,
          artStyles: [],
          followers: 0,
          following: 0,
          createdAt: new Date().toISOString().split('T')[0],
          socialLinks: {}
        };
        
        const newThread: MessageThread = {
          id: `thread-${Date.now()}`,
          artist: artistUser,
          messages: [newMessage],
          lastMessage: `Работа: ${artwork.title} • ${artwork.artistName}`,
          unread: false,
          date: timestamp
        };
        
        return [...prevThreads, newThread];
      }
    });
  };

  const contextValue: MessageStore = {
    threads,
    addMessage,
    markAsRead,
    getThreadByArtistId,
    shareArtwork
  };

  return (
    <MessageContext.Provider value={contextValue}>
      {children}
    </MessageContext.Provider>
  );
};

export default MessageContext; 