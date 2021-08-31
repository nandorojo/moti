---
id: use-pressables
title: useMotiPressables
---

```tsx
import { useMotiPressables } from '@motify/interactions'
```

`useMotiPressables` lets you access the interaction state of multiple `MotiPressable` parents. This lets you combine multiple different interactions and build animation states with ease.

## Usage

```tsx
const ListItem = ({ id }) => {
  const state = useMotiPressables((container) => {
    'worklet'

    // access items by their unique IDs
    const list = containers.list.value
    const item = containers[`item-${id}`].value

    let opacity = 1

    if (list.hovered && !item.hovered) {
      opacity = 0.5
    }

    return {
      opacity,
    }
  }, [])
}

return <MotiView state={state} />
```

## Walk Through

Imagine we have a list. The outer container component is a `MotiPressable`, and each item has a `MotiPressable` too.

```tsx
<MotiPressable id="list">
  {items.map(id =>
    <MotiPressable id={`item-${id}`} key={id}>
      <ListItem id={id} />
    </MotiPressable>
  )}
<MotiPressable>
```

Now, the `ListItem` component can call `useMotiPressables` instead of `useMotiPressable`.

Say we want to make all items fade away when you hover over the list, _except_ for the actual item you're hovering.

```tsx
import { useMotiPressables } from '@motify/interactions'

const ListItem = ({ id }) => {
  const state = useMotiPressables((containers) => {
    'worklet'

    // access items by their unique IDs
    const list = containers.list.value
    const item = containers[`item-${id}`].value

    let opacity = 1

    if (list.hovered && !item.hovered) {
      opacity = 0.5
    }

    return {
      opacity,
    }
  }, [])
  return <MotiView state={state} />
}
```

## Performance

This hook runs on the native thread and triggers zero re-renders. That means it's great for performance out-of-the-box.

Similar to `useMemo`, you can also pass in a dependency array as the last argument to reduce updates:

```tsx
const state = useMotiPressables(
  (containers) => {
    'worklet'

    const list = containers.list.value

    return {
      opacity: list.pressed && !loading ? 0.5 : 1,
    }
  },
  [loading] // pass an empty array if there are no dependencies
)
```

## API

The following usages are valid:

```tsx
useMotiPressables(factory, deps?)
```

### Arguments

- `factory` is a worklet that returns a style object.
  - Its only argument is a `containers` dictionary, whose keys are the `id` props of the containers, and the values are the derived values of each interaction state.
- `id` is a unique string to identify the parent `MotiPressable` component whose interaction state you're trying to access.
- `deps` is a dependency array, just like `useMemo`

### Returns

A Moti `state` object, meant to be passed to any Moti component's `state` prop.
