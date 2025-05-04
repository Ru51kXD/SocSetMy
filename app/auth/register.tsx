import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ScrollView,
  ActivityIndicator,
  Image
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/app/context/AuthContext';
import { User } from '@/app/models/types';
import * as ImagePicker from 'expo-image-picker';

// Список доступных стилей искусства
const ART_STYLES = [
  'Живопись', 'Графика', 'Скульптура', 'Фотография', 
  'Цифровое искусство', 'Акварель', 'Масло', 'Акрил',
  'Карандаш', 'Иллюстрация', 'Абстракция', 'Реализм',
  'Сюрреализм', 'Импрессионизм', 'Поп-арт', 'Минимализм'
];

// Список доступных категорий фотографий
const PHOTO_CATEGORIES = [
  'Портрет', 'Пейзаж', 'Макро', 'Архитектура', 
  'Уличная', 'Репортаж', 'Дикая природа', 'Натюрморт',
  'Черно-белая', 'Спорт', 'Мода', 'Свадебная',
  'Ночная', 'Документальная', 'Аэрофотосъемка', 'Подводная'
];

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  
  const [step, setStep] = useState(1); // Шаг регистрации (1 - основная информация, 2 - дополнительная)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedPhotoCategories, setSelectedPhotoCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Выбор аватара из галереи
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Ошибка', 'Для выбора аватара требуется доступ к галерее');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
    }
  };
  
  // Выбор/отмена выбора стиля искусства
  const toggleStyle = (style: string) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter(s => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };
  
  // Выбор/отмена выбора категории фотографий
  const togglePhotoCategory = (category: string) => {
    if (selectedPhotoCategories.includes(category)) {
      setSelectedPhotoCategories(selectedPhotoCategories.filter(c => c !== category));
    } else {
      setSelectedPhotoCategories([...selectedPhotoCategories, category]);
    }
  };
  
  // Переход к следующему шагу
  const handleNextStep = () => {
    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Ошибка', 'Пароли не совпадают');
      return;
    }
    
    setStep(2);
  };
  
  // Завершение регистрации
  const handleRegister = async () => {
    if (!displayName.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, укажите имя для отображения');
      return;
    }
    
    if (selectedStyles.length === 0) {
      Alert.alert('Ошибка', 'Пожалуйста, выберите хотя бы один стиль искусства');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Создаем объект пользователя для регистрации
      const newUser: User = {
        id: `user-${Date.now()}`,
        username: username.toLowerCase(),
        displayName: displayName,
        avatar: avatar || 'https://i.pravatar.cc/150?img=3',
        bio: bio || 'Художник',
        artStyles: selectedStyles,
        photoCategories: selectedPhotoCategories,
        followers: 0,
        following: 0,
        createdAt: new Date().toISOString().split('T')[0],
        socialLinks: {}
      };
      
      // Регистрируем пользователя, передавая объект пользователя и пароль отдельно
      await register(newUser, password);
      
      // Перенаправляем на экран профиля
      router.replace('/(tabs)/profile');
      
    } catch (error: any) {
      console.error('Ошибка при регистрации:', error);
      Alert.alert('Ошибка', error.message || 'Не удалось зарегистрироваться. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => step === 1 ? router.replace('auth') : setStep(1)}
          >
            <FontAwesome name="arrow-left" size={20} color="#0a7ea4" />
          </TouchableOpacity>
          <ThemedText style={styles.title}>
            {step === 1 ? 'Регистрация' : 'Профиль художника'}
          </ThemedText>
          <View style={styles.stepIndicator}>
            <View style={[styles.stepDot, styles.activeStepDot]} />
            <View style={[styles.stepDot, step === 2 && styles.activeStepDot]} />
          </View>
        </View>
        
        {step === 1 ? (
          // Шаг 1: Основная информация
          <View style={styles.formContainer}>
            <ThemedText style={styles.sectionTitle}>Создание аккаунта</ThemedText>
            
            <View style={styles.inputContainer}>
              <FontAwesome name="user" size={20} color="#0a7ea4" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Имя пользователя *"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                editable={!isSubmitting}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <FontAwesome name="lock" size={20} color="#0a7ea4" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Пароль *"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isSubmitting}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <FontAwesome name="check-circle" size={20} color="#0a7ea4" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Подтверждение пароля *"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!isSubmitting}
              />
            </View>
            
            <TouchableOpacity
              style={[styles.button, isSubmitting && styles.disabledButton]}
              onPress={handleNextStep}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#0a7ea4', '#0a6ea4']}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <ThemedText style={styles.buttonText}>Далее</ThemedText>
                <FontAwesome name="arrow-right" size={16} color="#fff" style={styles.buttonIcon} />
              </LinearGradient>
            </TouchableOpacity>
            
            <View style={styles.loginContainer}>
              <ThemedText style={styles.loginText}>
                Уже есть аккаунт?
              </ThemedText>
              <TouchableOpacity onPress={() => router.push('/auth/login')}>
                <ThemedText style={styles.loginLink}>
                  Войти
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // Шаг 2: Информация о художнике
          <View style={styles.formContainer}>
            <ThemedText style={styles.sectionTitle}>Информация о вас</ThemedText>
            
            <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <FontAwesome name="user" size={40} color="#ccc" />
                </View>
              )}
              <View style={styles.avatarBadge}>
                <FontAwesome name="camera" size={14} color="#fff" />
              </View>
            </TouchableOpacity>
            
            <View style={styles.inputContainer}>
              <FontAwesome name="id-badge" size={20} color="#0a7ea4" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Имя для отображения *"
                value={displayName}
                onChangeText={setDisplayName}
                editable={!isSubmitting}
              />
            </View>
            
            <View style={[styles.inputContainer, styles.bioInput]}>
              <FontAwesome name="pencil" size={20} color="#0a7ea4" style={[styles.inputIcon, { alignSelf: 'flex-start', marginTop: 16 }]} />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="О себе (необязательно)"
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
                editable={!isSubmitting}
              />
            </View>
            
            <ThemedText style={styles.stylesLabel}>Ваши стили искусства *</ThemedText>
            <View style={styles.stylesContainer}>
              {ART_STYLES.map((style) => (
                <TouchableOpacity
                  key={style}
                  style={[
                    styles.styleButton,
                    selectedStyles.includes(style) && styles.selectedStyleButton
                  ]}
                  onPress={() => toggleStyle(style)}
                  disabled={isSubmitting}
                >
                  <ThemedText 
                    style={[
                      styles.styleButtonText,
                      selectedStyles.includes(style) && styles.selectedStyleButtonText
                    ]}
                  >
                    {style}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
            
            <ThemedText style={styles.stylesLabel}>Категории фотографий</ThemedText>
            <View style={styles.stylesContainer}>
              {PHOTO_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.styleButton,
                    selectedPhotoCategories.includes(category) && styles.selectedStyleButton
                  ]}
                  onPress={() => togglePhotoCategory(category)}
                  disabled={isSubmitting}
                >
                  <ThemedText 
                    style={[
                      styles.styleButtonText,
                      selectedPhotoCategories.includes(category) && styles.selectedStyleButtonText
                    ]}
                  >
                    {category}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity
              style={[styles.button, (isSubmitting || isLoading) && styles.disabledButton]}
              onPress={handleRegister}
              disabled={isSubmitting || isLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#0a7ea4', '#0a6ea4']}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {isSubmitting || isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <ThemedText style={styles.buttonText}>Зарегистрироваться</ThemedText>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  stepIndicator: {
    flexDirection: 'row',
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
    marginLeft: 8,
  },
  activeStepDot: {
    backgroundColor: '#0a7ea4',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  bioInput: {
    height: 120,
    alignItems: 'flex-start',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 16,
  },
  button: {
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    color: '#666',
    marginRight: 6,
  },
  loginLink: {
    color: '#0a7ea4',
    fontWeight: 'bold',
  },
  avatarContainer: {
    alignSelf: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0a7ea4',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  stylesLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
  },
  stylesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  styleButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedStyleButton: {
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
    borderColor: '#0a7ea4',
  },
  styleButtonText: {
    fontSize: 14,
    color: '#666',
  },
  selectedStyleButtonText: {
    color: '#0a7ea4',
    fontWeight: '500',
  },
}); 