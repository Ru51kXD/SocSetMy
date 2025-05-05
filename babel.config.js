module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Поддержка реакт-нейтив-ревилеблс
      'react-native-reanimated/plugin',
      // Поддержка абсолютных импортов
      ['module-resolver', {
        root: ['.'],
        alias: {
          '@': '.',
          '@app': './app',
          '@components': './components',
          '@constants': './constants',
          '@hooks': './hooks',
          '@assets': './assets',
        },
        extensions: [
          '.ios.js',
          '.android.js',
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
          '.json',
        ],
      }],
    ],
  };
};
