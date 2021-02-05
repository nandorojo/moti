# `useAnimationState`

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

`useAnimatedState` lets you control your animation state, based on static presets. It is the most performant way to drive animations, since it lives fully on the native side.

When using this hook, your animations are static, meaning they have to be known ahead of time. Re-rendering your component does not update your styles.

For most cases, this is fine anyway, but just keep that in mind. If you need styles that depend on React state, just use a component's `animate` prop instead of this hook.

## Basic Usage

Create your `animationState`, and pass it as your moti component's `state` prop.

```tsx
import React from 'react'
import { View, useAnimationState } from 'moti'
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

### Changing variant

To change the animation variant, use the `transitionTo` prop.

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

This means the `useAnimatedState` hook should only be used with static states. If you need dynamic states, please use the `animate` prop directly.

## Minor suggestion

As a rule of thumb, don't destructure the `animator`. `animator` has a stable reference, but the values inside of it do not.

```js
// ✅ in general, do this
const animator = useAnimationState(...)

useEffect(() => {
 if (loading) animator.transitionTo('some-state')
 else animator.transitionTo('some-other-state')
}, [animator, loading])

// 🚨 not this
const { current, transitionTo } = useAnimationState(...)

useEffect(() => {
 if (loading) transitionTo('some-state')
 else transitionTo('some-other-state')
}, [transitionTo, loading])
```

You don't have to follow that suggestion if you don't want to. But I recommend it to prevent unintended consequences of triggering effects when these are used in dependency arrays.

If you aren't using the animator in a dependency array anywhere, then you can ignore this suggestion. But I treat it as a rule of thumb to keep things simpler.

Technically, it's fine if you do this with `transitionTo`. It's `current` you'll want to watch out for, since its reference will change, without triggering re-renders. This functions similar to `useRef`.

## Arguments

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

If both `from` and `to` are set, then it will transition from one to the other on the component's initial mount.

If, for some reason, you really don't want to use `from` and `to` as your props, you can pass a second argument object with `from`/`to` keys that rename them.

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

// ✅ do this instead
<View animate={{ opacity: isLoading ? 1 : 0 }} />
```

`useAnimationState` should _only_ be used for **static** variants, meaning the different potential states you'll be animating to will be known ahead of time.

Any **dynamic** animations should be used with a component's `animate` prop directly.

### Yet another caveat

Okay, now that I got those caveats out of the way, I'll clarify: the variant will transition to whatever the variant object is **when you call `transitionTo`**. So technically, you can use dynamic variables in this hook. However, re-renders will not trigger changes; only calling `transitionTo` will change it.
