import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Image, StatusBar, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useMessages } from '@/app/context/MessageContext';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

export default function MessagesScreen() {
  const router = useRouter();
  const { threads: messageThreads } = useMessages();

  const handleThreadPress = (artistId: string) => {
    router.push(`/chat/${artistId}`);
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
              {messageThreads.length > 0 
                ? `${messageThreads.length} ${messageThreads.length === 1 ? 'диалог' : 
                  messageThreads.length < 5 ? 'диалога' : 'диалогов'}`
                : 'Нет активных диалогов'}
            </ThemedText>
          </View>
          
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
      </LinearGradient>
      
      {messageThreads.length === 0 ? (
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
          data={messageThreads}
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
}); 