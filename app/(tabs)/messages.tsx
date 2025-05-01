import React, { useState, useRef, useEffect, useContext, useMemo } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  StatusBar, 
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
  Animated,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useMessages } from '@/app/context/MessageContext';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Message } from '@/app/models/types';
import MessageContext, { MessageStore } from '@/app/context/MessageContext';

const { width, height } = Dimensions.get('window');
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function MessagesScreen() {
  const router = useRouter();
  const { threads: messageThreads, addMessage, markAsRead, getThreadByArtistId, hasThreadWithArtist, clearDuplicates, clearAllMessages } = useMessages();
  const messageContext = useContext(MessageContext) as MessageStore;
  
  // Дедуплицируем чаты по имени художника и ID
  const uniqueChats = useMemo(() => {
    const nameMap = new Map();
    const idMap = new Map();
    const result = [];
    
    // Сортируем по дате (сначала новые)
    const sorted = [...messageThreads].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    for (const thread of sorted) {
      const name = thread.artist.displayName;
      const id = String(thread.artist.id);
      
      // Если ни имя, ни ID художника еще не встречались, добавляем чат
      if (!nameMap.has(name) && !idMap.has(id)) {
        nameMap.set(name, thread);
        idMap.set(id, thread);
        result.push(thread);
      }
    }
    
    return result;
  }, [messageThreads]);
  
  // Состояние для отслеживания, в каком чате мы находимся
  const [activeArtistId, setActiveArtistId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  
  // Получаем активный поток сообщений, если есть активный художник
  const activeThread = activeArtistId ? getThreadByArtistId(activeArtistId) : null;
  
  // Проверяем, есть ли в контексте активный чат при монтировании компонента
  useEffect(() => {
    if (messageContext && messageContext.activeChat) {
      // Проверяем, существует ли уже такой чат
      const artistId = String(messageContext.activeChat);
      
      // Если чат с художником существует, устанавливаем его активным
      if (hasThreadWithArtist(artistId)) {
        setActiveArtistId(artistId);
      } else {
        // Если чат не существует, мы остаемся на экране списка чатов,
        // контекст создаст новый чат при добавлении первого сообщения
        console.log('Чат с художником ID', artistId, 'еще не существует');
      }
      
      // Сбрасываем активный чат в контексте после его использования
      if (messageContext.setActiveChat) {
        messageContext.setActiveChat(null);
      }
    }
  }, [messageContext, hasThreadWithArtist]);
  
  // Отмечаем сообщения как прочитанные при открытии чата
  useEffect(() => {
    if (activeThread && activeThread.unread) {
      markAsRead(activeThread.id);
    }
  }, [activeThread, markAsRead]);
  
  // Прокручиваем к последнему сообщению при открытии чата или отправке нового сообщения
  useEffect(() => {
    if (activeThread?.messages.length) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [activeThread?.messages.length]);

  const handleThreadPress = (artistId: string) => {
    // Тактильный отклик
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Устанавливаем активного художника (преобразуем в строку для надежности)
    setActiveArtistId(String(artistId));
  };

  const handleBackToMessages = () => {
    // Тактильный отклик
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Возвращаемся к списку сообщений
    setActiveArtistId(null);
  };

  // Проверяем, содержит ли последнее сообщение прикрепленное произведение
  const hasSharedArtwork = (thread) => {
    if (thread.messages.length === 0) return false;
    const lastMessage = thread.messages[thread.messages.length - 1];
    return lastMessage.sharedArtwork !== undefined;
  };

  const handleNewMessage = () => {
    // Здесь можно открыть выбор художника для отправки нового сообщения
    // Пока просто уведомление
    alert('Функция создания нового сообщения будет доступна в следующем обновлении');
  };

  const formatMessageDate = (dateString: string) => {
    const messageDate = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Вчера';
    } else if (diffDays < 7) {
      const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
      return days[messageDate.getDay()];
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  const renderMessageThread = ({ item }) => (
    <TouchableOpacity 
      style={styles.threadCard} 
      onPress={() => handleThreadPress(item.artist.id)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarWrapper}>
        <Image source={{ uri: item.artist.avatar }} style={styles.avatar} />
        {item.unread && <View style={styles.unreadBadge} />}
      </View>
      
      <View style={styles.threadContent}>
        <View style={styles.threadHeader}>
          <ThemedText style={styles.artistName}>{item.artist.displayName}</ThemedText>
          <View style={styles.dateContainer}>
            <ThemedText style={styles.dateText}>{formatMessageDate(item.date)}</ThemedText>
          </View>
        </View>
        
        <View style={styles.messagePreviewContainer}>
          {hasSharedArtwork(item) && (
            <View style={styles.artworkIconContainer}>
              <FontAwesome name="picture-o" size={12} color="#0a7ea4" />
            </View>
          )}
          <ThemedText 
            style={[
              styles.messageText, 
              item.unread && styles.unreadText,
              hasSharedArtwork(item) && styles.artworkMessageText
            ]} 
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.lastMessage}
          </ThemedText>
          {item.unread && (
            <View style={styles.indicatorContainer}>
              <View style={styles.unreadIndicator} />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
  
  // Функция для отправки сообщения
  const handleSend = () => {
    if (!message.trim() || !activeArtistId) return;
    
    setIsSending(true);
    Keyboard.dismiss();
    
    // Вибрационный отклик при отправке
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Имитируем задержку сети
    setTimeout(() => {
      // Преобразуем ID в строку для гарантированного сравнения
      const artistIdStr = String(activeArtistId);
      
      addMessage(artistIdStr, {
        content: message.trim(),
        senderId: 'current-user',
        receiverId: artistIdStr
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
          addMessage(artistIdStr, {
            content: getRandomResponse(),
            senderId: artistIdStr,
            receiverId: 'current-user'
          });
          
          // Вибрационный отклик при получении сообщения
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }, 500);
      }, responseTime);
    }, 500);
  };
  
  // Функция для очистки дубликатов
  const handleRemoveDuplicates = () => {
    clearDuplicates();
    Alert.alert("Готово", "Дубликаты чатов удалены");
  };
  
  // Функция для полной очистки хранилища сообщений
  const handleClearAllMessages = () => {
    Alert.alert(
      "Внимание",
      "Вы действительно хотите очистить все сообщения? Это действие нельзя отменить.",
      [
        {
          text: "Отмена",
          style: "cancel"
        },
        { 
          text: "Очистить", 
          onPress: () => {
            clearAllMessages();
            Alert.alert("Готово", "Все сообщения очищены");
          },
          style: "destructive"
        }
      ]
    );
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
  
  // Рендерим пузырек сообщения
  const renderMessageBubble = ({ item }: { item: Message }) => {
    const isCurrentUser = item.senderId === 'current-user';
    
    return (
      <Animated.View style={[
        styles.messageBubbleContainer,
        isCurrentUser ? styles.currentUserContainer : styles.artistContainer
      ]}>
        {!isCurrentUser && activeThread && (
          <Image source={{ uri: activeThread.artist.avatar }} style={styles.messageAvatar} />
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
  
  // Форматируем время сообщения
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = '';
    let currentGroup: Message[] = [];
    
    messages.forEach(message => {
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
  
  // Если активен чат, показываем экран чата
  if (activeArtistId && activeThread) {
    const messageGroups = groupMessagesByDate(activeThread.messages);
    
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
          <Animated.View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={handleBackToMessages}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.artistInfo}
              onPress={() => router.push(`/profile/${activeArtistId}`)}
              activeOpacity={0.7}
            >
              <Image 
                source={{ uri: activeThread.artist.avatar }} 
                style={styles.chatAvatar}
              />
              <View style={styles.artistNameContainer}>
                <ThemedText style={styles.chatArtistName}>{activeThread.artist.displayName}</ThemedText>
                <ThemedText style={styles.artistStatus}>
                  {activeThread.artist.artStyles.length > 0 
                    ? activeThread.artist.artStyles[0] 
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
          keyExtractor={(item) => `message-group-${item.date}-${Math.random().toString(36).substring(2)}`}
          contentContainerStyle={styles.messagesList}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          renderItem={({ item }) => (
            <View>
              {renderDateSeparator(item.date)}
              {item.messages.map((message, index) => (
                <View key={`${message.id}-${index}-${message.timestamp}`}>
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

  // Иначе показываем список сообщений
  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <LinearGradient
        colors={['rgba(10, 126, 164, 0.2)', 'rgba(10, 126, 164, 0.05)']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View>
            <ThemedText style={styles.title}>Сообщения</ThemedText>
            <ThemedText style={styles.subtitle}>
              {uniqueChats.length > 0 
                ? `${uniqueChats.length} ${uniqueChats.length === 1 ? 'диалог' : 
                  uniqueChats.length < 5 ? 'диалога' : 'диалогов'}`
                : 'Нет активных диалогов'}
            </ThemedText>
          </View>
          
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={handleRemoveDuplicates}
              activeOpacity={0.7}
            >
              <FontAwesome name="refresh" size={18} color="#0a7ea4" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.iconButton, styles.dangerButton]} 
              onPress={handleClearAllMessages}
              activeOpacity={0.7}
            >
              <FontAwesome name="trash" size={18} color="#d9534f" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.newMessageButton} 
              onPress={handleNewMessage}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['#0a7ea4', '#0a6ea4']}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <FontAwesome name="edit" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      
      {uniqueChats.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/893/893257.png' }} 
            style={styles.emptyIcon}
          />
          <ThemedText style={styles.emptyText}>У вас пока нет сообщений</ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Найдите интересного художника и начните общение!
          </ThemedText>
          <TouchableOpacity 
            style={styles.startButton} 
            onPress={handleNewMessage}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#0a7ea4', '#0a6ea4']}
              style={styles.startButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <ThemedText style={styles.startButtonText}>Начать переписку</ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={uniqueChats}
          renderItem={renderMessageThread}
          keyExtractor={(item) => `message-thread-${item.id}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          initialNumToRender={10}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  headerGradient: {
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  dangerButton: {
    backgroundColor: 'rgba(217, 83, 79, 0.1)',
  },
  newMessageButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  gradientButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: 16,
  },
  threadCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    borderWidth: 2,
    borderColor: 'rgba(10, 126, 164, 0.2)',
  },
  unreadBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#0a7ea4',
    borderWidth: 2,
    borderColor: '#fff',
  },
  threadContent: {
    flex: 1,
    justifyContent: 'center',
  },
  threadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  artistName: {
    fontSize: 16,
    fontWeight: '600',
  },
  dateContainer: {
    backgroundColor: 'rgba(10, 126, 164, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  dateText: {
    fontSize: 11,
    color: '#0a7ea4',
    fontWeight: '500',
  },
  messagePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 14,
    color: '#888',
    flex: 1,
  },
  unreadText: {
    color: '#555',
    fontWeight: '500',
  },
  artworkMessageText: {
    color: '#0a7ea4',
  },
  artworkIconContainer: {
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  indicatorContainer: {
    marginLeft: 8,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0a7ea4',
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    marginBottom: 20,
    tintColor: '#ccc',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 30,
  },
  startButton: {
    overflow: 'hidden',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Стили для чата
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
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
  artistNameContainer: {
    marginLeft: 12,
  },
  chatArtistName: {
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