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

### yarn

```sh
yarn add moti
```

### npm

```sh
npm i moti --legacy-peer-deps
```

## Install Reanimated 2+

Moti requires that you install `react-native-reanimated`. Version 2 and 3 are both compatible.

<details>
  <summary>
    View Reanimated compatibility options
  </summary>
    

Moti `0.17.x` requires Reanimated `2.3.0` or higher. This version is compatible with Expo SDK 44.

Moti `0.16.x` is compatible with Reanimated `2.2.0`. This is compatible with Expo SDK 43.

Moti `0.8.x` and higher requires at least Reanimated v2 stable (`2.0.0` or higher). This version is compatible with Expo starting SDK 41.
</summary>

</details>

### If you're using Expo

Please follow the [Expo instructions](https://docs.expo.io/versions/latest/sdk/reanimated) for installing `react-native-reanimated` v2.

### If you aren't using Expo

Please follow Reanimated's [installation instructions](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation) for v2.

## Import Reanimated

Lastly, add this to the top of your `App.tsx`:

```ts
import 'react-native-reanimated'
import 'react-native-gesture-handler'
```

If you're using Next.js or [Solito](https://solito.dev), you should not add this import to your `_app.tsx`. See the Web instructions below for more.

## Web support

Please see the following guides:

- [Expo Web](/web)
- [Next.js](/next)
- [React Native Web](/web)

## Hermes

Moti works with Hermes as of version [`0.22`](https://github.com/nandorojo/moti/releases/tag/v0.22.0). It's been tested with React Native `0.70+`.

<details>
  <summary>
    Click here if you're using React Native 0.63.x with Hermes
  </summary>

Moti uses `Proxy` under the hood, which is not supported on older versions of Hermes (see [hermes#33](https://github.com/facebook/hermes/issues/33)). Follow the steps below if you're using Hermes.

### If you're using React Native 0.63.x

Install `v0.5.2-rc.1` of Hermes:

```bash npm2yarn
npm install hermes-engine@v0.5.2-rc1
```

Relevant release notes for v0.5.2-rc1 [here](https://github.com/facebook/hermes/releases/tag/v0.5.2-rc1).

### If you're using React Native 0.64.x

Upgrade Hermes to `0.7.*`.

## Possible errors

### Property 'Proxy' doesn't exist

As mentioned in this [Moti issue](https://github.com/nandorojo/moti/issues/13), if you don't install the correct version of Hermes, you might see this error:

```sh
Property 'Proxy' doesn't exist, js engine: hermes [Mon Feb 08 2021 19:21:54.427] ERROR Invariant Violation: Module AppRegistry is not a registered callable module (calling runApplication), js engine: hermes
```
  
</details>
 
## Create your first animation

```tsx
import { MotiView } from 'moti'

export const FadeIn = () => (
  <MotiView
    from={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ type: 'timing' }}
  />
)
```

Your component will now fade in on the native thread at 60 FPS.
