const path = require('path')

module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          extensions: ['.tsx', '.ts', '.js', '.json'],
          alias: {
            // For development, we want to alias the library to the source
            moti$: path.join(__dirname, '../../packages/moti/src/index.tsx'),
            'moti/skeleton': path.join(
              __dirname,
              '../../packages/moti/src/skeleton/index.ts'
            ),
            'moti/interactions': path.join(
              __dirname,
              '../../packages/moti/src/interactions/index.ts'
            ),
          },
        },
      ],
    ],
  }
}
