import React, { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { useAuth } from './context/AuthContext';

export default function StartScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Даем время показать загрузочный экран
    const timer = setTimeout(() => {
      if (isLoading) return;

      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/auth');
      }
    }, 2000); // Показываем экран загрузки на 2 секунды

    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0a7ea4', '#0a6ea4']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['#ffffff', '#f0f0f0']}
              style={styles.logoBackground}
            >
              <FontAwesome name="paint-brush" size={60} color="#0a7ea4" />
            </LinearGradient>
          </View>
          
          <ThemedText style={styles.appName}>ArtConnect</ThemedText>
          <ThemedText style={styles.tagline}>Сообщество художников</ThemedText>
          
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 30,
    borderRadius: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  logoBackground: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 60,
    opacity: 0.9,
  },
  loadingContainer: {
    marginTop: 30,
  }
}); 