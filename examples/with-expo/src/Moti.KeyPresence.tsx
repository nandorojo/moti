import React, { useReducer } from 'react'
import { StyleSheet, Pressable } from 'react-native'
import { View, AnimatePresence } from 'moti'

function Shape() {
  return (
    <View
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
      exitTransition={{
        type: 'timing',
        duration: 2500,
      }}
      style={styles.shape}
    />
  )
}

export default function Presence() {
  const [key, increment] = useReducer((state) => state + 1, 0)

  return (
    <Pressable onPress={increment} style={styles.container}>
      <AnimatePresence exitBeforeEnter>
        <View
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
          exitTransition={{
            type: 'timing',
            duration: 100,
          }}
          key={key}
          style={[styles.shape, key % 2 && { backgroundColor: 'black' }]}
        />
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
