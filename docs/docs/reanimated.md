---
title: Moti vs. Reanimated
---

Should you use `moti` or `react-native-reanimated`? I get this question often, so let's break it down.

First off, Moti uses Reanimated under the hood. This means that Moti's components can do anything a Reanimated can, with additional features.

## Simple comparison

Let's start by comparing a simple example. Take this Moti component:

```tsx
import { MotiView } from 'moti'

export function Moti({ isActive }) {
  return <MotiView animate={{ opacity: isActive ? 1 : 0 }} />
}
```

Let's implement the same thing with Reanimated:

```tsx
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'

export function Reanimated({ isActive }) {
  const style = useAnimatedStyle(() => ({
    opacity: withTiming(isActive ? 1 : 0),
  }))

  return <Animated.View style={style} />
}
```

Under the hood, Moti builds this `useAnimatedStyle` hook for you, with a number of additional features.

The benefit of using Reanimated directly is often more seen with imperative usage, which I'll touch on later. But for declarative styles, the Moti API usually offers what you need.

## Reanimated props in Moti

Let's rewrite the Reanimated example from above, this time using `MotiView` instead of `Animated.View`.

```tsx
import { useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { MotiView } from 'moti'

export function Reanimated({ isActive }) {
  const style = useAnimatedStyle(() => ({
    opacity: withTiming(isActive ? 1 : 0),
  }))

  return <MotiView style={style} />
}
```

Turns out, that's completely valid. After all, `MotiView` is a layer on top of `Animated.View`. If it works with Reanimated, then it works with Moti.

## Shared Values

Reanimated shared values let you power animations at 60 FPS without triggering any re-renders. This offers great performance.

When using `useAnimationState` or `useDynamicAnimation` from Moti, you are using a Reanimated shared value under the hood to power animations.

### `animate` prop

To use Reanimated shared values with Moti, you can pass `useDerivedValue` to the `animate` prop. This allows the `animate` prop to be fully reactive to shared value changes, without requiring re-renders.

```tsx
import { MotiView } from 'moti'
import { useSharedValue, useDerivedValue } from 'react-native-reanimated'

export function WithSharedValue() {
  const isValid = useSharedValue(false)

  return (
    <MotiView
      animate={useDerivedValue(() => ({
        opacity: isValid.value ? 1 : 0,
      }))}
    />
  )
}
```

The values in `animate` will automatically transition. You don't need to use `withTiming`/`withSpring` functions. Instead, you can customize transitions with the `transition` prop.

### Derived values

You can also use derived values with Moti. Here, we'll derive `translateY` from `isValid`. We'll then use it inside of the `animate` prop's derived value.

```tsx
import { MotiView } from 'moti'
import { useSharedValue, useDerivedValue } from 'react-native-reanimated'

export function WithSharedValue() {
  const isValid = useSharedValue(false)
  const translateY = useDerivedValue(() => (isValid.value ? 0 : -10))

  return (
    <MotiView
      animate={useDerivedValue(() => ({
        opacity: isValid.value ? 1 : 0,
        translateY: translateY.value,
      }))}
      transition={{
        type: 'timing',
        duration: 300,
        translateY: {
          // custom override for translateY
          type: 'spring',
        },
      }}
    />
  )
}
```

### Custom transitions

You can also pass `useDerivedValue` to your `transition` prop to use Reanimated values.

```tsx
import { MotiView } from 'moti'
import { useSharedValue, useDerivedValue } from 'react-native-reanimated'

export function WithSharedValue() {
  const isValid = useSharedValue(false)

  return (
    <MotiView
      animate={useDerivedValue(() => ({
        opacity: isValid.value ? 1 : 0,
      }))}
      transition={useDerivedValue(() => ({
        delay: isValid.value ? 0 : 100,
      }))}
    />
  )
}
```

## Gestures

For animating based on simple interactions, such as hovered and pressed states, I recommend using [`moti/interactions`](/interactions/overview).

However, Moti will also work with `react-native-gesture-handler`. You can use `useSharedValue` as shown above to track gestures.

Or, you can use a Moti hook:

```tsx
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import { MotiView, useDynamicAnimation } from 'moti'

export function WithGestures() {
  const state = useDynamicAnimation(() => ({
    opacity: 0,
  }))

  const gesture = Gesture.Tap()
    .onStart(() => {
      state.animateTo({
        opacity: 1,
      })
    })
    .onEnd(() => {
      state.animateTo({
        opacity: 0,
      })
    })

  return (
    <GestureDetector gesture={gesture}>
      <MotiView state={state} collapsable={false} />
    </GestureDetector>
  )
}
```

## When should I use Reanimated directly?

If you find yourself hacking together something really complicated with Moti, it might be worth trying out Reanimated directly. For complex gestures that require granular control, Reanimated is likely the way to go.

### Imperative control

Reanimated offers a cool way of using an imperative-style API:

```tsx
const x = useSharedValue(0)
const y = useSharedValue(0)

const onPress = () => {
  x.value = withTiming(20, { duration: 200 }, (finished) => {
    if (finished) {
      y.value = withSequence(withTiming(20), withSpring(30))
    }
  })
}
```

If you're chaining together multiple animations with complex things done in each step, Reanimated might be the way to go.

Moti lets you listen to changes in animations with the `onDidAnimate` prop, but it's harder to know which step of the animation was fired.

## Direct Comparisons

### Mount animations

#### Moti

```tsx
import { MotiView } from 'moti'

export const Moti = () => (
  <MotiView
    from={{
      translateY: -10,
      opacity: 0,
    }}
    animate={{
      translateY: 0,
      opacity: 1,
    }}
  />
)
```

#### Reanimated

```tsx
import Animated, {
  useSharedValue,
  withTiming,
  withSpring,
  useAnimatedStyle,
} from 'react-native-reanimated'

export const Reanimated = () => {
  const isMounted = useSharedValue(false)

  const style = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isMounted.value ? 1 : 0),
      transform: [
        {
          translateY: withSpring(isMounted.value ? 0 : -10),
        },
      ],
    }
  })

  useEffect(() => {
    isMounted.value = true
  }, [])

  return <Animated.View style={style} />
}
```

### Sequences

#### Moti

```tsx
import { MotiView } from 'moti'

const Moti = () => (
  <MotiView
    animate={{
      translateY: [
        0,
        10,
        { value: 0, delay: 100, type: 'timing', duration: 100 },
      ],
    }}
  />
)
```

#### Reanimated

```tsx
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
} from 'react-native-reanimated'

export const Reanimated = () => {
  const style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withSequence(
            withSpring(0),
            withSpring(10),
            withTiming(0, { delay: 100, duration: 200 })
          ),
        },
      ],
    }
  })

  return <Animated.View style={style} />
}
```

### Animation callbacks

#### Moti

```tsx
import { MotiView } from 'moti'

const Moti = () => (
  <MotiView
    from={{
      opacity: 0,
    }}
    animate={{
      opacity: 1,
    }}
    onDidAnimate={(key, finished, maybeValue, { attemptedValue }) => {
      if (key === 'opacity') {
        // do something
      }
    }}
  />
)
```

#### Reanimated

```tsx
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'

export const Reanimated = () => {
  const isMounted = useSharedValue(false)

  const style = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isMounted.value ? 1 : 0, undefined, (finished) => {
        if (finished) {
          // do something
        }
      }),
    }
  })
  return <Animated.View style={style} />
}
```
