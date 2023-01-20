module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            moti$: '../../packages/moti',
            'react-native': './node_modules/react-native',
            'react-native-gesture-handler':
              './node_modules/react-native-gesture-handler',
            'react-native-reanimated': './node_modules/react-native-reanimated',
            react: './node_modules/react',
          },
        },
      ],
    ],
  }
}
