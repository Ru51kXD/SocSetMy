// Модели данных для социальной сети художников

// Модель пользователя
export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  artStyles: string[];
  skills?: string[];
  location?: string;
  socialLinks: {
    instagram?: string;
    behance?: string;
    artstation?: string;
  };
  isVerified?: boolean;
  followers: number;
  following: number;
  createdAt: string;
  coverImage?: string;
}

// Модель работы художника
export interface Artwork {
  id: string;
  title: string;
  description: string;
  images: string[];
  thumbnailUrl: string;
  artistId: string;
  artistName: string;
  artistAvatar: string;
  categories: string[];
  tags: string[];
  medium: string;
  dimensions?: string;
  createdYear?: number;
  likes: number;
  views: number;
  comments: number;
  isForSale: boolean;
  price?: number;
  currency?: string;
  createdAt: string;
}

// Модель коллекции/галереи
export interface Gallery {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  ownerId: string;
  ownerName: string;
  isPublic: boolean;
  artworkCount: number;
  featuredArtworks: string[];
  createdAt: string;
  updatedAt: string;
}

// Модель комментария
export interface Comment {
  id: string;
  artworkId: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  likes: number;
  createdAt: string;
}

// События для ленты активности
export interface ActivityEvent {
  id: string;
  type: 'new_artwork' | 'liked' | 'commented' | 'followed' | 'featured';
  actorId: string;
  actorName: string;
  actorAvatar: string;
  targetId?: string;
  targetType?: 'artwork' | 'user' | 'gallery';
  targetPreview?: string;
  createdAt: string;
}

// Модель для категории искусства
export interface ArtCategory {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  artworkCount?: number;
  longDescription?: string;
}

// Интерфейс для сообщения
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  subject?: string; // Тема сообщения
  sharedArtwork?: Artwork; // Прикрепленный пост/работа
}

// Интерфейс для потока сообщений (чата)
export interface MessageThread {
  id: string;
  artist: User;
  messages: Message[];
  lastMessage: string;
  unread: boolean;
  date: string;
}

// Интерфейс для хранилища сообщений
export interface MessageStore {
  threads: MessageThread[];
  addMessage: (artistId: string, message: Partial<Message>) => void;
  markAsRead: (threadId: string) => void;
  getThreadByArtistId: (artistId: string) => MessageThread | undefined;
} 