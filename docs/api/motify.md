# `motify`

A higher-order component that turns any React Native component into an animated `moti` component.

It returns a function, which you should call.

```jsx
import React from 'react'
import { View } from 'react-native'
import { motify } from 'moti'

function MyMotiComponent(props) {
  // make sure you forward props down
  return <View {...props} />
}

// notice that we call the function after!
const MotifiedComponent = motify(MyMotiComponent)()

export default MotifiedComponent
```

**Note** under the hood, `motify` runs `Animated.createAnimatedComponent` for you, so don't pass an `Animated.View`. Instead, just pass a normal `View` (or its equivalent).

At the moment, the function it returns doesn't take any arguments. But I like this composition pattern, so I build the API this way to account for using the returned function in the future.

## Context

`motify` is the function that Moti uses under the hood to create its primitives.

This is the component file in `moti`:

```tsx
import { motify } from '@motify/core'
import {
  View as RView,
  Text as RText,
  Image as RImage,
  ScrollView as RScrollView,
  SafeAreaView as RSafeAreaView,
} from 'react-native'

export const View = motify(RView)()
export const Text = motify(RText)()
export const Image = motify(RImage)()
export const ScrollView = motify(RScrollView)()
export const SafeAreaView = motify(RSafeAreaView)()
```

That should be all you need for any custom usage.

- Fernando Rojo
