import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, TextInput, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

type ImageInfo = {
  uri: string;
  width: number;
  height: number;
  type?: string;
};

export default function UploadScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImages, setSelectedImages] = useState<ImageInfo[]>([]);
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [medium, setMedium] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [isForSale, setIsForSale] = useState(false);
  const [price, setPrice] = useState('');
  
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });
    
    if (!result.canceled) {
      setSelectedImages(result.assets);
    }
  };
  
  const removeImage = (index: number) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };
  
  const handleSubmit = () => {
    // В реальном приложении здесь была бы логика отправки данных на сервер
    console.log({
      title,
      description,
      images: selectedImages,
      category,
      tags: tags.split(',').map(tag => tag.trim()),
      medium,
      dimensions,
      isForSale,
      price: isForSale ? parseFloat(price) : undefined
    });
    
    alert('Работа успешно загружена!');
    
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
    router.push('/profile');
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
            (!title || !category || selectedImages.length === 0) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!title || !category || selectedImages.length === 0}
        >
          <ThemedText style={styles.submitButtonText}>Опубликовать</ThemedText>
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
}); 