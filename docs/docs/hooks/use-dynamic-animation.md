---
id: use-dynamic-animation
title: useDynamicAnimation
sidebar_label: useDynamicAnimation()
---

`useDynamicAnimation` is a hook that lets you use style objects dynamically, rather than using static variants.

It has all the same performance benefits of `useAnimationState`, with a more expressive API.

## `useDynamicAnimation(initialState?)`

```tsx
const animation = useDynamicAnimation(() => {
  // optional function that returns your initial style
  return {
    height: 100,
  }
})

const onLayout = ({ nativeEvent }) => {
  animation.animateTo({
    ...animation.current,
    height: nativeEvent.layout.height,
  })
}

// pass the animation to state of any Moti component
return <MotiView state={animation} />
```

### Benefits

- High performance
- Zero re-renders
- Animations run on the native thread
- Easy API

## Arguments

Receives one (optional) argument: a pure function which returns the initial state. This is similar to React `useState`'s first argument.

```ts
const animation = useDynamicAnimation(() => {
  // this is your initial state
  return {
    height: 100,
  }
})
```

## Returns

### `current`

Get the current animation state. Unlike `useState`'s return value, this can be safely read and accessed synchronously.

```ts
const animation = useDynamicAnimation(() => {
  // this is your initial state
  return {
    height: 100,
  }
})

const onPress = () => {
  console.log(animation.current) // { height: 100 }
}
```

### `animateTo(next)`

A function to animate to your next state. This is a worklet, so you can call it from the native thread.

```ts
const animation = useDynamicAnimation(() => {
  return {
    height: 100,
  }
})

const onPress = () => {
  animation.animateTo({ height: 200 })
}
```

You can also pass a function which receives the current style and returns the next state:

```ts
const animation = useDynamicAnimation(() => {
  return {
    height: 100,
    width: 100,
  }
})

const onPress = () => {
  animation.animateTo((current) => ({ ...current, height: 200 }))

  // or, you could do this! they're the same
  animation.animateTo({
    ...animation.current,
    height: 200,
  })
}
```

### Do not destructure

```ts
// 😡 don't do this
const { current, animateTo } = useDynamicAnimation()

// ✅ do this!
const animation = useDynamicAnimation()
```

## Sequences

Any Moti styles are valid here. For example, if you want a sequence animation, just pass an array.

```ts
const animation = useDynamicAnimation(() => {
  return {
    opacity: 1,
  }
})

const onPress = () => {
  animation.animateTo({
    // sequence
    opacity: [1, 0.5, { value: 0, delay: 1000 }],
  })
}
```

## Full example: Touchable pulse

```tsx
import React from 'react'
import { MotiView, useDynamicAnimation } from 'moti'
import {
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler'
import { useAnimatedGestureHandler } from 'react-native-reanimated'

export default function HoverPulse({
  scaleTo = 1.05,
  style,
  children,
  ...props
}) {
  const animation = useDynamicAnimation(() => ({
    // this is the initial state
    scale: 1,
  }))

  const onGestureEvent = useAnimatedGestureHandler<TapGestureHandlerGestureEvent>(
    {
      onStart: () => {
        animation.animateTo({ scale: scaleTo })
      },
      onFinish: () => {
        animation.animateTo({ scale: 1 })
      },
    }
  )

  return (
    <TapGestureHandler onGestureEvent={onGestureEvent}>
      <MotiView style={style} state={animation}>
        {children}
      </MotiView>
    </TapGestureHandler>
  )
}
```
