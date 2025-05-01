import { Tabs } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';

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

  // Определяем максимальное количество табов на основе ширины экрана
  const MAX_TABS = 5; // Максимальное количество табов на экране

  return (
    <Tabs
      backBehavior='initialRoute'
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: styles.tabBarIcon,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: true,
        tabBarItemStyle: {
          paddingVertical: 2,
          height: 50,
          width: width / MAX_TABS, // Равномерное распределение ширины
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 0,
        },
        tabBarBackground: () => (
          <View style={[
            styles.tabBarBackground,
            {backgroundColor: colorScheme === 'dark' ? '#1E2124' : '#FFFFFF'}
          ]} />
        ),
      })}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Лента',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="home" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Поиск',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="search" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="upload/index"
        options={{
          title: 'Загрузить',
          headerShown: false,
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
          headerShown: false,
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="chatbubble" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Профиль',
          headerShown: false,
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
      <Tabs.Screen
        name="chat/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="gallery/index"
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
    height: 60,
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
    paddingTop: 5,
    paddingBottom: 8,
    paddingHorizontal: 0,
    justifyContent: 'space-between',
    flexDirection: 'row',
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
    fontSize: 9,
    fontWeight: '600',
    marginTop: 1,
    marginBottom: 3,
    textAlign: 'center',
  },
  tabBarIcon: {
    marginTop: 0,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
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
