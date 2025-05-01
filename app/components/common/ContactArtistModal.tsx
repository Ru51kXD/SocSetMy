import React, { useState, useContext } from 'react';
import { 
  StyleSheet, 
  View, 
  Modal, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { User, Artwork } from '@/app/models/types';
import { useMessages } from '@/app/context/MessageContext';
import { useRouter } from 'expo-router';
import { Haptics } from '@/app/utils/Haptics';
import MessageContext, { MessageStore } from '@/app/context/MessageContext';

interface ContactArtistModalProps {
  visible: boolean;
  artist: User;
  artwork?: Artwork;
  onClose: () => void;
}

export function ContactArtistModal({ visible, artist, artwork, onClose }: ContactArtistModalProps) {
  const router = useRouter();
  const { addMessage, shareArtwork, setActiveChat, hasThreadWithArtist } = useMessages();
  const [messageData, setMessageData] = useState('');
  const [subject, setSubject] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    if (!subject.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, укажите тему сообщения');
      return;
    }

    if (!messageData.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, введите текст сообщения');
      return;
    }

    // Преобразуем ID в строку для гарантированного сравнения
    const artistIdStr = String(artist.id);
    
    // Имитация отправки сообщения
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      
      // Проверяем, существует ли уже чат с этим художником
      if (hasThreadWithArtist(artistIdStr)) {
        // Если чат уже существует, просто добавляем новое сообщение
        addMessage(artistIdStr, {
          content: messageData.trim(),
          senderId: 'current-user',
          receiverId: artistIdStr,
          subject: subject.trim()
        });
      } else {
        // Если чат ещё не существует
        if (artwork) {
          // Если есть произведение, отправляем его с помощью shareArtwork
          shareArtwork(artistIdStr, artwork);
        } else {
          // Иначе просто создаём новый чат с сообщением
          addMessage(artistIdStr, {
            content: messageData.trim(),
            senderId: 'current-user',
            receiverId: artistIdStr,
            subject: subject.trim()
          });
        }
      }
      
      // Очищаем поля ввода
      setMessageData('');
      setSubject('');
      
      // Закрываем модальное окно
      onClose();
      
      // Устанавливаем активный чат и переходим к экрану сообщений
      setActiveChat?.(artistIdStr);
      router.push('/(tabs)/messages');
    }, 1000);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ThemedView style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <FontAwesome name="arrow-left" size={20} color="#666" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Связаться с художником</ThemedText>
          <View style={styles.placeholder} />
        </ThemedView>
        
        <ScrollView style={styles.content}>
          <View style={styles.artistInfo}>
            <View style={styles.avatarContainer}>
              <ThemedText style={styles.toLabel}>Кому:</ThemedText>
              <View style={styles.recipientContainer}>
                <View style={styles.avatarWrapper}>
                  <FontAwesome name="user-circle" size={24} color="#0a7ea4" />
                </View>
                <ThemedText style={styles.artistName}>{artist.displayName}</ThemedText>
              </View>
            </View>
            
            {artwork && (
              <View style={styles.artworkInfo}>
                <ThemedText style={styles.artworkInfoLabel}>О работе:</ThemedText>
                <ThemedText style={styles.artworkTitle}>{artwork.title}</ThemedText>
              </View>
            )}
          </View>
          
          <View style={styles.formSection}>
            <ThemedText style={styles.inputLabel}>Тема</ThemedText>
            <TextInput
              style={styles.input}
              value={subject}
              onChangeText={setSubject}
              placeholder="Укажите тему сообщения"
            />
            
            <ThemedText style={styles.inputLabel}>Сообщение</ThemedText>
            <TextInput
              style={[styles.input, styles.messageInput]}
              value={messageData}
              onChangeText={setMessageData}
              placeholder="Напишите ваше сообщение..."
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />
            
            <TouchableOpacity 
              style={[styles.sendButton, !messageData.trim() || !subject.trim() ? styles.disabledButton : null]}
              onPress={handleSend}
              disabled={!messageData.trim() || !subject.trim() || isSending}
            >
              {isSending ? (
                <ThemedText style={styles.sendButtonText}>Отправка...</ThemedText>
              ) : (
                <>
                  <FontAwesome name="paper-plane" size={16} color="#fff" style={styles.sendIcon} />
                  <ThemedText style={styles.sendButtonText}>Отправить сообщение</ThemedText>
                </>
              )}
            </TouchableOpacity>
            
            <ThemedText style={styles.tipText}>
              {artwork 
                ? "Ваше сообщение будет отправлено с прикрепленной работой. Художник ответит вам в чате."
                : "Художник получит ваше сообщение и сможет ответить вам через приложение или по электронной почте"
              }
            </ThemedText>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default ContactArtistModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  placeholder: {
    width: 36,
  },
  content: {
    flex: 1,
  },
  artistInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
  },
  avatarContainer: {
    flexDirection: 'column',
  },
  toLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  recipientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  artistName: {
    fontSize: 16,
    fontWeight: '500',
  },
  artworkInfo: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#efefef',
  },
  artworkInfoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  artworkTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0a7ea4',
  },
  formSection: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  messageInput: {
    height: 160,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  sendIcon: {
    marginRight: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tipText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
}); 