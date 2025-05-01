import React from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Image,
  Dimensions,
  ImageBackground
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';

const { width, height } = Dimensions.get('window');

export default function AuthChoiceScreen() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0a7ea4', '#0a6ea4']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={['#ffffff', '#f0f0f0']}
            style={styles.logoBackground}
          >
            <FontAwesome name="paint-brush" size={50} color="#0a7ea4" />
          </LinearGradient>
          <ThemedText style={styles.appName}>ArtConnect</ThemedText>
          <ThemedText style={styles.tagline}>Объединяем художников</ThemedText>
        </View>
        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/auth/login')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#ffffff', '#f5f5f5']}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <ThemedText style={styles.buttonText}>Войти</ThemedText>
              <FontAwesome name="sign-in" size={20} color="#0a7ea4" style={styles.buttonIcon} />
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/auth/register')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#ffffff', '#f5f5f5']}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <ThemedText style={styles.buttonText}>Регистрация</ThemedText>
              <FontAwesome name="user-plus" size={20} color="#0a7ea4" style={styles.buttonIcon} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>Присоединяйтесь к сообществу</ThemedText>
          <ThemedText style={styles.footerText}>художников со всего мира</ThemedText>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  appName: {
    fontSize: 36,
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
    opacity: 0.9,
  },
  buttonsContainer: {
    width: width * 0.8,
    marginVertical: 40,
  },
  button: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
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
    paddingVertical: 18,
  },
  buttonText: {
    color: '#0a7ea4',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    color: '#ffffff',
    fontSize: 14,
    opacity: 0.8,
    textAlign: 'center',
  },
}); 