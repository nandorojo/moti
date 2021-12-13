---
id: animations
title: Overview
---

Moti has a number of powerful features that make your animations slick and simple.

```ts
import { MotiView, MotiText } from 'moti'
```

## Mount animations

You can set the initial state with `from`. Any styles passed to `animate` will transition for you.

```tsx
<MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} />
```

## Animate based on React state

```tsx
<MotiView animate={{ opacity: isLoading ? 1 : 0 }} />
```

This is useful for dynamic height changes, for instance.

```tsx
const [height, setHeight] = useMeasure()

<MotiView
  animate={{
    height,
  }}
/>
```

## Customize your animation

Moti animations are highly configurable, thanks to the `transition` prop. If you've used `framer-motion`, this will look familiar.

```tsx
<MotiView
  from={{ opacity: 0, scale: 0.5 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{
    type: 'timing',
    duration: 350,
  }}
/>
```

You can also configure different transitions per-style:

```tsx
<MotiView
  from={{ opacity: 0, scale: 0.5 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{
    // default settings for all style values
    type: 'timing',
    duration: 350,
    // set a custom transition for scale
    scale: {
      type: 'spring',
      delay: 100,
    },
  }}
/>
```

If you set `type: 'spring'`, you can pass any options that Reanimated's `withSpring` accepts. Same goes for `type: 'timing'` & Reanimated's `withTiming`.

## Mount/unmount animations 😎

Framer Motion introduced the incredible [`AnimatePresence`](https://www.framer.com/api/motion/animate-presence/) component to animate a component before it unmounts.

With Moti, you can now achieve the same thing in React Native.

### Import `AnimatePresence`

```tsx
import { AnimatePresence } from 'moti'
```

### Add an `exit` prop

Wrap your animation with `AnimatePresence`, and add an `exit` prop.

```tsx
const [visible, setVisible] = useState(false)

<AnimatePresence>
  {visible && (
    <MotiView
      from={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
      }}
    />
  )}
</AnimatePresence>
```

Even though it's experimental, I think this feature is so cool.

### Exit before enter

You can leverage the [`exitBeforeEnter`](https://www.framer.com/api/motion/animate-presence/#animatepresenceprops.exitbeforeenter) prop to only allow one item to be visible at a time.

Make sure that its direct children have a unique `key` prop for this to work.

```tsx
const Skeleton = () => (
  <MotiView
    animate={{ opacity: 1 }}
    exit={{
      opacity: 0,
    }}
  />
)

const WithAnimatedPresence = () => (
  <AnimatePresence exitBeforeEnter>
    {loading && <Skeleton key="skeleton" />}

    {!loading && (
      <MotiView
        key="content"
        animate={{ opacity: 1 }}
        exit={{
          opacity: 0,
        }}
      />
    )}
  </AnimatePresence>
)
```

In the example above, the `content` won't load in until after the `skeleton` has faded out.

The `exit` prop can be inside of a nested component. However, it's important that the _direct_ children of `AnimatePresence` have a unique `key`.

## Delay animations

You can use the `delay` prop

```tsx
<MotiView
  // delay in milliseconds
  delay={200}
  from={{ translateY: -5 }}
  animate={{ translateY: 0 }}
/>
```

Or, pass your `delay` in `transition`:

```tsx
<MotiView
  from={{ translateY: -5 }}
  animate={{ translateY: 0 }}
  transition={{
    delay: 100,
  }}
/>
```

You can also set a different delay per-style:

```tsx
<MotiView
  from={{ translateY: -5, opacity: 0 }}
  animate={{ translateY: 0, opacity: 1 }}
  transition={{
    translateY: {
      delay: 100,
    },
    opacity: {
      delay: 250,
    },
  }}
/>
```

## Sequence animations

To create a sequence animation, similar to CSS keyframes, just pass an array to any style:

```tsx
<MotiView
  animate={{
    scale: [0.1, 1.1, 1],
  }}
/>
```

This will animate to `0.1`, then `1.1`, then `1`.

If you want to customize each step of the animation, you can also pass an object with a `value` field.

```tsx
<MotiView
  animate={{
    scale: [
      // you can mix primitive values with objects, too
      { value: 0.1, delay: 100 },
      1.1,
      { value: 1, type: 'timing', delay: 200 },
    ],
  }}
/>
```

Any `transition` settings can be passed to a sequence object.

## Repeat & loop animations

Repeat an animation 4 times.

```tsx
<MotiView
  from={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{
    repeat: 4,
  }}
/>
```

By default, repetitions reverse, meaning they automatically animate back to where they just were.

You can disable this behavior with `repeatReverse: false`.

```tsx
<MotiView
  from={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{
    repeat: 4,
    // when false, animation goes 0 -> 1, then starts over back at 0
    repeatReverse: false,
  }}
/>
```

Setting `repeatReverse` to `true` is like setting `animationDirection: alternate` in CSS.

Infinitely loop from 0 to 1:

```tsx
<MotiView
  from={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{
    loop: true,
  }}
/>
```

Repetition styles can't be changed on the fly. Reanimated's `withRepeat` has some limitations, so just keep that in mind.

If you're trying to change them on the fly via re-render, you may have to update the component's `key`.

## Listen to animation changes

The `onDidAnimate` function prop gets called whenever an animation completes.

```tsx
<MotiView
  from={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  onDidAnimate={(
    styleProp,
    didAnimationFinish,
    maybeValue,
    { attemptedValue }
  ) => {
    console.log('[moti]', styleProp, didAnimationFinish) // [moti], opacity, true

    if (styleProp === 'opacity' && didAnimationFinish) {
      console.log('did animate opacity to: ' + attemptedValue)
    }
  }}
/>
```

## Variants

You can define static variants when your component mounts:

```tsx
const animationState = useAnimationState({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
})

// make sure to pass this to the `state` prop
return <MotiView state={animationState} />
```

Or set custom variants and update them on the fly:

```tsx
const animationState = useAnimationState({
  closed: {
    height: 0,
  },
  open: {
    height: 300,
  },
})

const onPress = () => {
  if (animationState.current === 'closed') {
    animationState.transitionTo('open')
  } else {
    animationState.transitionTo('closed')
  }
}

return <MotiView state={animationState} />
```

You can use this to create reusable animations, too:

```ts
const useFadeIn = () => {
  return useAnimationState({
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  })
}

const FadeInComponent = () => {
  const fadeInState = useFadeIn()

  return <MotiView state={fadeInState} />
}
```

Read more about [`useAnimationState`](use-animation-state).
