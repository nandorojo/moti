---
id: use-pressable-transition
title: useMotiPressableTransition()
---

```tsx
import { useMotiPressableTransition } from 'moti/interactions'
```

`useMotiPressableTransition` lets you motify any Moti component's `transition` prop based on a parent's interaction state.

Please refer to the Moti `transition` prop options to see what this hook should return.

Example:

```tsx
const transition = useMotiPressableTransition(({ pressed, hovered }) => {
  'worklet'

  if (pressed) {
    return {
      type: 'timing',
    }
  }

  return {
    type: 'spring',
    delay: 50,
  }
})

return <MotiView transition={transition} />
```

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
  const transition = useMotiPressableTransition(({ pressed }) => {
    'worklet'

    if (pressed) {
      return {
        type: 'timing',
      }
    }

    return {
      type: 'spring',
      delay: 50,
    }
  })
  
  const state = useMotiPressableState(({ pressed }) => {
    return {
      translateY: pressed ? -10 : 0,
    }
  })

  return <MotiView transition={transition} state={state} />
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

Then, in the `Item` component, add `list` as the first argument of `useMotiPressableTransition`:

```tsx
const state = useMotiPressableTransition('list', ({ pressed }) => {
  'worklet'

  return {
    opactiy: pressed ? 0.5 : 1,
  }
})

return <MotiView transition={transition} />
```

This lets you uniquely transition based on interactionns made on the `list` pressable.

## Performance

This hook runs on the native thread and triggers zero re-renders. Like all things moti, it has great performance out-of-the-box.

Similar to `useMemo`, you can also pass in a dependency array as the last argument to reduce updates:

```tsx
const state = useMotiPressableTransition(
  'list',
  ({ pressed, hovered }) => {
    'worklet'

    return {
      opactiy: pressed && !loading ? 0.5 : 1,
    }
  },
  [loading] // pass an empty array if there are no dependencies
)
```

## API

The following usages are valid:

```tsx
useMotiPressableTransition(factory, deps?)
```

If there's a unique MotiPressable component with an `id` prop as the parent:

```tsx
useMotiPressableTransition(id, factory, deps?)
```

### Arguments

- `factory` is a worklet that receives the interaction state as the first argument, and returns a transition object.
- `id` is a unique string to identify the parent `MotiPressable` component whose interaction state you're trying to access.
- `deps` is a dependency array, just like `useMemo`

### Returns

A Moti `transition` object, meant to be passed to any Moti component's `transition` prop.
