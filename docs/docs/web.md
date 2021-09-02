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

#### Current workaround options (select one):
1. Use `react-native-web` between versions (`0.15.2` through `0.15.6`) for a temporary patch and the default `type: spring` will work on web.
2. Alternatively if you want to use springs, I recommend setting `overshootClamping: false`. This seems to solve it on web:

```tsx
<MotiView transition={{ overshootClamping: false }} />
```

Thanks to [pranshuchittora](https://github.com/pranshuchittora) for discovering this workaround.

3. Another solution is to use `timing` transitions instead of the default `spring`.

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


4. For using `react-native-web` > 0.15.6, check the status on an upcoming [release](https://github.com/software-mansion/react-native-reanimated/releases) that includes this pull request regarding [Reanimated setNativeProps](https://github.com/software-mansion/react-native-reanimated/pull/2280). It should be solved once `react-native-web` resolves issue [#1935](https://github.com/necolas/react-native-web/issues/1935).
