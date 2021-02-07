---
id: loop
title: Loop Animation
---

Create a loop animation of a box that goes up and down infinitely.

:::tip
Loop animations cannot be changed on the fly. See the explanation at the bottom.
:::

### Code

```tsx
import React, { useReducer } from 'react'
import { StyleSheet } from 'react-native'
import { View } from 'moti'

function Shape() {
  return (
    <View
      from={{
        translateY: -100,
      }}
      animate={{
        translateY: 0,
      }}
      transition={{
        loop: true,
        type: 'timing',
        duration: 1500,
        delay: 100,
      }}
      style={styles.shape}
    />
  )
}

export default function Loop() {
  return (
    <View style={styles.container}>
      <Shape />
    </View>
  )
}

const styles = StyleSheet.create({
  shape: {
    justifyContent: 'center',
    height: 250,
    width: 250,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#9c1aff',
  },
})
```

### Warning

It's worth noting that using the `loop` cannot be changed. For example, you can't set `loop` to be `true` at a random time. It must be `true` when the component mounts, and stay true.

Similarly, the styles passed to `from` and `animate` must exist when the component mounts, and cannot change over time. If they do, we **cannot** guarantee a working loop animation.

### Why?

We're using Reanimated's `withRepeat` function under the hood, which repeats back to the **previous value**. That means that if you change the value on the fly, that is where it will repeat back to.

If you want a loop that's constant, make sure you set `loop: true` when the component mounts, and make sure that your `from` and `animate` prop **do not** change throughout the component's lifecycle.

### Sequences

Sequence animations cannot be paired with `loop: true` or with `repeat`.
