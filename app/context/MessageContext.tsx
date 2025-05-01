import React, { createContext, useContext, useState, useEffect } from 'react';
import { Message, MessageThread, MessageStore, User, Artwork } from '@/app/models/types';
import { MOCK_ARTWORKS } from '@/app/data/artworks';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Создаем константу для ключа хранилища
const MESSAGES_STORAGE_KEY = 'art_community_messages';

// Функция для удаления дубликатов чатов
const removeDuplicateThreads = (threads: MessageThread[]): MessageThread[] => {
  // Используем Map для хранения уникальных чатов по ID художника
  const uniqueThreads = new Map<string, MessageThread>();
  
  // Сортируем по дате (сначала самые новые)
  const sortedThreads = [...threads].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Проходим по всем чатам, сохраняя только первый (самый новый) для каждого художника
  sortedThreads.forEach(thread => {
    const artistId = String(thread.artist.id);
    if (!uniqueThreads.has(artistId)) {
      uniqueThreads.set(artistId, thread);
    }
  });
  
  // Преобразуем обратно в массив
  return Array.from(uniqueThreads.values());
};

// Очищаем дубликаты в начальных данных
const initialThreads: MessageThread[] = removeDuplicateThreads([
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
]);

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
  setActiveChat?: (artistId: string | null) => void;
  activeChat: string | null;
  hasThreadWithArtist: (artistId: string) => boolean;
  clearDuplicates: () => void; // Функция для очистки дубликатов
  clearAllMessages: () => void; // Функция для полной очистки хранилища
}

// Функция для генерации уникального идентификатора
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Провайдер контекста
export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [threads, setThreads] = useState<MessageThread[]>(initialThreads);
  const [activeChat, setActiveChat] = useState<string | null>(null);

  // Загружаем сообщения при инициализации
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const savedMessages = await AsyncStorage.getItem(MESSAGES_STORAGE_KEY);
        if (savedMessages) {
          // Загружаем сообщения и удаляем дубликаты
          const loadedThreads = JSON.parse(savedMessages);
          setThreads(removeDuplicateThreads(loadedThreads));
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
        // Удаляем дубликаты при сохранении
        const uniqueThreads = removeDuplicateThreads(threads);
        await AsyncStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(uniqueThreads));
        
        // Если после удаления дубликатов число чатов изменилось, обновляем состояние
        if (uniqueThreads.length !== threads.length) {
          setThreads(uniqueThreads);
        }
      } catch (error) {
        console.error('Ошибка при сохранении сообщений:', error);
      }
    };

    saveMessages();
  }, [threads]);

  // Функция для получения потока сообщений по ID художника
  const getThreadByArtistId = (artistId: string) => {
    // Преобразуем ID в строку для гарантированного сравнения
    const targetId = String(artistId);
    return threads.find(thread => String(thread.artist.id) === targetId);
  };

  // Функция для добавления нового сообщения
  const addMessage = (artistId: string, messageData: Partial<Message>) => {
    const timestamp = new Date().toISOString();
    // Преобразуем ID в строку для гарантированного сравнения
    const targetId = String(artistId);
    
    // Генерируем уникальный идентификатор для сообщения
    const uniqueId = `message-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newMessage: Message = {
      id: uniqueId,
      senderId: messageData.senderId || 'current-user',
      receiverId: messageData.receiverId || targetId,
      content: messageData.content || '',
      timestamp,
      isRead: false,
      subject: messageData.subject,
      sharedArtwork: messageData.sharedArtwork
    };

    setThreads(prevThreads => {
      // Ищем существующий поток сообщений с художником
      const existingThreadIndex = prevThreads.findIndex(thread => String(thread.artist.id) === targetId);

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
        const artwork = MOCK_ARTWORKS.find(artwork => String(artwork.artistId) === targetId);
        
        if (!artwork) {
          console.error(`Художник с ID ${targetId} не найден`);
          return prevThreads;
        }
        
        // Создаем объект художника из данных работы
        const artist: User = {
          id: targetId,
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
          id: `thread-artist-${targetId}`,
          artist,
          messages: [newMessage],
          lastMessage: newMessage.content,
          unread: newMessage.senderId !== 'current-user',
          date: timestamp
        };
        
        // Возвращаем массив без дубликатов
        return removeDuplicateThreads([...prevThreads, newThread]);
      }
    });
  };

  // Функция для отметки сообщений как прочитанных
  const markAsRead = (threadId: string) => {
    setThreads(prevThreads => {
      return prevThreads.map(thread => {
        // Приводим ID к строке для надежного сравнения
        if (String(thread.id) === String(threadId)) {
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

  // Функция для отправки сообщения с постом
  const shareArtwork = (artistId: string, artwork: Artwork) => {
    // Преобразуем ID в строку для гарантированного сравнения
    const targetId = String(artistId);
    
    // Проверяем, существует ли уже чат с этим художником
    const existingThread = getThreadByArtistId(targetId);
    
    if (existingThread) {
      // Если чат существует, добавляем сообщение с произведением
      addMessage(targetId, {
        content: `Я хочу поделиться с вами работой "${artwork.title}"`,
        sharedArtwork: artwork
      });
      return;
    }
    
    // Если чата нет, создаем новый
    const timestamp = new Date().toISOString();
    const uniqueId = `message-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newMessage: Message = {
      id: uniqueId,
      senderId: 'current-user',
      receiverId: targetId,
      content: `Я хочу поделиться с вами работой "${artwork.title}"`,
      timestamp,
      isRead: false,
      sharedArtwork: artwork
    };

    setThreads(prevThreads => {
      // Создаем новый поток сообщений
      const artistData = MOCK_ARTWORKS.find(a => String(a.artistId) === targetId);
      
      if (!artistData) {
        console.error(`Художник с ID ${targetId} не найден`);
        return prevThreads;
      }
      
      // Создаем объект художника из данных работы
      const artistUser: User = {
        id: targetId,
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
        id: `thread-artist-${targetId}`,
        artist: artistUser,
        messages: [newMessage],
        lastMessage: `Работа: ${artwork.title} • ${artwork.artistName}`,
        unread: false,
        date: timestamp
      };
      
      // Возвращаем массив без дубликатов
      return removeDuplicateThreads([...prevThreads, newThread]);
    });
  };

  // Функция для проверки существования чата
  const hasThreadWithArtist = (artistId: string) => {
    // Убедимся, что ID преобразован в строку для корректного сравнения
    const targetId = String(artistId);
    // Используем some для поиска хотя бы одного совпадения
    return threads.some(thread => String(thread.artist.id) === targetId);
  };
  
  // Функция для принудительной очистки дубликатов
  const clearDuplicates = () => {
    const uniqueThreads = removeDuplicateThreads(threads);
    if (uniqueThreads.length !== threads.length) {
      setThreads(uniqueThreads);
    }
  };

  // Функция для полной очистки хранилища сообщений
  const clearAllMessages = async () => {
    try {
      await AsyncStorage.removeItem(MESSAGES_STORAGE_KEY);
      setThreads(initialThreads);
      console.log("Все сообщения очищены, установлены начальные значения");
    } catch (error) {
      console.error('Ошибка при очистке хранилища сообщений:', error);
    }
  };

  const contextValue: MessageStore = {
    threads: removeDuplicateThreads(threads),
    addMessage,
    markAsRead,
    getThreadByArtistId,
    shareArtwork,
    setActiveChat: (artistId: string | null) => setActiveChat(artistId),
    activeChat,
    hasThreadWithArtist,
    clearDuplicates,
    clearAllMessages
  };

  return (
    <MessageContext.Provider value={contextValue}>
      {children}
    </MessageContext.Provider>
  );
};

export default MessageContext; 