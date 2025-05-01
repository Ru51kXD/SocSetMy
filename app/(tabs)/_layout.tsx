import { Tabs } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, Dimensions } from 'react-native';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  focused: boolean;
}) {
  return (
    <View style={[
      styles.iconContainer, 
      props.focused ? styles.focusedIconContainer : styles.unfocusedIconContainer
    ]}>
      <Ionicons 
        size={props.focused ? 24 : 22} 
        style={styles.icon} 
        {...props} 
      />
      {props.focused && <View style={styles.activeIndicator} />}
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const activeColor = '#0a7ea4'; // Фиксированный основной цвет для единообразия
  const inactiveColor = colorScheme === 'dark' ? '#9BA1A6' : '#687076';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        headerShown: true,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: styles.tabBarIcon,
        tabBarHideOnKeyboard: true,
        tabBarBackground: () => (
          <View style={[
            styles.tabBarBackground,
            {backgroundColor: colorScheme === 'dark' ? '#1E2124' : '#FFFFFF'}
          ]} />
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Лента',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="home" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Поиск',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="search" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="gallery/index"
        options={{
          title: 'Галерея',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="images-outline" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="upload/index"
        options={{
          title: 'Загрузить',
          tabBarIcon: ({ color, focused }) => 
            <View style={focused ? styles.uploadButtonActive : styles.uploadButton}>
              <Ionicons 
                name="add" 
                size={24} 
                color={focused ? activeColor : '#FFF'} 
              />
            </View>,
          tabBarLabelStyle: {
            ...styles.tabBarLabel,
            marginTop: 4,
          },
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Сообщения',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="chatbubble" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Профиль',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="person" color={color} focused={focused} />,
        }}
      />
      
      {/* Скрытые маршруты - не отображаются в навигационной панели */}
      <Tabs.Screen
        name="artwork/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="category/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  tabBar: {
    height: 65,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    borderTopWidth: 0,
    position: 'relative',
    paddingTop: 8,
    paddingHorizontal: 5,
  },
  tabBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 5,
  },
  tabBarIcon: {
    marginTop: 0,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 30,
    borderRadius: 15,
    marginBottom: -2,
  },
  focusedIconContainer: {
    backgroundColor: 'rgba(10, 126, 164, 0.15)',
  },
  unfocusedIconContainer: {
    backgroundColor: 'transparent',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#0a7ea4',
  },
  icon: {
    marginBottom: 0,
  },
  uploadButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#0a7ea4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  uploadButtonActive: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(10, 126, 164, 0.15)',
    borderWidth: 2,
    borderColor: '#0a7ea4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  }
});
