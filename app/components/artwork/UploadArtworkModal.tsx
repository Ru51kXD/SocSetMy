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
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Artwork } from '@/app/models/types';
import { useArtworks } from '@/app/context/ArtworkContext';
import { useAuth } from '@/app/context/AuthContext';
import * as ImagePicker from 'expo-image-picker';

// Доступные категории работ
const ARTWORK_CATEGORIES = [
  'Живопись', 'Графика', 'Скульптура', 'Фотография', 
  'Цифровое искусство', 'Иллюстрация', 'Коллаж', 'Инсталляция'
];

interface UploadArtworkModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: (artworkId?: string) => void;
}

export function UploadArtworkModal({ visible, onClose, onSuccess }: UploadArtworkModalProps) {
  const { user } = useAuth();
  const { addArtwork } = useArtworks();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isForSale, setIsForSale] = useState(false);
  const [tags, setTags] = useState('');
  const [medium, setMedium] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Выбор изображения из галереи
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Ошибка', 'Для выбора изображения требуется доступ к галерее');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Выбор/отмена выбора категории
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Очистка формы
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setIsForSale(false);
    setTags('');
    setMedium('');
    setImageUri(null);
    setSelectedCategories([]);
    setIsSubmitting(false);
  };

  // Отправка формы
  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Ошибка', 'Необходимо войти в аккаунт для загрузки работ');
      return;
    }

    if (!title.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, укажите название работы');
      return;
    }

    if (!imageUri) {
      Alert.alert('Ошибка', 'Пожалуйста, выберите изображение для работы');
      return;
    }

    if (selectedCategories.length === 0) {
      Alert.alert('Ошибка', 'Пожалуйста, выберите хотя бы одну категорию');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const tagsList = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      
      const newArtwork: Artwork = {
        id: `artwork-${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        images: [imageUri],
        thumbnailUrl: imageUri,
        artistId: user.id,
        artistName: user.displayName,
        artistAvatar: user.avatar,
        categories: selectedCategories,
        tags: tagsList,
        medium: medium.trim(),
        likes: 0,
        views: 0,
        comments: 0,
        isForSale: isForSale,
        price: isForSale ? parseFloat(price) : undefined,
        currency: isForSale ? 'KZT' : undefined,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      await addArtwork(newArtwork);
      
      Alert.alert(
        'Успех',
        'Работа успешно опубликована!',
        [{ 
          text: 'Посмотреть', 
          onPress: () => {
            resetForm();
            onClose();
            if (onSuccess) onSuccess(newArtwork.id);
          }
        }]
      );
      
    } catch (error) {
      console.error('Ошибка при загрузке работы:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить работу. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
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
          <ThemedText style={styles.headerTitle}>Загрузить работу</ThemedText>
          <TouchableOpacity 
            onPress={handleSubmit} 
            style={styles.saveButton}
            disabled={isSubmitting}
          >
            <ThemedText style={styles.saveButtonText}>
              {isSubmitting ? 'Загрузка...' : 'Опубликовать'}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        <ScrollView style={styles.content}>
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
            ) : (
              <View style={styles.placeholderContainer}>
                <FontAwesome name="camera" size={30} color="#ccc" />
                <ThemedText style={styles.placeholderText}>Нажмите, чтобы выбрать изображение</ThemedText>
              </View>
            )}
          </TouchableOpacity>
          
          <View style={styles.formSection}>
            <ThemedText style={styles.inputLabel}>Название *</ThemedText>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Название вашей работы"
              maxLength={100}
            />
            
            <ThemedText style={styles.inputLabel}>Описание</ThemedText>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Расскажите о своей работе..."
              multiline
              numberOfLines={4}
            />
            
            <ThemedText style={styles.inputLabel}>Техника исполнения</ThemedText>
            <TextInput
              style={styles.input}
              value={medium}
              onChangeText={setMedium}
              placeholder="Например: акварель, масло, цифровая графика"
            />
            
            <View style={styles.rowContainer}>
              <View style={styles.checkboxContainer}>
                <TouchableOpacity 
                  style={[styles.checkbox, isForSale && styles.checkboxChecked]}
                  onPress={() => setIsForSale(!isForSale)}
                >
                  {isForSale && <FontAwesome name="check" size={16} color="#fff" />}
                </TouchableOpacity>
                <ThemedText style={styles.checkboxLabel}>Выставить на продажу</ThemedText>
              </View>
              
              {isForSale && (
                <View style={styles.priceContainer}>
                  <TextInput
                    style={styles.priceInput}
                    value={price}
                    onChangeText={setPrice}
                    placeholder="Цена"
                    keyboardType="numeric"
                  />
                  <ThemedText style={styles.currencyLabel}>₸</ThemedText>
                </View>
              )}
            </View>
            
            <ThemedText style={styles.inputLabel}>Теги (через запятую)</ThemedText>
            <TextInput
              style={styles.input}
              value={tags}
              onChangeText={setTags}
              placeholder="пейзаж, природа, осень"
            />
            
            <ThemedText style={styles.inputLabel}>Категории *</ThemedText>
            <View style={styles.categoriesContainer}>
              {ARTWORK_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryTag,
                    selectedCategories.includes(category) && styles.selectedCategoryTag
                  ]}
                  onPress={() => toggleCategory(category)}
                >
                  <ThemedText 
                    style={[
                      styles.categoryTagText,
                      selectedCategories.includes(category) && styles.selectedCategoryTagText
                    ]}
                  >
                    {category}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default UploadArtworkModal;

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
  imagePicker: {
    width: '100%',
    height: 220,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 12,
    color: '#888',
    textAlign: 'center',
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
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#0a7ea4',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#0a7ea4',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    flex: 1,
    maxWidth: 120,
    marginLeft: 16,
  },
  priceInput: {
    flex: 1,
    padding: 8,
    fontSize: 16,
  },
  currencyLabel: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
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
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
    borderColor: '#0a7ea4',
  },
  categoryTagText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryTagText: {
    color: '#0a7ea4',
    fontWeight: '500',
  },
}); 