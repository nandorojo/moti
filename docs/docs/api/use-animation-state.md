---
id: use-animation-state
title: useAnimationState
sidebar_label: useAnimationState
---

`useAnimationState` is a React hook for driving animations. It's an alternative to the `animate` prop.

It's useful when you:

1. want the best performance on native, and
2. know your different animation states ahead of time

```js
const animationState = useAnimationState({
  from: {
    opacity: 0,
    scale: 0.9,
  },
  to: {
    opacity: 1,
    scale: 1.1,
  },
  expanded: {
    scale: 2,
  },
})

const onPress = () => {
  if (animationState.current === 'to') {
    animationState.transitionTo('expanded')
  }
}

return <View state={animationState} />
```

### When to use this

`useAnimatedState` lets you control your animation state based on static variants. It is the most performant way to drive animations, since it lives fully on the native thread.

When using this hook, your animations are static, meaning they have to be known ahead of time. You can change the state by using `transitionTo`, but re-rendering your component does not update your variants.

## Basic Usage

### Import

```ts
import { View, useAnimationState } from 'moti'
```

Moti exports typical `react-native` components, such as `View`, `Text`, etc.

### Define your state

```ts
const animationState = useAnimationState({
  from: {
    opacity: 0,
    scale: 0.9,
  },
  to: {
    opacity: 1,
    scale: 1,
  },
})
```

### Pass state to your Moti component

```tsx
<View state={animationState} />
```

Create your `animationState`, and pass it as your moti component's `state` prop.

## Update state with `transitionTo`

To change the animation variant, use the `transitionTo` function.

```tsx
const animationState = useAnimationState({
  from: {
    opacity: 0,
    scale: 0.9,
  },
  to: {
    opacity: 1,
    scale: 1,
  },
  active: {
    scale: 1.1,
    opacity: 1,
  },
})

return (
  <Pressable
    onPress={() => {
      animationState.transitionTo('active')
    }}
  >
    <View style={styles.shape} state={animationState} />
  </Pressable>
)
```

You can also transition based on the current animation state, similar to `setState` from React's `useState` hook:

```tsx
const animationState = useAnimationState({
  from: {
    opacity: 0,
    scale: 0.9,
  },
  to: {
    opacity: 1,
    scale: 1,
  },
  active: {
    scale: 1.1,
    opacity: 1,
  },
})

return (
  <Pressable
    onPress={() => {
      // you can pass a function here
      animationState.transitionTo((currentState) => {
        if (currentState === 'from') {
          return 'active'
        }
        return 'to'
      })
    }}
  >
    <View style={styles.shape} state={animationState} />
  </Pressable>
)
```

The function prop pattern isn't actually necessary, since updates are synchronous, unlike `setState`, which makes asynchronous updates. But I added this API because I'm used to it from `setState` and enjoy it.

It's worth noting that `animationState.transitionTo` will not trigger re-renders, so just keep that in mind.

## Read the `current` state

You could also read the current animation state, and use that to drive the next transiton, if you prefer:

```tsx
const animationState = useAnimationState({
  from: {
    opacity: 0,
    scale: 0.9,
  },
  to: {
    opacity: 1,
    scale: 1,
  },
  active: {
    scale: 1.1,
    opacity: 1,
  },
})

return (
  <Pressable
    onPress={() => {
      // you can read in the current state like this
      if (animationState.current === 'from') {
        animationState.transitionTo('active')
      }

      // or, like this, which achieves the exact same thing
      animationState.transitionTo((currentState) => {
        if (currentState === 'from') {
          return 'active'
        }
        return currentState
      })
    }}
  >
    <View style={styles.shape} state={animationState} />
  </Pressable>
)
```

## A full example

```tsx
import React from 'react'
import { useAnimationState, View } from 'moti'
import { StyleSheet } from 'react-native'

export default function PerformantView() {
  const animationState = useAnimationState({
    from: {
      opacity: 0,
      scale: 0.9,
    },
    to: {
      opacity: 1,
      scale: 1,
    },
  })

  return <View style={styles.shape} state={animationState} />
}

const styles = StyleSheet.create({
  shape: {
    justifyContent: 'center',
    height: 250,
    width: 250,
    borderRadius: 25,
    backgroundColor: 'cyan',
  },
})
```

## Mount Animations

```js
const animationState = useAnimationState({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
})

return <View state={animationState} />
```

If both `from` and `to` are set, then it will transition from one to the other on the component's initial mount. If only `from` is set, this will be the initial state.

If you don't want mount animations, give your variants different names.

<!--
## Example

```jsx
import { useAnimationState, View } from 'moti'

const animator = useAnimationState({
  from: {
    opacity: 0,
  },
  open: {
    opacity: 1,
  },
  pressed: {
    opacity: 0.7,
  },
})

return (
  <>
    <View state={animator} style={{ height: 100 }} />
    <Button
      title="Change!"
      onPressIn={() => {
        animator.transitionTo('pressed')
      }}
      onPressOut={() => animator.transitionTo('open')}
    />
  </>
)
```

You can also access the `current` state:

```jsx
import React from 'react'
import { Button } from 'react-native'
import  as Moti from 'moti'

const animator = Moti.useAnimationState({
  from: {
    opacity: 0
  },
  open: {
    opacity: 1
  },
  pressed: {
    opacity: 0.7
  }
})

return (
  <>
    <Moti.View state={animator} />
    <Button
     title="Change!"
     onPress={() => {
       if (animator.current === 'from') {
         animator.animateTo('open')
       } else {
         animator.animateTo('from')
       }
     }}
    />
  </>
)
```

If you provide an `from` key, this will be your default starting variant. If you don't, however, you can use the second argument to specify the from state. If you do not, then there will be no animated style to begin with (this is okay, as long as you intended it.)

```jsx
const animator = useAnimationState(
  {
    from: {
      opacity: 0,
    },
    open: {
      opacity: 1,
    },
  },
  { from: 'from' }
)
```

Note if you change variants on the fly by updating state, they will not re-render. This is to maintain good performance. Instead, you should pre-define all states in the first render. Then use `animator.transitionTo` to change state, and `animator.current` to read the state.

This means the `useAnimatedState` hook should only be used with static states. If you need dynamic states, please use the `animate` prop directly. -->

## Don't destructure

As a rule of thumb, don't destructure the animation state.

```js
// ✅ do this
const state = useAnimationState(...)
```

```js
// 🚨 not this
const { current, transitionTo } = useAnimationState(...)
```

### Why?

`useAnimationState` returns an object with a stable reference, but destructuring `.current` does not guarantee a stable reference.

You don't have to follow that suggestion if you don't want to. But I recommend it to prevent unintended consequences of triggering effects when these are used in dependency arrays.

If you aren't using the animator in a dependency array anywhere, then you can ignore this suggestion. But I treat it as a rule of thumb to keep things simpler.

Technically, it's fine if you do this with `transitionTo`. It's `current` you'll want to watch out for, since its reference will change, without triggering re-renders. This functions similar to `useRef`.

## API

### Arguments

- `variants` **(required)**
  - an object with variants specifying your different static styles.
  - to achieve mount animations, pass a `to` and `from` variant here.
- `config`
  - Optionally define your `from` and `to` variant keys.

If you need to rename `to` or `from`, do it like so:

```ts
// typically, it looks like this:
const animationState = useAnimationState({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
})

// but you can customize it if you want:
const animationState = useAnimationState(
  {
    initial: {
      opacity: 0,
    },
    next: {
      opacity: 1,
    },
  },
  {
    from: 'initial',
    to: 'next',
  }
)
```

By default, similar to `react-spring`, you can pass a `to` and a `from` variant. `from` will always be the initial state, assuming you pass `from`. It is not required, though.

If, for some reason, you really don't want to use `from` and `to` as your props, you can pass a second argument object with `from`/`to` keys that rename them.

### Returns

- `current` A synchronous way to read the current animation state. Returns the name of the current state (for example, `to`).
- `transitionTo(nextVariant)` A function that lets you update the state.

You can pass the next state directly to it: `animationState.transitionTo('open')

Or you can pass it a function:

```ts
animationState.transitionTo((prevState) => {
  if (prevState === 'open') {
    return 'close'
  }
  return 'open'
})
```

## Static animations only

Unlike `react-spring`'s `useSpring`, `useAnimationState` will **not** update your animation state if you change its style values.

```tsx
// 🚨 bad, do not do this
const state = useAnimationState({
  box: {
    // 😡 this will not update!
    opacity: isLoading ? 1 : 0,
  },
})

return <View state={state} />
```

```jsx
// ✅ do this instead
<View animate={{ opacity: isLoading ? 1 : 0 }} />
```

`useAnimationState` should _only_ be used for **static** variants, meaning the different potential states you'll be animating to will be known ahead of time.

Any **dynamic** animations should be used with a component's `animate` prop directly.

For most cases, this is fine, but just keep that in mind. If you need styles that automatically update based on React's state, use a component's `animate` prop instead of this hook.

### ...ok, but

Now that I got those warnings out of the way, I'll clarify: technically, you can use dynamic variables in this hook. However, only calling `transitionTo` will change the actual style. So if you use `dynamic` variables, just know that they won't apply to your styles until you call `transitionTo`.
