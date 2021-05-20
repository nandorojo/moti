---
id: exit-before-enter
title: Exit Before Enter
---

Smoothly hide one component before you let its sibling enter.

Make sure each direct child of `AnimatePresence` has a unique and stable `key`.

Also, enable the `exitBeforeEnter` prop.

See a video of this example [here](https://twitter.com/FernandoTheRojo/status/1351234878902333445).

```tsx
import { AnimatePresence } from 'framer-motion'
import React, { useReducer } from 'react'
import { StyleSheet, Pressable } from 'react-native'
import { MotiView } from 'moti'

function Shape({ bg }: { bg: string }) {
  return (
    <MotiView
      from={{
        opacity: 0,
        scale: 0.5,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        scale: 0.9,
      }}
      style={[styles.shape, { backgroundColor: bg }]}
    />
  )
}

export default function ExitBeforeEnter() {
  const [visible, toggle] = useReducer((s) => !s, true)

  return (
    <Pressable onPress={toggle} style={styles.container}>
      <AnimatePresence exitBeforeEnter>
        {visible && <Shape bg="hotpink" key="hotpink" />}
        {!visible && <Shape bg="cyan" key="cyan" />}
      </AnimatePresence>
    </Pressable>
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
