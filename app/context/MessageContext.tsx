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
  // Марина Иванова (ID=1)
  {
    id: 'thread-artist-1',
    artist: {
      id: '1',
      username: 'marina_art',
      displayName: 'Марина Иванова',
      avatar: 'https://i.pravatar.cc/150?img=36',
      bio: 'Цифровой художник, специализирующийся на фэнтези. Создаю иллюстрации для книг и игр.',
      artStyles: ['Цифровое искусство', 'Иллюстрация'],
      followers: 1250,
      following: 230,
      createdAt: '2022-03-15',
      socialLinks: {
        instagram: 'marina_art',
        behance: 'marina_ivanova'
      }
    },
    messages: [
      {
        id: 'welcome-marina-1',
        senderId: '1',
        receiverId: 'current-user',
        content: 'Здравствуйте! Спасибо за интерес к моим работам. Вы можете написать мне о заказе или задать вопрос о любой работе.',
        timestamp: new Date().toISOString(),
        isRead: true
      }
    ],
    lastMessage: 'Здравствуйте! Спасибо за интерес к моим работам. Вы можете написать мне о заказе или задать вопрос о любой работе.',
    unread: false,
    date: new Date().toISOString()
  },
  
  // Алексей Петров (ID=2)
  {
    id: 'thread-artist-2',
    artist: {
      id: '2',
      username: 'alex_create',
      displayName: 'Алексей Петров',
      avatar: 'https://i.pravatar.cc/150?img=12',
      bio: 'Скульптор и художник. Работаю с разными материалами - от мрамора до дерева.',
      artStyles: ['Скульптура', 'Живопись'],
      followers: 8300,
      following: 145,
      createdAt: '2022-06-22',
      socialLinks: {
        instagram: 'alex_sculptor',
        behance: 'alex_petrov'
      }
    },
    messages: [
      {
        id: 'welcome-alex-1',
        senderId: '2',
        receiverId: 'current-user',
        content: 'Приветствую! Рад, что вас заинтересовали мои работы. Какие именно вас интересуют?',
        timestamp: new Date().toISOString(),
        isRead: true
      }
    ],
    lastMessage: 'Приветствую! Рад, что вас заинтересовали мои работы. Какие именно вас интересуют?',
    unread: false,
    date: new Date().toISOString()
  },
  
  // Елена Смирнова (ID=3)
  {
    id: 'thread-artist-3',
    artist: {
      id: '3',
      username: 'elena_draws',
      displayName: 'Елена Смирнова',
      avatar: 'https://i.pravatar.cc/150?img=25',
      bio: 'Создаю иллюстрации и концепт-арт. Специализируюсь на персонажном дизайне и фэнтези-иллюстрациях.',
      artStyles: ['Концепт-арт', 'Диджитал'],
      followers: 5100,
      following: 92,
      createdAt: '2023-01-10',
      socialLinks: {
        instagram: 'elena_artwork',
        artstation: 'elena_smirnova'
      }
    },
    messages: [
      {
        id: 'welcome-elena-1',
        senderId: '3',
        receiverId: 'current-user',
        content: 'Добрый день! Благодарю за проявленный интерес к моим работам. Буду рада обсудить возможные проекты или ответить на ваши вопросы.',
        timestamp: new Date().toISOString(),
        isRead: true
      }
    ],
    lastMessage: 'Добрый день! Благодарю за проявленный интерес к моим работам. Буду рада обсудить возможные проекты или ответить на ваши вопросы.',
    unread: false,
    date: new Date().toISOString()
  },
  
  // Михаил Лебедев (ID=4)
  {
    id: 'thread-artist-4',
    artist: {
      id: '4',
      username: 'artmaster',
      displayName: 'Михаил Лебедев',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
      bio: 'Художник-иллюстратор из Санкт-Петербурга. Специализируюсь на акварельных пейзажах и цифровых иллюстрациях.',
      artStyles: ['Акварель', 'Скетчинг'],
      followers: 1250,
      following: 145,
      createdAt: '2023-01-15',
      socialLinks: {
        instagram: 'artmaster',
        behance: 'mikhail_lebedev'
      }
    },
    messages: [
      {
        id: 'welcome-mikhail-1',
        senderId: '4',
        receiverId: 'current-user',
        content: 'Здравствуйте! Очень рад нашему знакомству. Если вас заинтересовали мои акварельные работы, буду рад рассказать подробнее о техниках и материалах.',
        timestamp: new Date().toISOString(),
        isRead: true
      }
    ],
    lastMessage: 'Здравствуйте! Очень рад нашему знакомству. Если вас заинтересовали мои акварельные работы, буду рад рассказать подробнее о техниках и материалах.',
    unread: false,
    date: new Date().toISOString()
  },
  
  // Анна Соколова (ID=5)
  {
    id: 'thread-artist-5',
    artist: {
      id: '5',
      username: 'colorexpert',
      displayName: 'Анна Соколова',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      bio: 'Цифровой художник и иллюстратор. Создаю концепт-арты для игр и анимационных проектов.',
      artStyles: ['Диджитал Арт'],
      followers: 3400,
      following: 210,
      createdAt: '2022-08-22',
      socialLinks: {
        instagram: 'anna_digital',
        artstation: 'anna_sokolova'
      }
    },
    messages: [
      {
        id: 'welcome-anna-1',
        senderId: '5',
        receiverId: 'current-user',
        content: 'Привет! Спасибо, что заинтересовались моими работами. Я специализируюсь на цифровом искусстве для игр и анимации. С удовольствием отвечу на любые вопросы!',
        timestamp: new Date().toISOString(),
        isRead: true
      }
    ],
    lastMessage: 'Привет! Спасибо, что заинтересовались моими работами. Я специализируюсь на цифровом искусстве для игр и анимации. С удовольствием отвечу на любые вопросы!',
    unread: false,
    date: new Date().toISOString()
  },
  
  // Алексей Иванов (ID=6)
  {
    id: 'thread-artist-6',
    artist: {
      id: '6',
      username: 'sculptor',
      displayName: 'Алексей Иванов',
      avatar: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3',
      bio: 'Скульптор, работаю с глиной и металлом. Создаю как монументальные работы, так и миниатюры.',
      artStyles: ['Скульптура'],
      followers: 890,
      following: 132,
      createdAt: '2021-11-05',
      socialLinks: {
        instagram: 'alex_sculptor',
        behance: 'alexey_ivanov'
      }
    },
    messages: [
      {
        id: 'welcome-alexey-1',
        senderId: '6',
        receiverId: 'current-user',
        content: 'Здравствуйте! Рад, что вас заинтересовали мои скульптуры. Если у вас есть вопросы о моих работах или вы хотите обсудить возможный заказ, пишите в любое время.',
        timestamp: new Date().toISOString(),
        isRead: true
      }
    ],
    lastMessage: 'Здравствуйте! Рад, что вас заинтересовали мои скульптуры. Если у вас есть вопросы о моих работах или вы хотите обсудить возможный заказ, пишите в любое время.',
    unread: false,
    date: new Date().toISOString()
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
    if (!artistId) {
      console.error("Ошибка: artistId не определен в getThreadByArtistId");
      return undefined;
    }
    
    // Преобразуем ID в строку для корректного сравнения
    const targetId = String(artistId);
    console.log(`Поиск потока для художника ID=${targetId}`);
    
    // Для Марины Ивановой (ID=1) логируем дополнительно
    if (targetId === '1') {
      console.log('Ищем поток с Мариной Ивановой (ID=1)');
      console.log('Доступные потоки:', threads.map(t => ({ id: t.id, artistId: t.artist.id })));
    }
    
    // Ищем поток, где artistId совпадает с целевым
    const thread = threads.find(t => String(t.artist.id) === targetId);
    
    if (thread) {
      console.log(`Найден поток: ${thread.id}`);
    } else {
      console.log(`Поток для художника ID=${targetId} не найден`);
    }
    
    return thread;
  };

  // Функция для добавления нового сообщения
  const addMessage = (artistId: string, messageData: Partial<Message>) => {
    console.log('Вызвана функция addMessage для художника ID:', artistId);
    
    const timestamp = new Date().toISOString();
    // Преобразуем ID в строку для гарантированного сравнения
    const targetId = String(artistId);
    
    // Для Марины Ивановой выводим дополнительный лог
    if (targetId === '1') {
      console.log('Добавление сообщения для Марины Ивановой (ID=1)');
      console.log('Текущие потоки:', threads.map(t => ({ id: t.id, artistId: t.artist.id })));
    }
    
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
      console.log('Найден поток с индексом:', existingThreadIndex);

      if (existingThreadIndex >= 0) {
        console.log('Обновляем существующий поток для художника ID:', targetId);
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
        console.log('Создаем новый поток для художника ID:', targetId);
        
        // Специальная обработка для Марины Ивановой (ID=1)
        if (targetId === '1') {
          console.log('Создаем новый поток для Марины Ивановой (ID=1)');
          
          const marinaUser: User = {
            id: '1',
            username: 'marina_art',
            displayName: 'Марина Иванова',
            avatar: 'https://i.pravatar.cc/150?img=36',
            bio: 'Цифровой художник, специализирующийся на фэнтези',
            artStyles: ['Цифровое искусство', 'Фэнтези'],
            followers: 1250,
            following: 230,
            createdAt: '2022-03-15',
            socialLinks: {}
          };
          
          const newThread: MessageThread = {
            id: 'thread-artist-1',
            artist: marinaUser,
            messages: [newMessage],
            lastMessage: newMessage.content,
            unread: newMessage.senderId !== 'current-user',
            date: timestamp
          };
          
          console.log('Создан новый поток для Марины Ивановой с ID:', newThread.id);
          return removeDuplicateThreads([...prevThreads, newThread]);
        }
        
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

  // Специальная функция для создания чата с Мариной Ивановой
  const createMarinaChat = (artwork: Artwork) => {
    console.log('Принудительное создание чата с Мариной Ивановой (ID=1)');
    
    const timestamp = new Date().toISOString();
    const uniqueId = `message-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Создаем сообщение
    const newMessage: Message = {
      id: uniqueId,
      senderId: 'current-user',
      receiverId: '1',
      content: `Я хочу поделиться с вами работой "${artwork.title}"`,
      timestamp,
      isRead: false,
      sharedArtwork: artwork
    };
    
    // Создаем объект пользователя Марины Ивановой
    const marinaUser: User = {
      id: '1',
      username: 'marina_art',
      displayName: 'Марина Иванова',
      avatar: 'https://i.pravatar.cc/150?img=36',
      bio: 'Цифровой художник, специализирующийся на фэнтези',
      artStyles: ['Цифровое искусство', 'Фэнтези'],
      followers: 1250,
      following: 230,
      createdAt: '2023-01-01',
      socialLinks: {}
    };
    
    // Создаем новый поток для Марины
    const newThread: MessageThread = {
      id: 'thread-artist-1',
      artist: marinaUser,
      messages: [newMessage],
      lastMessage: `Работа: ${artwork.title} • Марина Иванова`,
      unread: false,
      date: timestamp
    };
    
    console.log('Создан новый поток для Марины Ивановой:', newThread.id);
    
    // Обновляем состояние потоков
    setThreads(prevThreads => {
      // Удаляем существующий поток с Мариной Ивановой, если есть
      const filteredThreads = prevThreads.filter(thread => String(thread.artist.id) !== '1');
      // Добавляем новый поток
      return removeDuplicateThreads([...filteredThreads, newThread]);
    });
    
    // Устанавливаем активный чат
    setActiveChat('1');
    
    return newThread;
  };

  // Функция для отправки сообщения с постом
  const shareArtwork = (artistId: string, artwork: Artwork) => {
    console.log('Вызвана функция shareArtwork с параметрами:', { artistId, artworkId: artwork?.id });
    
    if (!artwork) {
      console.error('Ошибка: artwork не определен');
      return;
    }
    
    // Преобразуем ID в строку для гарантированного сравнения
    const targetId = String(artistId);
    console.log('Целевой ID художника:', targetId);
    
    // Особая обработка для Марины Ивановой (ID=1)
    if (targetId === '1') {
      console.log('Особый случай: Марина Иванова (ID=1), используем createMarinaChat');
      return createMarinaChat(artwork);
    }
    
    // Для остальных художников - стандартная логика
    
    // Проверяем, существует ли уже чат с этим художником
    const existingThread = getThreadByArtistId(targetId);
    console.log('Существующий поток:', existingThread ? 'найден' : 'не найден');
    
    if (existingThread) {
      console.log('Добавляем сообщение в существующий поток:', existingThread.id);
      // Если чат существует, добавляем сообщение с произведением
      addMessage(targetId, {
        content: `Я хочу поделиться с вами работой "${artwork.title}"`,
        sharedArtwork: artwork
      });
      return;
    }
    
    console.log('Создаем новый поток чата для художника:', targetId);
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
      // Ищем художника в MOCK_ARTWORKS
      const artistData = MOCK_ARTWORKS.find(a => String(a.artistId) === targetId);
      
      // Для Марины Ивановой делаем дополнительную проверку
      if (targetId === '1' && !artistData) {
        console.log('Особая обработка для Марины Ивановой');
        // Используем первую работу, так как знаем, что она Марины Ивановой
        const firstArtwork = MOCK_ARTWORKS.find(a => a.artistName.includes('Марина'));
        
        if (firstArtwork) {
          const marinaUser: User = {
            id: '1',
            username: 'marina_art',
            displayName: 'Марина Иванова',
            avatar: firstArtwork.artistAvatar || 'https://i.pravatar.cc/150?img=36',
            bio: 'Цифровой художник, специализирующийся на фэнтези',
            artStyles: ['Цифровое искусство', 'Фэнтези'],
            followers: 1250,
            following: 230,
            createdAt: '2023-01-01',
            socialLinks: {}
          };
          
          const newThread: MessageThread = {
            id: `thread-artist-1`,
            artist: marinaUser,
            messages: [newMessage],
            lastMessage: `Работа: ${artwork.title} • Марина Иванова`,
            unread: false,
            date: timestamp
          };
          
          console.log('Создан новый поток для Марины Ивановой:', newThread.id);
          return removeDuplicateThreads([...prevThreads, newThread]);
        }
      }
      
      if (!artistData) {
        console.error(`Художник с ID ${targetId} не найден в MOCK_ARTWORKS`);
        return prevThreads;
      }
      
      console.log('Найдены данные художника:', artistData.artistName);
      
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
      
      console.log('Создан новый поток:', newThread.id);
      // Возвращаем массив без дубликатов
      return removeDuplicateThreads([...prevThreads, newThread]);
    });
    
    console.log('Функция shareArtwork завершена');
  };

  // Функция для проверки существования чата
  const hasThreadWithArtist = (artistId: string) => {
    if (!artistId) {
      console.error("Ошибка: artistId не определен в hasThreadWithArtist");
      return false;
    }
    
    // Убедимся, что ID преобразован в строку для корректного сравнения
    const targetId = String(artistId);
    console.log(`Проверка наличия чата с художником ID=${targetId}`);
    
    // Для Марины Ивановой выводим дополнительную информацию
    if (targetId === '1') {
      console.log('Проверяем чат с Мариной Ивановой (ID=1)');
      console.log('Текущие потоки:', threads.map(t => ({ id: t.id, artistId: t.artist.id })));
    }
    
    // Используем some для поиска хотя бы одного совпадения
    const hasThread = threads.some(thread => {
      const threadArtistId = String(thread.artist.id);
      const match = threadArtistId === targetId;
      if (targetId === '1') {
        console.log(`Сравнение ${threadArtistId} === ${targetId}: ${match}`);
      }
      return match;
    });
    
    console.log(`Результат проверки чата для ID=${targetId}: ${hasThread}`);
    return hasThread;
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