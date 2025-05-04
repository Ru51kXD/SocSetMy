import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { FontAwesome } from '@expo/vector-icons';
import { Comment } from '@/app/models/types';
import { useRouter } from 'expo-router';

interface CommentItemProps {
  comment: Comment;
}

export function CommentItem({ comment }: CommentItemProps) {
  const router = useRouter();
  
  // Функция форматирования даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Обработчик нажатия на аватар/имя пользователя
  const handleUserPress = () => {
    router.push(`/profile/${comment.userId}`);
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleUserPress}>
        <Image source={{ uri: comment.userAvatar }} style={styles.avatar} />
      </TouchableOpacity>
      
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleUserPress}>
            <ThemedText style={styles.username}>{comment.username}</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.date}>{formatDate(comment.createdAt)}</ThemedText>
        </View>
        
        <ThemedText style={styles.content}>{comment.content}</ThemedText>
        
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <FontAwesome name="heart-o" size={14} color="#888" />
            <ThemedText style={styles.actionText}>{comment.likes}</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <FontAwesome name="reply" size={14} color="#888" />
            <ThemedText style={styles.actionText}>Ответить</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Добавляем экспорт по умолчанию для совместимости с Expo Router
export default CommentItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontWeight: '600',
    fontSize: 14,
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 4,
  },
}); 