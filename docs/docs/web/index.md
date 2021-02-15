---
id: web
title: Web Support
sidebar_label: Web Support
---

Moti works on all platforms, including web. Make sure you've installed `react-native-web` and done anything you need to get that working.

## Expo Web support

Since Moti uses Reanimated 2, we need its Babel plugin to be applied to Moti. Since Expo Web doesn't transpile modules by default, we'll need to tell it to transpile Moti.

Create a custom `webpack.config.js` in the root of your Expo app, and paste the contents below:

`webpack.config.js`

```js
const createExpoWebpackConfigAsync = require('@expo/webpack-config')

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: { dangerouslyAddModulePathsToTranspile: ['moti'] },
    },
    argv
  )

  return config
}
```

Your app will now run with Expo Web!

## Other React Native Web setups

If you're using a different web solution, make sure that Babel knows to transpile Moti. You might need to create a `webpack.config.js` file like this:

`yarn add -D babel-loader`

```js
const createExpoWebpackConfigAsync = require('@expo/webpack-config')

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv)

  config.module.rules.push({
    test: /\.(js|ts|tsx)$/,
    exclude: /node_modules\/(?!(moti|@motify)\/).*/,
    use: 'babel-loader',
  })

  return config
}
```

I'm no Webpack expert, so consider this a hack. If you know the right solution for this file, please let me know and open a PR!

## Known issues

### Spring animations

In my experience, reanimated 2's spring animations are glitchy on web. I recommend using `timing` animations for now.

You can configure your animation settings using the `transition` prop of any Moti component.

```tsx
import React from 'react'
import { View } from 'moti'

export default function Timing() {
  return (
    <View
      from={{
        scale: 0.8,
        opacity: 0,
      }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      transition={{
        // timing instead of the default spring
        type: 'timing',
      }}
    />
  )
}
```
