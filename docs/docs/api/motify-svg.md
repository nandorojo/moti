---
id: motify-svg
title: motifySvg()
---

```tsx
import { motifySvg } from 'moti/svg'
```

A higher-order component that turns any React Native SVG component into an animated `moti` component. It's the same as `motify`, but for SVG elements.

```ts
import { motifySvg } from 'moti/svg'
import { Svg, Rect } from 'react-native-svg'

const MotiRect = motify(Rect)()
```

You can now pass any SVG props to the `animate` property, and they will animate there:

```tsx
<MotiRect
  animate={{
    // height sequence animation
    height: [50, 100],
    x: visible ? 0 : 10,
  }}
  transition={{
    // default all to timing
    type: 'timing',
    x: {
      // override the transition for x
    },
  }}
/>
```

This functionality compatible with all Moti features, including hooks like `useDynamicAnimation`:

```tsx
import { Rect } from 'react-native-svg'
import { motifySvg } from 'moti/svg'
import { useDynamicAnimation } from 'moti'

const MotiRect = motifySvg(Rect)()

export default function App() {
  const animation = useDynamicAnimation<ComponentProps<typeof Rect>>(() => ({
    x: 0,
  }))

  return <MotiRect state={animation} />
}
```

## How it works

Under the hood, `motifySvg` runs `Animated.createAnimatedComponent` for you, so don't call that yourself.

Instead, just pass a normal `View` (or its equivalent).

Notice that `motifySvg()` returns a function. At the moment, the function it returns doesn't take any arguments. But I like this composition pattern, so I built the API this way to account for using the returned function in the future.
