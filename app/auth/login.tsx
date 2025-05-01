import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/app/context/AuthContext';
import { User } from '@/app/models/types';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Отправляем запрос на авторизацию
      await login({
        username: username.trim(),
        password: password.trim()
      });
      
      // Если авторизация прошла успешно, перенаправляем на главный экран
      router.replace('/(tabs)');
      
    } catch (error: any) {
      console.error('Ошибка при входе:', error);
      Alert.alert('Ошибка', error.message || 'Не удалось войти. Пожалуйста, попробуйте еще раз.');
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
            onPress={() => router.replace('/auth')}
          >
            <FontAwesome name="arrow-left" size={20} color="#0a7ea4" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={['#0a7ea4', '#0a6ea4']}
            style={styles.logoBackground}
          >
            <FontAwesome name="paint-brush" size={40} color="#fff" />
          </LinearGradient>
          <ThemedText style={styles.appName}>ArtConnect</ThemedText>
          <ThemedText style={styles.tagline}>Сообщество художников</ThemedText>
        </View>
        
        <View style={styles.formContainer}>
          <ThemedText style={styles.title}>Вход в аккаунт</ThemedText>
          
          <View style={styles.inputContainer}>
            <FontAwesome name="user" size={20} color="#0a7ea4" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Имя пользователя"
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
              placeholder="Пароль"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isSubmitting}
            />
          </View>
          
          <TouchableOpacity
            style={[styles.loginButton, (isSubmitting || isLoading) && styles.disabledButton]}
            onPress={handleLogin}
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
                <ThemedText style={styles.buttonText}>Войти</ThemedText>
              )}
            </LinearGradient>
          </TouchableOpacity>
          
          <View style={styles.registerContainer}>
            <ThemedText style={styles.registerText}>
              Нет аккаунта?
            </ThemedText>
            <TouchableOpacity onPress={() => router.push('/auth/register')}>
              <ThemedText style={styles.registerLink}>
                Зарегистрироваться
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
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
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0a7ea4',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
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
  title: {
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
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.7,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerText: {
    color: '#666',
    marginRight: 6,
  },
  registerLink: {
    color: '#0a7ea4',
    fontWeight: 'bold',
  },
}); 