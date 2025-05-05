import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome } from '@expo/vector-icons';
import { Comment } from '@/app/models/types';
import { CommentItem } from './CommentItem';
import { ARTISTS } from '@/app/data/artworks';
import { useAuth } from '@/app/context/AuthContext';

// Импортируем массив шаблонных комментариев
const COMMENT_TEMPLATES = [
  "Великолепная работа! Очень нравится композиция и цветовое решение.",
  "Потрясающий стиль, как давно вы занимаетесь этим направлением?",
  "Мне очень нравится техника исполнения. Хотелось бы увидеть больше ваших работ.",
  "Интересное цветовое решение, особенно впечатляют детали.",
  "Очень атмосферная работа, вызывает много эмоций.",
  "Какая замечательная картина! Восхищаюсь вашим мастерством.",
  "Очень интересная концепция, было бы здорово узнать о вашем вдохновении для этой работы.",
  "Прекрасная работа, мне нравится ваш подход к этой теме.",
  "Отличная деталировка, сколько времени у вас ушло на создание этой работы?",
  "Впечатляющая техника, вы самоучка или учились где-то?",
  "Великолепно! Мне нравится настроение, которое передает эта работа.",
  "Очень интересный сюжет. Какую историю вы хотели рассказать этой работой?",
  "Мне нравится ваш стиль. Он очень узнаваемый и самобытный.",
  "Такое гармоничное сочетание цветов, очень приятно смотреть.",
  "Ваша работа вдохновляет меня. Спасибо за творчество!",
  "Это просто восхитительно! Вы настоящий профессионал своего дела."
];

// Функция для генерации случайной даты в пределах последних 30 дней
const getRandomRecentDate = (): string => {
  const now = new Date();
  const randomDaysAgo = Math.floor(Math.random() * 30);
  const randomHoursAgo = Math.floor(Math.random() * 24);
  const randomDate = new Date(now.getTime() - (randomDaysAgo * 24 * 60 * 60 * 1000) - (randomHoursAgo * 60 * 60 * 1000));
  return randomDate.toISOString();
};

// Функция для генерации случайных комментариев
const generateRandomComments = (artworkId: string, count: number): Comment[] => {
  // Убираем ограничение количества комментариев
  return Array.from({ length: count }, (_, index) => {
    const artist = ARTISTS[Math.floor(Math.random() * ARTISTS.length)];
    // Выбираем немного более короткие комментарии для мобильного отображения
    const templateIndex = Math.floor(Math.random() * COMMENT_TEMPLATES.length);
    let commentText = COMMENT_TEMPLATES[templateIndex];
    
    // Если комментарий слишком длинный, обрезаем его
    if (commentText.length > 120) {
      commentText = commentText.substring(0, 120) + '...';
    }
    
    return {
      id: `comment-${artworkId}-${index}`,
      artworkId,
      userId: artist.id,
      username: artist.name,
      userAvatar: artist.avatar, 
      content: commentText,
      likes: Math.floor(Math.random() * 10),
      createdAt: getRandomRecentDate()
    };
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Сортируем по убыванию даты
};

interface CommentsSectionProps {
  artworkId: string;
  commentCount: number;
}

export function CommentsSection({ artworkId, commentCount }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth(); // Получаем данные текущего пользователя
  
  // Генерируем комментарии при первой загрузке компонента
  useEffect(() => {
    // Имитируем загрузку с сервера
    const loadComments = async () => {
      setIsLoading(true);
      
      // Имитация задержки загрузки
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Генерируем случайные комментарии в количестве, указанном в свойствах артворка
      const generatedComments = generateRandomComments(artworkId, commentCount);
      setComments(generatedComments);
      setIsLoading(false);
    };
    
    loadComments();
  }, [artworkId, commentCount]);
  
  // Обработчик отправки комментария
  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    
    // Безопасный URL аватара по умолчанию
    const defaultAvatarUrl = 'https://i.pravatar.cc/150?img=12';
    
    // Создаем новый комментарий с аватаром текущего пользователя
    const newCommentObj: Comment = {
      id: `comment-${artworkId}-${Date.now()}`,
      artworkId,
      userId: user?.id || '0', // ID текущего пользователя
      username: user?.displayName || 'Вы', // Имя текущего пользователя
      userAvatar: user?.avatar || defaultAvatarUrl, // Используем аватар из профиля пользователя или дефолтный
      content: newComment,
      likes: 0,
      createdAt: new Date().toISOString()
    };
    
    // Добавляем комментарий в начало списка
    setComments([newCommentObj, ...comments]);
    
    // Очищаем поле ввода
    setNewComment('');
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0a7ea4" />
        <ThemedText style={styles.loadingText}>Загрузка комментариев...</ThemedText>
      </View>
    );
  }
  
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Комментарии ({comments.length})</ThemedText>
      </View>
      
      {/* Форма отправки комментария */}
      <View style={styles.commentForm}>
        <TextInput
          style={styles.commentInput}
          placeholder="Написать комментарий..."
          placeholderTextColor="#999"
          value={newComment}
          onChangeText={setNewComment}
          multiline
        />
        <TouchableOpacity
          style={[styles.submitButton, !newComment.trim() && styles.disabledButton]}
          onPress={handleSubmitComment}
          disabled={!newComment.trim()}
        >
          <FontAwesome name="paper-plane" size={16} color={newComment.trim() ? "#fff" : "#ccc"} />
        </TouchableOpacity>
      </View>
      
      {/* Проверка на наличие комментариев */}
      {comments.length === 0 ? (
        <View style={styles.emptyCommentsContainer}>
          <FontAwesome name="comments-o" size={48} color="#ccc" />
          <ThemedText style={styles.emptyCommentsText}>
            Пока нет комментариев. Будьте первым!
          </ThemedText>
        </View>
      ) : (
        <View>
          <ThemedText style={styles.commentsCountText}>Всего комментариев: {comments.length}</ThemedText>
          <View style={styles.commentsList}>
            {comments.map((comment, index) => (
              <View key={comment.id}>
                <CommentItem comment={comment} />
                {index < comments.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </View>
        </View>
      )}
    </ThemedView>
  );
}

// Добавляем экспорт по умолчанию для совместимости с Expo Router
export default CommentsSection;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingBottom: 16,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  commentForm: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 8,
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
  },
  submitButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#eee',
  },
  loadingContainer: {
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#888',
  },
  emptyCommentsContainer: {
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  emptyCommentsText: {
    marginTop: 16,
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  commentsList: {
    paddingBottom: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 16,
  },
  commentsCountText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    marginBottom: 8,
  },
}); 