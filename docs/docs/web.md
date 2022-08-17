---
id: web
title: Web Support
sidebar_label: Web Support
---

Moti works on all platforms, including web. Make sure you've installed `react-native-web` and done anything you need to get that working.

## Expo Web support

The following applies to React Native Web apps that **do not** use Next.js.

Since Moti uses Reanimated 2, we need its Babel plugin to be applied to Moti. Since Expo Web doesn't transpile modules by default, we'll need to tell it to transpile Moti.

First, install `@expo/webpack-config` to your `devDependencies`:

```bash npm2yarn
npm install -D @expo/webpack-config
```

Next, create a custom `webpack.config.js` in the root of your Expo app, and paste the contents below:

`webpack.config.js`

```js
const createExpoWebpackConfigAsync = require('@expo/webpack-config')

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: { dangerouslyAddModulePathsToTranspile: ['moti', '@motify'] },
    },
    argv
  )

  config.resolve.alias['framer-motion'] = 'framer-motion/dist/framer-motion'

  return config
}
```

Your app will now run with Expo Web!
