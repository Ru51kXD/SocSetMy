// Модели данных для социальной сети художников

// Модель пользователя
export interface User {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  coverImage?: string;
  artStyles: string[];
  skills: string[];
  location?: string;
  websiteUrl?: string;
  socialLinks: {
    instagram?: string;
    twitter?: string;
    behance?: string;
    artstation?: string;
    pinterest?: string;
  };
  isVerified: boolean;
  followers: number;
  following: number;
  createdAt: string;
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
  artworkCount: number;
} 