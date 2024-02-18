import React, { useReducer, useEffect, useRef } from 'react'
import { StyleSheet, Pressable, Animated } from 'react-native'
import { AnimatePresence, usePresence } from 'framer-motion'

function FadeOut() {
  const [present, safeToUnmount] = usePresence()

  const opacity = useRef<Animated.Value>(new Animated.Value(1))

  const unmount = useRef(safeToUnmount)
  useEffect(() => {
    unmount.current = safeToUnmount
  })

  useEffect(
    function exit() {
      if (!present) {
        Animated.timing(opacity.current, {
          toValue: 0,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) {
            unmount.current()
          }
        })
      }
    },
    [present]
  )

  return <Animated.View style={[styles.shape, { opacity: opacity.current }]} />
}

export default function HelloWorld() {
  const [visible, toggle] = useReducer((s) => !s, true)

  return (
    <Pressable onPress={toggle} style={styles.container}>
      <AnimatePresence>{visible && <FadeOut />}</AnimatePresence>
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
