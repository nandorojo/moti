const aliasPackages = (...packageNames) => {
  const alias = {}
  for (const packageName of packageNames) {
    alias[`moti/${packageName}`] = `../../packages/${packageName}/src`
  }
  return alias
}

module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['../../packages'],
          alias: {
            ...aliasPackages('interactions', 'skeleton', 'reorder'),
          },
        },
      ],
    ],
  }
}
