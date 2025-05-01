import * as ExpoHaptics from 'expo-haptics';

// Экспортируем Haptics для использования в других файлах
export const Haptics = {
  // Импактная (ударная) тактильная обратная связь
  impactAsync: (style: ExpoHaptics.ImpactFeedbackStyle = ExpoHaptics.ImpactFeedbackStyle.Medium) => {
    try {
      ExpoHaptics.impactAsync(style);
    } catch (error) {
      console.error('Haptics impact error:', error);
    }
  },

  // Уведомительная тактильная обратная связь
  notificationAsync: (type: ExpoHaptics.NotificationFeedbackType = ExpoHaptics.NotificationFeedbackType.Success) => {
    try {
      ExpoHaptics.notificationAsync(type);
    } catch (error) {
      console.error('Haptics notification error:', error);
    }
  },

  // Выбор с тактильной обратной связью
  selectionAsync: () => {
    try {
      ExpoHaptics.selectionAsync();
    } catch (error) {
      console.error('Haptics selection error:', error);
    }
  }
};

export default Haptics; 