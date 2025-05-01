import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar, View, Alert, Platform } from 'react-native';
import { MessageProvider } from '@/app/context/MessageContext';
import 'react-native-reanimated';
import * as Updates from 'expo-updates';
import { ThemeProvider } from '@react-navigation/native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/profile` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Проверка и применение обновлений
  useEffect(() => {
    async function checkForUpdates() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          if (Platform.OS === 'ios' || Platform.OS === 'android') {
            Alert.alert(
              'Обновление',
              'Доступно обновление приложения. Перезапустить сейчас?',
              [
                { text: 'Не сейчас', style: 'cancel' },
                { text: 'Обновить', onPress: async () => await Updates.reloadAsync() }
              ]
            );
          } else {
            await Updates.reloadAsync();
          }
        }
      } catch (error) {
        console.log('Ошибка при проверке обновлений:', error);
      }
    }

    checkForUpdates();
  }, []);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav colorScheme={colorScheme} />;
}

function RootLayoutNav({ colorScheme }: { colorScheme: 'light' | 'dark' }) {
  return (
    <MessageProvider>
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </View>
    </MessageProvider>
  );
}
