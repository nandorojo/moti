---
id: hello-world
title: Hello World
---

This is all it takes to create an animation that fades and scales in with Moti:

```tsx
import React, { useReducer } from 'react'
import { StyleSheet, Pressable } from 'react-native'
import { View } from 'moti'

function Shape() {
  return (
    <View
      from={{
        opacity: 0,
        scale: 0.5,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        type: 'timing',
      }}
      style={styles.shape}
    />
  )
}

export default function HelloWorld() {
  const [visible, toggle] = useReducer((s) => !s, true)

  return (
    <Pressable onPress={toggle} style={styles.container}>
      {visible && <Shape />}
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
