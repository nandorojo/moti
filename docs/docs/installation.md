---
id: installation
title: Installation
---

Moti uses [Reanimated 2](https://docs.swmansion.com/react-native-reanimated/) under the hood to drive high-performance animations on iOS, Android and Web.

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
