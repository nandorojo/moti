---
id: use-pressable
title: useMotiPressable()
---

```tsx
import { useMotiPressable } from 'moti/interactions'
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
      opacity: pressed ? 0.5 : 1,
    }
  })

  return <MotiView state={state} />
}
```

### Access a unique ID

You can also access a pressable via unique ID. Say you have mutliple nested pressables:

```tsx
<MotiPressable id="list">
  <MotiPressable>
    <Item />
  </MotiPressable>
</MotiPressable>
```

By adding `id="list"`, we can now access that unique component's interaction state.

Then, in the `Item` component, add `list` as the first argument of `useMotiPressable`:

```tsx
const state = useMotiPressable('list', ({ pressed }) => {
  'worklet'

  return {
    opacity: pressed ? 0.5 : 1,
  }
})

return <MotiView state={state} />
```

## Performance

This hook runs on the native thread and triggers zero re-renders. Like all things moti, it has great performance out-of-the-box.

Similar to `useMemo`, you can also pass in a dependency array as the last argument to reduce updates:

```tsx
const state = useMotiPressable(
  'list',
  ({ pressed, hovered }) => {
    'worklet'

    return {
      opacity: pressed && !loading ? 0.5 : 1,
    }
  },
  [loading] // pass an empty array if there are no dependencies
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
