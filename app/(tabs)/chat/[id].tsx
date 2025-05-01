import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  Image,
  ActivityIndicator,
  Keyboard,
  StatusBar,
  Dimensions,
  Animated
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Message } from '@/app/models/types';
import { useMessages } from '@/app/context/MessageContext';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const artistId = typeof id === 'string' ? id : '';
  const router = useRouter();
  const { threads, addMessage, markAsRead, getThreadByArtistId } = useMessages();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Находим поток сообщений для текущего художника
  const thread = getThreadByArtistId(artistId);
  
  // Отмечаем сообщения как прочитанные при открытии чата
  useEffect(() => {
    if (thread && thread.unread) {
      markAsRead(thread.id);
    }
  }, [thread, markAsRead]);
  
  // Прокручиваем к последнему сообщению при открытии чата или отправке нового сообщения
  useEffect(() => {
    if (thread?.messages.length) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [thread?.messages.length]);

  if (!thread) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={['#0a7ea4', '#0a6ea4']}
          style={styles.loadingGradient}
        >
          <ActivityIndicator size="large" color="#fff" />
          <ThemedText style={styles.loadingText}>Загрузка чата...</ThemedText>
        </LinearGradient>
      </ThemedView>
    );
  }

  const handleSend = () => {
    if (!message.trim()) return;
    
    setIsSending(true);
    Keyboard.dismiss();
    
    // Вибрационный отклик при отправке
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Имитируем задержку сети
    setTimeout(() => {
      addMessage(artistId, {
        content: message.trim(),
        senderId: 'current-user',
        receiverId: artistId
      });
      
      setMessage('');
      setIsSending(false);
      
      // Показываем эффект печатания
      setIsTyping(true);
      
      // Имитируем ответ художника через случайное время
      const responseTime = Math.random() * 3000 + 1000; // от 1 до 4 секунд
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        
        // Добавляем сообщение от художника
        setTimeout(() => {
          addMessage(artistId, {
            content: getRandomResponse(),
            senderId: artistId,
            receiverId: 'current-user'
          });
          
          // Вибрационный отклик при получении сообщения
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }, 500);
      }, responseTime);
    }, 500);
  };
  
  // Генерируем случайный ответ художника
  const getRandomResponse = () => {
    const responses = [
      'Спасибо за ваше сообщение! Я рассмотрю ваше предложение.',
      'Да, конечно! Я могу выполнить такой заказ.',
      'Интересная идея! Давайте обсудим детали.',
      'Благодарю за интерес к моим работам!',
      'Я сейчас работаю над несколькими проектами, но готов(а) обсудить ваш заказ.',
      'Отличный вопрос! Дайте мне немного времени подумать над ним.',
      'Это возможно, но потребует дополнительных материалов. Мы можем обсудить стоимость.',
      'Спасибо за обращение! Какие именно детали вас интересуют?',
      'С удовольствием отвечу на все ваши вопросы о моих работах.',
      'Мы можем организовать встречу для обсуждения деталей проекта.'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };
  
  // Форматируем дату сообщения
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Рендерим пузырек сообщения
  const renderMessageBubble = ({ item }: { item: Message }) => {
    const isCurrentUser = item.senderId === 'current-user';
    
    return (
      <Animated.View style={[
        styles.messageBubbleContainer,
        isCurrentUser ? styles.currentUserContainer : styles.artistContainer
      ]}>
        {!isCurrentUser && (
          <Image source={{ uri: thread.artist.avatar }} style={styles.messageAvatar} />
        )}
        
        <View style={[
          styles.messageBubble,
          isCurrentUser ? styles.currentUserBubble : styles.artistBubble
        ]}>
          <ThemedText style={[
            styles.messageText,
            isCurrentUser ? styles.currentUserText : styles.artistText
          ]}>
            {item.content}
          </ThemedText>
          
          {item.sharedArtwork && (
            <TouchableOpacity 
              style={styles.sharedArtworkContainer}
              onPress={() => router.push(`/artwork/${item.sharedArtwork.id}`)}
              activeOpacity={0.8}
            >
              <Image 
                source={{ uri: item.sharedArtwork.thumbnailUrl }} 
                style={styles.sharedArtworkImage} 
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.sharedArtworkGradient}
              >
                <ThemedText style={styles.sharedArtworkTitle}>
                  {item.sharedArtwork.title}
                </ThemedText>
                <ThemedText style={styles.sharedArtworkArtist}>
                  {item.sharedArtwork.artistName}
                </ThemedText>
              </LinearGradient>
            </TouchableOpacity>
          )}
          
          <ThemedText style={[
            styles.messageTime,
            isCurrentUser ? styles.currentUserTime : styles.artistTime
          ]}>
            {formatMessageTime(item.timestamp)}
          </ThemedText>
        </View>
      </Animated.View>
    );
  };
  
  // Рендерим разделитель даты (для группировки сообщений по дням)
  const renderDateSeparator = (date: string) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    let dateText = messageDate.toLocaleDateString([], {
      day: 'numeric',
      month: 'long'
    });
    
    if (messageDate.toDateString() === today.toDateString()) {
      dateText = 'Сегодня';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      dateText = 'Вчера';
    }
    
    return (
      <View style={styles.dateSeparator}>
        <LinearGradient
          colors={['rgba(10, 126, 164, 0.1)', 'rgba(10, 126, 164, 0.15)', 'rgba(10, 126, 164, 0.1)']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.dateSeparatorGradient}
        >
          <ThemedText style={styles.dateSeparatorText}>{dateText}</ThemedText>
        </LinearGradient>
      </View>
    );
  };
  
  // Группируем сообщения по дням для отображения разделителей
  const groupMessagesByDate = () => {
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = '';
    let currentGroup: Message[] = [];
    
    thread.messages.forEach(message => {
      const messageDate = new Date(message.timestamp).toDateString();
      
      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({
            date: currentDate,
            messages: [...currentGroup]
          });
        }
        
        currentDate = messageDate;
        currentGroup = [message];
      } else {
        currentGroup.push(message);
      }
    });
    
    if (currentGroup.length > 0) {
      groups.push({
        date: currentDate,
        messages: [...currentGroup]
      });
    }
    
    return groups;
  };
  
  const messageGroups = groupMessagesByDate();
  
  // Создаем анимацию для заголовка на основе прокрутки
  const headerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.95],
    extrapolate: 'clamp'
  });
  
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp'
  });
  
  // Создаем функцию для обработки кнопки "Назад"
  const handleBackPress = () => {
    // Тактильный отклик при нажатии на кнопку
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Переход на экран сообщений
    router.push('/(tabs)/messages');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#0a7ea4', '#0a6ea4']}
        style={styles.headerGradient}
      >
        <Animated.View 
          style={[
            styles.header,
            { 
              transform: [{ scale: headerScale }],
              opacity: headerOpacity
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.artistInfo}
            onPress={() => router.push(`/profile/${artistId}`)}
            activeOpacity={0.7}
          >
            <Image 
              source={{ uri: thread.artist.avatar }} 
              style={styles.avatar}
            />
            <View style={styles.artistNameContainer}>
              <ThemedText style={styles.artistName}>{thread.artist.displayName}</ThemedText>
              <ThemedText style={styles.artistStatus}>
                {thread.artist.artStyles.length > 0 
                  ? thread.artist.artStyles[0] 
                  : 'Художник'}
                {isTyping && ' • печатает...'}
              </ThemedText>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuButton}
            activeOpacity={0.7}
          >
            <Ionicons name="ellipsis-vertical" size={22} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
      
      <AnimatedFlatList
        ref={flatListRef}
        data={messageGroups}
        keyExtractor={(item) => item.date}
        contentContainerStyle={styles.messagesList}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        renderItem={({ item }) => (
          <View>
            {renderDateSeparator(item.date)}
            {item.messages.map(message => (
              <View key={message.id}>
                {renderMessageBubble({ item: message })}
              </View>
            ))}
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
      
      <LinearGradient
        colors={['rgba(245, 245, 245, 0.9)', '#f5f5f5']}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Написать сообщение..."
            placeholderTextColor="#999"
            multiline
            maxLength={500}
          />
          
          <TouchableOpacity 
            style={[
              styles.sendButton,
              (!message.trim() || isSending) && styles.disabledButton
            ]}
            onPress={handleSend}
            disabled={!message.trim() || isSending}
            activeOpacity={0.7}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <LinearGradient
                colors={['#0a7ea4', '#0a6ea4']}
                style={styles.sendButtonGradient}
              >
                <Ionicons name="send" size={18} color="#fff" />
              </LinearGradient>
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: 'white',
    fontWeight: '500',
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  artistInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 25,
    padding: 8,
    paddingRight: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  artistNameContainer: {
    marginLeft: 12,
  },
  artistName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  artistStatus: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  menuButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  messagesList: {
    padding: 16,
    paddingBottom: 24,
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 20,
  },
  dateSeparatorGradient: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 5,
  },
  dateSeparatorText: {
    fontSize: 12,
    color: '#0a7ea4',
    fontWeight: '600',
  },
  messageBubbleContainer: {
    flexDirection: 'row',
    marginBottom: 14,
    maxWidth: '80%',
  },
  currentUserContainer: {
    alignSelf: 'flex-end',
  },
  artistContainer: {
    alignSelf: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    alignSelf: 'flex-end',
    borderWidth: 1.5,
    borderColor: 'rgba(10, 126, 164, 0.2)',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    maxWidth: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  currentUserBubble: {
    backgroundColor: '#0a7ea4',
    borderBottomRightRadius: 4,
  },
  artistBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    marginBottom: 4,
    lineHeight: 20,
  },
  currentUserText: {
    color: '#fff',
  },
  artistText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 10,
    alignSelf: 'flex-end',
  },
  currentUserTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  artistTime: {
    color: '#999',
  },
  inputContainer: {
    padding: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 120,
    fontSize: 15,
    color: '#333',
  },
  sendButton: {
    marginRight: 4,
    borderRadius: 22,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  sharedArtworkContainer: {
    width: 220,
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  sharedArtworkImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  sharedArtworkGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    paddingTop: 25,
  },
  sharedArtworkTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  sharedArtworkArtist: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
}); 