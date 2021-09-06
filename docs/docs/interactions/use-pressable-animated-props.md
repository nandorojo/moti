---
id: use-pressable-animated-props
title: useMotiPressableAnimatedProps
---

```tsx
import { useMotiPressableAnimatedProps } from '@motify/interactions'
```

If you've used `useAnimatedProps` from `react-native-reanimated` before, then this will look familiar. It serves the same purpose, with the added feature of using the `hovered` and `pressed` states.

## Usage

```tsx
const Menu = () => {
  return (
    <MotiPressable>
      <Trigger />
      <MenuItems />
    </MotiPressable>
  )
}

const MenuItems = () => {
  const animatedProps = useMotiPressableAnimatedProps(({ hovered }) => {
    'worklet'

    return {
      pointerEvents: hovered ? 'auto' : 'none',
    }
  }, [])
  return (
    <MotiView animatedProps={animatedProps}>{/* Menu items here...*/}</MotiView>
  )
}
```

## API

The following usages are valid:

```tsx
useMotiPressableAnimatedProps(factory, deps?)
```

If there's a unique MotiPressable component with an `id` prop as the parent, then pass `id` as the first argument:

```tsx
useMotiPressableAnimatedProps(id, factory, deps?)
```

### Arguments

- `factory` is a worklet that receives the interaction state as the first argument, and returns props that should be animated.
- `id` is a unique string to identify the parent `MotiPressable` component whose interaction state you're trying to access.
- `deps` is a dependency array, just like `useMemo`

### Returns

Animated props, to be passed a Reanimated or Moti component's `animatedProps` prop.

## Web

`animatedProps` cannot be used with `animate` on the same prop on Web.

```tsx
//  🚨 bad
const animateProps = useMotiPressableAnimatedProps(...)

<MotiView animate={...} animatedProps={animatedProps}>

</MotiView>
```

If you need to do both, please split your usage into two components; one that receives the `animate` prop, and another that receives `animateProps`. This is a limitation in Reanimated 2.

```tsx
// ✅ good
const animateProps = useMotiPressableAnimatedProps(...)

<MotiView animatedProps={animatedProps}>
  <MotiView animate={...} />
</MotiView>
```
