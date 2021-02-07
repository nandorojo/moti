---
id: variants
title: Variants
---

Variants are a common use case for animations. Moti makes this easy.

```tsx
import React from 'react'
import { StyleSheet, Pressable } from 'react-native'
import { View, useAnimationState } from 'moti'

// you can create a reusable animation preset
const useFadeInDown = () => {
  return useAnimationState({
    from: {
      opacity: 0,
      translateY: -15,
    },
    to: {
      opacity: 1,
      translateY: 0,
    },
  })
}

function Shape() {
  const fadeInDown = useFadeInDown()

  const scaleIn = useAnimationState({
    from: {
      scale: 0.5,
    },
    open: {
      scale: 1,
    },
    big: {
      scale: 1.5,
    },
  })

  const onPress = () => {
    fadeInDown.transitionTo((state) => {
      if (state === 'from') {
        return 'to'
      } else {
        return 'from'
      }
    })

    if (scaleIn.current === 'from') {
      scaleIn.transitionTo('open')
    } else if (scaleIn.current === 'open') {
      scaleIn.transitionTo('big')
    } else {
      scaleIn.transitionTo('from')
    }
  }

  return (
    <Pressable onPress={onPress}>
      <View delay={300} state={fadeInDown} style={styles.shape} />
      <View
        transition={{
          type: 'spring',
        }}
        delay={300}
        state={scaleIn}
        style={[styles.shape, styles.shape2]}
      />
    </Pressable>
  )
}

export default function Variants() {
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
    backgroundColor: 'black',
  },
  shape2: {
    backgroundColor: 'hotpink',
    marginTop: 16,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'cyan',
  },
})
```
