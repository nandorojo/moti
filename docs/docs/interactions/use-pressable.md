---
id: use-pressable
title: useMotiPressable
---

```tsx
import { useMotiPressable } from '@motify/interactions'
```

`useMotiPressable` lets you access the interaction state of a parent `MotiPressable` component.

(If you need to access the interaction state of multiple `MotiPressable` parents, use `useMotiPressables` instead.)

## Usage

Wrap your component with `MotiPressable`.

```tsx
<MotiPressable>
  <Item />
</MotiPressable>
```

Then, in the `Item` component:

```tsx
const Item = () => {
  const state = useMotiPressable(({ pressed }) => {
    'worklet'

    return {
      opactiy: pressed ? 0.5 : 1,
    }
  })

  return <MotiView state={state} />
}
```

### Access a unique ID

You can also access a pressable via unique ID:

```tsx
<MotiPressable id="list">
  <Item />
</MotiPressable>
```

Then, in the `Item` component, add `list` as the first argument of `useMotiPressable`:

```tsx
const state = useMotiPressable('list', ({ pressed }) => {
  'worklet'

  return {
    opactiy: pressed ? 0.5 : 1,
  }
})

return <MotiView state={state} />
```

## Improve performance

Similar to `useMemo`, you can also pass in a dependency array as the last argument:

```tsx
const state = useMotiPressable(
  'list',
  ({ pressed, hovered }) => {
    'worklet'

    return {
      opactiy: pressed && !loading ? 0.5 : 1,
    }
  },
  [loading]
)
```

## API

The following usages are valid:

```tsx
useMotiPressable(factory, deps?)
```

If there's a unique MotiPressable component with an `id` prop as the parent:

```tsx
useMotiPressable(id, factory, deps?)
```

### Arguments

- `factory` is a worklet that receives the interaction state as the first argument, and returns a style object.
- `id` is a unique string to identify the parent `MotiPressable` component whose interaction state you're trying to access.
- `deps` is a dependency array, just like `useMemo`

### Returns

A Moti `state` object, meant to be passed to any Moti component's `state` prop.
