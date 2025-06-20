import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Modal, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { User } from '@/app/models/types';

// Список доступных категорий фотографий (те же, что в регистрации)
const PHOTO_CATEGORIES = [
  'Портрет', 'Пейзаж', 'Макро', 'Архитектура', 
  'Уличная', 'Репортаж', 'Дикая природа', 'Натюрморт',
  'Черно-белая', 'Спорт', 'Мода', 'Свадебная',
  'Ночная', 'Документальная', 'Аэрофотосъемка', 'Подводная'
];

interface EditProfileModalProps {
  visible: boolean;
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

export function EditProfileModal({ visible, user, onClose, onSave }: EditProfileModalProps) {
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || '');
  const [websiteUrl, setWebsiteUrl] = useState(user?.websiteUrl || '');
  const [instagram, setInstagram] = useState(user?.socialLinks?.instagram || '');
  const [behance, setBehance] = useState(user?.socialLinks?.behance || '');
  const [artstation, setArtstation] = useState(user?.socialLinks?.artstation || '');
  const [selectedPhotoCategories, setSelectedPhotoCategories] = useState<string[]>(
    user?.photoCategories || []
  );

  const togglePhotoCategory = (category: string) => {
    if (selectedPhotoCategories.includes(category)) {
      setSelectedPhotoCategories(selectedPhotoCategories.filter(c => c !== category));
    } else {
      setSelectedPhotoCategories([...selectedPhotoCategories, category]);
    }
  };

  const handleSave = () => {
    const updatedUser: User = {
      ...user,
      displayName,
      username,
      bio,
      location,
      websiteUrl,
      photoCategories: selectedPhotoCategories,
      socialLinks: {
        ...user.socialLinks,
        instagram,
        behance,
        artstation
      }
    };
    
    onSave(updatedUser);
    onClose();
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
            <FontAwesome name="times" size={22} color="#666" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Редактировать профиль</ThemedText>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <ThemedText style={styles.saveButtonText}>Сохранить</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        <ScrollView style={styles.content}>
          <View style={styles.imageSection}>
            <View style={styles.coverImageContainer}>
              {user && (
                <Image 
                  source={{ uri: user.coverImage || 'https://via.placeholder.com/600x200' }} 
                  style={styles.coverImage} 
                />
              )}
              <TouchableOpacity style={styles.editCoverButton}>
                <FontAwesome name="camera" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.avatarContainer}>
              {user && (
                <Image source={{ uri: user.avatar || 'https://via.placeholder.com/150' }} style={styles.avatar} />
              )}
              <TouchableOpacity style={styles.editAvatarButton}>
                <FontAwesome name="camera" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.formSection}>
            <ThemedText style={styles.inputLabel}>Имя</ThemedText>
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Ваше имя"
            />
            
            <ThemedText style={styles.inputLabel}>Имя пользователя</ThemedText>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="@username"
            />
            
            <ThemedText style={styles.inputLabel}>О себе</ThemedText>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={bio}
              onChangeText={setBio}
              placeholder="Расскажите о себе..."
              multiline
              numberOfLines={4}
            />
            
            <ThemedText style={styles.inputLabel}>Местоположение</ThemedText>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Город"
            />
            
            <ThemedText style={styles.inputLabel}>Веб-сайт</ThemedText>
            <TextInput
              style={styles.input}
              value={websiteUrl}
              onChangeText={setWebsiteUrl}
              placeholder="www.example.com"
              keyboardType="url"
            />
            
            <ThemedText style={styles.sectionTitle}>Категории фотографий</ThemedText>
            <View style={styles.categoriesContainer}>
              {PHOTO_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryTag,
                    selectedPhotoCategories.includes(category) && styles.selectedCategoryTag
                  ]}
                  onPress={() => togglePhotoCategory(category)}
                >
                  <ThemedText 
                    style={[
                      styles.categoryTagText,
                      selectedPhotoCategories.includes(category) && styles.selectedCategoryTagText
                    ]}
                  >
                    {category}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
            
            <ThemedText style={styles.sectionTitle}>Социальные сети</ThemedText>
            
            <View style={styles.socialInput}>
              <FontAwesome name="instagram" size={20} color="#C13584" style={styles.socialIcon} />
              <TextInput
                style={styles.socialTextInput}
                value={instagram}
                onChangeText={setInstagram}
                placeholder="Instagram username"
              />
            </View>
            
            <View style={styles.socialInput}>
              <FontAwesome name="behance" size={20} color="#053eff" style={styles.socialIcon} />
              <TextInput
                style={styles.socialTextInput}
                value={behance}
                onChangeText={setBehance}
                placeholder="Behance username"
              />
            </View>
            
            <View style={styles.socialInput}>
              <FontAwesome name="paint-brush" size={20} color="#13AFF0" style={styles.socialIcon} />
              <TextInput
                style={styles.socialTextInput}
                value={artstation}
                onChangeText={setArtstation}
                placeholder="ArtStation username"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default EditProfileModal;

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
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    color: '#0a7ea4',
    fontWeight: 'bold',
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  imageSection: {
    position: 'relative',
    marginBottom: 60,
  },
  coverImageContainer: {
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  editCoverButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: -50,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formSection: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#555',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  bioInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  categoryTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedCategoryTag: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderColor: 'rgba(76, 175, 80, 0.5)',
  },
  categoryTagText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryTagText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  socialInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  socialIcon: {
    marginRight: 12,
  },
  socialTextInput: {
    flex: 1,
    fontSize: 16,
  },
}); 