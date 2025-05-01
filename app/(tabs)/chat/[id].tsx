import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';

/**
 * Этот экран заменен интегрированным чатом в экране сообщений.
 * Теперь он выполняет перенаправление на экран сообщений.
 */
export default function ChatRedirectScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  useEffect(() => {
    // Перенаправляем на экран сообщений
    router.replace('/(tabs)/messages');
  }, [router]);
  
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0a7ea4" />
      <ThemedText style={styles.text}>Перенаправление...</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
}); 