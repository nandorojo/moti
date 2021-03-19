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

  return config
}
```

Your app will now run with Expo Web!

## Known issues

### Spring animations

By default, `moti` uses `type: 'spring'` for animations.

However, Reanimated 2's spring animations are currently glitchy on web.

If you want to use springs, I recommend setting `overshootClamping: false`. This seems to solve it on web:

```tsx
<MotiView transition={{ overshootClamping: false }} />
```

Thanks to [pranshuchittora](https://github.com/pranshuchittora) for discovering this workaround.

See [Reanimated issue #1804](https://github.com/software-mansion/react-native-reanimated/issues?q=is%3Aissue+web+is%3Aclosed+) for more info on this problem. It should be solved once `react-native-web` merges [#1939](https://github.com/necolas/react-native-web/pull/1939). Once that's merged, you'll need to install the new version of RNW (`0.15.x`, presumably.)

Another solution is to use `timing` transitions instead of the default `spring`.

You can configure your animation settings using the `transition` prop of any Moti component.

```tsx
import React from 'react'
import { View as MotiView } from 'moti'

export default function Timing() {
  return (
    <MotiView
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
