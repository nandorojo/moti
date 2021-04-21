---
id: props
title: Component Props
sidebar_label: Component Props
---

All `moti` components have a few useful props:

- `animate` Magically animate any value passed here
- `from` The initial animation styles when the component mounts
- `exit` Unmount animation styles. This works the exact same as `framer-motion`'s exit prop, and requires wrapping your component with `AnimatePresence`. The only difference is you import `AnimatePresence` from `moti`.
- `transition` Take full control over your animation configuration. You can set options for your entire animtation (such as `type: 'timing'`), or set transition options per-style (`translateY: { type: 'timing' }`).
- `exitTransition` The exact same as `transition`, except that it only applies to `exit` animations.
- `state` If you're using the `useAnimationState` hook, you should pass the state it returns to this prop.
- `onDidAnimate` Callback function called after finishing a given animation.
  - First argument is the style prop string (`opacity`, `scale`, etc.)
  - The second argument is whether the animation `finished` or not (boolean)

## `exitTransition`

<div
  style={{
    position: 'relative',
    paddingBottom: '209.59302325581396%',
    height: 0,
    width: '100%',
  }}
>
  <iframe
    src="https://www.loom.com/embed/a8a691cdd7c243678723f2034f611b20"
    frameborder="0"
    webkitallowfullscreen
    mozallowfullscreen
    allowfullscreen
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
    }}
  ></iframe>
</div>

Define animation configurations for exiting components.

Options passed to `exitTransition` will only apply to the `exit` prop, when a component is exiting.

```jsx
<MotiView
  // the animate prop uses the transition
  transition={{ type: 'spring' }}
  animate={{ opacity: 1, scale: 1 }}
  // when exiting, it will use a timing transition
  exitTransition={{ type: 'timing' }}
  exit={{ opacity: 0, scale: 0.1 }}
/>
```

By default, `exit` uses `transition` to configure its animations, so this prop is not required.

However, if you pass `exitTransition`, it will override `transition` for exit animations.

To see how to use this prop, see the `transition` docs.
