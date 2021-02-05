# Props

All `moti` components have a few useful props:

- `animate` Magically animate any value passed here
- `from` The initial animation styles when the component mounts
- `exit` Unmount animation styles. This works the exact same as `framer-motion`'s exit prop, and requires wrapping your component with `AnimatePresence`. The only difference is you import `AnimatePresence` from `moti`.
- `transition` Take full control over your animation configuration. You can set options for your entire animtation (such as `type: 'timing'`), or set transition options per-style.
- `state` If you're using the `useAnimationState` hook, you should pass the state it returns to this prop.
