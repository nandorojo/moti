---
hide_title: true
hide_table_of_contents: true
sidebar_label: Animate Presence
---

<iframe src="https://stackblitz.com/edit/nextjs-pxczpl?embed=1&file=pages/index.js" className="stackblitz" />

<!--
See a video of this example [here](https://twitter.com/FernandoTheRojo/status/1349884929765765123).

```tsx
import React, { useReducer } from 'react'
import { StyleSheet, Pressable } from 'react-native'

import { MotiView, AnimatePresence } from 'moti'

function Shape() {
  return (
    <MotiView
      from={{
        opacity: 0,
        scale: 0.9,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        scale: 0.9,
      }}
      style={styles.shape}
    />
  )
}

export default function Presence() {
  const [visible, toggle] = useReducer((s) => !s, true)

  return (
    <Pressable onPress={toggle} style={styles.container}>
      <AnimatePresence>{visible && <Shape />}</AnimatePresence>
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
``` -->
