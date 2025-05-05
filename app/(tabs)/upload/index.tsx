import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, TextInput, Image, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/app/context/AuthContext';
import { useArtworks } from '@/app/context/ArtworkContext';
import { Artwork } from '@/app/models/types';

type ImageInfo = {
  uri: string;
  width: number;
  height: number;
  type?: string;
};

export default function UploadScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { addArtwork } = useArtworks();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImages, setSelectedImages] = useState<ImageInfo[]>([]);
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [medium, setMedium] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [isForSale, setIsForSale] = useState(false);
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const pickImage = async () => {
    try {
      // Запрашиваем разрешение
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Ошибка', 'Для выбора изображения требуется доступ к галерее');
        return;
      }
      
      // Запускаем выбор изображения
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        console.log("Выбранные изображения:", result.assets);
        setSelectedImages(result.assets);
      }
    } catch (error) {
      console.error("Ошибка при выборе изображения:", error);
      Alert.alert('Ошибка', 'Произошла ошибка при выборе изображения');
    }
  };
  
  const removeImage = (index: number) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };
  
  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Ошибка', 'Необходимо войти в аккаунт для загрузки работ');
      return;
    }

    if (!title.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, укажите название работы');
      return;
    }

    if (selectedImages.length === 0) {
      Alert.alert('Ошибка', 'Пожалуйста, выберите хотя бы одно изображение для работы');
      return;
    }

    if (!category.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, укажите категорию работы');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const tagsList = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      
      const newArtwork: Artwork = {
        id: `artwork-${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        images: selectedImages.map(img => img.uri),
        thumbnailUrl: selectedImages[0].uri,
        artistId: user.id,
        artistName: user.displayName,
        artistAvatar: user.avatar,
        categories: [category.trim()],
        tags: tagsList,
        medium: medium.trim(),
        dimensions: dimensions.trim(),
        likes: 0,
        views: 0,
        comments: 0,
        isForSale: isForSale,
        price: isForSale ? parseFloat(price) : undefined,
        currency: isForSale ? 'RUB' : undefined,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      await addArtwork(newArtwork);
      
      Alert.alert(
        'Успех',
        'Работа успешно загружена',
        [{ text: 'OK', onPress: () => {
          // Очистка формы
          setTitle('');
          setDescription('');
          setSelectedImages([]);
          setCategory('');
          setTags('');
          setMedium('');
          setDimensions('');
          setIsForSale(false);
          setPrice('');
          
          // Перенаправление на экран профиля
          router.push('/(tabs)/profile');
        }}]
      );
    } catch (error) {
      console.error('Ошибка при загрузке работы:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить работу. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Загрузить новую работу</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.imagePickerContainer}>
        {selectedImages.length === 0 ? (
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            <FontAwesome name="plus" size={24} color="#ccc" />
            <ThemedText style={styles.imagePickerText}>
              Добавить фото работы
            </ThemedText>
          </TouchableOpacity>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {selectedImages.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: image.uri }} style={styles.image} />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <FontAwesome name="times" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addMoreButton} onPress={pickImage}>
              <FontAwesome name="plus" size={24} color="#0a7ea4" />
            </TouchableOpacity>
          </ScrollView>
        )}
      </ThemedView>
      
      <ThemedView style={styles.formContainer}>
        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Название работы*</ThemedText>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Введите название работы"
          />
        </View>
        
        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Описание</ThemedText>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder="Опишите вашу работу"
            multiline={true}
            numberOfLines={4}
          />
        </View>
        
        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Категория*</ThemedText>
          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholder="Например: Живопись, Скульптура, Графика"
          />
        </View>
        
        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Теги</ThemedText>
          <TextInput
            style={styles.input}
            value={tags}
            onChangeText={setTags}
            placeholder="Через запятую, например: портрет, акварель"
          />
        </View>
        
        <View style={styles.formRow}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
            <ThemedText style={styles.label}>Техника</ThemedText>
            <TextInput
              style={styles.input}
              value={medium}
              onChangeText={setMedium}
              placeholder="Например: Масло, Акварель"
            />
          </View>
          
          <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
            <ThemedText style={styles.label}>Размеры</ThemedText>
            <TextInput
              style={styles.input}
              value={dimensions}
              onChangeText={setDimensions}
              placeholder="Например: 40x60 см"
            />
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity 
              style={[styles.checkbox, isForSale && styles.checkboxChecked]}
              onPress={() => setIsForSale(!isForSale)}
            >
              {isForSale && <FontAwesome name="check" size={14} color="#fff" />}
            </TouchableOpacity>
            <ThemedText style={styles.checkboxLabel}>Продается</ThemedText>
          </View>
        </View>
        
        {isForSale && (
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Цена (руб.)</ThemedText>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="Введите цену"
              keyboardType="numeric"
            />
          </View>
        )}
        
        <TouchableOpacity 
          style={[
            styles.submitButton,
            (isSubmitting || !title || !category || selectedImages.length === 0) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting || !title || !category || selectedImages.length === 0}
        >
          <View style={styles.submitButtonContent}>
            {isSubmitting && <ActivityIndicator size="small" color="#fff" style={styles.submitButtonLoader} />}
            <ThemedText style={styles.submitButtonText}>
              {isSubmitting ? 'Загрузка...' : 'Опубликовать'}
            </ThemedText>
          </View>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  imagePickerContainer: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  imagePicker: {
    height: 200,
    borderWidth: 2,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerText: {
    marginTop: 8,
    color: '#888',
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addMoreButton: {
    width: 150,
    height: 150,
    borderWidth: 2,
    borderColor: '#0a7ea4',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#0a7ea4',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#0a7ea4',
  },
  checkboxLabel: {
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonLoader: {
    marginRight: 8,
  },
}); 