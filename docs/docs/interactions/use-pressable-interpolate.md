---
id: use-pressable-interpolate
title: useInterpolateMotiPressable
---

```tsx
import { useInterpolateMotiPressable } from '@motify/interactions'
```

In the rare case that you want more customization over pressable state, you can use `useInterpolateMotiPressable`. As the name implies, it lets you interpolate based on the current interaction state of a parent `MotiPressable`.

## Usage

```tsx
import { useSharedValue } from 'react-native-reanimated'
import { useInterpolateMotiPressable } from '@motify/interactions'

// in your component
const mySharedValue = useSharedValue(0)
useInterpolateMotiPressable(({ pressed }) => {
  'worklet'

  mySharedValue.value = pressed ? 1 : 0
})
```

## Access a unique parent

If you're passing a unique `id` prop to your pressable, you can also isolate this hook to that pressable.

Say the parent pressable has `id="menu"`, and you want to isolate this hook to the `menu` pressable:

```tsx
<MotiPressable id="menu">
  <Item />
</MotiPressable>
```

Then, in the `Item` component:

```tsx
const mySharedValue = useSharedValue(0)
useInterpolateMotiPressable('menu', ({ pressed }) => {
  'worklet'

  mySharedValue.value = pressed ? 1 : 0
})
```

## TypeScript support

`useInterpolateMotiPressable` returns an `Animated.DerivedValue`. You can also type it with a generic:

```tsx
const swipePosition = useSharedValue(0)
const interpolatedValue = useInterpolateMotiPressable<{ done: boolean }>(
  'menu',
  ({ pressed }) => {
    'worklet'

    return {
      done: swipePosition.value > 50 && !pressed,
    }
  }
)
```

## Use the result of the interpolation

Just like any derived value, you can read the value it returns with `.value`:

```tsx
const swipePosition = useSharedValue(0)
const interpolatedValue = useInterpolateMotiPressable<{ done: boolean }>(
  'menu',
  ({ pressed }) => {
    'worklet'

    return {
      done: swipePosition.value > 50 && !pressed,
    }
  }
)

// then, in some worklet
const done = state.value.done
```

## Performance

Similar to `useMemo`, you can also pass in a dependency array as the last argument:

```tsx
const swipePosition = useSharedValue(0)
const interpolatedValue = useInterpolateMotiPressable(({ pressed }) => {
  'worklet'

  return {
    done: swipePosition.value > 50 && !pressed,
  }
}, [])
```

## API

The following usages are valid:

```tsx
useInterpolateMotiPressable(factory, deps?)
```

If there's a unique MotiPressable component with an `id` prop as the parent:

```tsx
useInterpolateMotiPressable(id, factory, deps?)
```

### Arguments

- `factory` is a worklet that receives the interaction state as the first argument, and can return whatever it wants.
- `id` is a unique string to identify the parent `MotiPressable` component whose interaction state you're trying to access.
- `deps` is a dependency array, just like `useMemo`

### Returns

A derived value, which you can use in Reanimated worklets.
