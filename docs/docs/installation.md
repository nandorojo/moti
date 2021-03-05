---
id: installation
title: Installation
---

Moti uses [Reanimated 2](https://docs.swmansion.com/react-native-reanimated/) under the hood to drive high-performance animations on iOS, Android and Web.

## Starter project

If you're starting a project from scratch, or just want to play around, you can use the Expo + Moti [starter](https://github.com/expo/examples/tree/master/with-moti).

`npx create-react-native-app -t with-moti`

## Install Moti

First, install `moti` in your app:

```bash npm2yarn
npm install moti
```

## Install Reanimated 2

Moti requires that you install `react-native-reanimated`. The minimum version of Reanimated it's been tested on is `2.0.0-rc.0`.

### If you're using Expo

Please follow the [Expo instructions](https://docs.expo.io/versions/latest/sdk/reanimated/#experimental-support-for-v2) for installing `react-native-reanimated` v2.

You'll need at least [Expo SDK 40](https://docs.expo.io/workflow/upgrading-expo-sdk-walkthrough/).

### If you aren't using Expo

Please follow Reanimated's [installation instructions](https://docs.swmansion.com/react-native-reanimated/docs/installation) for v2.

## Web support

Please see the following guides:

- [Expo Web](/web#expo-web-support)
- [Next.js](/next)
- [React Native Web](/web#other-react-native-web-setups)

## Hermes/Android Support

Moti uses `Proxy` under the hood, which is not supported on older versions of Hermes (see [hermes#33](https://github.com/facebook/hermes/issues/33)).

### If you're using React Native 0.63.x

Install `v0.5.2-rc.1` of Hermes:

```bash npm2yarn
npm install hermes-engine@v0.5.2-rc1
```

Relevant release notes for v0.5.2-rc1 [here](https://github.com/facebook/hermes/releases/tag/v0.5.2-rc1).

### If you're using React Native 0.64.x

Upgrade Hermes to `0.7.*`.

### Possible error

As mentioned in this [Moti issue](https://github.com/nandorojo/moti/issues/13), if you don't install the correct version of Hermes, you might see this error:

```sh
Property 'Proxy' doesn't exist, js engine: hermes [Mon Feb 08 2021 19:21:54.427] ERROR Invariant Violation: Module AppRegistry is not a registered callable module (calling runApplication), js engine: hermes
```

If you see this, you haven't correctly installed the right version of Hermes, so please confirm that.

## Using inline requires

If you're using [Inline Requires](https://instagram-engineering.com/making-instagram-com-faster-code-size-and-execution-optimizations-part-4-57668be796a8), you might need to import `react-native-reanimated` in the root of your app before using any Moti code.

```ts
// App.js
import 'react-native-reanimated'
```

Only do this if you notice your app isn't working with Moti and you have inline requires enabled.

## Create your first animation

```tsx
import { View as MotiView } from 'moti'

export const FadeIn = () => (
  <MotiView
    from={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ type: 'timing' }}
  />
)
```

Your component will now fade in on the native thread at 60 FPS.
